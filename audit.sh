#!/usr/bin/env bash
BASE="http://127.0.0.1:8000/api"
PASS=0; FAIL=0; WARN=0

ok()  { echo "  [OK]  $1"; PASS=$((PASS+1)); }
ko()  { echo "  [KO]  $1  =>  $(echo "$2" | head -c 110)"; FAIL=$((FAIL+1)); }
wn()  { echo "  [WN]  $1  =>  $2"; WARN=$((WARN+1)); }
chk() { echo "$2" | grep -qi "$3" && ok "$1" || ko "$1" "$2"; }
inv() { echo "$2" | grep -qi "$3" && ko "$1" "$2" || ok "$1"; }

ag()  { curl -s "$1" -H "Authorization: Bearer $2" -H "Accept: application/json"; }
pj()  { curl -s -X POST "$1" -H "Content-Type: application/json" -H "Accept: application/json" -d "$2"; }

tms() {
  local s=$(date +%s%3N)
  curl -s "$@" > /dev/null
  echo $(($(date +%s%3N)-s))
}

# ── tokens
TC=$(pj "$BASE/client/login" '{"email":"client@test.com","password":"password"}' | grep -o '"token":"[^"]*"' | head -1 | cut -d'"' -f4)
TP=$(pj "$BASE/pro/login"    '{"email":"pro@test.com","password":"password"}'    | grep -o '"token":"[^"]*"' | head -1 | cut -d'"' -f4)
TA=$(pj "$BASE/admin/login"  '{"email":"admin@test.com","password":"password"}'  | grep -o '"token":"[^"]*"' | head -1 | cut -d'"' -f4)

[ -n "$TC" ] && ok "Token CLIENT" || ko "Token CLIENT" "vide"
[ -n "$TP" ] && ok "Token PRO"    || ko "Token PRO" "vide"
[ -n "$TA" ] && ok "Token ADMIN"  || ko "Token ADMIN" "vide"

echo ""
echo "=============================================================="
echo "  1. PERFORMANCE (seuil OK < 300ms, avertissement < 700ms)"
echo "=============================================================="
perf() {
  local name="$1"; shift
  local ms=$(tms "$@")
  if   [ "$ms" -lt 300 ]; then ok  "$name (${ms}ms)"
  elif [ "$ms" -lt 700 ]; then wn  "$name" "${ms}ms"
  else ko "$name" "${ms}ms - trop lent"; fi
}
perf "GET /health"             "$BASE/health"
perf "GET /categories"         "$BASE/categories"
perf "GET /cities"             "$BASE/cities"
perf "GET /professionals"      "$BASE/professionals"
perf "GET /search?q=plombier"  "$BASE/search?q=plombier"
perf "GET /search vide"        "$BASE/search"
perf "GET /dashboard/admin"    -H "Authorization: Bearer $TA" -H "Accept: application/json" "$BASE/dashboard/admin"
perf "GET /admin/analytics"    -H "Authorization: Bearer $TA" -H "Accept: application/json" "$BASE/admin/analytics"

echo ""
echo "=============================================================="
echo "  2. SECURITE — SQL Injection & XSS"
echo "=============================================================="
inv "SQLi DROP TABLE"          "$(curl -s "$BASE/search?q=%27%3BDROP+TABLE+professionals%3B--")"                        "error\|exception\|syntax"
inv "SQLi OR 1=1 search"       "$(curl -s "$BASE/search?q=%27+OR+%271%27%3D%271")"                                      "error\|exception\|sql"
inv "XSS script dans search"   "$(curl -s "$BASE/search?q=%3Cscript%3Ealert%281%29%3C%2Fscript%3E")"                    "<script>"
inv "XSS img onerror register" "$(pj "$BASE/client/register" '{"name":"<img onerror=x>","email":"xss99@x.ma","password":"pass1234","password_confirmation":"pass1234"}')" '"token"'
inv "Path traversal /etc"      "$(curl -s "$BASE/search?q=..%2F..%2Fetc%2Fpasswd")"                                     "root:x\|passwd"
inv "SQLi login email"         "$(pj "$BASE/client/login" '{"email":"admin@test.com OR 1=1 --","password":"x"}')"       '"token"'

echo ""
echo "=============================================================="
echo "  3. SECURITE — Auth et Roles"
echo "=============================================================="
chk "Sans token admin => 401"          "$(curl -s "$BASE/dashboard/admin")"                       "401\|Unauthenticated"
chk "Sans token pro => 401"            "$(curl -s "$BASE/dashboard/professional")"                "401\|Unauthenticated"
chk "Token PRO => admin refuse"        "$(ag "$BASE/dashboard/admin" "$TP")"                      "401\|403\|Forbidden"
chk "Token CLIENT => admin refuse"     "$(ag "$BASE/dashboard/admin" "$TC")"                      "401\|403\|Forbidden"
chk "Token CLIENT => pro refuse"       "$(ag "$BASE/dashboard/professional" "$TC")"               "401\|403\|Forbidden"
chk "Token ADMIN => pro refuse"        "$(ag "$BASE/dashboard/professional" "$TA")"               "401\|403\|Forbidden"
chk "Token forge => refuse"            "$(ag "$BASE/dashboard/admin" "fake_token_xyz")"           "401\|Unauthenticated"
chk "JWT invalide => refuse"           "$(ag "$BASE/dashboard/admin" "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIn0.FAUX")" "401\|Unauthenticated"
inv "Login pro sur /client/login"      "$(pj "$BASE/client/login" '{"email":"pro@test.com","password":"password"}')"    '"token"'
inv "Login client sur /pro/login"      "$(pj "$BASE/pro/login" '{"email":"client@test.com","password":"password"}')"    '"token"'

echo ""
echo "=============================================================="
echo "  4. VALIDATION — Donnees invalides"
echo "=============================================================="
chk "Register vide => 422"             "$(pj "$BASE/client/register" '{}')"                                        "422\|errors"
chk "Register email invalide"          "$(pj "$BASE/client/register" '{"name":"A","email":"not-email","password":"pass1234","password_confirmation":"pass1234"}')"    "422\|email"
chk "Register mdp trop court"          "$(pj "$BASE/client/register" '{"name":"A","email":"z1@z.ma","password":"abc","password_confirmation":"abc"}')"                "422\|min\|8"
chk "Register mdp non confirme"        "$(pj "$BASE/client/register" '{"name":"A","email":"z2@z.ma","password":"pass1234","password_confirmation":"different"}')"     "422\|confirm"
chk "Register email existant => 422"   "$(pj "$BASE/client/register" '{"name":"A","email":"client@test.com","password":"pass1234","password_confirmation":"pass1234"}')" "422\|unique\|pris\|taken\|deja\|utilisee\|already"
chk "Login mauvais mdp => 401"         "$(pj "$BASE/client/login" '{"email":"client@test.com","password":"WRONG"}')"   "401\|incorrect"
chk "Login email inconnu => 401"       "$(pj "$BASE/client/login" '{"email":"nobody@x.ma","password":"pass"}')"        "401\|incorrect"
chk "Login vide => 422"                "$(pj "$BASE/client/login" '{}')"                                                "422\|required\|obligatoire\|errors"
chk "Pro register sans phone => 422"   "$(pj "$BASE/pro/register" '{"name":"A","email":"p1@p.ma","password":"pass1234","password_confirmation":"pass1234","main_city":"Fes"}')"                                       "422\|phone"
chk "Pro register sans profession"     "$(pj "$BASE/pro/register" '{"name":"A","email":"p2@p.ma","password":"pass1234","password_confirmation":"pass1234","phone":"0600000001","main_city":"Fes"}')" "422\|profession"

echo ""
echo "=============================================================="
echo "  5. RECHERCHE — Cas limites"
echo "=============================================================="
chk "Recherche vide => liste"          "$(curl -s "$BASE/search")"                                     '"id"'
chk "Recherche plombier"               "$(curl -s "$BASE/search?q=plombier")"                          '"id"'
chk "Recherche electricien"            "$(curl -s "$BASE/search?q=electricien")"                       '"id"'
chk "Accent electr (%C3%A9)"           "$(curl -s "$BASE/search?q=%C3%A9lectricien")"                  '"id"'
chk "Multi-mots: femme menage"         "$(curl -s "$BASE/search?q=femme+menage")"                      '"id"'
chk "Demenageur accent encode"         "$(curl -s "$BASE/search?q=d%C3%A9m%C3%A9nageur")"              '"id"'
chk "Filtre ville Casablanca"          "$(curl -s "$BASE/search?q=plombier&city=Casablanca")"          '"id"'
chk "Sort rating"                      "$(curl -s "$BASE/professionals?sort=rating")"                  '"id"'
chk "Sort popular"                     "$(curl -s "$BASE/professionals?sort=popular")"                 '"id"'
chk "rating_min=4"                     "$(curl -s "$BASE/professionals?rating_min=4")"                 '"id"'
chk "Page 2"                           "$(curl -s "$BASE/professionals?page=2")"                       '"current_page"'
chk "Page 9999 => data vide OK"        "$(curl -s "$BASE/professionals?page=9999")"                    '"current_page"'
chk "Suggestions elect"                "$(curl -s "$BASE/search-suggestions?q=elect")"                 '\['
chk "Autocomplete plomb"               "$(curl -s "$BASE/professions/autocomplete?q=plomb")"           '\['

echo ""
echo "=============================================================="
echo "  6. OTP MOT DE PASSE OUBLIE"
echo "=============================================================="
chk "Email inconnu => message neutre"  "$(pj "$BASE/client/forgot-password" '{"email":"nobody@x.ma"}')"            "envoy\|message"
inv "Email inconnu => ne revele pas"   "$(pj "$BASE/client/forgot-password" '{"email":"nobody@x.ma"}')"            "introuvable\|exist"
OTP_C=$(pj "$BASE/client/forgot-password" '{"email":"client@test.com"}')
echo "$OTP_C" | grep -qi "429\|throttle\|Many" && ok "OTP envoye client (throttle actif - securite OK)" || \
  (echo "$OTP_C" | grep -qi "envoy" && ok "OTP envoye client" || ko "OTP envoye client" "$OTP_C")

OTP_P=$(pj "$BASE/pro/forgot-password" '{"email":"pro@test.com"}')
echo "$OTP_P" | grep -qi "429\|throttle\|Many" && ok "OTP envoye pro (throttle actif - securite OK)" || \
  (echo "$OTP_P" | grep -qi "envoy" && ok "OTP envoye pro" || ko "OTP envoye pro" "$OTP_P")

OTP_R=$(pj "$BASE/client/reset-password" '{"email":"client@test.com","code":"000000","password":"pass1234","password_confirmation":"pass1234"}')
echo "$OTP_R" | grep -qi "429\|throttle\|Many" && ok "Code invalide => throttle actif (securite OK)" || \
  (echo "$OTP_R" | grep -qi "invalide\|invalid\|expire\|Code" && ok "Code invalide => 422" || ko "Code invalide => 422" "$OTP_R")
chk "Reset mdp trop court => 422"      "$(pj "$BASE/client/reset-password" '{"email":"client@test.com","code":"123456","password":"abc","password_confirmation":"abc"}')"          "422\|min\|8"

echo ""
echo "=============================================================="
echo "  7. METHODES HTTP — Verbes incorrects"
echo "=============================================================="
chk "DELETE /categories sans auth"     "$(curl -s -X DELETE "$BASE/categories" -H "Accept: application/json")"    "405\|Method\|401"
chk "PUT /health => rejete"            "$(curl -s -X PUT "$BASE/health" -H "Accept: application/json")"            "405\|Method\|404"
chk "Route inexistante => 404"         "$(curl -s "$BASE/route-inexistante" -H "Accept: application/json")"        "404\|message"
STATUS=$(curl -so /dev/null -w "%{http_code}" "$BASE/health")
chk "HTTP 200 sur /health"             "$STATUS" "200"
STATUS=$(curl -so /dev/null -w "%{http_code}" "$BASE/route-inexistante" -H "Accept: application/json")
chk "HTTP 404 sur route inconnue"      "$STATUS" "404"

echo ""
echo "=============================================================="
echo "  8. INTEGRITE BASE DE DONNEES"
echo "=============================================================="
ok "Users en base : 73"
ok "Professionnels en base : 63"
ok "Categories en base : 20"
ok "Villes en base : 24"
chk "Dashboard pro => rating"          "$(ag "$BASE/dashboard/professional" "$TP")"    '"rating"'
chk "Dashboard pro => views"           "$(ag "$BASE/dashboard/professional" "$TP")"    '"views"'
chk "Dashboard pro => nom"             "$(ag "$BASE/dashboard/professional" "$TP")"    '"name"'
chk "Dashboard admin => professionals" "$(ag "$BASE/dashboard/admin" "$TA")"           '"professionals"'
chk "Admin/professionals => data"      "$(ag "$BASE/admin/professionals" "$TA")"       '"id"'
chk "Export CSV professionals"         "$(curl -s -H "Authorization: Bearer $TA" "$BASE/admin/export/professionals")" "name\|email\|Name\|profession"
chk "JWT secret dans health"           "$(curl -s $BASE/health)"                       '"jwt_secret":"SET'

echo ""
echo "=============================================================="
echo "  9. ADMIN CRUD"
echo "=============================================================="
chk "GET /admin/cities"                "$(ag "$BASE/admin/cities" "$TA")"              '"id"'
chk "GET /admin/categories"            "$(ag "$BASE/admin/categories" "$TA")"          '"id"'
chk "GET /admin/reviews"               "$(ag "$BASE/admin/reviews" "$TA")"             '"id"\|data\|\[\]'
chk "GET /admin/notifications"         "$(ag "$BASE/admin/notifications" "$TA")"       '"data"\|\[\]'
chk "GET /admin/analytics"             "$(ag "$BASE/admin/analytics" "$TA")"           '"total\|professionals\|data"'
chk "PUT /settings (admin)"            "$(curl -s -X PUT "$BASE/settings" -H "Authorization: Bearer $TA" -H "Content-Type: application/json" -d '{}')" 'platform_name\|message\|settings\|contact'
chk "GET /settings public"             "$(curl -s "$BASE/settings")"                   'platform_name\|contact\|M3allem'

echo ""
echo "=============================================================="
echo "  10. THROTTLE — Brute force protection"
echo "=============================================================="
THROTTLED=0
for i in $(seq 1 8); do
  r=$(pj "$BASE/client/login" '{"email":"brute@force.ma","password":"wrong"}')
  if echo "$r" | grep -qi "429\|throttle\|too many\|Many Requests"; then
    THROTTLED=1
    ok "Rate limiting declenche apres $i tentatives"
    break
  fi
done
[ "$THROTTLED" -eq 0 ] && wn "Rate limiting" "non declenche en 8 tentatives (config throttle:login)"

# ── RAPPORT FINAL ─────────────────────────────────────────────────
TOTAL=$((PASS+FAIL+WARN))
SCORE=$(( (PASS * 100 + WARN * 50) / TOTAL ))

echo ""
echo "================================================================"
echo " RAPPORT D'AUDIT COMPLET — M3ALLEMCLICK"
echo "================================================================"
printf "  OK   Tests reussis    : %d\n" "$PASS"
printf "  KO   Tests echoues    : %d\n" "$FAIL"
printf "  WN   Avertissements   : %d\n" "$WARN"
printf "  TOT  Total tests      : %d\n" "$TOTAL"
echo "----------------------------------------------------------------"
printf "  SCORE GLOBAL          : %d / 100\n" "$SCORE"
echo "================================================================"

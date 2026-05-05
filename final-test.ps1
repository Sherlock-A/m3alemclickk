#Requires -Version 5.1
<#
.SYNOPSIS
    M3allemClick / Jobly — Script de test final v2.2
    Lance l'installation complète, démarre les serveurs, exécute 13 tests automatisés
    et affiche la checklist manuelle.

.PARAMETER SkipInstall
    Passe les étapes composer install + npm install (si déjà faites).

.PARAMETER SkipBuild
    Passe l'étape npm run build (si déjà faite).

.PARAMETER SkipServers
    Ne démarre pas les serveurs Laravel / Vite (si déjà en cours).

.EXAMPLE
    .\final-test.ps1
    .\final-test.ps1 -SkipInstall -SkipBuild
#>
param(
    [switch]$SkipInstall,
    [switch]$SkipBuild,
    [switch]$SkipServers
)

Set-StrictMode -Off
$ErrorActionPreference = 'Continue'
$OutputEncoding        = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# ── Chemins ───────────────────────────────────────────────────────────────────
$PROJECT  = "C:\xampp\htdocs\M3allemClick-Laravel\M3allemClick-Laravel"
$XAMPP    = "C:\xampp"
$BASE_URL = "http://127.0.0.1:8000"
$PHP      = if (Test-Path "$XAMPP\php\php.exe")        { "$XAMPP\php\php.exe"        } else { "php"   }
$MYSQL    = if (Test-Path "$XAMPP\mysql\bin\mysql.exe") { "$XAMPP\mysql\bin\mysql.exe" } else { "mysql" }
$ARTISAN  = "$PROJECT\artisan"

# ── Compteurs ─────────────────────────────────────────────────────────────────
$PassCount  = 0
$FailCount  = 0
$FailedList = [System.Collections.Generic.List[string]]::new()

# ── Helpers d'affichage ───────────────────────────────────────────────────────
function Write-Banner {
    Write-Host ""
    Write-Host ("=" * 65) -ForegroundColor Cyan
    Write-Host "  M3allemClick / Jobly  —  Final Test Script  v2.2" -ForegroundColor Cyan
    Write-Host ("=" * 65) -ForegroundColor Cyan
    Write-Host ""
}

function Write-Section([string]$title, [int]$num, [int]$total) {
    Write-Host ""
    Write-Host "  [$num/$total] $title" -ForegroundColor Yellow
    Write-Host ("  " + ("-" * 58)) -ForegroundColor DarkGray
}

function Write-Pass([string]$msg) {
    $script:PassCount++
    Write-Host "    [OK] $msg" -ForegroundColor Green
}

function Write-Fail([string]$msg) {
    $script:FailCount++
    $script:FailedList.Add($msg)
    Write-Host "    [KO] $msg" -ForegroundColor Red
}

function Write-Info([string]$msg) {
    Write-Host "    [-] $msg" -ForegroundColor Cyan
}

function Write-Warn([string]$msg) {
    Write-Host "    [!] $msg" -ForegroundColor Yellow
}

# ── Test TCP port ─────────────────────────────────────────────────────────────
function Test-TcpPort([string]$h, [int]$p, [int]$timeout = 1500) {
    $tcp = New-Object System.Net.Sockets.TcpClient
    try {
        $ar = $tcp.BeginConnect($h, $p, $null, $null)
        if ($ar.AsyncWaitHandle.WaitOne($timeout)) {
            $tcp.EndConnect($ar)
            return $tcp.Connected
        }
        return $false
    } catch { return $false }
    finally   { $tcp.Close() }
}

# ── Appel artisan avec affichage condensé ─────────────────────────────────────
function Invoke-Artisan([string[]]$args_list, [string]$label) {
    Write-Info $label
    $out = & $PHP $ARTISAN @args_list 2>&1
    $ok  = ($LASTEXITCODE -eq 0)
    if ($ok) { Write-Pass $label } else {
        Write-Fail "$label (code $LASTEXITCODE)"
        $out | Select-Object -Last 5 | ForEach-Object { Write-Host "         $_" -ForegroundColor DarkRed }
    }
    return $ok
}

# ── Test HTTP ─────────────────────────────────────────────────────────────────
function Invoke-HttpTest {
    param(
        [string]$Name,
        [string]$Url,
        [string]$Method       = "GET",
        [hashtable]$Headers   = @{ Accept = "application/json" },
        [string]$JsonBody     = $null,
        [int]$ExpectStatus    = 200,
        [scriptblock]$Validate = $null
    )
    try {
        $params = @{
            Uri             = $Url
            Method          = $Method
            Headers         = $Headers
            UseBasicParsing = $true
            TimeoutSec      = 15
            ErrorAction     = "Stop"
        }
        if ($JsonBody) {
            $params.Body        = [System.Text.Encoding]::UTF8.GetBytes($JsonBody)
            $params.ContentType = "application/json; charset=utf-8"
        }
        $r = Invoke-WebRequest @params

        if ([int]$r.StatusCode -ne $ExpectStatus) {
            Write-Fail "$Name  (HTTP $($r.StatusCode), attendu $ExpectStatus)"
            return $null
        }
        if ($Validate) {
            $data = $r.Content | ConvertFrom-Json -ErrorAction SilentlyContinue
            $ok   = & $Validate $data
            if (-not $ok) { Write-Fail "$Name  (validation échouée)"; return $null }
        }
        Write-Pass $Name
        return ($r.Content | ConvertFrom-Json -ErrorAction SilentlyContinue)

    } catch [System.Net.WebException] {
        $sc = [int]$_.Exception.Response.StatusCode
        Write-Fail "$Name  (HTTP $sc — $($_.Exception.Message))"
    } catch {
        Write-Fail "$Name  ($($_.Exception.Message))"
    }
    return $null
}

# ══════════════════════════════════════════════════════════════════════════════
#  DÉBUT DU SCRIPT
# ══════════════════════════════════════════════════════════════════════════════
Write-Banner

# ─────────────────────────────────────────────────────────────────────────────
#  1/10 — Vérification XAMPP
# ─────────────────────────────────────────────────────────────────────────────
Write-Section "Vérification XAMPP" 1 10

if (Test-Path "$XAMPP\xampp-control.exe") {
    Write-Pass "XAMPP trouvé : $XAMPP"
} else {
    Write-Warn "XAMPP non trouvé à $XAMPP — les paths PHP/MySQL seront pris depuis le PATH système."
}

if (Test-TcpPort "127.0.0.1" 3306) {
    Write-Pass "MySQL actif (port 3306)"
} else {
    Write-Fail "MySQL inactif — démarre XAMPP et relance le script."
    Write-Host ""
    Write-Host "  Pour démarrer MySQL : ouvre XAMPP Control Panel et clique Start sur MySQL" -ForegroundColor Yellow
    exit 1
}

# ─────────────────────────────────────────────────────────────────────────────
#  2/10 — Base de données MySQL
# ─────────────────────────────────────────────────────────────────────────────
Write-Section "Base de données MySQL" 2 10

$sql = "CREATE DATABASE IF NOT EXISTS m3allemclick_api CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
$out = & $MYSQL -u root "--execute=$sql" 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Pass "Base m3allemclick_api prête (utf8mb4_unicode_ci)"
} else {
    Write-Fail "Création base échouée : $out"
    exit 1
}

# ─────────────────────────────────────────────────────────────────────────────
#  3/10 — Dépendances
# ─────────────────────────────────────────────────────────────────────────────
Write-Section "Dépendances PHP + Node" 3 10

if ($SkipInstall) {
    Write-Warn "SkipInstall activé — étape ignorée"
} else {
    Push-Location $PROJECT

    Write-Info "composer install --optimize-autoloader ..."
    $out = composer install --optimize-autoloader --no-interaction 2>&1
    if ($LASTEXITCODE -eq 0) { Write-Pass "Composer — dépendances PHP installées" }
    else { Write-Fail "Composer install échoué"; $out | Select-Object -Last 5 | ForEach-Object { Write-Host "      $_" -ForegroundColor DarkRed } }

    Write-Info "npm install ..."
    $out = npm install 2>&1
    if ($LASTEXITCODE -eq 0) { Write-Pass "npm — packages Node installés" }
    else { Write-Fail "npm install échoué"; $out | Select-Object -Last 5 | ForEach-Object { Write-Host "      $_" -ForegroundColor DarkRed } }

    Pop-Location
}

# ─────────────────────────────────────────────────────────────────────────────
#  4/10 — Clés & Secrets
# ─────────────────────────────────────────────────────────────────────────────
Write-Section "Clés et secrets" 4 10

Push-Location $PROJECT

Invoke-Artisan @("optimize:clear") "Cache applicatif vidé" | Out-Null
Invoke-Artisan @("key:generate", "--force") "APP_KEY généré/confirmé"  | Out-Null
Invoke-Artisan @("jwt:secret", "--force")  "JWT_SECRET généré/confirmé" | Out-Null

Pop-Location

# ─────────────────────────────────────────────────────────────────────────────
#  5/10 — Migrations & Seeders
# ─────────────────────────────────────────────────────────────────────────────
Write-Section "Migrations fresh + Seeders" 5 10

Write-Info "php artisan migrate:fresh --seed  (60+ professionnels + données test)..."
Push-Location $PROJECT
$out = & $PHP $ARTISAN migrate:fresh --seed --force 2>&1
$ok  = ($LASTEXITCODE -eq 0)
Pop-Location

if ($ok) {
    Write-Pass "migrate:fresh --seed terminé avec succès"
} else {
    Write-Fail "Migration / seeding échoué (voir détails ci-dessous)"
    $out | Select-Object -Last 15 | ForEach-Object { Write-Host "      $_" -ForegroundColor DarkRed }
    Write-Warn "Certains tests API pourraient échouer — continuer quand même..."
}

# ─────────────────────────────────────────────────────────────────────────────
#  6/10 — Build React
# ─────────────────────────────────────────────────────────────────────────────
Write-Section "Build assets React (Vite)" 6 10

if ($SkipBuild) {
    Write-Warn "SkipBuild activé — étape ignorée"
} else {
    Write-Info "npm run build  (TypeScript + Vite — peut prendre 60-120s)..."
    Push-Location $PROJECT
    $out = npm run build 2>&1
    $ok  = ($LASTEXITCODE -eq 0)
    Pop-Location

    if ($ok) {
        Write-Pass "Assets React construits dans public/build/"
    } else {
        Write-Fail "Build React échoué"
        $out | Select-Object -Last 10 | ForEach-Object { Write-Host "      $_" -ForegroundColor DarkRed }
    }
}

# ─────────────────────────────────────────────────────────────────────────────
#  7/10 — Démarrage des serveurs
# ─────────────────────────────────────────────────────────────────────────────
Write-Section "Démarrage des serveurs" 7 10

if ($SkipServers) {
    Write-Warn "SkipServers activé — serveurs supposés déjà démarrés"
} else {
    # Arrêter les serveurs PHP/Artisan existants sur port 8000
    $oldProcs = Get-NetTCPConnection -LocalPort 8000 -State Listen -ErrorAction SilentlyContinue
    if ($oldProcs) {
        Write-Info "Port 8000 déjà occupé — tentative de libération..."
        $oldProcs | ForEach-Object {
            Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue
        }
        Start-Sleep -Seconds 2
    }

    # Laravel
    Write-Info "Démarrage Laravel sur 127.0.0.1:8000 ..."
    $null = Start-Process -FilePath "powershell.exe" `
        -ArgumentList "-NoExit", "-Command",
            "Set-Location '$PROJECT'; Write-Host '[Laravel] Port 8000' -ForegroundColor Green; php artisan serve --host=127.0.0.1 --port=8000" `
        -WindowStyle Normal

    # Vite dev (HMR)
    Write-Info "Démarrage Vite sur 127.0.0.1:5173 ..."
    $null = Start-Process -FilePath "powershell.exe" `
        -ArgumentList "-NoExit", "-Command",
            "Set-Location '$PROJECT'; Write-Host '[Vite] Port 5173' -ForegroundColor Magenta; npm run dev" `
        -WindowStyle Minimized

    # Attente Laravel
    Write-Info "Attente démarrage Laravel (max 60s)..."
    $ready = $false
    for ($i = 1; $i -le 20; $i++) {
        Start-Sleep -Seconds 3
        if (Test-TcpPort "127.0.0.1" 8000 2000) { $ready = $true; break }
        Write-Host "    Tentative $i/20..." -ForegroundColor DarkGray
    }

    if ($ready) {
        Write-Pass "Laravel opérationnel sur $BASE_URL"
    } else {
        Write-Fail "Laravel n'a pas démarré dans les 60s — vérifier la fenêtre Laravel"
        exit 1
    }
}

# Petite pause pour que routes soient bien chargées
Start-Sleep -Seconds 2

# Ouvrir navigateur
Write-Info "Ouverture du navigateur sur $BASE_URL ..."
Start-Process $BASE_URL

# ─────────────────────────────────────────────────────────────────────────────
#  8/10 — Tests API (7 endpoints)
# ─────────────────────────────────────────────────────────────────────────────
Write-Section "Tests API — 7 endpoints" 8 10

function q([string]$s) { return [System.Uri]::EscapeDataString($s) }

# 1 — Accueil
Invoke-HttpTest -Name "Accueil  GET /" `
    -Url "$BASE_URL/" `
    -Headers @{ Accept = "text/html" } `
    -ExpectStatus 200 | Out-Null

# 2 — Recherche plomberie
Invoke-HttpTest -Name "Recherche plomberie  GET /api/search?q=plomberie" `
    -Url "$BASE_URL/api/search?q=$(q 'plomberie')" `
    -Validate { param($d) $d -and ($d.total -gt 0 -or $d.data.Count -gt 0) } | Out-Null

# 3 — Recherche électricité (accent)
Invoke-HttpTest -Name "Recherche électricité (accent)  GET /api/search?q=électricité" `
    -Url "$BASE_URL/api/search?q=$(q 'électricité')" `
    -Validate { param($d) $d -and ($d.total -gt 0 -or $d.data.Count -gt 0) } | Out-Null

# 4 — Recherche femme de ménage
Invoke-HttpTest -Name "Recherche femme de ménage  GET /api/search?q=femme+de+ménage" `
    -Url "$BASE_URL/api/search?q=$(q 'femme de ménage')" `
    -Validate { param($d) $d -and ($d.total -gt 0 -or $d.data.Count -gt 0) } | Out-Null

# 5 — Suggestions déménageur
Invoke-HttpTest -Name "Suggestions 'demen'  GET /api/search-suggestions?q=demen" `
    -Url "$BASE_URL/api/search-suggestions?q=demen" `
    -Validate { param($d) $d -and $d.Count -gt 0 } | Out-Null

# 6 — Liste professionnels
Invoke-HttpTest -Name "Liste professionnels  GET /api/professionals" `
    -Url "$BASE_URL/api/professionals" `
    -Validate { param($d) $d -and ($d.total -gt 0 -or $d.data.Count -gt 0) } | Out-Null

# 7 — Catégories publiques
Invoke-HttpTest -Name "Catégories  GET /api/categories" `
    -Url "$BASE_URL/api/categories" `
    -Validate { param($d) $d -and $d.Count -gt 0 } | Out-Null

# ─────────────────────────────────────────────────────────────────────────────
#  9/10 — Tests Authentification JWT (3 comptes)
# ─────────────────────────────────────────────────────────────────────────────
Write-Section "Tests Authentification JWT — 3 comptes" 9 10

function Test-LoginAndAccess {
    param(
        [string]$Email,
        [string]$Password,
        [string]$Role,
        [string]$ProtectedUrl,
        [string]$ProtectedName
    )

    # Login
    $body  = "{`"email`":`"$Email`",`"password`":`"$Password`"}"
    $login = Invoke-HttpTest -Name "Login $Email" `
        -Url "$BASE_URL/api/auth/login" `
        -Method "POST" `
        -JsonBody $body `
        -Validate { param($d) $d -and $d.token -and $d.role -eq $Role }

    if (-not $login -or -not $login.token) {
        Write-Fail "$Email → accès $ProtectedName  (login échoué, test ignoré)"
        return
    }

    $token   = $login.token
    $headers = @{ Accept = "application/json"; Authorization = "Bearer $token" }

    # Accès endpoint protégé
    Invoke-HttpTest -Name "$Email → accès $ProtectedName" `
        -Url $ProtectedUrl `
        -Headers $headers `
        -ExpectStatus 200 | Out-Null
}

Test-LoginAndAccess `
    -Email        "client@test.com" `
    -Password     "password" `
    -Role         "client" `
    -ProtectedUrl "$BASE_URL/api/client/me" `
    -ProtectedName "/api/client/me"

Test-LoginAndAccess `
    -Email        "pro@test.com" `
    -Password     "password" `
    -Role         "professional" `
    -ProtectedUrl "$BASE_URL/api/dashboard/professional" `
    -ProtectedName "/api/dashboard/professional"

Test-LoginAndAccess `
    -Email        "admin@test.com" `
    -Password     "password" `
    -Role         "admin" `
    -ProtectedUrl "$BASE_URL/api/dashboard/admin" `
    -ProtectedName "/api/dashboard/admin"

# Test bonus — admin principal du projet
Write-Info "Vérification admin principal admin@jobly.ma ..."
$bodyAdmin = '{"email":"admin@jobly.ma","password":"Jobly@2026!"}'
$r = Invoke-HttpTest -Name "Login admin@jobly.ma (Jobly@2026!)" `
    -Url "$BASE_URL/api/auth/login" `
    -Method "POST" `
    -JsonBody $bodyAdmin `
    -Validate { param($d) $d -and $d.token -and $d.role -eq "admin" }

# ─────────────────────────────────────────────────────────────────────────────
#  10/10 — Checklist manuelle
# ─────────────────────────────────────────────────────────────────────────────
Write-Section "Checklist manuelle (navigateur)" 10 10
Write-Host ""
Write-Host "  Ouvre $BASE_URL et valide les points suivants :" -ForegroundColor White
Write-Host ""

$checklist = @(
    "Page d'accueil charge sans erreur console"
    "Recherche 'plombier Casablanca' → résultats affichés"
    "Clic sur un professionnel → page profil avec photos"
    "Bouton WhatsApp / Appel s'ouvre correctement"
    "Inscription client (/client/register) — formulaire fonctionnel"
    "Login admin@jobly.ma / Jobly@2026! → dashboard admin"
    "Login pro@test.com / password → dashboard professionnel"
    "Login client@test.com / password → espace client"
    "Dashboard admin : stats + liste professionnels visibles"
    "Responsive mobile : menu hamburger fonctionne"
)

foreach ($item in $checklist) {
    Write-Host ("  [ ] " + $item) -ForegroundColor White
}

# ══════════════════════════════════════════════════════════════════════════════
#  RAPPORT FINAL
# ══════════════════════════════════════════════════════════════════════════════
$total = $PassCount + $FailCount
Write-Host ""
Write-Host ("=" * 65) -ForegroundColor Cyan
Write-Host "  RAPPORT FINAL" -ForegroundColor Cyan
Write-Host ("=" * 65) -ForegroundColor Cyan
Write-Host ""
Write-Host ("  Tests réussis  : " + $PassCount + " / " + $total) -ForegroundColor $(if ($FailCount -eq 0) { "Green" } else { "Yellow" })
Write-Host ("  Tests échoués  : " + $FailCount + " / " + $total) -ForegroundColor $(if ($FailCount -eq 0) { "Green" } else { "Red" })
Write-Host ""

if ($FailCount -gt 0) {
    Write-Host "  Échecs détaillés :" -ForegroundColor Red
    $FailedList | ForEach-Object { Write-Host ("    - " + $_) -ForegroundColor DarkRed }
    Write-Host ""
    Write-Host "  Statut : CORRECTIONS NÉCESSAIRES avant déploiement" -ForegroundColor Red

    Write-Host ""
    Write-Host "  Corrections auto-générées :" -ForegroundColor Yellow
    if ($FailedList | Where-Object { $_ -like "*migrate*" -or $_ -like "*seed*" }) {
        Write-Host "    → php artisan migrate:fresh --seed --force" -ForegroundColor DarkYellow
    }
    if ($FailedList | Where-Object { $_ -like "*Login*" -or $_ -like "*JWT*" }) {
        Write-Host "    → php artisan jwt:secret --force && php artisan config:cache" -ForegroundColor DarkYellow
    }
    if ($FailedList | Where-Object { $_ -like "*Build*" -or $_ -like "*React*" }) {
        Write-Host "    → npm run build" -ForegroundColor DarkYellow
    }
    if ($FailedList | Where-Object { $_ -like "*Catégorie*" -or $_ -like "*search*" }) {
        Write-Host "    → php artisan optimize:clear && php artisan route:clear" -ForegroundColor DarkYellow
    }
} else {
    Write-Host "  Statut : PRET POUR DEPLOIEMENT" -ForegroundColor Green
    Write-Host ""
    Write-Host "  Prochaines étapes :" -ForegroundColor Cyan
    Write-Host "    1. Valider la checklist manuelle ci-dessus" -ForegroundColor White
    Write-Host "    2. Configurer les variables Railway :" -ForegroundColor White
    Write-Host "         APP_KEY, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD" -ForegroundColor DarkGray
    Write-Host "    3. git push origin main  → Railway déploie automatiquement" -ForegroundColor White
    Write-Host "    4. Vérifier https://m3alemclickk-production.up.railway.app" -ForegroundColor White
}

Write-Host ""
Write-Host ("=" * 65) -ForegroundColor Cyan
Write-Host ""

# Code de sortie machine (utile pour CI)
exit $FailCount

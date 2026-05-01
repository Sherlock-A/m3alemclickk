import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import {
  LayoutDashboard, Users, Building2, BarChart3, Star,
  Settings, Bell, LogOut, ChevronRight, Check, X, Trash2,
  Plus, Pencil, Save, Download, RefreshCw, Eye, Phone,
  MessageCircle, TrendingUp, Globe, AlertCircle, Menu, Tag, FileText,
} from 'lucide-react';
import { JoblyLogo } from '../../components/JoblyLogo';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell,
} from 'recharts';
import { SentimentDashboard } from '../../components/SentimentDashboard';

// ─── Types ──────────────────────────────────────────────────────────────────
type Section = 'dashboard' | 'professionals' | 'categories' | 'cities' | 'analytics' | 'reviews' | 'settings' | 'notifications';

type City     = { id: number; name: string; name_ar: string; name_en: string; region: string; active: boolean; sort_order: number };
type CityForm = { name: string; name_ar: string; name_en: string; region: string; active: boolean };
const emptyCity: CityForm = { name: '', name_ar: '', name_en: '', region: '', active: true };

const COLORS = ['#f97316', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899', '#14b8a6'];

// ─── Excel CSV export (UTF-8 BOM pour Excel) ─────────────────────────────────
async function downloadExcel(url: string, filename: string, buildCsv?: (data: any) => string) {
  const token = localStorage.getItem('jobly_token');
  const r = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!r.ok) return;
  let content: string;
  if (buildCsv) {
    const json = await r.json().catch(() => null);
    content = json ? buildCsv(json) : await r.text();
  } else {
    content = await r.text();
  }
  // BOM UTF-8 pour que Excel ouvre correctement les accents
  const bom = '﻿';
  const blob = new Blob([bom + content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

// ─── PDF professionnel style ERP ─────────────────────────────────────────────
function generatePDF(title: string, rows: string[][], columns: string[], subtitle = '') {
  const date = new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
  const tableRows = rows.map(row =>
    `<tr>${row.map((cell, i) => `<td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;font-size:12px;color:${i === 0 ? '#1e293b' : '#475569'}">${cell}</td>`).join('')}</tr>`
  ).join('');

  const html = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>${title}</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'Segoe UI',Arial,sans-serif;background:#f8fafc;color:#1e293b}
    .page{max-width:900px;margin:0 auto;background:#fff;min-height:100vh;padding:0}
    .header{background:linear-gradient(135deg,#f97316 0%,#ea580c 100%);padding:32px 40px;color:#fff}
    .header-top{display:flex;justify-content:space-between;align-items:flex-start}
    .logo{font-size:22px;font-weight:900;letter-spacing:-0.5px}
    .logo span{color:#fed7aa}
    .company-info{text-align:right;font-size:11px;opacity:0.85;line-height:1.6}
    .doc-title{margin-top:24px}
    .doc-title h1{font-size:26px;font-weight:800;margin-bottom:4px}
    .doc-title p{font-size:13px;opacity:0.85}
    .meta-bar{background:#fff7ed;border-bottom:2px solid #fed7aa;padding:14px 40px;display:flex;gap:40px}
    .meta-item{font-size:11px;color:#92400e}
    .meta-item strong{display:block;font-size:13px;color:#c2410c;font-weight:700}
    .content{padding:32px 40px}
    .section-title{font-size:14px;font-weight:700;color:#f97316;text-transform:uppercase;letter-spacing:1px;margin-bottom:16px;padding-bottom:8px;border-bottom:2px solid #fed7aa}
    table{width:100%;border-collapse:collapse;margin-bottom:24px}
    thead tr{background:#f97316}
    thead td{padding:10px 12px;color:#fff;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px}
    tbody tr:nth-child(even){background:#fff7ed}
    tbody tr:hover{background:#fef3c7}
    .footer{border-top:1px solid #e2e8f0;padding:20px 40px;display:flex;justify-content:space-between;align-items:center;background:#f8fafc}
    .footer-left{font-size:10px;color:#94a3b8}
    .footer-right{font-size:10px;color:#94a3b8;text-align:right}
    .badge{display:inline-block;padding:2px 8px;border-radius:99px;font-size:10px;font-weight:600}
    .badge-green{background:#d1fae5;color:#065f46}
    .badge-orange{background:#ffedd5;color:#9a3412}
    @media print{body{background:#fff}.page{box-shadow:none}}
  </style></head>
  <body><div class="page">
    <div class="header">
      <div class="header-top">
        <div class="logo">Jobly</div>
        <div class="company-info">
          Plateforme des artisans du Maroc<br>
          contact@jobly.ma<br>
          www.jobly.ma
        </div>
      </div>
      <div class="doc-title">
        <h1>${title}</h1>
        <p>${subtitle || 'Rapport généré automatiquement par le système'}</p>
      </div>
    </div>
    <div class="meta-bar">
      <div class="meta-item"><strong>${date}</strong>Date d'émission</div>
      <div class="meta-item"><strong>${rows.length}</strong>Enregistrements</div>
      <div class="meta-item"><strong>CONFIDENTIEL</strong>Usage interne</div>
    </div>
    <div class="content">
      <div class="section-title">${title}</div>
      <table>
        <thead><tr>${columns.map(c => `<td>${c}</td>`).join('')}</tr></thead>
        <tbody>${tableRows}</tbody>
      </table>
    </div>
    <div style="display:flex;justify-content:center;padding:10px 40px 0">
      <svg width="90" height="90" viewBox="0 0 90 90" xmlns="http://www.w3.org/2000/svg" opacity="0.12">
        <circle cx="45" cy="45" r="43" fill="none" stroke="#f97316" stroke-width="3"/>
        <circle cx="45" cy="45" r="36" fill="none" stroke="#f97316" stroke-width="1"/>
        <text x="45" y="38" text-anchor="middle" font-family="Arial" font-weight="900" font-size="11" fill="#f97316">Jobly</text>
        <text x="45" y="52" text-anchor="middle" font-family="Arial" font-weight="900" font-size="11" fill="#f97316">Click</text>
        <text x="45" y="65" text-anchor="middle" font-family="Arial" font-size="7" fill="#f97316">CERTIFIÉ OFFICIEL</text>
      </svg>
    </div>
    <div class="footer">
      <div class="footer-left">Jobly — Plateforme des artisans marocains<br>Document généré le ${date}</div>
      <div class="footer-right">Ce document est confidentiel.<br>Toute reproduction est interdite sans autorisation.</div>
    </div>
  </div>
  <script>window.onload=()=>window.print()</script>
  </body></html>`;

  const w = window.open('', '_blank');
  if (w) { w.document.write(html); w.document.close(); }
}

// ─── Nav items ──────────────────────────────────────────────────────────────
const navItems: { id: Section; label: string; icon: any }[] = [
  { id: 'dashboard',      label: 'Dashboard',      icon: LayoutDashboard },
  { id: 'professionals',  label: 'Inscriptions',   icon: Users },
  { id: 'categories',     label: 'Catégories',     icon: Tag },
  { id: 'cities',         label: 'Villes',         icon: Building2 },
  { id: 'analytics',      label: 'Analytics',      icon: BarChart3 },
  { id: 'reviews',        label: 'Avis',           icon: Star },
  { id: 'settings',       label: 'Paramètres',     icon: Settings },
  { id: 'notifications',  label: 'Notifications',  icon: Bell },
];

// ─── Main Component ──────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('jobly_token') : null;

  const [section, setSection]   = useState<Section>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifCount, setNotifCount]   = useState(0);

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!token) { window.location.href = '/admin/login'; return; }
    // Load notification badge count
    axios.get('/api/admin/notifications', { headers })
      .then(r => setNotifCount((r.data.counts?.pending_pros ?? 0) + (r.data.counts?.pending_reviews ?? 0)))
      .catch(() => {});
  }, []);

  if (!token) return null;

  const logout = () => {
    localStorage.removeItem('jobly_token');
    window.location.href = '/admin/login';
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-slate-950 overflow-hidden">
      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col
        transform transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0
      `}>
        {/* Logo */}
        <div className="flex flex-col gap-0.5 px-6 py-5 border-b border-slate-700">
          <JoblyLogo size="md" theme="dark" />
          <div className="text-xs text-slate-400 mt-1">Panneau Admin</div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { setSection(id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
                section === id
                  ? 'bg-orange-500 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
              {id === 'notifications' && notifCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                  {notifCount}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Footer sidebar */}
        <div className="border-t border-slate-700 px-6 py-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center text-sm font-bold">A</div>
            <div>
              <div className="text-sm font-medium">Admin</div>
              <div className="text-xs text-slate-400">admin@jobly.ma</div>
            </div>
          </div>
          <button onClick={logout} className="flex items-center gap-2 text-xs text-slate-400 hover:text-red-400 transition-colors">
            <LogOut className="h-3.5 w-3.5" /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Main ────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-slate-100">
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-bold text-slate-800 dark:text-white">
              {navItems.find(n => n.id === section)?.label ?? 'Dashboard'}
            </h1>
          </div>
          <a href="/" target="_blank" className="flex items-center gap-1 text-sm text-blue-500 hover:underline">
            <Globe className="h-4 w-4" /> Voir le site
          </a>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {section === 'dashboard'     && <SectionDashboard headers={headers} setSection={setSection} />}
          {section === 'professionals' && <SectionProfessionals headers={headers} />}
          {section === 'categories'    && <SectionCategories headers={headers} />}
          {section === 'cities'        && <SectionCities headers={headers} />}
          {section === 'analytics'     && <SectionAnalytics headers={headers} />}
          {section === 'reviews'       && <SectionReviews headers={headers} />}
          {section === 'settings'      && <SectionSettings headers={headers} />}
          {section === 'notifications' && <SectionNotifications headers={headers} setNotifCount={setNotifCount} />}
        </main>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION — DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════
function SectionDashboard({ headers, setSection }: { headers: any; setSection: (s: Section) => void }) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    axios.get('/api/dashboard/admin', { headers }).then(r => setData(r.data)).catch(() => {});
  }, []);

  const stats = [
    { label: 'Professionnels actifs',  value: data?.stats?.professionals ?? '—', sub: `${data?.stats?.verified ?? 0} vérifiés`,    color: 'text-blue-600',   onClick: () => setSection('professionals') },
    { label: 'En attente d\'inscription', value: data?.stats?.pendingPros ?? '—', sub: 'Pros à valider →',                          color: 'text-orange-500', onClick: () => setSection('professionals') },
    { label: 'Avis à modérer',          value: data?.stats?.pendingReviews ?? '—', sub: 'Voir →',                                   color: 'text-yellow-600', onClick: () => setSection('reviews') },
    { label: 'Contacts (WA + Appels)',   value: data ? `${(data.stats?.whatsapp ?? 0) + (data.stats?.calls ?? 0)}` : '—',
      sub: `${data?.stats?.views ?? 0} vues`,                                                                                       color: 'text-green-600' },
  ];

  return (
    <div className="space-y-6">
      {/* KPI */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s, i) => (
          <div key={i} onClick={s.onClick} className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm ${s.onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}>
            <div className="text-sm text-slate-500 mb-1">{s.label}</div>
            <div className={`text-3xl font-black ${s.color}`}>{s.value}</div>
            <div className="text-xs text-slate-400 mt-1">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <h2 className="font-bold mb-4">Services demandés</h2>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.services ?? []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="profession" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="total" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <h2 className="font-bold mb-4">Top professionnels</h2>
          <div className="space-y-2">
            {(data?.topPros ?? []).slice(0, 5).map((p: any) => (
              <div key={p.id} className="flex items-center justify-between text-sm py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-slate-400">{p.profession}</div>
                </div>
                <div className="text-right text-xs text-slate-500">
                  <div className="flex items-center gap-1"><Eye className="h-3 w-3" />{p.views}</div>
                  <div>⭐ {p.rating}/5</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Moderation queue */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
        <h2 className="font-bold mb-4">File de modération des avis</h2>
        {(data?.reviewsQueue ?? []).length === 0 ? (
          <p className="text-sm text-slate-400">Aucun avis en attente.</p>
        ) : (
          <div className="space-y-3">
            {(data.reviewsQueue ?? []).slice(0, 5).map((r: any) => (
              <div key={r.id} className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <div>
                  <div className="font-medium text-sm">{r.client_name} → {r.professional?.name}</div>
                  <p className="text-xs text-slate-500 mt-0.5">{r.comment}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => axios.put(`/api/admin/reviews/${r.id}/approve`, {}, { headers: { Authorization: `Bearer ${localStorage.getItem('jobly_token')}` } })}
                    className="flex items-center gap-1 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-600">
                    <Check className="h-3 w-3" /> Approuver
                  </button>
                  <button onClick={() => axios.delete(`/api/admin/reviews/${r.id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('jobly_token')}` } })}
                    className="flex items-center gap-1 rounded-lg bg-rose-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-600">
                    <X className="h-3 w-3" /> Rejeter
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION — PROFESSIONNELS
// ═══════════════════════════════════════════════════════════════════════════════
function SectionProfessionals({ headers }: { headers: any }) {
  const [data, setData]       = useState<any>(null);
  const [search, setSearch]   = useState('');
  const [filter, setFilter]   = useState('');
  const [page, setPage]       = useState(1);
  const [rejectId, setRejectId]   = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const load = useCallback(() => {
    const params = new URLSearchParams({ page: String(page) });
    if (search) params.set('search', search);
    if (filter) params.set('status', filter);
    axios.get(`/api/admin/professionals?${params}`, { headers })
      .then(r => setData(r.data))
      .catch(() => {});
  }, [search, filter, page]);

  useEffect(() => { load(); }, [load]);

  const setStatus = async (id: number, status: string, reason = '') => {
    await axios.put(`/api/admin/professionals/${id}/status`, { status, rejection_reason: reason }, { headers });
    setRejectId(null);
    setRejectReason('');
    load();
  };

  const deleteUser = async (id: number) => {
    if (!confirm('Supprimer ce professionnel ?')) return;
    await axios.delete(`/api/admin/professionals/${id}`, { headers });
    load();
  };

  const statusBadge = (s: string) => {
    const map: Record<string, string> = {
      active:    'bg-emerald-100 text-emerald-700',
      pending:   'bg-orange-100 text-orange-700',
      refused:   'bg-red-100 text-red-700',
      suspended: 'bg-slate-100 text-slate-600',
    };
    const labels: Record<string, string> = { active: 'Actif', pending: 'En attente', refused: 'Refusé', suspended: 'Suspendu' };
    return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${map[s] ?? 'bg-slate-100 text-slate-500'}`}>{labels[s] ?? s}</span>;
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 items-center">
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
          placeholder="Rechercher nom / email..."
          className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none w-64" />
        <select value={filter} onChange={e => { setFilter(e.target.value); setPage(1); }}
          className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none">
          <option value="">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="active">Actifs</option>
          <option value="refused">Refusés</option>
          <option value="suspended">Suspendus</option>
        </select>
        <button onClick={() => downloadExcel('/api/admin/export/professionals', 'Jobly_Professionnels.csv')}
          className="ml-auto flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 hover:bg-emerald-100 transition-colors font-semibold">
          <Download className="h-4 w-4" /> Excel
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
              <tr>
                {['Nom', 'Email', 'Métier', 'Ville', 'Statut', 'Inscrit le', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {(data?.data ?? []).map((u: any) => (
                <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium">{u.name}</td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{u.email}</td>
                  <td className="px-4 py-3 text-slate-500">{u.professional?.profession ?? '—'}</td>
                  <td className="px-4 py-3 text-slate-500">{u.professional?.main_city ?? '—'}</td>
                  <td className="px-4 py-3">{statusBadge(u.status)}</td>
                  <td className="px-4 py-3 text-slate-400 text-xs">{new Date(u.created_at).toLocaleDateString('fr-FR')}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {u.status === 'pending' && (
                        <button onClick={() => setStatus(u.id, 'active')}
                          className="flex items-center gap-1 rounded-md bg-emerald-500 px-2 py-1 text-xs text-white hover:bg-emerald-600">
                          <Check className="h-3 w-3" /> Valider
                        </button>
                      )}
                      {u.status === 'pending' && (
                        <button onClick={() => setRejectId(u.id)}
                          className="flex items-center gap-1 rounded-md bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600">
                          <X className="h-3 w-3" /> Rejeter
                        </button>
                      )}
                      {u.status === 'active' && (
                        <button onClick={() => setStatus(u.id, 'suspended')}
                          className="flex items-center gap-1 rounded-md border border-slate-300 px-2 py-1 text-xs hover:bg-slate-50">
                          Suspendre
                        </button>
                      )}
                      {u.status === 'suspended' && (
                        <button onClick={() => setStatus(u.id, 'active')}
                          className="flex items-center gap-1 rounded-md border border-emerald-300 px-2 py-1 text-xs text-emerald-600 hover:bg-emerald-50">
                          Réactiver
                        </button>
                      )}
                      <button onClick={() => deleteUser(u.id)}
                        className="flex items-center gap-1 rounded-md border border-red-200 px-2 py-1 text-xs text-red-500 hover:bg-red-50">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {(data?.data ?? []).length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-400">Aucun résultat.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data?.last_page > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-slate-800 text-sm">
            <span className="text-slate-500">Page {data.current_page} / {data.last_page}</span>
            <div className="flex gap-2">
              <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
                className="px-3 py-1 rounded-lg border border-slate-300 disabled:opacity-40 hover:bg-slate-50">←</button>
              <button disabled={page >= data.last_page} onClick={() => setPage(p => p + 1)}
                className="px-3 py-1 rounded-lg border border-slate-300 disabled:opacity-40 hover:bg-slate-50">→</button>
            </div>
          </div>
        )}
      </div>

      {/* Reject modal */}
      {rejectId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="font-bold text-lg mb-3">Motif de rejet</h3>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="Expliquez pourquoi le profil est refusé..."
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none resize-none"
            />
            <div className="flex gap-2 mt-4">
              <button onClick={() => setStatus(rejectId, 'refused', rejectReason)}
                className="flex-1 bg-red-500 text-white rounded-lg py-2 text-sm font-semibold hover:bg-red-600">
                Confirmer le rejet
              </button>
              <button onClick={() => { setRejectId(null); setRejectReason(''); }}
                className="flex-1 border border-slate-300 rounded-lg py-2 text-sm hover:bg-slate-50">
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION — VILLES
// ═══════════════════════════════════════════════════════════════════════════════
function SectionCities({ headers }: { headers: any }) {
  const [cities, setCities]       = useState<City[]>([]);
  const [loading, setLoading]     = useState(false);
  const [showForm, setShowForm]   = useState(false);
  const [editing, setEditing]     = useState<City | null>(null);
  const [form, setForm]           = useState<CityForm>(emptyCity);
  const [error, setError]         = useState('');

  const load = () => {
    setLoading(true);
    axios.get('/api/admin/cities', { headers })
      .then(r => { const raw = r.data?.data ?? r.data; setCities(Array.isArray(raw) ? raw : []); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(emptyCity); setError(''); setShowForm(true); };
  const openEdit = (c: City) => { setEditing(c); setForm({ name: c.name, name_ar: c.name_ar, name_en: c.name_en, region: c.region, active: c.active }); setError(''); setShowForm(true); };

  const save = async () => {
    setError('');
    try {
      if (editing) await axios.put(`/api/admin/cities/${editing.id}`, form, { headers });
      else         await axios.post('/api/admin/cities', form, { headers });
      setShowForm(false);
      load();
    } catch (e: any) {
      setError(Object.values(e.response?.data?.errors ?? {}).flat().join(' ') || e.response?.data?.message || 'Erreur.');
    }
  };

  const del = async (id: number) => {
    if (!confirm('Supprimer cette ville ?')) return;
    await axios.delete(`/api/admin/cities/${id}`, { headers });
    load();
  };

  const toggle = async (c: City) => {
    await axios.put(`/api/admin/cities/${c.id}`, { ...c, active: !c.active }, { headers });
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{cities.length} ville(s) enregistrée(s)</p>
        <button onClick={openAdd}
          className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600">
          <Plus className="h-4 w-4" /> Ajouter une ville
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-orange-50 dark:bg-orange-900/10 rounded-2xl border border-orange-200 dark:border-orange-800 p-5">
          <h3 className="font-bold mb-4">{editing ? 'Modifier' : 'Nouvelle ville'}</h3>
          {error && <div className="mb-3 text-sm text-red-600 bg-red-50 rounded-lg p-2">{error}</div>}
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { label: 'Nom (FR) *', key: 'name', placeholder: 'Casablanca', dir: 'ltr' },
              { label: 'Nom (AR)',   key: 'name_ar', placeholder: 'الدار البيضاء', dir: 'rtl' },
              { label: 'Nom (EN)',   key: 'name_en', placeholder: 'Casablanca', dir: 'ltr' },
              { label: 'Région',    key: 'region', placeholder: 'Casablanca-Settat', dir: 'ltr' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-medium text-slate-500 mb-1">{f.label}</label>
                <input dir={f.dir} value={(form as any)[f.key]} placeholder={f.placeholder}
                  onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none" />
              </div>
            ))}
          </div>
          <label className="flex items-center gap-2 mt-3 text-sm">
            <input type="checkbox" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} className="rounded" />
            Active (visible sur le site)
          </label>
          <div className="flex gap-2 mt-4">
            <button onClick={save} className="flex items-center gap-2 bg-orange-500 text-white rounded-xl px-5 py-2 text-sm font-semibold hover:bg-orange-600">
              <Check className="h-4 w-4" /> {editing ? 'Enregistrer' : 'Ajouter'}
            </button>
            <button onClick={() => setShowForm(false)} className="border border-slate-300 rounded-xl px-5 py-2 text-sm hover:bg-slate-50">Annuler</button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-slate-400">Chargement...</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
              <tr>
                {['Français', 'العربية', 'Région', 'Statut', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {cities.map(c => (
                <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3 text-slate-500" dir="rtl">{c.name_ar || '—'}</td>
                  <td className="px-4 py-3 text-slate-500">{c.region || '—'}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggle(c)} className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${c.active ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                      {c.active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(c)} className="flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-xs hover:bg-slate-50">
                        <Pencil className="h-3 w-3" /> Modifier
                      </button>
                      <button onClick={() => del(c.id)} className="flex items-center gap-1 rounded-md border border-red-200 px-2 py-1 text-xs text-red-500 hover:bg-red-50">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {cities.length === 0 && <tr><td colSpan={5} className="py-8 text-center text-slate-400">Aucune ville.</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION — CATÉGORIES
// ═══════════════════════════════════════════════════════════════════════════════
type CatItem = { id: number; name: string; icon: string; description: string; sort_order: number; active: boolean; professionals_count: number };
type CatForm = { name: string; icon: string; description: string; sort_order: number; active: boolean };
const emptyCat: CatForm = { name: '', icon: '', description: '', sort_order: 0, active: true };

function SectionCategories({ headers }: { headers: any }) {
  const [cats, setCats]         = useState<CatItem[]>([]);
  const [loading, setLoading]   = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState<CatItem | null>(null);
  const [form, setForm]         = useState<CatForm>(emptyCat);
  const [error, setError]       = useState('');

  const load = () => {
    setLoading(true);
    axios.get('/api/admin/categories', { headers })
      .then(r => setCats(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openAdd  = () => { setEditing(null); setForm({ ...emptyCat, sort_order: (cats.length + 1) * 10 }); setError(''); setShowForm(true); };
  const openEdit = (c: CatItem) => { setEditing(c); setForm({ name: c.name, icon: c.icon ?? '', description: c.description ?? '', sort_order: c.sort_order, active: c.active }); setError(''); setShowForm(true); };

  const save = async () => {
    setError('');
    try {
      if (editing) await axios.put(`/api/admin/categories/${editing.id}`, form, { headers });
      else         await axios.post('/api/admin/categories', form, { headers });
      setShowForm(false);
      load();
    } catch (e: any) {
      setError(Object.values(e.response?.data?.errors ?? {}).flat().join(' ') || e.response?.data?.message || 'Erreur.');
    }
  };

  const del = async (c: CatItem) => {
    if (c.professionals_count > 0) { alert(`Impossible : ${c.professionals_count} professionnel(s) utilisent cette catégorie.`); return; }
    if (!confirm(`Supprimer "${c.name}" ?`)) return;
    await axios.delete(`/api/admin/categories/${c.id}`, { headers });
    load();
  };

  const toggle = async (c: CatItem) => {
    await axios.put(`/api/admin/categories/${c.id}`, { ...c, active: !c.active }, { headers });
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{cats.length} catégorie(s)</p>
        <button onClick={openAdd}
          className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600">
          <Plus className="h-4 w-4" /> Ajouter une catégorie
        </button>
      </div>

      {showForm && (
        <div className="bg-orange-50 dark:bg-orange-900/10 rounded-2xl border border-orange-200 dark:border-orange-800 p-5">
          <h3 className="font-bold mb-4">{editing ? 'Modifier' : 'Nouvelle catégorie'}</h3>
          {error && <div className="mb-3 text-sm text-red-600 bg-red-50 rounded-lg p-2">{error}</div>}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Nom *</label>
              <input value={form.name} placeholder="Ex: Plomberie" onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Icône (emoji)</label>
              <input value={form.icon} placeholder="🔧" maxLength={4} onChange={e => setForm({ ...form, icon: e.target.value })}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-500 mb-1">Description</label>
              <input value={form.description} placeholder="Services de plomberie..." onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Ordre d'affichage</label>
              <input type="number" value={form.sort_order} min={0} onChange={e => setForm({ ...form, sort_order: Number(e.target.value) })}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none" />
            </div>
          </div>
          <label className="flex items-center gap-2 mt-3 text-sm">
            <input type="checkbox" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} className="rounded" />
            Active (visible sur le site)
          </label>
          <div className="flex gap-2 mt-4">
            <button onClick={save} className="flex items-center gap-2 bg-orange-500 text-white rounded-xl px-5 py-2 text-sm font-semibold hover:bg-orange-600">
              <Check className="h-4 w-4" /> {editing ? 'Enregistrer' : 'Ajouter'}
            </button>
            <button onClick={() => setShowForm(false)} className="border border-slate-300 rounded-xl px-5 py-2 text-sm hover:bg-slate-50">Annuler</button>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-slate-400">Chargement...</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
              <tr>
                {['Icône', 'Nom', 'Description', 'Pros', 'Ordre', 'Statut', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {cats.map(c => (
                <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-4 py-3 text-2xl">{c.icon || '—'}</td>
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3 text-slate-500 text-xs max-w-[200px] truncate">{c.description || '—'}</td>
                  <td className="px-4 py-3 text-slate-600 font-semibold">{c.professionals_count}</td>
                  <td className="px-4 py-3 text-slate-400">{c.sort_order}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggle(c)} className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${c.active ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                      {c.active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(c)} className="flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-xs hover:bg-slate-50">
                        <Pencil className="h-3 w-3" /> Modifier
                      </button>
                      <button onClick={() => del(c)} className={`flex items-center gap-1 rounded-md border px-2 py-1 text-xs ${c.professionals_count > 0 ? 'border-slate-200 text-slate-300 cursor-not-allowed' : 'border-red-200 text-red-500 hover:bg-red-50'}`}>
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {cats.length === 0 && <tr><td colSpan={7} className="py-8 text-center text-slate-400">Aucune catégorie.</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION — ANALYTICS
// ═══════════════════════════════════════════════════════════════════════════════
function SectionAnalytics({ headers }: { headers: any }) {
  const [range, setRange] = useState('7');
  const [data, setData]   = useState<any>(null);

  useEffect(() => {
    axios.get(`/api/admin/analytics?range=${range}`, { headers })
      .then(r => setData(r.data))
      .catch(() => {});
  }, [range]);

  return (
    <div className="space-y-6">
      {/* Range selector */}
      <div className="flex items-center gap-2 flex-wrap">
        {[['1','Aujourd\'hui'],['7','7 jours'],['30','30 jours'],['90','90 jours']].map(([v, l]) => (
          <button key={v} onClick={() => setRange(v)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${range === v ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-50'}`}>
            {l}
          </button>
        ))}
        <div className="ml-auto flex gap-2">
          <button onClick={() => downloadExcel('/api/admin/export/professionals', 'Jobly_Professionnels.csv')}
            className="flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs text-emerald-700 hover:bg-emerald-100 transition-colors font-semibold">
            <Download className="h-3.5 w-3.5" /> Excel Pros
          </button>
          <button onClick={async () => {
            const token = localStorage.getItem('jobly_token');
            const r = await fetch('/api/admin/export/professionals', { headers: { Authorization: `Bearer ${token}` } });
            const text = await r.text();
            const lines = text.trim().split('\n').slice(1).map(l => l.split(';').map(c => c.replace(/^"|"$/g, '')));
            generatePDF(
              'Rapport Professionnels',
              lines,
              ['Nom', 'Email', 'Statut', 'Métier', 'Ville', 'Téléphone', 'Inscrit le'],
              `Export complet des professionnels inscrits sur Jobly`
            );
          }} className="flex items-center gap-1.5 rounded-xl border border-orange-300 bg-orange-50 px-3 py-2 text-xs text-orange-700 hover:bg-orange-100 transition-colors font-semibold">
            <FileText className="h-3.5 w-3.5" /> PDF Pros
          </button>
        </div>
      </div>

      {/* Totals */}
      {data?.totals && (
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: 'Vues', value: data.totals.views, icon: Eye, color: 'text-blue-600' },
            { label: 'WhatsApp', value: data.totals.whatsapp, icon: MessageCircle, color: 'text-green-600' },
            { label: 'Appels', value: data.totals.calls, icon: Phone, color: 'text-orange-600' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex items-center gap-4">
              <div className={`h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center ${color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <div className={`text-2xl font-black ${color}`}>{value}</div>
                <div className="text-xs text-slate-400">{label} sur la période</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Daily chart */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
        <h2 className="font-bold mb-4 flex items-center gap-2"><TrendingUp className="h-4 w-4 text-blue-500" />Activité — Vues & Contacts</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data?.daily ?? []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="views"    stroke="#3b82f6" strokeWidth={2} dot={false} name="Vues" />
              <Line type="monotone" dataKey="whatsapp" stroke="#10b981" strokeWidth={2} dot={false} name="WhatsApp" />
              <Line type="monotone" dataKey="calls"    stroke="#f97316" strokeWidth={2} dot={false} name="Appels" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top categories */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <h2 className="font-bold mb-4">Catégories les plus demandées</h2>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data?.topCategories ?? []} dataKey="total" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name }) => name}>
                  {(data?.topCategories ?? []).map((_: any, i: number) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top villes */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <h2 className="font-bold mb-4">Top villes</h2>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.topCities ?? []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis type="category" dataKey="main_city" tick={{ fontSize: 10 }} width={80} />
                <Tooltip />
                <Bar dataKey="total" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top pros table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 font-bold">Top 10 professionnels</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800">
              <tr>{['Nom','Métier','Ville','Vues','WhatsApp','Appels','Note'].map(h => (
                <th key={h} className="px-4 py-2 text-left text-xs text-slate-500 font-semibold uppercase">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {(data?.topPros ?? []).map((p: any) => (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3 text-slate-500">{p.profession}</td>
                  <td className="px-4 py-3 text-slate-500">{p.main_city}</td>
                  <td className="px-4 py-3 text-blue-600 font-semibold">{p.views}</td>
                  <td className="px-4 py-3 text-green-600 font-semibold">{p.whatsapp_clicks}</td>
                  <td className="px-4 py-3 text-orange-600 font-semibold">{p.calls}</td>
                  <td className="px-4 py-3">⭐ {p.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION — AVIS
// ═══════════════════════════════════════════════════════════════════════════════
function SectionReviews({ headers }: { headers: any }) {
  const [data, setData]   = useState<any>(null);
  const [filter, setFilter] = useState('false');
  const [page, setPage]   = useState(1);

  const load = useCallback(() => {
    axios.get(`/api/admin/reviews?approved=${filter}&page=${page}`, { headers })
      .then(r => setData(r.data))
      .catch(() => {});
  }, [filter, page]);

  useEffect(() => { load(); }, [load]);

  const approve = async (id: number) => {
    await axios.put(`/api/admin/reviews/${id}/approve`, {}, { headers });
    load();
  };

  const del = async (id: number) => {
    if (!confirm('Supprimer cet avis ?')) return;
    await axios.delete(`/api/admin/reviews/${id}`, { headers });
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {[['false','En attente'],['true','Approuvés'],['','Tous']].map(([v, l]) => (
          <button key={v} onClick={() => { setFilter(v); setPage(1); }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filter === v ? 'bg-orange-500 text-white' : 'bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-50'}`}>
            {l}
          </button>
        ))}
        <button onClick={load} className="ml-auto p-2 rounded-xl border border-slate-300 hover:bg-slate-50">
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* Analyse de sentiment IA sur les avis approuvés */}
      {(data?.data ?? []).length > 0 && (filter === 'true' || filter === '') && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-orange-500" /> Analyse de sentiment IA
          </h3>
          <SentimentDashboard reviews={(data?.data ?? []).filter((r: any) => r.approved)} />
        </div>
      )}

      <div className="space-y-3">
        {(data?.data ?? []).map((r: any) => (
          <div key={r.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm">{r.client_name}</span>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                  <span className="text-sm text-orange-500">{r.professional?.name ?? '—'}</span>
                  <span className="text-xs text-slate-400">{'⭐'.repeat(r.rating)}</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">{r.comment}</p>
                <p className="text-xs text-slate-400 mt-1">{new Date(r.created_at).toLocaleDateString('fr-FR')}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                {!r.approved && (
                  <button onClick={() => approve(r.id)}
                    className="flex items-center gap-1 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-600">
                    <Check className="h-3 w-3" /> Approuver
                  </button>
                )}
                <button onClick={() => del(r.id)}
                  className="flex items-center gap-1 rounded-lg bg-rose-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-600">
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {(data?.data ?? []).length === 0 && (
          <div className="text-center py-12 text-slate-400">Aucun avis à afficher.</div>
        )}
      </div>

      {data?.last_page > 1 && (
        <div className="flex justify-center gap-2">
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="px-4 py-2 rounded-lg border border-slate-300 disabled:opacity-40 hover:bg-slate-50 text-sm">← Précédent</button>
          <button disabled={page >= data.last_page} onClick={() => setPage(p => p + 1)} className="px-4 py-2 rounded-lg border border-slate-300 disabled:opacity-40 hover:bg-slate-50 text-sm">Suivant →</button>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION — PARAMÈTRES
// ═══════════════════════════════════════════════════════════════════════════════
function SectionSettings({ headers }: { headers: any }) {
  const [tab, setTab]           = useState<'general'|'whatsapp'|'footer'|'limits'>('general');
  const [settings, setSettings] = useState<any>(null);
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);

  useEffect(() => {
    axios.get('/api/settings').then(r => setSettings(r.data)).catch(() => {});
  }, []);

  const save = async () => {
    setSaving(true); setSaved(false);
    try {
      await axios.put('/api/settings', settings, { headers });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally { setSaving(false); }
  };

  const field = (label: string, key: string, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
      <input type={type} value={settings?.[key] ?? ''} placeholder={placeholder}
        onChange={e => setSettings({ ...settings, [key]: e.target.value })}
        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none" />
    </div>
  );

  const tabs = [['general','Général'],['whatsapp','WhatsApp'],['footer','Footer'],['limits','Limites']];

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map(([v, l]) => (
          <button key={v} onClick={() => setTab(v as any)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${tab === v ? 'bg-orange-500 text-white' : 'bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-50'}`}>
            {l}
          </button>
        ))}
      </div>

      {settings && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          {/* Général */}
          {tab === 'general' && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Informations générales</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {field('Nom de la plateforme', 'platform_name', 'text', 'Jobly')}
                {field('Email de contact', 'contact_email', 'email', 'contact@jobly.ma')}
                {field('Téléphone', 'contact_phone', 'text', '+212 6XX XXX XXX')}
                {field('Adresse', 'address', 'text', 'Casablanca, Maroc')}
              </div>
            </div>
          )}

          {/* WhatsApp */}
          {tab === 'whatsapp' && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Configuration WhatsApp</h3>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Message par défaut</label>
                <textarea rows={4} value={settings.whatsapp_message ?? ''}
                  onChange={e => setSettings({ ...settings, whatsapp_message: e.target.value })}
                  placeholder="Bonjour, je vous contacte depuis Jobly..."
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none resize-none" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Numéro international (footer)</label>
                  <input type="text" value={settings.footer_social?.whatsapp ?? ''} placeholder="212612345678"
                    onChange={e => setSettings({ ...settings, footer_social: { ...(settings.footer_social ?? {}), whatsapp: e.target.value } })}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none" />
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          {tab === 'footer' && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Contenu du footer</h3>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Texte de présentation</label>
                <textarea rows={3} value={settings.footer_about ?? ''}
                  onChange={e => setSettings({ ...settings, footer_about: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none resize-none" />
              </div>
              {field('Texte copyright', 'footer_copyright', 'text', '© 2026 Jobly. Tous droits réservés.')}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Facebook URL</label>
                  <input type="url" value={settings.footer_social?.facebook ?? ''} placeholder="https://facebook.com/..."
                    onChange={e => setSettings({ ...settings, footer_social: { ...(settings.footer_social ?? {}), facebook: e.target.value } })}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Instagram URL</label>
                  <input type="url" value={settings.footer_social?.instagram ?? ''} placeholder="https://instagram.com/..."
                    onChange={e => setSettings({ ...settings, footer_social: { ...(settings.footer_social ?? {}), instagram: e.target.value } })}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none" />
                </div>
              </div>
            </div>
          )}

          {/* Limites */}
          {tab === 'limits' && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Limites système</h3>
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <AlertCircle className="h-4 w-4" />
                  Ces paramètres sont utilisés pour contrôler les limites de la plateforme.
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {field('Max professionnels actifs', 'max_professionals', 'number', '500')}
                {field('Max clics WhatsApp / jour / pro', 'max_whatsapp_per_day', 'number', '100')}
                {field('Seuil alerte avis en attente', 'alert_reviews_threshold', 'number', '10')}
                {field('Seuil alerte inscriptions en attente', 'alert_pending_threshold', 'number', '5')}
              </div>
            </div>
          )}

          {/* Save button */}
          <div className="flex items-center gap-3 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
            <button onClick={save} disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-50 transition-colors">
              {saving ? <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
            {saved && <span className="flex items-center gap-1 text-sm text-emerald-600 font-medium"><Check className="h-4 w-4" /> Sauvegardé</span>}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION — NOTIFICATIONS
// ═══════════════════════════════════════════════════════════════════════════════
function SectionNotifications({ headers, setNotifCount }: { headers: any; setNotifCount: (n: number) => void }) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    axios.get('/api/admin/notifications', { headers })
      .then(r => {
        setData(r.data);
        setNotifCount((r.data.counts?.pending_pros ?? 0) + (r.data.counts?.pending_reviews ?? 0));
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      {/* Badges résumé */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="bg-orange-50 dark:bg-orange-900/10 rounded-2xl border border-orange-200 dark:border-orange-800 p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
            <Users className="h-5 w-5 text-orange-500" />
          </div>
          <div>
            <div className="text-2xl font-black text-orange-500">{data?.counts?.pending_pros ?? 0}</div>
            <div className="text-xs text-slate-500">Inscriptions en attente</div>
          </div>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/10 rounded-2xl border border-yellow-200 dark:border-yellow-800 p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
            <Star className="h-5 w-5 text-yellow-500" />
          </div>
          <div>
            <div className="text-2xl font-black text-yellow-500">{data?.counts?.pending_reviews ?? 0}</div>
            <div className="text-xs text-slate-500">Avis en attente de modération</div>
          </div>
        </div>
      </div>

      {/* Nouvelles inscriptions */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <Users className="h-4 w-4 text-orange-500" />
          <span className="font-bold">Dernières inscriptions en attente</span>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {(data?.pending_pros ?? []).length === 0 ? (
            <div className="px-5 py-6 text-sm text-slate-400 text-center">Aucune inscription en attente.</div>
          ) : (
            (data.pending_pros ?? []).map((u: any) => (
              <div key={u.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <div className="font-medium text-sm">{u.name}</div>
                  <div className="text-xs text-slate-400">{u.email} · {new Date(u.created_at).toLocaleDateString('fr-FR')}</div>
                </div>
                <span className="inline-flex items-center rounded-full bg-orange-100 text-orange-700 px-2.5 py-0.5 text-xs font-medium">En attente</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Avis en attente */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <Star className="h-4 w-4 text-yellow-500" />
          <span className="font-bold">Derniers avis à modérer</span>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {(data?.pending_reviews ?? []).length === 0 ? (
            <div className="px-5 py-6 text-sm text-slate-400 text-center">Aucun avis en attente.</div>
          ) : (
            (data.pending_reviews ?? []).map((r: any) => (
              <div key={r.id} className="px-5 py-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{r.client_name} → {r.professional?.name}</span>
                  <span className="text-xs text-slate-400">{'⭐'.repeat(r.rating)}</span>
                </div>
                <p className="text-xs text-slate-500 truncate">{r.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Activité récente */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 font-bold">Activité récente</div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {(data?.recent_trackings ?? []).map((t: any, i: number) => (
            <div key={i} className="flex items-center gap-3 px-5 py-3 text-sm">
              <div className={`h-2 w-2 rounded-full shrink-0 ${t.type === 'view' ? 'bg-blue-400' : t.type === 'whatsapp_click' ? 'bg-green-400' : 'bg-orange-400'}`} />
              <span className="text-slate-500 capitalize">{t.type === 'whatsapp_click' ? 'WhatsApp' : t.type === 'view' ? 'Vue' : 'Appel'}</span>
              <span className="font-medium">{t.professional?.name ?? '—'}</span>
              <span className="ml-auto text-xs text-slate-400">{new Date(t.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          ))}
          {(data?.recent_trackings ?? []).length === 0 && (
            <div className="px-5 py-6 text-sm text-slate-400 text-center">Aucune activité récente.</div>
          )}
        </div>
      </div>
    </div>
  );
}

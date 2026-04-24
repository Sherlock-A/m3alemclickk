/* =================================================================
   M3allemClick — Alpine + Livewire utilities
   ================================================================= */

// ─── GPS Search ──────────────────────────────────────────────────
window.gpsSearch = function () {
    return {
        locating: false,

        // Apply city to a <select x-ref="citySelect"> or text <input x-ref="cityInput">
        _applyCity(city) {
            const sel = this.$refs.citySelect;
            if (sel) {
                const opt = Array.from(sel.options).find(
                    o => o.value.toLowerCase() === city.toLowerCase()
                       || o.text.toLowerCase().includes(city.toLowerCase())
                );
                if (opt) { sel.value = opt.value; sel.dispatchEvent(new Event('change')); return; }
            }
            const inp = this.$refs.cityInput;
            if (inp && !inp.value) {
                inp.value = city;
                inp.dispatchEvent(new Event('input'));
                inp.dispatchEvent(new Event('change'));
            }
        },

        // Silently detect city by IP on page load
        async autoDetectByIp() {
            try {
                const r    = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(4000) });
                const data = await r.json();
                if (data.city) this._applyCity(data.city);
            } catch { /* silent */ }
        },

        // GPS browser geolocation → Nominatim reverse geocode
        async _fetchCity(lat, lon) {
            const r    = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`, { headers: { 'Accept-Language': 'fr' } });
            const data = await r.json();
            return data.address?.city || data.address?.town || data.address?.village || data.address?.county || '';
        },

        locate() {
            if (!navigator.geolocation) return;
            this.locating = true;
            navigator.geolocation.getCurrentPosition(
                async pos => {
                    try {
                        const city = await this._fetchCity(pos.coords.latitude, pos.coords.longitude);
                        if (city) this._applyCity(city);
                    } finally { this.locating = false; }
                },
                () => { this.locating = false; }
            );
        },

        locateAndSet() { this.locate(); },
    };
};

// ─── Toast notifications ──────────────────────────────────────────
window.Toast = {
    show(message, type = 'success', duration = 3500) {
        const icons   = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
        const colors  = {
            success: 'bg-green-600', error: 'bg-red-600',
            info: 'bg-blue-600',    warning: 'bg-yellow-500',
        };
        const el = document.createElement('div');
        el.className = `fixed bottom-5 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 ${colors[type] ?? colors.info} text-white text-sm font-medium px-5 py-3 rounded-xl shadow-xl transition-all`;
        el.innerHTML = `<span>${icons[type] ?? '🔔'}</span><span>${message}</span>`;
        document.body.appendChild(el);
        setTimeout(() => { el.style.opacity = '0'; el.style.transform = 'translateX(-50%) translateY(8px)'; setTimeout(() => el.remove(), 400); }, duration);
    },
    success: (m, d) => window.Toast.show(m, 'success', d),
    error:   (m, d) => window.Toast.show(m, 'error',   d),
    info:    (m, d) => window.Toast.show(m, 'info',    d),
    warning: (m, d) => window.Toast.show(m, 'warning', d),
};

// ─── Livewire hooks ───────────────────────────────────────────────
document.addEventListener('livewire:init', () => {
    Livewire.on('toast-success', ({ message }) => window.Toast.success(message));
    Livewire.on('toast-error',   ({ message }) => window.Toast.error(message));
    Livewire.on('toast',         ({ message, type }) => window.Toast.show(message, type ?? 'success'));
});

// ROX Finance — interacciones del sitio

// Datos de contacto (pendientes de confirmación por el cliente)
const WHATSAPP_NUMBER = '593985467451';

document.addEventListener('DOMContentLoaded', () => {
    // Header: sombra al hacer scroll
    const header = document.querySelector('.site-header');
    const onScroll = () => header?.classList.toggle('scrolled', window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    // Menú móvil
    const menuToggle = document.getElementById('menu-toggle');
    const closeMenu = () => {
        document.body.classList.remove('menu-open');
        menuToggle?.setAttribute('aria-expanded', 'false');
    };

    menuToggle?.addEventListener('click', () => {
        const open = document.body.classList.toggle('menu-open');
        menuToggle.setAttribute('aria-expanded', String(open));
    });

    document.querySelectorAll('.nav-links a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', e => e.key === 'Escape' && closeMenu());

    // Animaciones al entrar en pantalla
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.reveal, [data-animate]').forEach(el => revealObserver.observe(el));

    // Formularios de agenda: arman el mensaje y lo abren en WhatsApp
    document.querySelectorAll('form[data-agenda]').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!form.reportValidity()) return;

            const data = new FormData(form);
            const lines = [
                'Hola ROX Finance, quiero agendar una consulta.',
                '',
                `Nombre: ${data.get('nombre')}`,
                `WhatsApp: ${data.get('whatsapp')}`,
                `Email: ${data.get('email')}`,
                `Objetivo principal: ${data.get('objetivo')}`,
            ];
            if (data.get('momento')) lines.push(`Momento para conversar: ${data.get('momento')}`);
            if (data.get('mensaje')) lines.push(`Mensaje: ${data.get('mensaje')}`);

            window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener');

            form.querySelector('.form-success')?.remove();
            const success = document.createElement('p');
            success.className = 'form-success';
            success.textContent = `Gracias, ${data.get('nombre')}. Abrimos WhatsApp con tu solicitud para que puedas enviarla. Te responderemos para coordinar la conversación.`;
            form.appendChild(success);
            form.reset();
        });
    });

    // Calculadora de crecimiento (interés compuesto)
    document.querySelectorAll('[data-calc]').forEach(initCalculator);

    // Año en el footer
    document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
});

// Calculadora de interés compuesto: aportes al final de cada mes; el interés
// se acumula mes a mes y se capitaliza según la frecuencia elegida.
function initCalculator(root) {
    const form = root.querySelector('form');
    const errorBox = root.querySelector('.calc-error');
    const chart = root.querySelector('[data-chart]');
    const tableBody = root.querySelector('[data-table]');
    const out = key => root.querySelector(`[data-out="${key}"]`);
    const money = new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
    const NS = 'http://www.w3.org/2000/svg';

    const limits = {
        capital: [100, 100000000, 'El capital inicial debe ser de al menos $100 y no superar $100.000.000.'],
        aporte: [0, 1000000, 'El aporte mensual debe estar entre 0 y 1.000.000.'],
        anios: [1, 60, 'Los años deben estar entre 1 y 60.'],
        tasa: [0, 20, 'El rendimiento debe estar entre 0% y 20%.'],
    };

    function read() {
        const data = new FormData(form);
        const values = {};
        for (const [key, [min, max, message]] of Object.entries(limits)) {
            const raw = String(data.get(key)).trim();
            const value = Number(raw);
            if (raw === '' || !Number.isFinite(value) || value < min || value > max) return { error: message };
            values[key] = value;
        }
        values.anios = Math.round(values.anios);
        values.frecuencia = Number(data.get('frecuencia'));
        return { values };
    }

    function simulate({ capital, aporte, anios, tasa, frecuencia }) {
        const monthlyRate = tasa / 100 / 12;
        const every = 12 / frecuencia;
        let balance = capital;
        let pending = 0;
        let contributed = capital;
        const rows = [];
        for (let month = 1; month <= anios * 12; month++) {
            pending += balance * monthlyRate;
            balance += aporte;
            contributed += aporte;
            if (month % every === 0) {
                balance += pending;
                pending = 0;
            }
            if (month % 12 === 0) {
                const total = balance + pending;
                rows.push({ year: month / 12, contributed, interest: total - contributed, total });
            }
        }
        return rows;
    }

    function drawChart(rows) {
        chart.replaceChildren();
        const W = 600, H = 220, gap = 4;
        chart.setAttribute('viewBox', `0 0 ${W} ${H}`);
        chart.setAttribute('preserveAspectRatio', 'none');
        const max = Math.max(...rows.map(r => r.total), 1);
        const barW = (W - gap * (rows.length - 1)) / rows.length;
        rows.forEach((row, i) => {
            const x = i * (barW + gap);
            const hContrib = (row.contributed / max) * H;
            const hInterest = (Math.max(row.interest, 0) / max) * H;
            [['bar-contrib', H - hContrib, hContrib], ['bar-interest', H - hContrib - hInterest, hInterest]].forEach(([cls, y, h], layer) => {
                const rect = document.createElementNS(NS, 'rect');
                rect.setAttribute('class', `calc-bar ${cls}`);
                rect.setAttribute('x', x.toFixed(2));
                rect.setAttribute('y', y.toFixed(2));
                rect.setAttribute('width', barW.toFixed(2));
                rect.setAttribute('height', Math.max(h, 0).toFixed(2));
                rect.style.setProperty('--i', i);
                rect.style.setProperty('--layer', layer);
                chart.appendChild(rect);
            });
        });
    }

    function drawTable(rows) {
        tableBody.replaceChildren(...rows.map(row => {
            const tr = document.createElement('tr');
            [row.year, money.format(row.contributed), money.format(row.interest), money.format(row.total)].forEach(text => {
                const td = document.createElement('td');
                td.textContent = text;
                tr.appendChild(td);
            });
            return tr;
        }));
    }

    function update() {
        const { values, error } = read();
        errorBox.hidden = !error;
        if (error) {
            errorBox.textContent = error;
            return;
        }
        const rows = simulate(values);
        const last = rows[rows.length - 1];
        out('total').textContent = money.format(last.total);
        out('contrib').textContent = money.format(last.contributed);
        out('interest').textContent = money.format(last.interest);
        out('years-label').textContent = `${values.anios} ${values.anios === 1 ? 'año' : 'años'}`;
        drawChart(rows);
        drawTable(rows);
    }

    form.addEventListener('input', update);
    form.addEventListener('change', update);
    form.addEventListener('submit', e => e.preventDefault());
    update();
}

// ROX Finance — interacciones del sitio

// Datos de contacto (pendientes de confirmación por el cliente)
const WHATSAPP_NUMBER = '593991234567';

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

    // Año en el footer
    document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
});

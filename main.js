// Basic interactions and animations
document.addEventListener('DOMContentLoaded', () => {
    // Navbar scroll effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.padding = '0.8rem 0';
            header.style.background = 'rgba(10, 25, 47, 0.95)';
        } else {
            header.style.padding = '1.5rem 0';
            header.style.background = 'rgba(10, 25, 47, 0.85)';
        }
    });

    // Contact form handling (Simulation with email destination)
    const contactForm = document.getElementById('rox-contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerText;
            
            // Collect data (for simulation)
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                service: document.getElementById('service').value,
                message: document.getElementById('message').value
            };

            btn.innerText = 'Enviando a info@roxfinance.com...';
            btn.disabled = true;

            // Simulate API Call
            setTimeout(() => {
                btn.innerText = '¡Solicitud Recibida!';
                btn.style.backgroundColor = '#d4af37';
                btn.style.color = '#0a192f';
                
                console.log('Formulario enviado a info@roxfinance.com:', formData);
                
                // Show success alert
                const successMsg = document.createElement('p');
                successMsg.innerText = 'Gracias ' + formData.name + '. Su mensaje ha sido enviado exitosamente a nuestra oficina central.';
                successMsg.style.color = '#d4af37';
                successMsg.style.marginTop = '1rem';
                successMsg.style.fontSize = '0.9rem';
                contactForm.appendChild(successMsg);

                contactForm.reset();

                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.backgroundColor = 'var(--accent-green)';
                    btn.style.color = 'var(--primary-blue)';
                    btn.disabled = false;
                    successMsg.remove();
                }, 5000);
            }, 1500);
        });
    }

    // Advanced Scroll Reveal
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    // Apply reveal to elements
    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });

    // Timeline Slider Logic
    const track = document.getElementById('timeline-track');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.timeline-nav-btn.prev');
    const nextBtn = document.querySelector('.timeline-nav-btn.next');

    if (track && dots.length > 0) {
        const updateDots = () => {
            const scrollLeft = track.scrollLeft;
            const itemWidth = track.querySelector('.timeline-item').offsetWidth;
            const index = Math.round(scrollLeft / itemWidth);
            
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        };

        track.addEventListener('scroll', updateDots);

        nextBtn.addEventListener('click', () => {
            const itemWidth = track.querySelector('.timeline-item').offsetWidth + 32; // width + gap
            track.scrollBy({ left: itemWidth, behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', () => {
            const itemWidth = track.querySelector('.timeline-item').offsetWidth + 32;
            track.scrollBy({ left: -itemWidth, behavior: 'smooth' });
        });

        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                const itemWidth = track.querySelector('.timeline-item').offsetWidth + 32;
                track.scrollTo({ left: i * itemWidth, behavior: 'smooth' });
            });
        });
    }

    // Mobile Menu Toggle Logic
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const menuIcon = menuToggle?.querySelector('i');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            // Toggle icon between bars and times
            if (menuIcon) {
                if (navLinks.classList.contains('active')) {
                    menuIcon.classList.remove('fa-bars');
                    menuIcon.classList.add('fa-times');
                } else {
                    menuIcon.classList.remove('fa-times');
                    menuIcon.classList.add('fa-bars');
                }
            }
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                if (menuIcon) {
                    menuIcon.classList.remove('fa-times');
                    menuIcon.classList.add('fa-bars');
                }
            });
        });
    }
});

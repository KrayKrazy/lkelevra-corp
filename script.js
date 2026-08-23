/* ═══════════════════════════════════════════════════════
   lKelevra Corp. — Interactive Scripts
   O FUTURO É ILUMINADO.
   ═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    /* ─── HEADER SCROLL EFFECT ─── */
    const header = document.getElementById('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        if (currentScroll > 60) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    });

    /* ─── MOBILE MENU ─── */
    const hamburger = document.getElementById('hamburger');
    const mainNav = document.getElementById('mainNav');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mainNav.classList.toggle('open');
        document.body.style.overflow = mainNav.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu on link click
    mainNav.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mainNav.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    /* ─── ACTIVE NAV LINK ON SCROLL ─── */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link:not(.nav-link--cta)');

    function updateActiveNav() {
        const scrollPos = window.scrollY + 200;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);

    /* ─── SCROLL ANIMATIONS (Intersection Observer) ─── */
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger animations
                const delay = Array.from(animatedElements).indexOf(entry.target) % 5;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));

    /* ─── COUNTER ANIMATION ─── */
    const metricValues = document.querySelectorAll('.metric-card__value');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    metricValues.forEach(el => counterObserver.observe(el));

    function animateCounter(element) {
        const target = parseInt(element.dataset.target);
        const prefix = element.dataset.prefix || '';
        const suffix = element.dataset.suffix || '';
        const duration = 2000;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(target * easeOut);

            element.textContent = prefix + current.toLocaleString('pt-BR') + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = prefix + target.toLocaleString('pt-BR') + suffix;
            }
        }

        requestAnimationFrame(update);
    }

    /* ─── TESTIMONIAL SLIDER ─── */
    const track = document.getElementById('testimonialTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('sliderDots');
    const totalSlides = track ? track.children.length : 0;
    let currentSlide = 0;
    let autoSlideInterval;

    // Create dots
    if (dotsContainer && totalSlides > 0) {
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.classList.add('slider-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }

    function goToSlide(index) {
        currentSlide = index;
        if (track) {
            track.style.transform = `translateX(-${index * 100}%)`;
        }
        updateDots();
        resetAutoSlide();
    }

    function updateDots() {
        if (!dotsContainer) return;
        dotsContainer.querySelectorAll('.slider-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }

    function nextSlide() {
        goToSlide((currentSlide + 1) % totalSlides);
    }

    function prevSlide() {
        goToSlide((currentSlide - 1 + totalSlides) % totalSlides);
    }

    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(nextSlide, 6000);
    }

    if (totalSlides > 0) {
        resetAutoSlide();
    }

    /* ─── HERO CONSTELLATION — Custom Canvas (stars + lines + mouse parallax) ─── */
    (function initConstellation() {
        const heroSection = document.getElementById('inicio');
        if (!heroSection) return;

        const canvas = document.createElement('canvas');
        canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;';
        heroSection.style.position = 'relative';
        heroSection.insertBefore(canvas, heroSection.firstChild);

        const ctx = canvas.getContext('2d');
        let W, H, stars;
        const mouse = { x: 0, y: 0 };
        const STAR_COUNT = 75;
        const CONNECTION_DIST = 140;

        function resize() {
            W = canvas.offsetWidth;
            H = canvas.offsetHeight;
            canvas.width = W;
            canvas.height = H;
        }

        function createStars() {
            stars = Array.from({ length: STAR_COUNT }, () => {
                const bx = Math.random() * W;
                const by = Math.random() * H;
                return {
                    bx, by, x: bx, y: by,
                    r: Math.random() * 1.4 + 0.4,
                    phase: Math.random() * Math.PI * 2,
                    speed: Math.random() * 0.25 + 0.08,
                    ampX: Math.random() * 20 + 8,
                    ampY: Math.random() * 14 + 5,
                };
            });
        }

        let t = 0;
        function draw() {
            t += 0.005;
            ctx.clearRect(0, 0, W, H);

            const mx = mouse.x || W / 2;
            const my = mouse.y || H / 2;
            const px = (mx - W / 2) * 0.018;
            const py = (my - H / 2) * 0.018;

            stars.forEach(s => {
                s.x = s.bx + Math.sin(t * s.speed + s.phase) * s.ampX + px;
                s.y = s.by + Math.cos(t * s.speed * 0.7 + s.phase) * s.ampY + py;
                if (s.x < 0) { s.x += W; s.bx += W; }
                if (s.x > W) { s.x -= W; s.bx -= W; }
                if (s.y < 0) { s.y += H; s.by += H; }
                if (s.y > H) { s.y -= H; s.by -= H; }
            });

            for (let i = 0; i < stars.length; i++) {
                for (let j = i + 1; j < stars.length; j++) {
                    const dx = stars[i].x - stars[j].x;
                    const dy = stars[i].y - stars[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < CONNECTION_DIST) {
                        const a = (1 - dist / CONNECTION_DIST) * 0.22;
                        ctx.beginPath();
                        ctx.moveTo(stars[i].x, stars[i].y);
                        ctx.lineTo(stars[j].x, stars[j].y);
                        ctx.strokeStyle = `rgba(212,175,55,${a})`;
                        ctx.lineWidth = 0.6;
                        ctx.stroke();
                    }
                }
            }

            stars.forEach(s => {
                const pulse = 0.65 + 0.35 * Math.sin(t * 2.2 + s.phase);
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r * pulse, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(212,175,55,${0.45 + 0.55 * pulse})`;
                ctx.fill();
            });

            requestAnimationFrame(draw);
        }

        window.addEventListener('mousemove', e => {
            const rect = heroSection.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });
        window.addEventListener('resize', () => { resize(); createStars(); });

        resize();
        createStars();
        draw();
    })();

    /* ─── LUXURY CURSOR (desktop only) ─── */
    (function initCursor() {
        if (window.innerWidth < 768) return;

        document.body.style.cursor = 'none';

        const dot = document.createElement('div');
        dot.style.cssText = 'position:fixed;top:0;left:0;width:14px;height:14px;border-radius:50%;background:#d4af37;pointer-events:none;z-index:99999;will-change:transform;mix-blend-mode:difference;';

        const ring = document.createElement('div');
        ring.style.cssText = 'position:fixed;top:0;left:0;width:38px;height:38px;border-radius:50%;border:1px solid rgba(212,175,55,0.55);pointer-events:none;z-index:99998;will-change:transform;transition:border-color 0.2s;';

        document.body.appendChild(dot);
        document.body.appendChild(ring);

        const pos = { x: -100, y: -100 };
        const trail = { x: -100, y: -100 };
        let isHover = false;

        window.addEventListener('mousemove', e => { pos.x = e.clientX; pos.y = e.clientY; });

        document.querySelectorAll('a, button').forEach(el => {
            el.style.cursor = 'none';
            el.addEventListener('mouseenter', () => { isHover = true; ring.style.borderColor = 'rgba(212,175,55,0.9)'; });
            el.addEventListener('mouseleave', () => { isHover = false; ring.style.borderColor = 'rgba(212,175,55,0.55)'; });
        });

        (function animateCursor() {
            trail.x += (pos.x - trail.x) * 0.12;
            trail.y += (pos.y - trail.y) * 0.12;
            const s = isHover ? 2.2 : 1;
            const rs = isHover ? 1.5 : 1;
            dot.style.transform = `translate(${pos.x - 7}px,${pos.y - 7}px) scale(${s})`;
            ring.style.transform = `translate(${trail.x - 19}px,${trail.y - 19}px) scale(${rs})`;
            requestAnimationFrame(animateCursor);
        })();
    })();

    /* ─── SMOOTH SCROLL for anchor links ─── */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* ─── CONTACT FORM ─── */
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const company = document.getElementById('company').value;
            const serviceSelect = document.getElementById('service');
            const serviceText = serviceSelect.options[serviceSelect.selectedIndex].text;

            const text = `Olá, vim pelo site da Kelevra Corp!\n\n*Nome:* ${name}\n*Empresa:* ${company}\n*E-mail:* ${email}\n*Telefone:* ${phone}\n*Pilar de interesse:* ${serviceText}`;
            const whatsappNumber = "5561981849873";
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;

            window.open(whatsappUrl, '_blank');

            const btn = contactForm.querySelector('.btn');
            const originalContent = btn.innerHTML;

            btn.innerHTML = '<span>Redirecionando...</span> ⏳';
            btn.style.background = 'linear-gradient(135deg, #2ECC71, #27AE60)';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerHTML = originalContent;
                btn.style.background = '';
                btn.disabled = false;
                contactForm.reset();
            }, 3000);
        });
    }

    /* ─── PARALLAX SUBTLE on hero ─── */
    const heroContent = document.querySelector('.hero__content');

    window.addEventListener('scroll', () => {
        if (!heroContent) return;
        const scrolled = window.scrollY;
        if (scrolled < window.innerHeight) {
            heroContent.style.transform = `translateY(${scrolled * 0.15}px)`;
            heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
        }
    });

    /* ─── SWIPER SLIDER INIT ─── */
    if (typeof Swiper !== 'undefined') {
        new Swiper('.ecossistema-swiper', {
            slidesPerView: 1.2,
            spaceBetween: 20,
            grabCursor: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                640: {
                    slidesPerView: 2.2,
                    spaceBetween: 24,
                },
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 32,
                }
            }
        });
    }

});

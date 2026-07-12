/* ============================================================
   ANURA ADVERTISING — Interactive Scripts
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ── Preloader ─────────────────────────────────────────
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 800);
    });
    // Fallback: hide preloader after 3 seconds
    setTimeout(() => {
        preloader.classList.add('hidden');
    }, 3000);

    // ── Header Scroll Effect ──────────────────────────────
    const header = document.getElementById('header');
    const backToTop = document.getElementById('back-to-top');
    let lastScrollY = 0;

    function handleScroll() {
        const scrollY = window.scrollY;
        if (scrollY > 80) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        // Back to top visibility
        if (scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
        lastScrollY = scrollY;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    // ── Active Nav Link on Scroll ─────────────────────────
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

    function updateActiveNav() {
        const scrollPos = window.scrollY + 150;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });

    // ── Mobile Navigation Toggle ──────────────────────────
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('open');
        document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // ── Hero Slider ───────────────────────────────────────
    const slides = document.querySelectorAll('.hero-slide');
    const sliderDots = document.querySelectorAll('.slider-dot');
    let currentSlide = 0;
    let slideInterval;

    function goToSlide(index) {
        slides[currentSlide].classList.remove('active');
        sliderDots[currentSlide].classList.remove('active');
        currentSlide = index;
        slides[currentSlide].classList.add('active');
        sliderDots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        goToSlide((currentSlide + 1) % slides.length);
    }

    function startSlider() {
        slideInterval = setInterval(nextSlide, 5000);
    }

    function resetSlider() {
        clearInterval(slideInterval);
        startSlider();
    }

    sliderDots.forEach(dot => {
        dot.addEventListener('click', () => {
            goToSlide(parseInt(dot.dataset.slide));
            resetSlider();
        });
    });

    startSlider();

    // ── Projects Carousel ─────────────────────────────────
    const projectsTrack = document.getElementById('projects-track');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    let carouselPos = 0;

    function getVisibleCards() {
        const width = window.innerWidth;
        if (width <= 768) return 1;
        if (width <= 992) return 2;
        return 3;
    }

    function getCardWidth() {
        const track = projectsTrack;
        const cards = track.querySelectorAll('.project-card');
        if (cards.length === 0) return 0;
        const gap = parseFloat(getComputedStyle(track).gap) || 24;
        const trackWidth = track.parentElement.offsetWidth;
        const visible = getVisibleCards();
        return (trackWidth - gap * (visible - 1)) / visible + gap;
    }

    function moveCarousel(direction) {
        const cards = projectsTrack.querySelectorAll('.project-card');
        const maxPos = cards.length - getVisibleCards();
        carouselPos = Math.max(0, Math.min(carouselPos + direction, maxPos));
        const cardWidth = getCardWidth();
        projectsTrack.style.transform = `translateX(-${carouselPos * cardWidth}px)`;
    }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => moveCarousel(-1));
        nextBtn.addEventListener('click', () => moveCarousel(1));
    }

    // Drag support for carousel
    let isDragging = false;
    let startX = 0;
    let currentTranslate = 0;

    if (projectsTrack) {
        projectsTrack.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
        });

        projectsTrack.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
        });

        projectsTrack.addEventListener('mouseup', (e) => {
            if (!isDragging) return;
            isDragging = false;
            const diff = e.clientX - startX;
            if (Math.abs(diff) > 50) {
                moveCarousel(diff > 0 ? -1 : 1);
            }
        });

        projectsTrack.addEventListener('mouseleave', () => {
            isDragging = false;
        });
    }

    // ── Portfolio Filter ──────────────────────────────────
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            portfolioItems.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.classList.remove('hidden');
                    item.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });

    // ── Testimonials Slider ───────────────────────────────
    const testimonials = document.querySelectorAll('.testimonial-card');
    const tDots = document.querySelectorAll('.t-dot');
    let currentTestimonial = 0;
    let testimonialInterval;

    function goToTestimonial(index) {
        testimonials[currentTestimonial].classList.remove('active');
        tDots[currentTestimonial].classList.remove('active');
        currentTestimonial = index;
        testimonials[currentTestimonial].classList.add('active');
        tDots[currentTestimonial].classList.add('active');
    }

    function nextTestimonial() {
        goToTestimonial((currentTestimonial + 1) % testimonials.length);
    }

    function startTestimonialSlider() {
        testimonialInterval = setInterval(nextTestimonial, 6000);
    }

    tDots.forEach(dot => {
        dot.addEventListener('click', () => {
            goToTestimonial(parseInt(dot.dataset.testimonial));
            clearInterval(testimonialInterval);
            startTestimonialSlider();
        });
    });

    startTestimonialSlider();

    // ── Counter Animation ─────────────────────────────────
    const statNumbers = document.querySelectorAll('.stat-number');
    let counterAnimated = false;

    function animateCounters() {
        if (counterAnimated) return;
        const aboutStats = document.querySelector('.about-stats');
        if (!aboutStats) return;

        const rect = aboutStats.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
            counterAnimated = true;
            statNumbers.forEach(num => {
                const target = parseInt(num.dataset.target);
                const duration = 2000;
                const step = target / (duration / 16);
                let current = 0;

                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    num.textContent = Math.round(current);
                }, 16);
            });
        }
    }

    window.addEventListener('scroll', animateCounters, { passive: true });

    // ── Scroll Reveal ─────────────────────────────────────
    function addRevealClass() {
        // Add reveal class to elements that should animate in
        const revealTargets = document.querySelectorAll(
            '.about-header, .about-content, .stat-card, .projects-header, .project-card, ' +
            '.portfolio-header, .portfolio-filter, .portfolio-item, .contact-header, ' +
            '.contact-info-card, .contact-form-wrap, .service-card'
        );
        revealTargets.forEach(el => el.classList.add('reveal'));
    }

    function handleReveal() {
        const reveals = document.querySelectorAll('.reveal');
        reveals.forEach((el, i) => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.85) {
                setTimeout(() => {
                    el.classList.add('revealed');
                }, i * 50);
            }
        });
    }

    addRevealClass();
    window.addEventListener('scroll', handleReveal, { passive: true });
    handleReveal(); // Initial check

    // ── Smooth Scroll for anchor links ────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = 80; // header height
                const bodyRect = document.body.getBoundingClientRect().top;
                const elementRect = target.getBoundingClientRect().top;
                const elementPosition = elementRect - bodyRect;
                const offsetPosition = elementPosition - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ── Contact Form Handler ──────────────────────────────
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('.submit-btn');
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<span>Sending...</span><i class="fa-solid fa-spinner fa-spin"></i>';
            btn.disabled = true;

            // Simulate submission
            setTimeout(() => {
                btn.innerHTML = '<span>Sent Successfully!</span><i class="fa-solid fa-check"></i>';
                btn.style.background = '#38a169';
                contactForm.reset();

                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }

});

/* CSS Keyframe for filter animation */
const style = document.createElement('style');
style.textContent = `
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
`;
document.head.appendChild(style);

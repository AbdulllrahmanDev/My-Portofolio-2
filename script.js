/**
 * Project: Abdulrahman Portfolio
 * Description: Main script for project interactions and notifications
 */
const lenis = new Lenis({
    lerp: 0.5,
    wheelMultiplier: 1,
    gestureOrientation: 'vertical',
    normalizeWheel: true,
    smoothWheel: true
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Navbar Mobile Toggle
const navToggle = document.getElementById('nav-toggle');
const navMobile = document.getElementById('nav-mobile');
if (navToggle && navMobile) {
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('open');
        navMobile.classList.toggle('open');
    });

    document.querySelectorAll('.navbar__mobile a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('open');
            navMobile.classList.remove('open');
        });
    });
}

// Fade-in animations on scroll
const observerOptions = { threshold: 0.1 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Smooth scroll for nav links
document.querySelectorAll('.navbar__links a, .navbar__mobile a, .navbar__logo').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetAttr = this.getAttribute('href');
        if (targetAttr === '#') {
            lenis.scrollTo(0);
        } else {
            const targetEl = document.querySelector(targetAttr);
            if (targetEl) {
                lenis.scrollTo(targetEl, { offset: 0 });
            }
        }
    });
});

// Scroll to top button
const scrollTopBtn = document.getElementById('scroll-top');
if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        lenis.scrollTo(0);
    });
}


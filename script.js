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

// LIVE NOTIFICATION SYSTEM
function showNotification(title, message, icon = 'fa-lock') {
    const notification = document.getElementById('live-notification');
    const titleEl = document.getElementById('notification-title');
    const messageEl = document.getElementById('notification-message');
    const iconEl = notification ? notification.querySelector('.live-notification__icon i') : null;

    if (notification && titleEl && messageEl) {
        titleEl.textContent = title;
        messageEl.textContent = message;
        if (iconEl) iconEl.className = `fa-solid ${icon}`;
        
        notification.classList.add('active');
        
        setTimeout(() => {
            closeNotification();
        }, 5000);
    }
}

function closeNotification() {
    const notification = document.getElementById('live-notification');
    if (notification) notification.classList.remove('active');
}

// PROJECT PREVIEW & LINK HANDLING
window.handleProjectLink = function(event, url, title, type) {
    if (event) event.preventDefault();
    
    if (!url || url === '#' || url === 'javascript:void(0)') {
        showNotification('Private Project | مشروع خاص', 'This project is currently private and its links are restricted. | هذا المشروع خاص حالياً وروابطه غير متوفرة.', 'fa-lock');
        return;
    }

    if (type === 'github') {
        window.open(url, '_blank');
    } else if (type === 'demo') {
        openPreviewModal(url, title);
    }
};

function openPreviewModal(url, title) {
    const modal = document.getElementById('preview-modal');
    const iframe = document.getElementById('preview-iframe');
    const titleEl = document.getElementById('preview-title');
    
    if (modal && iframe && titleEl) {
        iframe.src = url;
        titleEl.textContent = title + ' - Live Preview';
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closePreviewModal() {
    const modal = document.getElementById('preview-modal');
    const iframe = document.getElementById('preview-iframe');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    if (iframe) iframe.src = '';
}

// Export for backward compatibility if needed
window.openPrivateModal = () => {
    showNotification('Private Project | مشروع خاص', 'This project is currently private. | هذا المشروع خاص حالياً.', 'fa-lock');
};
window.closeNotification = closeNotification;
window.closePreviewModal = closePreviewModal;

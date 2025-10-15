// ========================================
// DOM ELEMENTS
// ========================================
const navbar = document.getElementById('navbar');
const navLinks = document.getElementById('navLinks');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const subscribeModal = document.getElementById('subscribeModal');
const backToTopBtn = document.getElementById('backToTop');
const toast = document.getElementById('toast');
const preloader = document.getElementById('preloader');

// ========================================
// PRELOADER
// ========================================
window.addEventListener('load', () => {
    setTimeout(() => {
        preloader.classList.add('fade-out');
    }, 1000);
});

// ========================================
// NAVBAR FUNCTIONALITY
// ========================================
// Scroll effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Show/hide back to top button
    if (currentScroll > 500) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
    
    lastScroll = currentScroll;
});

// Mobile menu toggle
mobileMenuToggle?.addEventListener('click', () => {
    mobileMenuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuToggle?.classList.remove('active');
        navLinks?.classList.remove('active');
    });
});

// Active nav link
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLink?.classList.add('active');
        } else {
            navLink?.classList.remove('active');
        }
    });
});

// ========================================
// MODAL FUNCTIONALITY
// ========================================
function openModal() {
    subscribeModal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    subscribeModal.classList.remove('show');
    document.body.style.overflow = '';
}

// Close modal on background click
window.addEventListener('click', (e) => {
    if (e.target === subscribeModal) {
        closeModal();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && subscribeModal.classList.contains('show')) {
        closeModal();
    }
});

// ========================================
// FORM HANDLING
// ========================================
// Subscribe forms
const subscribeForms = document.querySelectorAll('.subscribe-form');
subscribeForms.forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const email = formData.get('email') || form.querySelector('input[type="email"]').value;
        
        // Validate email
        if (!validateEmail(email)) {
            showToast('Please enter a valid email address', 'error');
            return;
        }
        
        // Simulate API call
        setTimeout(() => {
            showToast('🎉 Successfully subscribed to newsletter!', 'success');
            form.reset();
            closeModal();
        }, 1000);
    });
});

// Email validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ========================================
// POST INTERACTIONS
// ========================================
function likePost(btn) {
    const icon = btn.querySelector('i');
    const countElement = btn.querySelector('.action-count');
    let count = parseInt(countElement?.textContent || 0);
    
    if (btn.classList.contains('liked')) {
        btn.classList.remove('liked');
        icon.classList.remove('fas');
        icon.classList.add('far');
        count--;
    } else {
        btn.classList.add('liked');
        icon.classList.remove('far');
        icon.classList.add('fas');
        count++;
    }
    
    if (countElement) {
        countElement.textContent = count;
    }
    
    // Animate heart
    icon.style.animation = 'none';
    setTimeout(() => {
        icon.style.animation = '';
    }, 10);
}

function commentPost(btn) {
    showToast('Comment feature coming soon!', 'info');
}

function sharePost(btn) {
    const url = window.location.href;
    
    if (navigator.share) {
        navigator.share({
            title: 'Maddy\'s Fashion Blog',
            text: 'Check out this amazing fashion blog post!',
            url: url
        }).catch(err => console.log('Error sharing:', err));
    } else if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url)
            .then(() => {
                showToast('Link copied to clipboard!', 'success');
            })
            .catch(() => {
                fallbackCopyToClipboard(url);
            });
    } else {
        fallbackCopyToClipboard(url);
    }
}

function savePost(btn) {
    const icon = btn.querySelector('i');
    
    if (btn.classList.contains('saved')) {
        btn.classList.remove('saved');
        icon.classList.remove('fas');
        icon.classList.add('far');
        showToast('Post removed from saved', 'info');
    } else {
        btn.classList.add('saved');
        icon.classList.remove('far');
        icon.classList.add('fas');
        showToast('Post saved successfully!', 'success');
    }
}

function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
        document.execCommand('copy');
        showToast('Link copied to clipboard!', 'success');
    } catch (err) {
        showToast('Failed to copy link', 'error');
    }
    
    document.body.removeChild(textArea);
}

// ========================================
// TOAST NOTIFICATIONS
// ========================================
function showToast(message, type = 'success') {
    const toastIcon = toast.querySelector('.toast-icon');
    const toastMessage = toast.querySelector('.toast-message');
    
    // Set icon based on type
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle',
        warning: 'fas fa-exclamation-triangle'
    };
    
    const colors = {
        success: '#4caf50',
        error: '#f44336',
        info: '#2196f3',
        warning: '#ff9800'
    };
    
    toastIcon.className = `toast-icon ${icons[type]}`;
    toastIcon.style.color = colors[type];
    toastMessage.textContent = message;
    
    // Show toast
    toast.classList.add('show');
    
    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ========================================
// BACK TO TOP
// ========================================
backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ========================================
// TAG FILTERING
// ========================================
document.querySelectorAll('.tag').forEach(tag => {
    tag.addEventListener('click', function() {
        const tagName = this.dataset.tag;
        showToast(`Filtering by: ${tagName}`, 'info');
        
        // Toggle active state
        document.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        // Here you would implement actual filtering logic
    });
});

// ========================================
// PAGINATION
// ========================================
document.querySelectorAll('.page-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        if (this.disabled) return;
        
        // Remove active class from all buttons
        document.querySelectorAll('.page-btn').forEach(b => b.classList.remove('active'));
        
        // Add active class to clicked button
        if (!this.classList.contains('page-prev') && !this.classList.contains('page-next')) {
            this.classList.add('active');
        }
        
        // Here you would implement actual pagination logic
        showToast(`Loading page ${this.textContent}...`, 'info');
    });
});

// ========================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all blog cards and sidebar cards
document.querySelectorAll('.blog-card, .sidebar-card').forEach(card => {
    card.style.opacity = '0';
    observer.observe(card);
});

// ========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// LAZY LOADING IMAGES
// ========================================
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            img.classList.add('loaded');
            imageObserver.unobserve(img);
        }
    });
});

document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    imageObserver.observe(img);
});

// ========================================
// KEYBOARD NAVIGATION
// ========================================
document.addEventListener('keydown', (e) => {
    // Press '/' to focus search (if you add a search feature)
    if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        // Focus search input when implemented
    }
    
    // Press 'S' to open subscribe modal
    if (e.key === 's' && !e.ctrlKey && !e.metaKey && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        openModal();
    }
});

// ========================================
// INITIALIZE
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Add initial animations
    document.querySelectorAll('[data-aos]').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
    });
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.classList.add(savedTheme);
    }
    
    console.log('✨ Maddy\'s Fashion Blog loaded successfully!');
});

// ========================================
// PERFORMANCE MONITORING
// ========================================
window.addEventListener('load', () => {
    if ('performance' in window) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`Page load time: ${pageLoadTime}ms`);
    }
});
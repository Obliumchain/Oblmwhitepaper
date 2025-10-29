// script.js - Final version using Email.js

// --- START Email.js Configuration ---
// Keys populated from your screenshots
const EMAILJS_CONFIG = {
    PUBLIC_KEY: 'A2yfA0IBjBCYwqRPH', //
    SERVICE_ID: 'service_e8afa0q', //
    TEMPLATE_ID: 'template_df088pr' //
};

// Initialize Email.js
(function() {
    emailjs.init({ publicKey: EMAILJS_CONFIG.PUBLIC_KEY });
    console.log('Email.js initialized.');
})();
// --- END Email.js Configuration ---


// Enhanced Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const body = document.body;

// Debug mobile menu elements
console.log('Mobile menu elements:', { hamburger, navMenu });

if (hamburger && navMenu) {
    console.log('Mobile menu elements found - setting up event listeners');
    
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        console.log('Hamburger clicked - toggling menu');
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        body.classList.toggle('menu-open');
        
        console.log('Menu state:', {
            hamburgerActive: hamburger.classList.contains('active'),
            navMenuActive: navMenu.classList.contains('active'),
            bodyMenuOpen: body.classList.contains('menu-open')
        });
    });

    // Close menu when clicking on links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            console.log('Nav link clicked - closing menu');
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            body.classList.remove('menu-open');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && 
            !e.target.closest('.nav-menu') && 
            !e.target.closest('.hamburger')) {
            console.log('Clicked outside - closing menu');
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            body.classList.remove('menu-open');
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            console.log('Escape key pressed - closing menu');
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            body.classList.remove('menu-open');
        }
    });

    // Close menu on window resize (if resizing to desktop)
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
            console.log('Window resized to desktop - closing menu');
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            body.classList.remove('menu-open');
        }
    });
} else {
    console.error('Mobile menu elements not found!');
}

// Waitlist Form Submission with Email.js
const waitlistForm = document.getElementById('waitlistForm');

if (waitlistForm) {
    console.log('Waitlist form found');
    
    waitlistForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('Form submitted');
        
        const email = document.getElementById('email').value.trim();
        const wallet = document.getElementById('wallet').value.trim();
        
        console.log('Form data:', { email, wallet });
        
        // Basic validation
        if (!email) {
            showNotification('Please enter your email address', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }

        await submitToWaitlist(email, wallet);
    });
} else {
    console.error('Waitlist form not found!');
}

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Submit to Email.js
async function submitToWaitlist(email, wallet) {
    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<span class="btn-icon">⏳</span>Joining Waitlist...';
    submitBtn.disabled = true;

    // These param keys MUST match the variables in your Email.js template
    const templateParams = {
        from_email: email,
        wallet_address: wallet || 'N/A' // Send 'N/A' if wallet is empty
    };
    
    try {
        console.log('Sending email via Email.js...');
        
        const response = await emailjs.send(
            EMAILJS_CONFIG.SERVICE_ID, 
            EMAILJS_CONFIG.TEMPLATE_ID, 
            templateParams
        );

        console.log('Email.js SUCCESS:', response);
        showNotification('🎉 Successfully joined the Oblium mining waitlist! We\'ll notify you when mining starts.', 'success');
        waitlistForm.reset();
        
    } catch (error) {
        console.error('Email.js FAILED:', error);
        // Use error.text for a more specific message if available
        showNotification('Error: ' + (error.text || 'Failed to send. Please try again.'), 'error');
    } finally {
        // Restore button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Removed Supabase connection test

document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM content loaded. Initializing animations.');
    
    // Initialize animations
    createStars('.stars', 100);
    createStars('.stars2', 150);
    createStars('.stars3', 200);
    
    // Add intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.feature-card, .stat, .waitlist-container').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Notification system (Unchanged)
function showNotification(message, type = 'info') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    const content = notification.querySelector('.notification-content');
    content.style.cssText = `
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        margin-left: auto;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
    
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
}

function getNotificationIcon(type) {
    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️',
        warning: '⚠️'
    };
    return icons[type] || icons.info;
}

function getNotificationColor(type) {
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#6366f1',
        warning: '#f59e0b'
    };
    return colors[type] || colors.info;
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    /* Mobile menu animations */
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            left: -100%;
            top: 80px;
            flex-direction: column;
            background: rgba(15, 23, 42, 0.98);
            width: 100%;
            height: calc(100vh - 80px);
            text-align: center;
            transition: 0.3s ease-in-out;
            padding: 2rem 0;
            gap: 0;
            backdrop-filter: blur(20px);
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            z-index: 999;
            overflow-y: auto;
        }

        .nav-menu.active {
            left: 0;
        }

        .nav-item {
            width: 100%;
            margin: 0;
        }

        .nav-link {
            display: block;
            padding: 1rem 2rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            font-size: 1.1rem;
            transition: all 0.3s ease;
            width: 100%;
        }

        .nav-link:hover {
            background: rgba(99, 102, 241, 0.1);
        }

        .hamburger {
            display: flex;
            flex-direction: column;
            cursor: pointer;
            z-index: 1000;
        }

        .hamburger .bar {
            width: 25px;
            height: 3px;
            background: var(--text);
            margin: 3px 0;
            transition: 0.3s;
        }

        .hamburger.active .bar:nth-child(1) {
            transform: translateY(8px) rotate(45deg);
        }

        .hamburger.active .bar:nth-child(2) {
            opacity: 0;
        }

        .hamburger.active .bar:nth-child(3) {
            transform: translateY(-8px) rotate(-45deg);
        }

        /* Prevent body scroll when menu is open */
        body.menu-open {
            overflow: hidden;
        }
    }

    /* Ensure desktop menu works */
    @media (min-width: 769px) {
        .nav-menu {
            display: flex !important;
            position: static;
            flex-direction: row;
            background: transparent;
            width: auto;
            height: auto;
            padding: 0;
        }
        
        .hamburger {
            display: none;
        }
    }
`;
document.head.appendChild(style);

// Star animations
function createStars(className, count) {
    const stars = document.querySelector(className);
    if (!stars) return;
    
    stars.innerHTML = '';
    
    for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        star.style.position = 'absolute';
        star.style.width = Math.random() * 2 + 'px';
        star.style.height = star.style.width;
        star.style.background = 'white';
        star.style.borderRadius = '50%';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.opacity = Math.random() * 0.7 + 0.3;
        star.style.animation = `twinkle ${Math.random() * 5 + 3}s infinite alternate`;
        stars.appendChild(star);
    }
}

const starStyle = document.createElement('style');
starStyle.textContent = `
    @keyframes twinkle {
        0% { opacity: 0.3; }
        100% { opacity: 1; }
    }
`;
document.head.appendChild(starStyle);

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll effect to navbar
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(15, 23, 42, 0.95)';
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        } else {
            navbar.style.background = 'rgba(15, 23, 42, 0.8)';
            navbar.style.boxShadow = 'none';
        }
    }
});

console.log('Oblium website script loaded successfully!');
// Social Media Popup Functionality
const joinCommunityBtn = document.getElementById('joinCommunityBtn');
const socialPopup = document.getElementById('socialPopup');
const closePopup = document.getElementById('closePopup');

if (joinCommunityBtn && socialPopup) {
    // Open popup
    joinCommunityBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Opening social media popup');
        socialPopup.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    });

    // Close popup
    closePopup.addEventListener('click', () => {
        console.log('Closing social media popup');
        socialPopup.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    });

    // Close popup when clicking overlay
    socialPopup.addEventListener('click', (e) => {
        if (e.target === socialPopup || e.target.classList.contains('popup-overlay')) {
            socialPopup.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Close popup with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && socialPopup.classList.contains('active')) {
            socialPopup.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
} else {
    console.error('Social popup elements not found!');
}

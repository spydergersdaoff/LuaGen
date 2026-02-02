// ===========================
// Disclaimer Modal
// ===========================
document.addEventListener('DOMContentLoaded', () => {
    const disclaimerModal = document.getElementById('disclaimerModal');
    const acceptBtn = document.getElementById('acceptDisclaimer');
    
    // Check if user already accepted
    const hasAccepted = localStorage.getItem('disclaimerAccepted');
    
    if (hasAccepted === 'true') {
        disclaimerModal.classList.add('hidden');
    }
    
    acceptBtn.addEventListener('click', () => {
        localStorage.setItem('disclaimerAccepted', 'true');
        disclaimerModal.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            disclaimerModal.classList.add('hidden');
        }, 300);
    });
});

// ===========================
// Particles Configuration
// ===========================
particlesJS('particles-js', {
    particles: {
        number: {
            value: 80,
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: {
            value: '#6366f1'
        },
        shape: {
            type: 'circle'
        },
        opacity: {
            value: 0.5,
            random: false,
            anim: {
                enable: true,
                speed: 1,
                opacity_min: 0.1,
                sync: false
            }
        },
        size: {
            value: 3,
            random: true,
            anim: {
                enable: true,
                speed: 2,
                size_min: 0.1,
                sync: false
            }
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: '#6366f1',
            opacity: 0.4,
            width: 1
        },
        move: {
            enable: true,
            speed: 2,
            direction: 'none',
            random: false,
            straight: false,
            out_mode: 'out',
            bounce: false
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: {
                enable: true,
                mode: 'grab'
            },
            onclick: {
                enable: true,
                mode: 'push'
            },
            resize: true
        },
        modes: {
            grab: {
                distance: 140,
                line_linked: {
                    opacity: 1
                }
            },
            push: {
                particles_nb: 4
            }
        }
    },
    retina_detect: true
});

// ===========================
// Navigation
// ===========================
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');

// Smooth scrolling
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
        targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});

// Active section on scroll
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
});

// ===========================
// Hero Buttons
// ===========================
const startInstallBtn = document.getElementById('startInstallBtn');
const learnMoreBtn = document.getElementById('learnMoreBtn');

startInstallBtn.addEventListener('click', () => {
    document.getElementById('installation').scrollIntoView({
        behavior: 'smooth'
    });
    // Auto-start verification
    setTimeout(() => {
        startVerification();
    }, 500);
});

learnMoreBtn.addEventListener('click', () => {
    document.getElementById('features').scrollIntoView({
        behavior: 'smooth'
    });
});

// ===========================
// Installation Wizard
// ===========================
let currentStep = 1;
const totalSteps = 4;

const steps = document.querySelectorAll('.step');
const panels = document.querySelectorAll('.wizard-panel');

function goToStep(stepNumber) {
    // Update steps
    steps.forEach((step, index) => {
        step.classList.remove('active', 'completed');
        if (index + 1 < stepNumber) {
            step.classList.add('completed');
        } else if (index + 1 === stepNumber) {
            step.classList.add('active');
        }
    });
    
    // Update panels
    panels.forEach((panel, index) => {
        panel.classList.remove('active');
        if (index + 1 === stepNumber) {
            panel.classList.add('active');
        }
    });
    
    currentStep = stepNumber;
}

// ===========================
// Step 1: Verification
// ===========================
const startVerificationBtn = document.getElementById('startVerification');

function startVerification() {
    startVerificationBtn.disabled = true;
    startVerificationBtn.textContent = 'Vérification en cours...';
    
    const requirements = [
        { id: 'req-os', delay: 500, success: true },
        { id: 'req-python', delay: 1000, success: true },
        { id: 'req-space', delay: 1500, success: true }
    ];
    
    requirements.forEach(req => {
        setTimeout(() => {
            const element = document.getElementById(req.id);
            const icon = element.querySelector('.req-icon');
            const status = element.querySelector('.req-status');
            
            if (req.success) {
                icon.classList.remove('pending');
                icon.classList.add('success');
                status.textContent = 'Vérifié ✓';
                status.style.color = '#10b981';
            } else {
                icon.classList.remove('pending');
                icon.classList.add('error');
                status.textContent = 'Échec';
                status.style.color = '#ef4444';
            }
        }, req.delay);
    });
    
    setTimeout(() => {
        startVerificationBtn.textContent = 'Continuer';
        startVerificationBtn.disabled = false;
        startVerificationBtn.onclick = () => goToStep(2);
    }, 2000);
}

startVerificationBtn.addEventListener('click', startVerification);

// ===========================
// Step 2: Download
// ===========================
const backToVerifBtn = document.getElementById('backToVerif');
const downloadSetupBtn = document.getElementById('downloadSetup');
const nextToInstallBtn = document.getElementById('nextToInstall');

backToVerifBtn.addEventListener('click', () => goToStep(1));

downloadSetupBtn.addEventListener('click', () => {
    // Direct download from Discord CDN
    const setupUrl = 'https://cdn.discordapp.com/attachments/1454771216878403636/1467917880170516685/setup.bat?ex=6982208f&is=6980cf0f&hm=c2718796f0385868276d026e006b19bbbf8a3453013fcc040564434b1343273b&';
    
    const a = document.createElement('a');
    a.href = setupUrl;
    a.download = 'setup.bat';
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Enable next button after download
    downloadSetupBtn.textContent = '✓ Téléchargé';
    downloadSetupBtn.style.background = 'var(--success)';
    downloadSetupBtn.disabled = true;
    nextToInstallBtn.disabled = false;
});

const backToDownloadBtn = document.getElementById('backToDownload');
nextToInstallBtn.addEventListener('click', () => goToStep(3));
backToDownloadBtn.addEventListener('click', () => goToStep(2));

// ===========================
// Step 3: Installation Instructions
// ===========================
const installCompleteBtn = document.getElementById('installComplete');
installCompleteBtn.addEventListener('click', () => goToStep(4));

// ===========================
// Step 4: Completion
// ===========================
const viewDocsBtn = document.getElementById('viewDocs');
const launchAppBtn = document.getElementById('launchApp');

viewDocsBtn.addEventListener('click', () => {
    window.open('https://discord.gg/KFNGynRHMv', '_blank');
});

launchAppBtn.addEventListener('click', () => {
    window.open('https://steamdb.info', '_blank');
});

// ===========================
// Feature Cards Animation
// ===========================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.animation = 'fadeInUp 0.6s forwards';
            }, index * 100);
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card').forEach(card => {
    card.style.opacity = '0';
    observer.observe(card);
});

// ===========================
// Help Options in Modal
// ===========================
document.querySelectorAll('.help-option').forEach(option => {
    option.addEventListener('click', () => {
        const title = option.querySelector('h4').textContent;
        console.log('Option d\'aide sélectionnée:', title);
        
        // Scroll to contact form
        const contactForm = document.querySelector('.contact-form');
        contactForm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Focus first input
        const firstInput = contactForm.querySelector('input');
        firstInput.focus();
    });
});

// ===========================
// Form Submission
// ===========================
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    const submitBtn = contactForm.querySelector('.btn-primary');
    submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        const name = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const message = contactForm.querySelector('textarea').value;
        
        if (!name || !email || !message) {
            alert('Veuillez remplir tous les champs!');
            return;
        }
        
        // Simulate sending
        submitBtn.textContent = 'Envoi en cours...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            contactForm.querySelectorAll('input, textarea').forEach(input => input.value = '');
            submitBtn.textContent = 'Envoyer';
            submitBtn.disabled = false;
            supportModal.classList.remove('active');
        }, 1500);
    });
}

// ===========================
// Keyboard Shortcuts
// ===========================
document.addEventListener('keydown', (e) => {
    // ESC to close modal
    if (e.key === 'Escape' && supportModal.classList.contains('active')) {
        supportModal.classList.remove('active');
    }
    
    // Ctrl+H for help
    if (e.ctrlKey && e.key === 'h') {
        e.preventDefault();
        supportModal.classList.add('active');
    }
});

// ===========================
// Dynamic Stats Counter
// ===========================
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        
        if (element.textContent.includes('K')) {
            element.textContent = value + 'K+';
        } else if (element.textContent.includes('%')) {
            element.textContent = value + '%';
        } else {
            element.textContent = value + '+';
        }
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Animate stats when they come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            animateValue(statNumbers[0], 0, 2000, 2000); // 2M+
            animateValue(statNumbers[1], 0, 50, 2000);   // 50K+
            animateValue(statNumbers[2], 0, 100, 2000);  // 100%
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// ===========================
// Easter Egg: Konami Code
// ===========================
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            activateEasterEgg();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateEasterEgg() {
    document.body.style.animation = 'rainbow 2s infinite';
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    setTimeout(() => {
        document.body.style.animation = '';
        style.remove();
    }, 5000);
}

// ===========================
// Performance Optimization
// ===========================
// Lazy load images if added later
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// ===========================
// Console Welcome Message
// ===========================
console.log('%c🚀 Bienvenue sur LuaGen Setup! ', 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 10px 20px; font-size: 20px; font-weight: bold; border-radius: 5px;');
console.log('%cGénérateur Lua & Manifest pour Steam', 'color: #8b5cf6; font-size: 14px; font-weight: bold;');
console.log('%cVersion: 2.5.1', 'color: #6366f1; font-size: 14px;');
console.log('%cPour obtenir de l\'aide, appuyez sur Ctrl+H', 'color: #8b5cf6; font-size: 12px;');

// ===========================
// Initialization Complete
// ===========================
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ LuaGen Setup initialized successfully!');
});

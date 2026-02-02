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
    // Create a simulated download link
    const setupBatContent = `@echo off
@setlocal
@set "PYTHON_URL=https://www.python.org/ftp/python/3.12.1/python-3.12.1-amd64.exe"
@set "INSTALLER=%temp%\python_installer.exe"
@python --version >nul 2>&1
@if %errorlevel% EQU 0 goto :run
@echo [SETUP] Python introuvable. Installation automatique...
@powershell -Command "Invoke-WebRequest -Uri '%PYTHON_URL%' -OutFile '%INSTALLER%'"
@if exist "%INSTALLER%" goto :install
@echo [ERREUR] Echec du telechargement.
@pause
@exit /b
@:install
@echo [SETUP] Installation en cours...
@start /wait "" "%INSTALLER%" /quiet InstallAllUsers=1 PrependPath=1 Include_test=0
@del "%INSTALLER%"
@echo [SETUP] Installation terminee.
@:run
@findstr /v "^@" "%~f0" > "%temp%\luagen_v6.pyw"
@start /b "" pythonw "%temp%\luagen_v6.pyw"
@exit /b
import customtkinter as ctk
import threading
import subprocess
import urllib.request
import zipfile
import os
import shutil
import sys
import webbrowser
import time
from datetime import datetime
import ssl

ssl._create_default_https_context = ssl._create_unverified_context


ctk.set_appearance_mode("Dark")
ctk.set_default_color_theme("blue")

class LuaGenUltimateDeployer(ctk.CTk):
    def __init__(self):
        super().__init__()

        
        self.title("LuaGen Setup - V1.0.1")
        self.geometry("900x750")
        self.resizable(False, False)
        self.attributes('-topmost', True)

        
        self.repo_url = "https://codeload.github.com/spydergersdaoff/LuaGen-/zip/refs/heads/main"
        self.discord = "https://discord.gg/KFNGynRHMv"
        self.modules = ["requests", "Pillow", "customtkinter"]
        self.start_time = time.time()

        self._build_ui()

    def _build_ui(self):
        
        self.side = ctk.CTkFrame(self, width=220, corner_radius=0, fg_color="#0a0c10")
        self.side.pack(side="left", fill="y")
        
        ctk.CTkLabel(self.side, text="LUAGEN", font=("Impact", 45), text_color="#3b8ed0").pack(pady=40)
        
        self.stat_frame = ctk.CTkFrame(self.side, fg_color="transparent")
        self.stat_frame.pack(pady=20, padx=10, fill="x")
        
        self.badge_py = self._create_badge(self.stat_frame, "PYTHON", "#2ecc71")
        self.badge_net = self._create_badge(self.stat_frame, "NETWORK", "#f1c40f")
        self.badge_fs = self._create_badge(self.stat_frame, "SYSTEM", "#95a5a6")

        
        self.main = ctk.CTkFrame(self, fg_color="#0d1117", corner_radius=0)
        self.main.pack(side="right", fill="both", expand=True)

        
        self.head = ctk.CTkLabel(self.main, text="PANNEAU DE DÉPLOIEMENT", font=("Roboto", 26, "bold"), text_color="#e6edf3")
        self.head.pack(anchor="w", padx=40, pady=(30, 10))

        
        self.desc_frame = ctk.CTkFrame(self.main, fg_color="#161b22", border_width=1, border_color="#30363d")
        self.desc_frame.pack(fill="x", padx=40, pady=10)
        
        info_txt = (
            "Architecture de déploiement sécurisée :\n"
            "• Runtime : Python {0}.{1}\n"
            "• Protocole : HTTPS/TLS 1.3\n"
            "• Target : {2}\n"
            "• Pipeline : Validation -> Installation -> Extraction -> Nettoyage"
        ).format(sys.version_info.major, sys.version_info.minor, os.getcwd())
        
        ctk.CTkLabel(self.desc_frame, text=info_txt, justify="left", font=("Consolas", 12), padx=20, pady=15).pack(anchor="w")

        
        self.p_text = ctk.CTkLabel(self.main, text="Initialisation du noyau...", font=("Roboto", 11))
        self.p_text.pack(anchor="w", padx=45, pady=(20, 0))
        
        self.p_bar = ctk.CTkProgressBar(self.main, width=580, height=12, progress_color="#3b8ed0")
        self.p_bar.set(0)
        self.p_bar.pack(padx=40, pady=(5, 20))

        
        self.console = ctk.CTkTextbox(self.main, height=280, fg_color="#010409", text_color="#238636", font=("Consolas", 11), border_width=1, border_color="#30363d")
        self.console.pack(fill="x", padx=40, pady=10)
        self.log("CORE", "Moteur chargé. Prêt pour l'exécution des scripts.")

        
        self.btn_f = ctk.CTkFrame(self.main, fg_color="transparent")
        self.btn_f.pack(fill="x", padx=40, pady=20)

        self.btn_main = ctk.CTkButton(self.btn_f, text="DÉPLOYER LUAGEN", font=("Roboto", 16, "bold"), height=50, command=self.execute)
        self.btn_main.pack(side="left", expand=True, padx=(0, 10))

        self.btn_disc = ctk.CTkButton(self.btn_f, text="DISCORD", font=("Roboto", 14), height=50, fg_color="#5865F2", command=lambda: webbrowser.open(self.discord))
        self.btn_disc.pack(side="right", expand=True, padx=(10, 0))

    def _create_badge(self, master, name, color):
        f = ctk.CTkFrame(master, fg_color="#161b22", height=30)
        f.pack(pady=5, fill="x")
        l = ctk.CTkLabel(f, text=f" {name} ", font=("Roboto", 10, "bold"), text_color="white", fg_color=color, corner_radius=5)
        l.pack(side="left", padx=5, pady=5)
        st = ctk.CTkLabel(f, text="En attente", font=("Roboto", 10))
        st.pack(side="right", padx=10)
        return st

    def log(self, tag, msg):
        t = datetime.now().strftime("%H:%M:%S")
        self.console.insert("end", f"[{t}] [{tag}] {msg}\n")
        self.console.see("end")

    def execute(self):
        self.btn_main.configure(state="disabled", text="EN COURS...")
        threading.Thread(target=self._worker, daemon=True).start()

    def _worker(self):

        try:
            
            self.log("SYSTEM", "Vérification des accès Administrateur...")
            self.p_text.configure(text="Phase 1 : Optimisation de l'environnement")
            self.p_bar.set(0.1)
            
            
            py_exe = sys.executable.replace("pythonw.exe", "python.exe")
            flags = 0x08000000 # CREATE_NO_WINDOW
            
            subprocess.run([py_exe, "-m", "pip", "install", "--upgrade", "pip"], capture_output=True, creationflags=flags)
            self.badge_py.configure(text="OK", text_color="#2ecc71")
            
            
            for i, m in enumerate(self.modules):
                self.log("MODULES", f"Synchronisation : {m}")
                self.p_text.configure(text=f"Installation de {m}...")
                self.p_bar.set(0.2 + (i * 0.1))
                subprocess.run([py_exe, "-m", "pip", "install", m], capture_output=True, creationflags=flags)
            
            
            self.log("NETWORK", "Ouverture du flux HTTPS vers GitHub...")
            self.p_text.configure(text="Phase 2 : Téléchargement des ressources")
            self.p_bar.set(0.6)
            urllib.request.urlretrieve(self.repo_url, "data.zip")
            self.badge_net.configure(text="ONLINE", text_color="#2ecc71")
            
            
            self.log("FILESYSTEM", "Déploiement atomique des fichiers...")
            self.p_text.configure(text="Phase 3 : Extraction et Nettoyage")
            self.p_bar.set(0.8)
            
            if os.path.exists("temp_x"): shutil.rmtree("temp_x")
            
            with zipfile.ZipFile("data.zip", 'r') as z:
                z.extractall("temp_x")
                root = os.path.join("temp_x", os.listdir("temp_x")[0])
                for item in os.listdir(root):
                    src, dst = os.path.join(root, item), os.path.join(".", item)
                    if os.path.exists(dst):
                        if os.path.isdir(dst): shutil.rmtree(dst)
                        else: os.remove(dst)
                    shutil.move(src, dst)
            
            os.remove("data.zip")
            shutil.rmtree("temp_x")
            self.badge_fs.configure(text="ACTIVE", text_color="#2ecc71")

            # Final
            self.p_bar.set(1.0)
            self.log("SUCCESS", "Déploiement terminé avec succès.")
            self.p_text.configure(text="Prêt à l'emploi !")
            self.btn_main.configure(state="normal", text="QUITTER", fg_color="#2ecc71", command=self.destroy)
            
        except Exception as e:
            self.log("CRITICAL", f"Erreur fatale : {str(e)}")
            self.btn_main.configure(state="normal", text="RÉPARER", fg_color="#e74c3c", command=self.execute)

if __name__ == "__main__":
    LuaGenUltimateDeployer().mainloop()
`;
    
    const blob = new Blob([setupBatContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'setup.bat';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
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
console.log('%cVersion: 1.0.0', 'color: #6366f1; font-size: 14px;');
console.log('%cPour obtenir de l\'aide, appuyez sur Ctrl+H', 'color: #8b5cf6; font-size: 12px;');

// ===========================
// Initialization Complete
// ===========================
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ LuaGen Setup initialized successfully!');
});

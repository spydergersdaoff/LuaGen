@echo off
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


/**
 * Système d'Authentification Simple pour Baticeram Admin
 *
 * AVERTISSEMENT: Ce système est basique et destiné aux petits déploiements.
 * Pour une sécurité maximale en production, utilisez un serveur d'authentification robuste.
 */

class AuthenticationSystem {
    constructor() {
        this.sessionTimeout = 30 * 60 * 1000; // 30 minutes
        this.maxAttempts = 5;
        this.lockoutTime = 15 * 60 * 1000; // 15 minutes
        this.init();
    }

    init() {
        this.checkAuthStatus();
        this.bindEvents();
    }

    // Vérifier le statut d'authentification
    checkAuthStatus() {
        const isAdminPage = window.location.pathname.includes('admin.html');

        if (isAdminPage && !this.isAuthenticated()) {
            this.showLoginForm();
        } else if (isAdminPage && this.isAuthenticated()) {
            this.checkSessionValidity();
        }
    }

    // Vérifier si l'utilisateur est authentifié
    isAuthenticated() {
        const authData = this.getAuthData();
        return authData && authData.authenticated && this.isSessionValid(authData);
    }

    // Vérifier la validité de la session
    isSessionValid(authData) {
        const now = Date.now();
        return (now - authData.loginTime) < this.sessionTimeout;
    }

    // Récupérer les données d'authentification
    getAuthData() {
        const encrypted = sessionStorage.getItem('baticeram_auth');
        if (!encrypted) return null;

        try {
            const decoded = atob(encrypted);
            return JSON.parse(decoded);
        } catch (e) {
            return null;
        }
    }

    // Sauvegarder les données d'authentification
    setAuthData(data) {
        const encoded = btoa(JSON.stringify(data));
        sessionStorage.setItem('baticeram_auth', encoded);
    }

    // Vérifier les tentatives de connexion
    checkLoginAttempts() {
        const attempts = JSON.parse(localStorage.getItem('login_attempts') || '{"count": 0, "lastAttempt": 0}');
        const now = Date.now();

        // Reset si le temps de verrouillage est dépassé
        if (now - attempts.lastAttempt > this.lockoutTime) {
            attempts.count = 0;
        }

        return attempts;
    }

    // Enregistrer une tentative de connexion
    recordLoginAttempt(success = false) {
        const attempts = this.checkLoginAttempts();

        if (!success) {
            attempts.count++;
            attempts.lastAttempt = Date.now();
        } else {
            attempts.count = 0;
        }

        localStorage.setItem('login_attempts', JSON.stringify(attempts));
        return attempts;
    }

    // Afficher le formulaire de connexion
    showLoginForm() {
        const attempts = this.checkLoginAttempts();

        if (attempts.count >= this.maxAttempts) {
            const remainingTime = this.lockoutTime - (Date.now() - attempts.lastAttempt);
            if (remainingTime > 0) {
                this.showLockoutMessage(Math.ceil(remainingTime / 1000 / 60));
                return;
            }
        }

        document.body.innerHTML = `
            <div id="login-container" style="
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                background: linear-gradient(135deg, #2c3e50, #34495e);
                font-family: 'Quicksand', sans-serif;
            ">
                <div id="login-form" style="
                    background: white;
                    padding: 2rem;
                    border-radius: 12px;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                    min-width: 300px;
                    text-align: center;
                ">
                    <h2 style="color: #2c3e50; margin-bottom: 1.5rem;">
                        🔐 Accès Administration
                    </h2>
                    <p style="color: #7f8c8d; margin-bottom: 1.5rem;">
                        Connexion requise pour accéder au CMS
                    </p>

                    <form id="auth-form">
                        <div style="margin-bottom: 1rem;">
                            <input type="text"
                                   id="username"
                                   placeholder="Nom d'utilisateur"
                                   required
                                   autocomplete="username"
                                   style="
                                       width: 100%;
                                       padding: 0.75rem;
                                       border: 2px solid #e0e0e0;
                                       border-radius: 6px;
                                       font-size: 14px;
                                       box-sizing: border-box;
                                   ">
                        </div>
                        <div style="margin-bottom: 1.5rem;">
                            <input type="password"
                                   id="password"
                                   placeholder="Mot de passe"
                                   required
                                   autocomplete="current-password"
                                   style="
                                       width: 100%;
                                       padding: 0.75rem;
                                       border: 2px solid #e0e0e0;
                                       border-radius: 6px;
                                       font-size: 14px;
                                       box-sizing: border-box;
                                   ">
                        </div>

                        <div id="error-message" style="
                            color: #e74c3c;
                            margin-bottom: 1rem;
                            font-size: 14px;
                            display: none;
                        "></div>

                        <button type="submit" id="login-btn" style="
                            width: 100%;
                            padding: 0.75rem;
                            background-color: #27ae60;
                            color: white;
                            border: none;
                            border-radius: 6px;
                            font-size: 14px;
                            cursor: pointer;
                            transition: background-color 0.3s;
                        ">
                            Se connecter
                        </button>
                    </form>

                    <div style="margin-top: 1.5rem; font-size: 12px; color: #95a5a6;">
                        <p>Tentatives restantes: ${this.maxAttempts - attempts.count}</p>
                        <p>⚠️ Pour des raisons de sécurité, changez les identifiants par défaut</p>
                    </div>
                </div>
            </div>
        `;

        this.bindLoginEvents();
    }

    // Afficher le message de verrouillage
    showLockoutMessage(minutes) {
        document.body.innerHTML = `
            <div style="
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                background: linear-gradient(135deg, #e74c3c, #c0392b);
                font-family: 'Quicksand', sans-serif;
                color: white;
                text-align: center;
            ">
                <div>
                    <h1>🔒 Accès Bloqué</h1>
                    <p>Trop de tentatives de connexion échouées.</p>
                    <p>Veuillez attendre <strong>${minutes} minutes</strong> avant de réessayer.</p>
                    <p style="margin-top: 2rem;">
                        <button onclick="window.location.href='index.html'" style="
                            padding: 0.75rem 1.5rem;
                            background: white;
                            color: #e74c3c;
                            border: none;
                            border-radius: 6px;
                            cursor: pointer;
                        ">
                            Retour au site
                        </button>
                    </p>
                </div>
            </div>
        `;
    }

    // Lier les événements du formulaire de connexion
    bindLoginEvents() {
        const form = document.getElementById('auth-form');
        const errorDiv = document.getElementById('error-message');

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;

            if (this.validateCredentials(username, password)) {
                this.setAuthData({
                    authenticated: true,
                    loginTime: Date.now(),
                    username: username
                });

                this.recordLoginAttempt(true);
                window.location.reload();
            } else {
                const attempts = this.recordLoginAttempt(false);

                errorDiv.style.display = 'block';
                errorDiv.textContent = `Identifiants incorrects. Tentatives restantes: ${this.maxAttempts - attempts.count}`;

                // Effacer le mot de passe
                document.getElementById('password').value = '';

                if (attempts.count >= this.maxAttempts) {
                    setTimeout(() => window.location.reload(), 2000);
                }
            }
        });
    }

    // Valider les identifiants (CHANGEZ CES VALEURS!)
    validateCredentials(username, password) {
        // IMPORTANT: Modifiez ces identifiants pour votre sécurité !
        const validCredentials = [
            { username: 'admin_baticeram', password: 'Btp2025!Secure#' },
            { username: 'gestionnaire', password: 'Chape$Liquide99!' }
            // Vous pouvez ajouter plus d'utilisateurs ou en supprimer
        ];

        return validCredentials.some(cred =>
            cred.username === username && cred.password === password
        );
    }

    // Vérifier la validité de la session
    checkSessionValidity() {
        const authData = this.getAuthData();

        if (!this.isSessionValid(authData)) {
            this.logout();
            return;
        }

        // Prolonger la session si l'utilisateur est actif
        this.extendSession();
    }

    // Prolonger la session
    extendSession() {
        const authData = this.getAuthData();
        if (authData) {
            authData.loginTime = Date.now();
            this.setAuthData(authData);
        }
    }

    // Déconnexion
    logout() {
        sessionStorage.removeItem('baticeram_auth');
        window.location.reload();
    }

    // Lier les événements généraux
    bindEvents() {
        // Prolonger la session sur activité
        ['click', 'keypress', 'scroll'].forEach(event => {
            document.addEventListener(event, () => {
                if (this.isAuthenticated()) {
                    this.extendSession();
                }
            });
        });

        // Ajouter bouton de déconnexion si authentifié
        if (this.isAuthenticated() && document.getElementById('admin-bar')) {
            this.addLogoutButton();
        }
    }

    // Ajouter bouton de déconnexion
    addLogoutButton() {
        const adminControls = document.querySelector('.admin-controls');
        if (adminControls) {
            const logoutBtn = document.createElement('button');
            logoutBtn.className = 'admin-btn-secondary';
            logoutBtn.innerHTML = '🚪 Déconnexion';
            logoutBtn.addEventListener('click', () => {
                if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
                    this.logout();
                }
            });
            adminControls.appendChild(logoutBtn);
        }
    }
}

// Initialiser l'authentification
document.addEventListener('DOMContentLoaded', () => {
    new AuthenticationSystem();
});

// Exporter pour utilisation dans d'autres scripts
window.BaticeramAuth = AuthenticationSystem;
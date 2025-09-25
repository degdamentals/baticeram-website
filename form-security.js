/**
 * Sécurisation des formulaires de contact et devis
 */

class FormSecurity {
    constructor() {
        this.init();
    }

    init() {
        this.secureAllForms();
        this.addHoneypotFields();
        this.setupRateLimiting();
    }

    // Sécuriser tous les formulaires de la page
    secureAllForms() {
        const forms = document.querySelectorAll('form');

        forms.forEach(form => {
            // Ajouter token CSRF
            this.addCSRFToken(form);

            // Valider avant soumission
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(e.target)) {
                    e.preventDefault();
                }
            });

            // Empêcher la soumission multiple
            this.preventDoubleSubmission(form);
        });
    }

    // Ajouter un token CSRF au formulaire
    addCSRFToken(form) {
        const csrfToken = window.SecurityUtils.generateCSRFToken();
        sessionStorage.setItem('form_csrf_token', csrfToken);

        const hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.name = 'csrf_token';
        hiddenInput.value = csrfToken;
        form.appendChild(hiddenInput);
    }

    // Ajouter des champs honeypot (invisible pour les humains)
    addHoneypotFields() {
        const forms = document.querySelectorAll('form');

        forms.forEach(form => {
            // Champ email piège
            const honeypot = document.createElement('input');
            honeypot.type = 'email';
            honeypot.name = 'email_confirmation';
            honeypot.style.position = 'absolute';
            honeypot.style.left = '-9999px';
            honeypot.style.opacity = '0';
            honeypot.tabIndex = -1;
            honeypot.autocomplete = 'off';

            const label = document.createElement('label');
            label.innerHTML = 'Ne pas remplir ce champ';
            label.style.position = 'absolute';
            label.style.left = '-9999px';
            label.appendChild(honeypot);

            form.appendChild(label);
        });
    }

    // Configuration du rate limiting pour les formulaires
    setupRateLimiting() {
        const forms = document.querySelectorAll('form');

        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                const formType = form.id || 'generic_form';
                const rateLimit = window.SecurityUtils.checkRateLimit(`form_${formType}`, 3, 300000); // 3 soumissions par 5 minutes

                if (!rateLimit.allowed) {
                    e.preventDefault();
                    this.showRateLimitError(Math.ceil((rateLimit.resetTime - Date.now()) / 1000 / 60));
                }
            });
        });
    }

    // Valider un formulaire
    validateForm(form) {
        let isValid = true;
        const errors = [];

        // Vérifier le token CSRF
        const csrfToken = form.querySelector('[name="csrf_token"]').value;
        const storedToken = sessionStorage.getItem('form_csrf_token');

        if (csrfToken !== storedToken) {
            errors.push('Erreur de sécurité. Veuillez recharger la page.');
            isValid = false;
        }

        // Vérifier le honeypot
        const honeypot = form.querySelector('[name="email_confirmation"]');
        if (honeypot && honeypot.value !== '') {
            console.warn('🤖 Bot détecté via honeypot');
            return false; // Échec silencieux
        }

        // Valider chaque champ
        const inputs = form.querySelectorAll('input, textarea, select');

        inputs.forEach(input => {
            if (input.name === 'csrf_token' || input.name === 'email_confirmation') {
                return;
            }

            const validation = this.validateField(input);
            if (!validation.isValid) {
                errors.push(...validation.errors);
                isValid = false;
                this.highlightError(input);
            } else {
                this.clearError(input);
            }
        });

        if (!isValid) {
            this.showFormErrors(errors);
        }

        return isValid;
    }

    // Valider un champ individuel
    validateField(input) {
        const errors = [];
        let isValid = true;
        const value = input.value.trim();

        // Validation basique
        if (input.required && !value) {
            errors.push(`Le champ ${this.getFieldLabel(input)} est requis`);
            isValid = false;
        }

        if (!value) {
            return { isValid: true, errors: [] }; // Champ optionnel vide
        }

        // Validation par type
        switch (input.type) {
            case 'email':
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    errors.push('Adresse email invalide');
                    isValid = false;
                }
                break;

            case 'tel':
                if (!/^[\d\s\-\+\(\)\.]+$/.test(value)) {
                    errors.push('Numéro de téléphone invalide');
                    isValid = false;
                }
                break;

            case 'url':
                try {
                    new URL(value);
                } catch {
                    errors.push('URL invalide');
                    isValid = false;
                }
                break;
        }

        // Validation de longueur
        if (value.length > 5000) {
            errors.push(`Le champ ${this.getFieldLabel(input)} est trop long`);
            isValid = false;
        }

        // Détecter du contenu suspect
        const suspiciousPatterns = [
            /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
            /javascript:/gi,
            /vbscript:/gi,
            /on\w+\s*=/gi
        ];

        suspiciousPatterns.forEach(pattern => {
            if (pattern.test(value)) {
                errors.push('Contenu non autorisé détecté');
                isValid = false;
            }
        });

        // Sanitiser la valeur
        if (isValid) {
            input.value = window.SecurityUtils.sanitizeText(value);
        }

        return { isValid, errors };
    }

    // Obtenir le label d'un champ
    getFieldLabel(input) {
        const label = document.querySelector(`label[for="${input.id}"]`);
        if (label) {
            return label.textContent.replace('*', '').trim();
        }

        return input.placeholder || input.name || 'ce champ';
    }

    // Mettre en évidence les erreurs
    highlightError(input) {
        input.style.borderColor = '#e74c3c';
        input.classList.add('error');
    }

    // Effacer l'indication d'erreur
    clearError(input) {
        input.style.borderColor = '';
        input.classList.remove('error');
    }

    // Afficher les erreurs du formulaire
    showFormErrors(errors) {
        // Supprimer les messages d'erreur existants
        const existingErrors = document.querySelectorAll('.form-error-message');
        existingErrors.forEach(el => el.remove());

        // Créer le nouveau message d'erreur
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error-message';
        errorDiv.style.cssText = `
            background-color: #fee;
            border: 1px solid #e74c3c;
            border-radius: 4px;
            padding: 1rem;
            margin: 1rem 0;
            color: #c0392b;
            font-size: 14px;
        `;

        errorDiv.innerHTML = `
            <strong>⚠️ Erreurs dans le formulaire:</strong>
            <ul style="margin: 0.5rem 0 0 1.5rem;">
                ${errors.map(error => `<li>${error}</li>`).join('')}
            </ul>
        `;

        // Insérer le message au début du formulaire
        const forms = document.querySelectorAll('form');
        if (forms.length > 0) {
            forms[0].insertBefore(errorDiv, forms[0].firstChild);
        }
    }

    // Afficher l'erreur de rate limiting
    showRateLimitError(minutesRemaining) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'rate-limit-error';
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #fee;
            border: 2px solid #e74c3c;
            border-radius: 8px;
            padding: 2rem;
            text-align: center;
            z-index: 10000;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        `;

        errorDiv.innerHTML = `
            <h3 style="color: #e74c3c; margin-top: 0;">🚫 Trop de tentatives</h3>
            <p>Pour des raisons de sécurité, vous devez attendre <strong>${minutesRemaining} minutes</strong> avant de soumettre à nouveau ce formulaire.</p>
            <button onclick="this.parentElement.remove()" style="
                background-color: #e74c3c;
                color: white;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 4px;
                cursor: pointer;
            ">Fermer</button>
        `;

        document.body.appendChild(errorDiv);

        // Supprimer automatiquement après 10 secondes
        setTimeout(() => {
            if (errorDiv.parentElement) {
                errorDiv.remove();
            }
        }, 10000);
    }

    // Empêcher la soumission multiple
    preventDoubleSubmission(form) {
        let isSubmitting = false;

        form.addEventListener('submit', (e) => {
            if (isSubmitting) {
                e.preventDefault();
                return false;
            }

            isSubmitting = true;

            // Désactiver le bouton de soumission
            const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                const originalText = submitBtn.textContent || submitBtn.value;
                submitBtn.textContent = '⏳ Envoi en cours...';

                // Réactiver après 10 secondes (au cas où)
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                    isSubmitting = false;
                }, 10000);
            }
        });
    }
}

// Initialiser la sécurisation des formulaires
document.addEventListener('DOMContentLoaded', () => {
    if (window.SecurityUtils) {
        new FormSecurity();
    }
});
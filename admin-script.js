/**
 * Système d'Administration CMS pour Baticeram
 *
 * AVERTISSEMENT DE SÉCURITÉ :
 * Ce système est conçu pour des démonstrations et des environnements de développement.
 * Pour un usage en production, veuillez implémenter :
 * - Authentification et autorisation appropriées
 * - Upload sécurisé de fichiers côté serveur
 * - Validation et sanitisation des données
 * - Stockage sécurisé en base de données
 *
 * Version: 1.0
 * License: MIT
 */

// Système d'administration pour Baticeram
class BaticeramAdmin {
    constructor() {
        this.currentData = {};
        this.originalData = {};
        this.isPreviewMode = false;
        this.init();
    }

    init() {
        // Générer et stocker un token CSRF
        this.csrfToken = window.SecurityUtils.generateCSRFToken();
        sessionStorage.setItem('csrf_token', this.csrfToken);

        this.loadCurrentData();
        this.loadSavedData();
        this.bindEvents();
        this.setupSecurityMonitoring();
        this.showSuccessMessage('Mode édition activé ! Cliquez sur les boutons ✏️ pour modifier le contenu.');
    }

    // Configuration du monitoring de sécurité
    setupSecurityMonitoring() {
        // Détecter les tentatives de manipulation du DOM
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // Vérifier les scripts injectés
                            if (node.tagName === 'SCRIPT') {
                                console.warn('⚠️ Script injecté détecté et supprimé');
                                node.remove();
                            }
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Surveiller les tentatives de modification des données critiques
        Object.defineProperty(window, 'localStorage', {
            writable: false,
            configurable: false
        });
    }

    // Charger les données sauvegardées
    loadSavedData() {
        const savedData = localStorage.getItem('baticeram_data');
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
                this.currentData = { ...this.currentData, ...parsedData };
                this.applyDataToDOM();
                console.log('Données précédentes chargées:', this.currentData);
            } catch (e) {
                console.error('Erreur lors du chargement des données sauvegardées:', e);
            }
        }
    }

    // Charger les données actuelles de la page
    loadCurrentData() {
        const editableElements = document.querySelectorAll('.editable');
        editableElements.forEach(element => {
            const section = element.closest('[data-section]')?.getAttribute('data-section') || 'global';
            const field = element.getAttribute('data-field');

            if (field) {
                if (!this.currentData[section]) {
                    this.currentData[section] = {};
                }
                this.currentData[section][field] = element.innerHTML || element.textContent;
            }
        });

        // Sauvegarder l'état original
        this.originalData = JSON.parse(JSON.stringify(this.currentData));
    }

    // Lier les événements
    bindEvents() {
        // Boutons de la barre d'administration
        document.getElementById('save-changes').addEventListener('click', () => this.saveChanges());
        document.getElementById('preview-mode').addEventListener('click', () => this.togglePreviewMode());
        document.getElementById('exit-admin').addEventListener('click', () => this.exitAdmin());

        // Boutons d'édition de section
        document.querySelectorAll('.edit-section-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.target.getAttribute('data-section');
                this.openSectionEditor(section);
            });
        });

        // Boutons d'édition inline
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.target.getAttribute('data-section');
                const field = e.target.getAttribute('data-field');
                this.openInlineEditor(section, field);
            });
        });

        // Boutons d'édition d'images
        document.querySelectorAll('.edit-image-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const field = e.target.getAttribute('data-field');
                this.openImageEditor(field);
            });
        });

        // Édition directe sur les éléments éditables
        document.querySelectorAll('.editable').forEach(element => {
            element.addEventListener('dblclick', () => {
                this.enableInlineEditing(element);
            });
        });

        // Panneau d'édition
        document.getElementById('close-panel').addEventListener('click', () => this.closeEditPanel());
        document.getElementById('cancel-edit').addEventListener('click', () => this.closeEditPanel());
        document.getElementById('edit-overlay').addEventListener('click', () => this.closeEditPanel());
        document.getElementById('edit-form').addEventListener('submit', (e) => this.handleFormSubmit(e));
    }

    // Ouvrir l'éditeur de section
    openSectionEditor(section) {
        const sectionData = this.currentData[section] || {};
        const panelTitle = this.getSectionTitle(section);

        document.getElementById('edit-title').textContent = `Éditer - ${panelTitle}`;

        const form = document.getElementById('edit-form');
        form.innerHTML = '';
        form.setAttribute('data-section', section);

        // Générer les champs du formulaire
        Object.keys(sectionData).forEach(field => {
            const fieldConfig = this.getFieldConfig(field);
            const formGroup = this.createFormField(field, sectionData[field], fieldConfig);
            form.appendChild(formGroup);
        });

        this.showEditPanel();
    }

    // Ouvrir l'éditeur inline
    openInlineEditor(section, field) {
        const currentValue = this.currentData[section]?.[field] || '';
        const newValue = prompt(`Modifier ${field}:`, currentValue);

        if (newValue !== null && newValue !== currentValue) {
            this.updateField(section, field, newValue);
        }
    }

    // Ouvrir l'éditeur d'images
    openImageEditor(field) {
        const form = document.getElementById('edit-form');
        form.innerHTML = '';
        form.setAttribute('data-field', field);

        const currentElement = document.querySelector(`[data-field="${field}"]`);
        const isVideo = currentElement && currentElement.tagName === 'VIDEO';
        const currentSrc = currentElement ? (isVideo ? currentElement.querySelector('source').src : currentElement.src) : '';

        document.getElementById('edit-title').textContent = isVideo ? 'Changer la vidéo' : 'Changer l\'image';

        // Champ de téléchargement d'image ou vidéo
        const formGroup = document.createElement('div');
        formGroup.className = 'form-group';

        const acceptTypes = isVideo ? "video/*" : "image/*";
        const icon = isVideo ? "🎥" : "📷";
        const mediaType = isVideo ? "vidéo" : "image";

        formGroup.innerHTML = `
            <label>${isVideo ? 'Vidéo' : 'Image'} actuelle:</label>
            ${isVideo ?
                `<video src="${currentSrc}" controls class="current-image" style="max-width: 200px; max-height: 150px;"></video>` :
                `<img src="${currentSrc}" alt="Image actuelle" class="current-image">`
            }
            <label>Nouvelle ${mediaType}:</label>
            <div class="image-upload-area" id="image-upload">
                <p>${icon} Cliquez ici ou glissez une ${mediaType}</p>
                <input type="file" id="image-input" accept="${acceptTypes}" style="display: none;">
            </div>
            <div id="image-preview"></div>
        `;

        form.appendChild(formGroup);

        // Gestion du téléchargement d'images
        const uploadArea = document.getElementById('image-upload');
        const imageInput = document.getElementById('image-input');

        uploadArea.addEventListener('click', () => imageInput.click());

        imageInput.addEventListener('change', (e) => {
            this.handleImageUpload(e.target.files[0]);
        });

        // Drag & drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            this.handleImageUpload(e.dataTransfer.files[0]);
        });

        this.showEditPanel();
    }

    // Gérer le téléchargement d'images et vidéos avec validation de sécurité
    handleImageUpload(file) {
        if (!file) return;

        // Validation de sécurité du fichier
        const validation = window.SecurityUtils.validateFile(file);

        if (!validation.isValid) {
            this.showErrorMessage('Fichier non valide: ' + validation.errors.join(', '));
            return;
        }

        // Rate limiting pour les uploads
        const rateLimit = window.SecurityUtils.checkRateLimit('file_upload', 5, 60000);
        if (!rateLimit.allowed) {
            this.showErrorMessage('Trop d\'uploads. Attendez quelques instants.');
            return;
        }

        const isVideo = file.type.startsWith('video/');
        const reader = new FileReader();

        reader.onload = (e) => {
            const preview = document.getElementById('image-preview');
            const mediaType = isVideo ? 'vidéo' : 'image';

            preview.innerHTML = `
                <p>Nouvelle ${mediaType} sélectionnée (${(file.size / 1024 / 1024).toFixed(2)} MB):</p>
                ${isVideo ?
                    `<video src="${e.target.result}" controls class="current-image" style="max-width: 200px; max-height: 150px;"></video>` :
                    `<img src="${e.target.result}" alt="Aperçu" class="current-image">`
                }
                <p style="font-size: 12px; color: #666;">
                    ✅ Fichier validé et sécurisé
                </p>
            `;
        };

        reader.onerror = () => {
            this.showErrorMessage('Erreur lors de la lecture du fichier');
        };

        reader.readAsDataURL(file);
    }

    // Créer un champ de formulaire
    createFormField(field, value, config) {
        const formGroup = document.createElement('div');
        formGroup.className = 'form-group';

        const label = document.createElement('label');
        label.textContent = config.label;
        formGroup.appendChild(label);

        let input;
        if (config.type === 'textarea') {
            input = document.createElement('textarea');
            input.rows = 4;
        } else if (config.type === 'select') {
            input = document.createElement('select');
            config.options.forEach(option => {
                const opt = document.createElement('option');
                opt.value = option.value;
                opt.textContent = option.label;
                input.appendChild(opt);
            });
        } else {
            input = document.createElement('input');
            input.type = config.type || 'text';
        }

        input.name = field;
        input.value = value;
        input.setAttribute('data-field', field);

        formGroup.appendChild(input);
        return formGroup;
    }

    // Configuration des champs
    getFieldConfig(field) {
        const configs = {
            title: { label: 'Titre principal', type: 'textarea' },
            subtitle: { label: 'Sous-titre', type: 'textarea' },
            description: { label: 'Description', type: 'textarea' },
            phone: { label: 'Téléphone', type: 'tel' },
            address: { label: 'Adresse', type: 'textarea' },
            email: { label: 'Email', type: 'email' },

            // Services
            service1_title: { label: 'Titre service 1', type: 'text' },
            service1_description: { label: 'Description service 1', type: 'textarea' },
            service1_point1: { label: 'Point 1 service 1', type: 'text' },
            service1_point2: { label: 'Point 2 service 1', type: 'text' },

            service2_title: { label: 'Titre service 2', type: 'text' },
            service2_description: { label: 'Description service 2', type: 'textarea' },
            service2_point1: { label: 'Point 1 service 2', type: 'text' },
            service2_point2: { label: 'Point 2 service 2', type: 'text' },

            service3_title: { label: 'Titre service 3', type: 'text' },
            service3_description: { label: 'Description service 3', type: 'textarea' },
            service3_point1: { label: 'Point 1 service 3', type: 'text' },
            service3_point2: { label: 'Point 2 service 3', type: 'text' },

            // À propos
            about_title: { label: 'Titre à propos', type: 'text' },
            about_description: { label: 'Description à propos', type: 'textarea' },

            // Statistiques
            stat1_number: { label: 'Chiffre 1', type: 'text' },
            stat1_label: { label: 'Libellé 1', type: 'text' },
            stat2_number: { label: 'Chiffre 2', type: 'text' },
            stat2_label: { label: 'Libellé 2', type: 'text' },
            stat3_number: { label: 'Chiffre 3', type: 'text' },
            stat3_label: { label: 'Libellé 3', type: 'text' },

            // Zone d'intervention
            zone_title: { label: 'Titre zone', type: 'text' },
            zone_service1_title: { label: 'Service 1 titre', type: 'text' },
            zone_service1_desc: { label: 'Service 1 description', type: 'textarea' },
            zone_service2_title: { label: 'Service 2 titre', type: 'text' },
            zone_service2_desc: { label: 'Service 2 description', type: 'textarea' },
            zone_address: { label: 'Adresse', type: 'textarea' },
            zone_cta_title: { label: 'Titre CTA', type: 'text' },

            // Footer
            footer_copyright: { label: 'Copyright', type: 'text' },
            footer_phone: { label: 'Téléphone footer', type: 'tel' },
            footer_address: { label: 'Adresse footer', type: 'textarea' }
        };

        return configs[field] || { label: field, type: 'text' };
    }

    // Obtenir le titre de section
    getSectionTitle(section) {
        const titles = {
            hero: 'Section Hero',
            services: 'Services',
            about: 'À propos',
            certifications: 'Certifications',
            zone: 'Zone d\'intervention',
            footer: 'Pied de page',
            contact: 'Contact'
        };
        return titles[section] || section;
    }

    // Gérer la soumission du formulaire
    handleFormSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const section = form.getAttribute('data-section');
        const imageField = form.getAttribute('data-field');

        if (imageField) {
            // Gestion des images
            this.handleImageFormSubmit(imageField);
        } else {
            // Gestion des textes
            const formData = new FormData(form);
            for (let [field, value] of formData.entries()) {
                this.updateField(section, field, value);
            }
        }

        this.closeEditPanel();
    }

    // Gérer la soumission d'image ou vidéo
    handleImageFormSubmit(field) {
        const imageInput = document.getElementById('image-input');
        if (imageInput.files.length > 0) {
            const file = imageInput.files[0];
            const isVideo = file.type.startsWith('video/');
            const reader = new FileReader();

            reader.onload = (e) => {
                const element = document.querySelector(`[data-field="${field}"]`);
                if (element) {
                    if (isVideo && element.tagName === 'VIDEO') {
                        // Mettre à jour la vidéo
                        const source = element.querySelector('source');
                        if (source) {
                            source.src = e.target.result;
                            element.load(); // Recharger la vidéo
                        }
                        this.showSuccessMessage('Vidéo mise à jour avec succès !');
                    } else if (!isVideo && element.tagName === 'IMG') {
                        // Mettre à jour l'image
                        element.src = e.target.result;
                        this.showSuccessMessage('Image mise à jour avec succès !');
                    }

                    // Sauvegarder la nouvelle valeur dans les données
                    this.updateField('media', field, e.target.result);
                }
            };
            reader.readAsDataURL(file);
        }
    }

    // Mettre à jour un champ avec validation de sécurité
    updateField(section, field, value) {
        // Vérifier l'authentification
        if (!window.BaticeramAuth || !new window.BaticeramAuth().isAuthenticated()) {
            this.showErrorMessage('Session expirée. Veuillez vous reconnecter.');
            return;
        }

        // Rate limiting
        const rateLimit = window.SecurityUtils.checkRateLimit('update_field', 30, 60000);
        if (!rateLimit.allowed) {
            this.showErrorMessage('Trop de modifications. Attendez quelques instants.');
            return;
        }

        // Sanitiser la valeur
        const sanitizedValue = window.SecurityUtils.sanitizeHTML(value);

        if (!this.currentData[section]) {
            this.currentData[section] = {};
        }
        this.currentData[section][field] = sanitizedValue;

        // Mettre à jour l'élément dans le DOM
        const element = document.querySelector(`[data-section="${section}"] [data-field="${field}"], [data-field="${field}"]`);
        if (element) {
            if (element.tagName === 'IMG') {
                element.src = sanitizedValue;
            } else {
                element.innerHTML = sanitizedValue;
            }
        }

        this.showSuccessMessage('Contenu mis à jour !');
    }

    // Édition inline
    enableInlineEditing(element) {
        const originalContent = element.innerHTML;
        const section = element.closest('[data-section]')?.getAttribute('data-section') || 'global';
        const field = element.getAttribute('data-field');

        element.contentEditable = true;
        element.classList.add('editing');
        element.focus();

        const finishEditing = () => {
            element.contentEditable = false;
            element.classList.remove('editing');

            const newContent = element.innerHTML;
            if (newContent !== originalContent) {
                this.updateField(section, field, newContent);
            }
        };

        element.addEventListener('blur', finishEditing, { once: true });
        element.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                element.blur();
            }
            if (e.key === 'Escape') {
                element.innerHTML = originalContent;
                element.blur();
            }
        });
    }

    // Afficher/masquer le panneau d'édition
    showEditPanel() {
        document.getElementById('edit-panel').classList.remove('hidden');
        document.getElementById('edit-overlay').classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    closeEditPanel() {
        document.getElementById('edit-panel').classList.add('hidden');
        document.getElementById('edit-overlay').classList.add('hidden');
        document.body.style.overflow = '';
    }

    // Mode aperçu
    togglePreviewMode() {
        this.isPreviewMode = !this.isPreviewMode;
        const body = document.body;
        const button = document.getElementById('preview-mode');

        if (this.isPreviewMode) {
            body.classList.add('preview-mode');
            button.innerHTML = '✏️ Mode Édition';
            this.showSuccessMessage('Mode aperçu activé');
        } else {
            body.classList.remove('preview-mode');
            button.innerHTML = '👁️ Aperçu';
            this.showSuccessMessage('Mode édition activé');
        }
    }

    // Sauvegarder les modifications
    saveChanges() {
        // Sauvegarder en localStorage
        localStorage.setItem('baticeram_data', JSON.stringify(this.currentData));

        // Appliquer les modifications au DOM pour la synchronisation
        this.applyDataToDOM();

        // Mettre à jour le fichier HTML principal (simulation)
        this.generateUpdatedHTML();

        this.showSuccessMessage('✅ Modifications sauvegardées avec succès !');

        // Optionnel: rediriger vers la version publique
        setTimeout(() => {
            if (confirm('Modifications sauvegardées ! Voir le site public ?')) {
                window.location.href = 'index.html';
            }
        }, 2000);
    }

    // Appliquer les données au DOM
    applyDataToDOM() {
        Object.keys(this.currentData).forEach(section => {
            Object.keys(this.currentData[section]).forEach(field => {
                const value = this.currentData[section][field];
                const element = document.querySelector(`[data-section="${section}"] [data-field="${field}"], [data-field="${field}"]`);

                if (element) {
                    if (element.tagName === 'IMG') {
                        element.src = value;
                        element.alt = `Image ${field}`;
                    } else if (element.tagName === 'VIDEO') {
                        const source = element.querySelector('source');
                        if (source) {
                            source.src = value;
                            element.load();
                        }
                    } else {
                        element.innerHTML = value;
                    }
                }
            });
        });
    }

    // Générer le HTML mis à jour
    generateUpdatedHTML() {
        // En production, cela devrait envoyer les données au serveur
        // pour régénérer le fichier index.html
        console.log('Données mises à jour:', this.currentData);

        // Simulation: créer un blob avec le HTML mis à jour
        const htmlContent = this.createUpdatedHTML();
        const blob = new Blob([htmlContent], { type: 'text/html' });

        // Créer un lien de téléchargement (pour test)
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'index_updated.html';
        // link.click(); // Décommenter pour télécharger automatiquement
    }

    // Créer le HTML mis à jour
    createUpdatedHTML() {
        // Ici, on devrait récupérer le template HTML et y injecter les nouvelles données
        // Pour la demo, on retourne juste les données JSON
        return `
        <!--
        Données mises à jour pour Baticeram:
        ${JSON.stringify(this.currentData, null, 2)}
        -->
        `;
    }

    // Quitter l'administration
    exitAdmin() {
        if (confirm('Quitter le mode administration ? Les modifications non sauvegardées seront perdues.')) {
            window.location.href = 'index.html';
        }
    }

    // Messages de confirmation
    showSuccessMessage(message) {
        this.showMessage(message, 'success');
    }

    showErrorMessage(message) {
        this.showMessage(message, 'error');
    }

    showMessage(message, type = 'success') {
        // Supprimer les messages existants
        document.querySelectorAll('.success-message, .error-message').forEach(msg => msg.remove());

        const messageDiv = document.createElement('div');
        messageDiv.className = `${type}-message`;
        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.remove();
        }, 4000);
    }
}

// Initialiser l'administration au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    new BaticeramAdmin();
});

// Ajouter un raccourci clavier pour sauvegarder (Ctrl+S)
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        document.getElementById('save-changes').click();
    }
});
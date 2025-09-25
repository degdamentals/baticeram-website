/**
 * Utilitaires de Sécurité pour Baticeram
 * Validation, sanitisation et protection des données
 */

class SecurityUtils {
    constructor() {
        this.maxTextLength = 10000;
        this.maxFileSize = 10 * 1024 * 1024; // 10MB
        this.allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'];
        this.allowedVideoTypes = ['video/mp4', 'video/webm', 'video/mov'];
        this.dangerousPatterns = [
            /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
            /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
            /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
            /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
            /javascript:/gi,
            /vbscript:/gi,
            /data:text\/html/gi,
            /on\w+\s*=/gi
        ];
    }

    /**
     * Sanitiser le texte pour éviter les injections XSS
     */
    sanitizeText(text) {
        if (typeof text !== 'string') {
            return '';
        }

        // Limiter la longueur
        text = text.substring(0, this.maxTextLength);

        // Nettoyer les caractères dangereux
        text = text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');

        // Supprimer les patterns dangereux
        this.dangerousPatterns.forEach(pattern => {
            text = text.replace(pattern, '');
        });

        return text.trim();
    }

    /**
     * Sanitiser le HTML pour permettre uniquement les balises sûres
     */
    sanitizeHTML(html) {
        if (typeof html !== 'string') {
            return '';
        }

        // Balises autorisées pour le formatage basique
        const allowedTags = ['b', 'strong', 'i', 'em', 'u', 'br', 'p'];
        const allowedPattern = new RegExp(`<(\/?)(?:${allowedTags.join('|')})(?:\\s[^>]*)?>`, 'gi');

        // Échapper tout le HTML
        let sanitized = this.sanitizeText(html);

        // Réautoriser les balises sûres
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        // Filtrer récursivement les éléments
        const cleanElement = (element) => {
            if (element.nodeType === Node.TEXT_NODE) {
                return element.textContent;
            }

            if (element.nodeType === Node.ELEMENT_NODE) {
                const tagName = element.tagName.toLowerCase();

                if (allowedTags.includes(tagName)) {
                    let result = `<${tagName}>`;
                    for (let child of element.childNodes) {
                        result += cleanElement(child);
                    }
                    result += `</${tagName}>`;
                    return result;
                }

                // Si la balise n'est pas autorisée, retourner le contenu texte
                let result = '';
                for (let child of element.childNodes) {
                    result += cleanElement(child);
                }
                return result;
            }

            return '';
        };

        let cleanHTML = '';
        for (let child of tempDiv.childNodes) {
            cleanHTML += cleanElement(child);
        }

        return cleanHTML.trim();
    }

    /**
     * Valider les données de formulaire
     */
    validateFormData(data, rules) {
        const errors = [];
        const sanitized = {};

        Object.keys(rules).forEach(field => {
            const rule = rules[field];
            const value = data[field];

            // Vérifier si le champ est requis
            if (rule.required && (!value || value.trim() === '')) {
                errors.push(`Le champ ${field} est requis`);
                return;
            }

            if (!value) {
                sanitized[field] = rule.default || '';
                return;
            }

            // Valider la longueur
            if (rule.minLength && value.length < rule.minLength) {
                errors.push(`Le champ ${field} doit contenir au moins ${rule.minLength} caractères`);
            }

            if (rule.maxLength && value.length > rule.maxLength) {
                errors.push(`Le champ ${field} doit contenir au maximum ${rule.maxLength} caractères`);
            }

            // Valider le type
            switch (rule.type) {
                case 'email':
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                        errors.push(`Le champ ${field} doit être un email valide`);
                    }
                    sanitized[field] = this.sanitizeText(value);
                    break;

                case 'phone':
                    if (!/^[\d\s\-\+\(\)\.]+$/.test(value)) {
                        errors.push(`Le champ ${field} doit être un numéro de téléphone valide`);
                    }
                    sanitized[field] = this.sanitizeText(value);
                    break;

                case 'url':
                    try {
                        new URL(value);
                        sanitized[field] = this.sanitizeText(value);
                    } catch {
                        errors.push(`Le champ ${field} doit être une URL valide`);
                    }
                    break;

                case 'html':
                    sanitized[field] = this.sanitizeHTML(value);
                    break;

                default:
                    sanitized[field] = this.sanitizeText(value);
            }
        });

        return { errors, sanitized };
    }

    /**
     * Valider les fichiers uploadés
     */
    validateFile(file) {
        const errors = [];

        if (!file) {
            errors.push('Aucun fichier sélectionné');
            return { errors, isValid: false };
        }

        // Vérifier la taille
        if (file.size > this.maxFileSize) {
            errors.push(`Le fichier est trop volumineux. Taille maximale: ${this.maxFileSize / 1024 / 1024}MB`);
        }

        // Vérifier le type
        const isImage = this.allowedImageTypes.includes(file.type);
        const isVideo = this.allowedVideoTypes.includes(file.type);

        if (!isImage && !isVideo) {
            errors.push('Type de fichier non autorisé. Formats acceptés: images (JPG, PNG, WebP, SVG) et vidéos (MP4, WebM, MOV)');
        }

        // Vérifier l'extension (double vérification)
        const extension = file.name.split('.').pop().toLowerCase();
        const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'svg', 'mp4', 'webm', 'mov'];

        if (!allowedExtensions.includes(extension)) {
            errors.push('Extension de fichier non autorisée');
        }

        // Vérifications spécifiques aux images
        if (isImage) {
            // Pour SVG, vérifications supplémentaires
            if (file.type === 'image/svg+xml') {
                return this.validateSVG(file);
            }
        }

        return { errors, isValid: errors.length === 0 };
    }

    /**
     * Validation spéciale pour les fichiers SVG (plus dangereux)
     */
    async validateSVG(file) {
        const errors = [];

        try {
            const text = await this.readFileAsText(file);

            // Vérifier les éléments dangereux dans le SVG
            const dangerousSVGPatterns = [
                /<script\b/i,
                /<foreignObject\b/i,
                /javascript:/i,
                /vbscript:/i,
                /on\w+\s*=/i,
                /<use\b[^>]*href\s*=\s*["|']?data:/i
            ];

            dangerousSVGPatterns.forEach(pattern => {
                if (pattern.test(text)) {
                    errors.push('Le fichier SVG contient des éléments potentiellement dangereux');
                }
            });

        } catch (e) {
            errors.push('Impossible de lire le contenu du fichier SVG');
        }

        return { errors, isValid: errors.length === 0 };
    }

    /**
     * Lire un fichier comme texte
     */
    readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error);
            reader.readAsText(file);
        });
    }

    /**
     * Générer un token CSRF simple
     */
    generateCSRFToken() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    /**
     * Vérifier le token CSRF
     */
    validateCSRFToken(token) {
        const storedToken = sessionStorage.getItem('csrf_token');
        return storedToken === token;
    }

    /**
     * Rate limiting simple basé sur localStorage
     */
    checkRateLimit(action, maxRequests = 10, windowMs = 60000) {
        const key = `rate_limit_${action}`;
        const now = Date.now();
        let requests = JSON.parse(localStorage.getItem(key) || '[]');

        // Nettoyer les anciennes requêtes
        requests = requests.filter(timestamp => now - timestamp < windowMs);

        if (requests.length >= maxRequests) {
            return {
                allowed: false,
                resetTime: requests[0] + windowMs,
                remainingRequests: 0
            };
        }

        // Ajouter la requête actuelle
        requests.push(now);
        localStorage.setItem(key, JSON.stringify(requests));

        return {
            allowed: true,
            resetTime: now + windowMs,
            remainingRequests: maxRequests - requests.length
        };
    }

    /**
     * Échapper les caractères spéciaux pour les expressions régulières
     */
    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    /**
     * Nettoyer les données avant stockage
     */
    cleanDataForStorage(data) {
        if (typeof data !== 'object' || data === null) {
            return data;
        }

        const cleaned = {};

        Object.keys(data).forEach(key => {
            const value = data[key];

            if (typeof value === 'string') {
                cleaned[key] = this.sanitizeText(value);
            } else if (typeof value === 'object' && value !== null) {
                cleaned[key] = this.cleanDataForStorage(value);
            } else {
                cleaned[key] = value;
            }
        });

        return cleaned;
    }
}

// Instance globale
window.SecurityUtils = new SecurityUtils();
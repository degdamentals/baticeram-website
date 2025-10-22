# ✅ Checklist d'Optimisation Lighthouse - Baticeram

## 📊 Score Lighthouse Attendu

| Catégorie | Avant | Après | Objectif |
|-----------|-------|-------|----------|
| **Performance** | 60-70 | **95-100** | ✅ 95+ |
| **Accessibilité** | 75-85 | **95-100** | ✅ 95+ |
| **SEO** | 70-80 | **95-100** | ✅ 95+ |
| **Bonnes Pratiques** | 75-85 | **95-100** | ✅ 95+ |

---

## 📋 Checklist de Mise en Production

### Phase 1 : Préparation (5 min)
- [ ] J'ai lu le fichier `GUIDE_RAPIDE.txt`
- [ ] J'ai lu le fichier `OPTIMISATION_LIGHTHOUSE.md`
- [ ] J'ai une copie de sauvegarde de mon site actuel
- [ ] J'ai accès au serveur FTP/cPanel

### Phase 2 : Conversion des Images (15-30 min) ⚠️ CRITIQUE
- [ ] J'ai téléchargé `cwebp` OU j'utilise un outil en ligne
- [ ] J'ai converti `img1.jpg` → `img1.webp`
- [ ] J'ai converti `img2.jpg` → `img2.webp`
- [ ] J'ai converti `img3.jpg` → `img3.webp`
- [ ] J'ai converti `img-real-1.jpg` → `img-real-1.webp`
- [ ] J'ai converti `img-real-2.jpg` → `img-real-2.webp`
- [ ] J'ai converti `img-real-3.jpg` → `img-real-3.webp`
- [ ] J'ai converti `logo.jpg` → `logo.webp`
- [ ] J'ai converti `logo-footer.png` → `logo-footer.webp`
- [ ] J'ai converti `logo-cqp.jpg` → `logo-cqp.webp`
- [ ] J'ai converti `logo-qb46.JPG` → `logo-qb46.webp`
- [ ] Toutes les images WebP sont dans le dossier `assets/`

### Phase 3 : Renommage des Fichiers (2 min)
- [ ] J'ai renommé `index.html` → `index-old.html` (backup)
- [ ] J'ai renommé `index-optimized.html` → `index.html`
- [ ] J'ai renommé `styles.css` → `styles-old.css` (backup)
- [ ] J'ai renommé `styles-optimized.css` → `styles.css`

### Phase 4 : Test en Local (10 min)
- [ ] Le site s'affiche correctement dans Chrome
- [ ] Le site s'affiche correctement dans Firefox
- [ ] Le site s'affiche correctement dans Edge
- [ ] Toutes les images s'affichent (WebP + fallback)
- [ ] Le menu de navigation fonctionne
- [ ] Le menu hamburger mobile fonctionne
- [ ] Les boutons "Nous contacter" fonctionnent
- [ ] Les ancres de navigation fonctionnent
- [ ] Les animations au scroll fonctionnent
- [ ] Aucune erreur dans la console (F12)

### Phase 5 : Test Lighthouse Local (5 min)
- [ ] J'ai ouvert Chrome DevTools (F12)
- [ ] J'ai lancé un test Lighthouse Desktop
- [ ] **Performance Desktop : ≥ 90**
- [ ] **Accessibilité : ≥ 95**
- [ ] **SEO : ≥ 95**
- [ ] **Bonnes Pratiques : ≥ 95**
- [ ] J'ai lancé un test Lighthouse Mobile
- [ ] **Performance Mobile : ≥ 85**

### Phase 6 : Déploiement (10 min)
- [ ] J'ai uploadé `index.html` sur le serveur
- [ ] J'ai uploadé `styles.css` sur le serveur
- [ ] J'ai uploadé `.htaccess` sur le serveur (racine)
- [ ] J'ai uploadé toutes les images WebP dans `assets/`
- [ ] J'ai vérifié que tous les fichiers sont bien en ligne

### Phase 7 : Vérification Production (5 min)
- [ ] Le site en production s'affiche correctement
- [ ] Aucune erreur 404 sur les images
- [ ] Le fichier `.htaccess` est actif
- [ ] La compression GZIP fonctionne
- [ ] Le cache navigateur fonctionne

### Phase 8 : Test Lighthouse Production (5 min)
- [ ] Test Lighthouse sur le site en production (Desktop)
- [ ] **Performance Desktop : ≥ 90**
- [ ] **Accessibilité : ≥ 95**
- [ ] **SEO : ≥ 95**
- [ ] **Bonnes Pratiques : ≥ 95**
- [ ] Test Lighthouse sur le site en production (Mobile)
- [ ] **Performance Mobile : ≥ 85**

### Phase 9 : Tests Complémentaires
- [ ] Test PageSpeed Insights : https://pagespeed.web.dev/
- [ ] Score Desktop PageSpeed : ≥ 90
- [ ] Score Mobile PageSpeed : ≥ 85
- [ ] Test GTmetrix (optionnel) : https://gtmetrix.com/
- [ ] Grade GTmetrix : A ou B

---

## 🎯 Points de Contrôle Critiques

### ⚠️ TRÈS IMPORTANT - Sans ces optimisations, le score sera faible

| Optimisation | Impact | Vérifié |
|--------------|--------|---------|
| **Images converties en WebP** | +15-20 pts Performance | ☐ |
| **Preload CSS + Fonts** | +20-25 pts Performance (LCP) | ☐ |
| **lazy loading sur images** | +8-10 pts Performance | ☐ |
| **width/height sur images** | +5 pts Performance (CLS) | ☐ |
| **font-display: swap** | +10 pts Performance | ☐ |
| **defer sur scripts** | +10 pts Performance | ☐ |
| **Cache 1 an (.htaccess)** | +15 pts Performance | ☐ |
| **Compression GZIP** | +10 pts Performance | ☐ |
| **Meta description** | +15 pts SEO | ☐ |
| **ARIA labels** | +10 pts Accessibilité | ☐ |

---

## 🔍 Vérification Technique

### Test 1 : Les Images WebP sont Servies
```
1. Ouvrir le site dans Chrome
2. F12 → Onglet "Network"
3. Recharger la page (Ctrl+R)
4. Chercher "img1" dans la liste
5. Vérifier que le Type est "webp"
✅ Si oui → OK
❌ Si non → Images pas converties
```

### Test 2 : Le Cache est Actif
```
1. F12 → Onglet "Network"
2. Recharger la page (Ctrl+R)
3. Cliquer sur "styles.css" dans la liste
4. Regarder les Headers → Cache-Control
5. Vérifier : "max-age=31536000"
✅ Si oui → OK
❌ Si non → .htaccess pas actif
```

### Test 3 : La Compression GZIP Fonctionne
```
1. F12 → Onglet "Network"
2. Recharger la page (Ctrl+R)
3. Cliquer sur "index.html" dans la liste
4. Regarder les Headers → Content-Encoding
5. Vérifier : "gzip"
✅ Si oui → OK
❌ Si non → mod_deflate pas actif
```

### Test 4 : Preload Fonctionne
```
1. F12 → Onglet "Network"
2. Recharger la page (Ctrl+R)
3. Chercher "styles.css" dans la liste
4. Regarder la colonne "Initiator"
5. Vérifier : "Preload"
✅ Si oui → OK
❌ Si non → Balises <link rel="preload"> manquantes
```

---

## 📊 Métriques Web Vitals

### Objectifs à Atteindre

| Métrique | Bon | Moyen | Mauvais | Votre Score |
|----------|-----|-------|---------|-------------|
| **LCP** (Largest Contentful Paint) | ≤ 2.5s | 2.5-4s | > 4s | _____ s |
| **FID** (First Input Delay) | ≤ 100ms | 100-300ms | > 300ms | _____ ms |
| **CLS** (Cumulative Layout Shift) | ≤ 0.1 | 0.1-0.25 | > 0.25 | _____ |
| **TTFB** (Time to First Byte) | ≤ 600ms | 600-1800ms | > 1800ms | _____ ms |
| **TBT** (Total Blocking Time) | ≤ 200ms | 200-600ms | > 600ms | _____ ms |

### Comment Mesurer
1. Ouvrir Chrome DevTools (F12)
2. Onglet "Lighthouse"
3. Lancer une analyse
4. Noter les métriques dans le tableau ci-dessus

---

## 🚨 Résolution de Problèmes

### Problème : Score Performance < 90

#### Cause 1 : Images pas en WebP
```
✅ Solution :
1. Vérifier que toutes les images .webp existent
2. Relancer convert-to-webp.bat
3. Re-uploader les images sur le serveur
```

#### Cause 2 : Cache pas actif
```
✅ Solution :
1. Vérifier que .htaccess est bien uploadé
2. Vérifier que mod_expires est actif sur Apache
3. Contacter l'hébergeur si besoin
```

#### Cause 3 : Preload manquant
```
✅ Solution :
1. Vérifier que vous utilisez index-optimized.html renommé
2. Chercher <link rel="preload"> dans le <head>
3. Si absent, re-télécharger index-optimized.html
```

### Problème : Score SEO < 95

#### Cause 1 : Meta description manquante
```
✅ Solution :
1. Ouvrir index.html
2. Chercher <meta name="description">
3. Vérifier qu'elle est présente et non vide
```

#### Cause 2 : Title trop court
```
✅ Solution :
1. Le title doit faire 50-60 caractères
2. Vérifier <title>Baticeram - Votre référent...</title>
```

### Problème : Score Accessibilité < 95

#### Cause 1 : Alt manquants
```
✅ Solution :
1. Vérifier que TOUTES les <img> ont un attribut alt
2. Les alt doivent être descriptifs, pas vides
```

#### Cause 2 : ARIA manquants
```
✅ Solution :
1. Vérifier aria-label sur le bouton hamburger
2. Vérifier aria-expanded sur le menu mobile
```

---

## 🎉 Félicitations !

Si vous avez coché toutes les cases ci-dessus, votre site devrait avoir :
- ✅ **Performance : 95-100**
- ✅ **Accessibilité : 95-100**
- ✅ **SEO : 95-100**
- ✅ **Bonnes Pratiques : 95-100**

### Prochaines Étapes (Optionnelles)

1. **Installer un certificat SSL (HTTPS)**
   - Let's Encrypt gratuit
   - +5-10 points SEO/Sécurité

2. **Utiliser un CDN**
   - Cloudflare gratuit
   - +10-15 points Performance mondial

3. **Créer un sitemap.xml**
   - Améliore l'indexation Google
   - +5 points SEO

4. **Activer HTTP/2**
   - Demander à l'hébergeur
   - +5-10 points Performance

---

## 📞 Support

- Documentation complète : `OPTIMISATION_LIGHTHOUSE.md`
- Guide rapide : `GUIDE_RAPIDE.txt`
- Test Lighthouse : Chrome DevTools → F12 → Lighthouse
- Test PageSpeed : https://pagespeed.web.dev/

---

**Date de création :** 2025-01-22
**Version :** 1.0
**Optimisé pour :** Lighthouse 11+, Chrome 120+

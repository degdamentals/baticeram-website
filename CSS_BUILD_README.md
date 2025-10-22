# Guide d'utilisation de l'optimisation CSS

## Plugins installés

### 1. **cssnano** - Minification CSS
cssnano minifie votre CSS en :
- Supprimant les commentaires
- Optimisant les couleurs
- Réduisant les espaces blancs
- Minifiant les sélecteurs et les valeurs de polices

### 2. **PurgeCSS** - Suppression du CSS non utilisé
PurgeCSS analyse vos fichiers HTML et supprime automatiquement les classes CSS non utilisées pour réduire la taille du fichier.

## Scripts npm disponibles

### Build du CSS principal
```bash
npm run build:css
```
Génère `styles.min.css` à partir de `styles.css`

### Build du CSS admin
```bash
npm run build:css-admin
```
Génère `admin-styles.min.css` à partir de `admin-styles.css`

### Build complet
```bash
npm run build
```
Génère tous les fichiers CSS minifiés et purgés

### Mode watch (développement)
```bash
npm run watch:css
```
Surveille les modifications de `styles.css` et régénère automatiquement `styles.min.css`

## Configuration PurgeCSS

Le fichier [postcss.config.cjs](postcss.config.cjs) contient la configuration.

### Fichiers analysés
PurgeCSS analyse automatiquement :
- `index.html`
- `admin.html`
- `contact.html`
- `devis.html`

### Classes préservées (safelist)
Certaines classes sont automatiquement conservées même si elles ne sont pas détectées :
- `active`
- `animate`
- `animate-on-scroll`
- `animate-fade-up`
- `animate-fade-left`
- `animate-fade-right`
- `animate-scale`

Ces classes sont généralement ajoutées dynamiquement via JavaScript.

### Ajouter des classes à la safelist

Si vous utilisez des classes dynamiques qui sont supprimées par erreur, ajoutez-les dans [postcss.config.cjs](postcss.config.cjs) :

```javascript
safelist: {
  standard: [
    'active',
    'animate',
    'ma-nouvelle-classe'  // Ajoutez ici
  ]
}
```

## Utilisation en production

1. **Générer les fichiers CSS optimisés** :
```bash
npm run build
```

2. **Mettre à jour vos fichiers HTML** :
Remplacez :
```html
<link rel="stylesheet" href="styles.css">
```

Par :
```html
<link rel="stylesheet" href="styles.min.css">
```

## Gains de performance

Avec cssnano et PurgeCSS, vous pouvez obtenir :
- **Réduction de 40-80%** de la taille du CSS
- **Amélioration du score Lighthouse** (Performance)
- **Temps de chargement réduit**

## Problème : Les images ne s'affichent pas

### Solution

Le problème vient probablement du fait que vous ouvrez le fichier HTML directement dans le navigateur (`file://`).

**Pour que les images s'affichent correctement, vous devez utiliser un serveur web local** :

### Méthode 1 : Utiliser le script npm
```bash
npm start
```
Puis ouvrez votre navigateur sur `http://localhost:8000`

### Méthode 2 : Python HTTP Server
```bash
cd "c:\Users\delac\Desktop\Planete\Planète"
python -m http.server 8000
```
Puis ouvrez `http://localhost:8000` dans votre navigateur

### Méthode 3 : PHP Built-in Server
```bash
cd "c:\Users\delac\Desktop\Planete\Planète"
php -S localhost:8000
```
Puis ouvrez `http://localhost:8000` dans votre navigateur

### Méthode 4 : Extension VS Code "Live Server"
1. Installez l'extension "Live Server" dans VS Code
2. Clic droit sur `index.html`
3. Sélectionnez "Open with Live Server"

## Structure des chemins

Les chemins des images sont corrects dans le fichier HTML :
```html
<img src="assets/logo.jpg" alt="Logo">
```

Tant que vous servez le site via un serveur HTTP (et non `file://`), toutes les images dans le dossier `assets/` s'afficheront correctement.

## Vérification

Pour vérifier que les images sont bien présentes :
```bash
ls assets/*.jpg
ls assets/*.png
ls assets/*.svg
```

Les fichiers suivants devraient être présents :
- `assets/logo.jpg`
- `assets/img1.jpg`
- `assets/img2.jpg`
- `assets/img3.jpg`
- `assets/img-real-1.jpg`
- `assets/img-real-2.jpg`
- `assets/img-real-3.jpg`
- `assets/logo-footer.png`
- `assets/favicon.png`
- etc.

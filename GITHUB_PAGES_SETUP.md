# Guide de déploiement sur GitHub Pages

## ✅ Code déployé avec succès !

Votre code a été poussé sur le dépôt GitHub :
**https://github.com/degdamentals/baticeram-website**

## 📋 Fichiers exclus du dépôt

Les fichiers suivants sont automatiquement exclus grâce au [.gitignore](.gitignore) :
- ✓ `index-backup.html`
- ✓ `styles-backup.css`
- ✓ `node_modules/`
- ✓ `*.min.css` (fichiers générés)

Ces fichiers restent uniquement en local et ne sont pas envoyés sur GitHub.

## 🚀 Activer GitHub Pages

Pour publier votre site, suivez ces étapes :

### 1. Accéder aux paramètres du dépôt

1. Allez sur votre dépôt : https://github.com/degdamentals/baticeram-website
2. Cliquez sur **Settings** (Paramètres) en haut à droite
3. Dans le menu de gauche, cliquez sur **Pages**

### 2. Configurer GitHub Pages

1. Sous **Source**, sélectionnez :
   - **Branch** : `main`
   - **Folder** : `/ (root)`
2. Cliquez sur **Save**

### 3. Attendre le déploiement

GitHub va automatiquement déployer votre site. Cela prend 1-2 minutes.

### 4. Accéder à votre site

Votre site sera disponible à l'adresse :
**https://degdamentals.github.io/baticeram-website/**

Vous verrez l'URL exacte dans la section GitHub Pages après le déploiement.

## 📝 Modifications futures

Pour mettre à jour votre site :

1. **Modifiez vos fichiers localement**
2. **Committez les changements** :
   ```bash
   cd "c:\Users\delac\Desktop\Planete\Planète"
   git add .
   git commit -m "Description de vos modifications"
   ```
3. **Poussez vers GitHub** :
   ```bash
   git push origin main
   ```
4. **Attendez 1-2 minutes** que GitHub Pages se mette à jour

## ✨ Optimisations incluses

Votre site est maintenant optimisé avec :
- ✅ **Images corrigées** - Tous les chemins fonctionnent correctement
- ✅ **cssnano** - CSS minifié pour de meilleures performances
- ✅ **PurgeCSS** - Suppression du CSS inutilisé
- ✅ **Build automatique** - Scripts npm pour générer les CSS optimisés

## 📊 Générer les CSS optimisés (optionnel)

Si vous voulez utiliser les versions minifiées du CSS :

1. **Générer les fichiers** :
   ```bash
   npm run build
   ```

2. **Mettre à jour index.html** :
   Remplacez :
   ```html
   <link rel="stylesheet" href="styles.css">
   ```
   Par :
   ```html
   <link rel="stylesheet" href="styles.min.css">
   ```

3. **Mettre à jour .gitignore** :
   Commentez la ligne `*.min.css` dans [.gitignore](.gitignore) pour inclure les fichiers minifiés

4. **Committez et poussez** :
   ```bash
   git add .
   git commit -m "Utilisation des CSS minifiés"
   git push origin main
   ```

## 🔍 Vérifier le déploiement

Après activation de GitHub Pages, vérifiez que :
- ✓ Les images s'affichent correctement
- ✓ Les liens de navigation fonctionnent
- ✓ Le site est responsive (mobile/desktop)
- ✓ Les formulaires fonctionnent (contact.html, devis.html)

## 🆘 Résolution de problèmes

### Les images ne s'affichent pas
- Vérifiez que le dossier `assets/` est bien présent dans le dépôt
- Assurez-vous que les chemins sont relatifs : `assets/img.jpg` (pas `/assets/img.jpg`)

### Les modifications ne sont pas visibles
- Videz le cache de votre navigateur (Ctrl+F5)
- Attendez 2-3 minutes après le push
- Vérifiez que le commit a bien été poussé : `git log --oneline`

### Erreur 404
- Vérifiez que GitHub Pages est bien activé dans les Settings
- Assurez-vous que la branche `main` est sélectionnée

## 📚 Ressources

- [Documentation CSS Build](CSS_BUILD_README.md)
- [Documentation GitHub Pages](https://docs.github.com/en/pages)
- [Optimisations Lighthouse](OPTIMISATION_LIGHTHOUSE.md)

---

**Votre site est prêt à être publié ! 🎉**

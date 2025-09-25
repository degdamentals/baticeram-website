# 🏗️ Baticeram - Site Web avec CMS Intégré

Un site web moderne et responsive pour une entreprise de chape liquide avec un système de gestion de contenu (CMS) intégré, permettant aux clients de modifier facilement le contenu sans connaissances techniques.

## ✨ Fonctionnalités

### 🌐 Site Web Public
- **Design moderne et responsive** adapté à tous les écrans
- **Animations fluides** au scroll avec détection de direction
- **Navigation intuitive** avec ancres et menu sticky
- **Formulaires de contact et devis** entièrement fonctionnels
- **Optimisé pour le référencement** (SEO-friendly)

### 🔧 Système d'Administration (CMS)
- **Interface visuelle** avec boutons d'édition sur chaque élément
- **Édition inline** par double-clic sur les textes
- **Upload d'images et vidéos** par drag & drop
- **Mode aperçu** pour visualiser sans boutons d'édition
- **Sauvegarde automatique** et synchronisation
- **Documentation complète** pour les utilisateurs

## 🚀 Installation et Utilisation

### Installation
1. Clonez le repository :
```bash
git clone https://github.com/votre-username/baticeram-website.git
cd baticeram-website
```

2. Ouvrez `index.html` dans votre navigateur pour voir le site public

3. Ouvrez `admin.html` pour accéder au mode d'administration

### Structure des Fichiers
```
baticeram-website/
├── index.html              # Page d'accueil
├── admin.html              # Interface d'administration
├── contact.html            # Page de contact
├── devis.html              # Page de demande de devis
├── styles.css              # Styles du site principal
├── admin-styles.css        # Styles de l'interface admin
├── admin-script.js         # Logic du CMS
├── GUIDE_ADMINISTRATION.md # Guide utilisateur du CMS
├── assets/                 # Images, vidéos et ressources
│   ├── img1.jpg
│   ├── img2.jpg
│   ├── video.mp4
│   └── ...
└── README.md              # Ce fichier
```

## 📱 Technologies Utilisées

- **HTML5** - Structure sémantique
- **CSS3** - Styles modernes avec Flexbox/Grid
- **JavaScript Vanilla** - Interactions et CMS
- **Google Fonts** - Typographie (Quicksand)
- **Responsive Design** - Compatible mobile/tablette/desktop

## 🎯 Fonctionnalités du CMS

### Pour les Utilisateurs Non-Techniques
- ✅ **Modifier les textes** - Double-clic ou boutons d'édition
- ✅ **Changer les images** - Upload par drag & drop
- ✅ **Remplacer les vidéos** - Support MP4, WebM, MOV
- ✅ **Éditer les sections** - Formulaires intuitifs
- ✅ **Aperçu en temps réel** - Voir les changements instantanément
- ✅ **Sauvegarde simple** - Un clic pour enregistrer

### Sections Éditables
- 🏠 Section Hero (titre, sous-titre, médias)
- 🔧 Services (3 services avec descriptions et images)
- 👥 À propos (présentation et statistiques)
- 🏆 Certifications (logos et noms des partenaires)
- 📍 Zone d'intervention (carte et informations)
- 📞 Informations de contact (téléphone, adresse)
- 🔗 Footer (liens et informations légales)

## 🛠️ Personnalisation

### Modifier les Couleurs
Éditez les variables CSS dans `styles.css` :
```css
:root {
  --primary-yellow: #FFD600;
  --primary-blue: #1E3A8A;
  --accent-orange: #F97316;
}
```

### Ajouter de Nouvelles Sections
1. Ajoutez le HTML avec les attributs `data-section` et `data-field`
2. Mettez à jour `admin-script.js` pour inclure les nouveaux champs
3. Ajoutez les styles correspondants

## 📖 Documentation

- **[Guide d'Administration](GUIDE_ADMINISTRATION.md)** - Manuel complet pour les utilisateurs du CMS
- **Code documenté** - Commentaires explicatifs dans tous les fichiers

## 🔒 Sécurité

### ✅ Sécurité Professionnelle Intégrée
- **🔐 Authentification** - Connexion sécurisée pour l'administration
- **🛡️ Protection complète** - Anti-XSS, validation de fichiers, rate limiting
- **🚫 Anti-intrusion** - Protection CSRF, détection de bots, headers sécurisés
- **📊 Monitoring** - Surveillance automatique des tentatives d'attaque

**🔑 Identifiants par défaut :** `admin`/`BaticeramAdmin2025!` - **À changer lors du premier déploiement !**

**📖 Sécurité :** Toutes les informations de sécurité et bonnes pratiques sont détaillées dans le [Guide d'Administration](GUIDE_ADMINISTRATION.md).

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créez votre branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 📞 Contact

- **Email** : contact@example.com
- **GitHub** : [@votre-username](https://github.com/votre-username)

## 🎉 Remerciements

- Développé avec ❤️ pour les entreprises du BTP
- Inspiré par les besoins réels des artisans
- Conçu pour être accessible à tous

---

⭐ **Si ce projet vous a aidé, n'hésitez pas à lui donner une étoile !**
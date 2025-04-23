---

## ✅ **Analyse fonctionnelle – DevBook**

### 🎯 Objectif
Créer une application web qui aide les développeurs à **gérer leur collection de livres techniques** de manière intuitive, en offrant des fonctionnalités de gestion, de tri, de suivi de lecture et de visualisation dynamique.

---

##Links
[Use Case](https://drive.google.com/file/d/1VBjo3j2pbHnprarTUmvBlHjKWAtIzceB/view?usp=drive_link)

---

## 👥 Acteurs

| Acteur       | Description |
|--------------|-------------|
| **Utilisateur** | Développeur utilisant DevBook pour gérer sa bibliothèque personnelle |
| **Système (DevBook)** | Application qui interagit avec l’utilisateur, la base de données et les actions liées aux livres |

---

## 📌 Besoins de l’utilisateur

L’utilisateur souhaite :
- Ajouter, modifier ou supprimer un livre.
- Classer ses livres par catégorie (ex: JavaScript, Design, Architecture…).
- Indiquer s’il a lu un livre, s’il est en cours ou à lire.
- Rechercher un livre (par auteur, titre, etc.).
- Trier la liste selon différents critères.
- Visualiser ses livres avec une **pagination dynamique**.
- Accéder à des **statistiques** sur ses lectures ou ses emprunts.

---

## 📘 Cas d’utilisation (Use Case)

Voici une proposition de **diagramme UML textuel** avec les principaux cas :

### Acteur principal : Utilisateur

- ✅ Gérer un livre :
  - Ajouter un livre
  - Modifier un livre
  - Supprimer un livre
- ✅ Organiser les livres :
  - Créer ou sélectionner une catégorie
  - Changer le statut de lecture (lu/en cours/à lire)
- ✅ Rechercher et trier :
  - Rechercher un livre
  - Trier par titre, auteur, statut, etc.
- ✅ Affichage dynamique :
  - Voir les livres paginés
  - Visualiser les catégories et les stats
- ✅ Suivre les emprunts :
  - Consulter les emprunts passés
  - Voir les livres non rendus
  - Afficher les emprunts selon des critères (date, popularité)

---

## 🧩 Livrables UML à produire (Jour 1)

### 1. 📄 **Diagramme de cas d’utilisation** (Use Case Diagram)
- **Acteur principal :** Utilisateur
- **Système :** DevBook
- **Cas d’utilisation :**
  - Gérer un livre (ajout, édition, suppression)
  - Organiser les livres par catégorie
  - Suivre les statuts de lecture
  - Rechercher / Trier
  - Visualiser les données dynamiquement
  - Consulter les statistiques liées aux emprunts

💡 Tu veux que je te génère un diagramme UML (Use Case) visuellement ? Ou un fichier prêt pour `draw.io` ou `StarUML` ?

---

## 💻 Début du développement – Base HTML/JS

**Structure de base à livrer :**

```
📁 devbook/
│
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   ├── book.js (classe Livre)
│   └── ui.js (gestion DOM)
└── data/
    └── books.json (faux JSON au départ)
```

---
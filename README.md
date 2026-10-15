# Studio Vigie – Jeu étude de marché

Jeux de rôle pédagogiques pour apprendre à réaliser une étude de marché.
Page d'accueil : `index.html`. Les jeux sont dans le dossier `jeux/`.

## Ajouter un nouveau jeu

1. **Déposez le fichier** du jeu dans le dossier `jeux/`.
   Nommez-le en minuscules, sans espaces ni accents : `mission-4-mon-titre.html`.

2. **Ajoutez une ligne** dans le tableau `JEUX`, en haut de `index.html` :

   ```js
   { titre: "Mission 4 · Mon titre", fichier: "jeux/mission-4-mon-titre.html", description: "Une phrase qui dit ce que fait le jeu.", categorie: "Étude de marché", emoji: "📊", couleur: "#4f7a8c" },
   ```

   Chaque ligne se termine par une virgule (sauf la dernière, où elle est facultative).

3. **(Facultatif) Ajoutez le bouton retour** dans le jeu : collez ces lignes juste avant `</body>` :

   ```html
   <style>.side{padding-top:2.8rem}@media (max-width:900px){.top{padding-top:2.4rem}}</style>
   <a href="../index.html" id="retour-hub" style="position:fixed;top:.4rem;left:.4rem;z-index:30;padding:.3rem .6rem;font:600 .8rem/1.2 system-ui,sans-serif;color:#ece8dc;background:rgba(29,41,47,.92);border:1px solid rgba(236,232,220,.35);border-radius:6px;text-decoration:none">&larr; Tous les jeux</a>
   ```

4. **Publiez** : `git add .` puis `git commit -m "Ajout mission 4"` puis `git push`.
   Le site se met à jour en une à deux minutes.

## Espace formateur (protégé par mot de passe)

Page `formateur/index.html` (lien « Espace formateur » en bas de l'accueil).
Les originaux sont dans `prive/` (jamais publié). Seule une version **chiffrée** est mise en ligne dans
`formateur/donnees/` : sans le mot de passe, ces fichiers sont illisibles, même en les téléchargeant depuis GitHub.

**Ajouter ou modifier un fichier :**

1. Déposez-le dans `prive/cours/` ou `prive/mission-N/` (minuscules, sans espaces ni accents).
   Pour une nouvelle mission, ajoutez son titre dans `SECTIONS` en haut de `outils/chiffrer.mjs`.
2. Dans Git Bash, depuis ce dossier :

   ```bash
   MDP_FORMATEUR='le-mot-de-passe' node outils/chiffrer.mjs
   git add formateur && git commit -m "Mise à jour espace formateur" && git push
   ```

**Changer le mot de passe :** relancez la même commande avec le nouveau mot de passe, puis publiez.
L'ancien ne fonctionne plus. Conservez le mot de passe dans un gestionnaire : il n'est enregistré nulle part
dans le projet, et s'il est perdu, il suffit de rechiffrer avec un nouveau.

## À ne pas publier en clair

Les corrigés et documents animateur (`*bonnes_reponses*`, `*.docx`, `*.pptx`, `*.json`) ne doivent jamais être
ajoutés ailleurs que dans `prive/` : le dépôt est public. Le fichier `.gitignore` les bloque par sécurité.

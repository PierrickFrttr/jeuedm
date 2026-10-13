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

## À ne pas publier

Les corrigés et documents animateur (`*bonnes_reponses*`, `*.docx`, `*.pptx`) ne doivent pas être mis dans ce dossier :
le dépôt est public, les étudiants pourraient les lire. Le fichier `.gitignore` les bloque par sécurité.

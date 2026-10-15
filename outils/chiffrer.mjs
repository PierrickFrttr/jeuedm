// Chiffre les fichiers de prive/ vers formateur/donnees/ (seule la version chiffrée est publiée).
// Usage (Git Bash) :  MDP_FORMATEUR='votre-mot-de-passe' node outils/chiffrer.mjs
// Aucune dépendance : module crypto intégré à Node. Algorithmes compatibles avec formateur/index.html
// (PBKDF2-SHA256 600 000 itérations → clé AES-256-GCM).
import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pbkdf2Sync, randomBytes, createCipheriv } from 'node:crypto';

const MDP = process.env.MDP_FORMATEUR;
if (!MDP || MDP.length < 12) { console.error('Définissez MDP_FORMATEUR (12 caractères minimum).'); process.exit(1); }

const RACINE = fileURLToPath(new URL('..', import.meta.url));
const SOURCE = join(RACINE, 'prive');
const CIBLE = join(RACINE, 'formateur', 'donnees');
const ITERATIONS = 600000;

// Titre de section selon le dossier, libellé selon le nom de fichier
const SECTIONS = { 'cours': 'Supports de cours', 'mission-1': 'Mission 1 · Brouillard sur le port', 'mission-2': 'Mission 2 · Sonder les quais', 'mission-3': 'Mission 3 · Les visages du quai' };
// Titres des cours (un nouveau cours sans titre ici s'affiche sous son nom de fichier)
const COURS = {
  'cours-0-etude-de-marche-les-bases.pptx': 'Cours 0 · Étude de marché : les bases',
  'cours-1-cadrer-une-etude.pptx': 'Cours 1 · Cadrer une étude',
  'cours-2-comprendre-la-demande-et-collecter.pptx': 'Cours 2 · Comprendre la demande et collecter',
  'cours-3-segmenter-cibler-persona.pptx': 'Cours 3 · Segmenter, cibler, persona',
};
function libelle(nom) {
  if (nom.startsWith('brouillon-')) return 'Brouillon corrigé (à charger dans le jeu : « Restaurer un brouillon »)';
  if (nom.includes('document-animateur')) return 'Document animateur';
  if (nom.includes('bonnes-reponses')) return 'Bonnes réponses';
  return COURS[nom] || nom;
}
const TYPES = { '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation', '.json': 'application/json' };

const sel = randomBytes(16);
const cle = pbkdf2Sync(MDP, sel, ITERATIONS, 32, 'sha256');
function chiffrer(donnees) {
  const iv = randomBytes(12);
  const c = createCipheriv('aes-256-gcm', cle, iv);
  return Buffer.concat([iv, c.update(donnees), c.final(), c.getAuthTag()]);
}

rmSync(CIBLE, { recursive: true, force: true });
mkdirSync(CIBLE, { recursive: true });

const manifeste = [];
for (const dossier of Object.keys(SECTIONS)) {
  let fichiers = [];
  try { fichiers = readdirSync(join(SOURCE, dossier)).sort(); } catch { continue; }
  for (const nom of fichiers) {
    const chemin = join(SOURCE, dossier, nom);
    if (!statSync(chemin).isFile()) continue;
    const id = randomBytes(8).toString('hex');
    writeFileSync(join(CIBLE, id + '.bin'), chiffrer(readFileSync(chemin)));
    manifeste.push({ section: SECTIONS[dossier], libelle: libelle(nom), nom, id, taille: statSync(chemin).size, type: TYPES[extname(nom)] || 'application/octet-stream' });
    console.log('chiffré :', dossier + '/' + nom);
  }
}
// manifeste.bin = sel (16 octets) + IV + contenu chiffré + étiquette
writeFileSync(join(CIBLE, 'manifeste.bin'), Buffer.concat([sel, chiffrer(Buffer.from(JSON.stringify(manifeste)))]));
console.log(manifeste.length + ' fichiers chiffrés dans formateur/donnees/');

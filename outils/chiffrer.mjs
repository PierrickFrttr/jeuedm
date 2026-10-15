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

// Jeux et sections, dans l'ordre d'affichage : dossier de prive/ → titres affichés
const JEUX = {
  'etude-de-marche': 'Studio Vigie – Étude de marché',
  'supply-chain': 'Cellule NOMAD – Supply chain',
};
const SECTIONS = {
  'etude-de-marche/cours': 'Supports de cours',
  'etude-de-marche/mission-1': 'Mission 1 · Brouillard sur le port',
  'etude-de-marche/mission-2': 'Mission 2 · Sonder les quais',
  'etude-de-marche/mission-3': 'Mission 3 · Les visages du quai',
  'supply-chain/cours': 'Supports de cours',
  'supply-chain/documents': 'Documents de séquence',
  'supply-chain/mission-1': 'Mission 1 · Point de rupture',
  'supply-chain/mission-2': 'Mission 2 · Le pari de la demande',
};
// Titres des fichiers (un fichier absent d'ici s'affiche sous son nom de fichier)
const TITRES = {
  'cours-0-etude-de-marche-les-bases.pptx': 'Cours 0 · Étude de marché : les bases',
  'cours-1-cadrer-une-etude.pptx': 'Cours 1 · Cadrer une étude',
  'cours-2-comprendre-la-demande-et-collecter.pptx': 'Cours 2 · Comprendre la demande et collecter',
  'cours-3-segmenter-cibler-persona.pptx': 'Cours 3 · Segmenter, cibler, persona',
  'cours-0-supply-chain.pptx': 'Cours 0 · Introduction à la supply chain',
  'seance-1-cours.pptx': 'Séance 1 · Cours (diaporama)',
  'seance-1-fondamentaux-supply-chain.docx': 'Séance 1 · Fondamentaux de la supply chain',
  'seance-2-prevision-sop.pptx': 'Séance 2 · Prévision et S&OP',
  'seance-3-achats-sourcing.pptx': 'Séance 3 · Achats et sourcing',
  'sequencage-supply-chain-24h.docx': 'Séquençage du module (24 h)',
};
function libelle(nom) {
  if (nom.startsWith('brouillon-')) return 'Brouillon corrigé (à charger dans le jeu : « Restaurer un brouillon »)';
  if (nom.includes('document-animateur')) return 'Document animateur';
  if (nom.includes('bonnes-reponses')) return 'Bonnes réponses';
  if (nom.includes('guide-formateur')) return 'Guide formateur (scénario, corrigé, animation)';
  return TITRES[nom] || nom;
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
    manifeste.push({ jeu: JEUX[dossier.split('/')[0]], section: SECTIONS[dossier], libelle: libelle(nom), nom, id, taille: statSync(chemin).size, type: TYPES[extname(nom)] || 'application/octet-stream' });
    console.log('chiffré :', dossier + '/' + nom);
  }
}
// manifeste.bin = sel (16 octets) + IV + contenu chiffré + étiquette
writeFileSync(join(CIBLE, 'manifeste.bin'), Buffer.concat([sel, chiffrer(Buffer.from(JSON.stringify(manifeste)))]));
console.log(manifeste.length + ' fichiers chiffrés dans formateur/donnees/');

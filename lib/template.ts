export type Facture = {
  numero: string;
  date: string;
  clientNom: string;
  clientAdresse: string;
  url: string;
  montant: string;
};

// Infos fixes de l'émetteur : à modifier ici si elles changent
const EMETTEUR = {
  nom: "YAMA",
  adresse: ["109 avenue Gilbert bergers", "93290 paris, France"],
  siret: "10201103800019",
  iban: "FR7616598000014000087522779",
  bic: "FPELFR21XXX",
  prestation: "montage vidéo",
};

export const esc = (s: unknown) =>
  String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string
  );

// accepte "ligne1\nligne2" ou "ligne1<br>ligne2"
const multiligne = (s: string) =>
  esc(s.replace(/<br\s*\/?>/gi, "\n").trim()).replace(/\r?\n/g, "<br>");

export function factureHtml(f: Facture): string {
  const m = esc(f.montant);
  return `<!DOCTYPE html>
<html lang="fr"><head><meta charset="utf-8"><title>Facture ${esc(f.numero)}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: Helvetica, Arial, sans-serif; color: #1a1a1a; margin: 0; padding: 48px 52px 0; font-size: 13px; }
  .top { display: flex; justify-content: space-between; align-items: flex-start; }
  .top h2 { margin: 0 0 6px; font-size: 20px; text-transform: uppercase; }
  .top p { margin: 0; color: #666; line-height: 1.5; }
  .right { text-align: right; }
  .title { display: flex; justify-content: space-between; align-items: flex-start; margin-top: 56px; }
  .title h1 { margin: 0 0 8px; font-size: 30px; }
  .title .sub { font-size: 15px; margin: 0 0 6px; }
  .title .url { color: #666; margin: 0; word-break: break-all; }
  table.lines { width: 100%; border-collapse: collapse; margin-top: 36px; }
  table.lines th { background: #b57be8; text-align: right; padding: 14px 16px; font-size: 12px; }
  table.lines th:first-child, table.lines td:first-child { text-align: left; }
  table.lines td { text-align: right; padding: 16px; border-bottom: 1px solid #e5e5e5; }
  .bottom { display: flex; justify-content: space-between; margin-top: 40px; gap: 40px; }
  .echeance { width: 46%; }
  .echeance .bar { background: #b57be8; padding: 12px 16px; font-weight: bold; }
  .echeance p { padding: 12px 16px; margin: 0; }
  .totaux { width: 40%; }
  .totaux div { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e5e5; font-weight: bold; }
  .totaux div:last-child { border-bottom: 0; }
  .legal, .paiement { font-size: 10.5px; color: #666; line-height: 1.6; }
  .legal { margin-top: 48px; }
  .paiement { margin-top: 24px; }
  .legal b, .paiement b { display: block; font-size: 12px; margin-bottom: 4px; color: #444; }
</style></head>
<body>
  <div class="top">
    <div><h2>${esc(EMETTEUR.nom)}</h2><p>${EMETTEUR.adresse.map(esc).join("<br>")}</p></div>
    <div class="right"><h2>${esc(f.clientNom)}</h2><p>${multiligne(f.clientAdresse)}</p></div>
  </div>
  <div class="title">
    <div>
      <h1>Facture ${esc(f.numero)}</h1>
      <p class="sub">${esc(EMETTEUR.prestation)}</p>
      <p class="url">${esc(f.url)}</p>
    </div>
    <div>Émise le ${esc(f.date)}</div>
  </div>
  <table class="lines">
    <thead><tr><th>Libelle</th><th>Unite</th><th>Quantite</th><th>Prix u. HT</th><th>TVA</th><th>Total HT</th></tr></thead>
    <tbody><tr><td>${esc(EMETTEUR.prestation)}</td><td></td><td>1</td><td>${m} €</td><td>0,00 %</td><td>${m} €</td></tr></tbody>
  </table>
  <div class="bottom">
    <div class="echeance"><div class="bar">Echeance de paiement</div><p>À réception.</p></div>
    <div class="totaux">
      <div><span>Total HT</span><span>${m} €</span></div>
      <div><span>TVA</span><span>0,00 €</span></div>
      <div><span>Total TTC</span><span>${m} €</span></div>
    </div>
  </div>
  <div class="legal"><b>Mentions légales</b>
    Pénalités de retard : taux légal en vigueur.<br>
    Indemnité forfaitaire pour frais de recouvrement : 40€.<br>
    ${esc(EMETTEUR.nom)} &nbsp;|&nbsp; SIRET : ${esc(EMETTEUR.siret)}
  </div>
  <div class="paiement"><b>Mode de paiement</b>
    IBAN : ${esc(EMETTEUR.iban)}<br>BIC : ${esc(EMETTEUR.bic)}
  </div>
</body></html>`;
}

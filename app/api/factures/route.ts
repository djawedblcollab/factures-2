import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";
import { timingSafeEqual } from "node:crypto";
import { esc, factureHtml, type Facture } from "../../../lib/template";

export const runtime = "nodejs";
export const maxDuration = 30;

const CHAMPS = ["numero", "date", "clientNom", "clientAdresse", "url", "montant"] as const;

function autorise(req: Request) {
  const attendu = Buffer.from(process.env.API_KEY ?? "");
  const recu = Buffer.from(req.headers.get("x-api-key") ?? "");
  return attendu.length > 0 && attendu.length === recu.length && timingSafeEqual(attendu, recu);
}

export async function POST(req: Request) {
  if (!autorise(req)) return new Response("Non autorisé", { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return new Response("JSON invalide", { status: 400 });
  }
  for (const k of CHAMPS) {
    if (body[k] === undefined || body[k] === null || String(body[k]).trim() === "") {
      return new Response(`Champ manquant : ${k}`, { status: 400 });
    }
  }
  const f = Object.fromEntries(CHAMPS.map((k) => [k, String(body[k]).trim()])) as Facture;
  const nomFichier = `Facture-${f.numero.replace(/[^\w-]/g, "")}.pdf`;

  const local = process.env.CHROME_PATH; // test local uniquement
  const browser = local
    ? await puppeteer.launch({ executablePath: local, headless: true })
    : await puppeteer.launch({
        args: await chromium.args,
        executablePath: await chromium.executablePath(),
        headless: "shell",
      });

  try {
    const page = await browser.newPage();
    await page.setContent(factureHtml(f), { waitUntil: "load" });
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: "<span></span>",
      footerTemplate: `<div style="width:100%;font-size:9px;color:#666;text-align:center;font-family:Helvetica,Arial,sans-serif">Facture ${esc(f.numero)} - <span class="pageNumber"></span>/<span class="totalPages"></span></div>`,
      margin: { top: "0", bottom: "14mm", left: "0", right: "0" },
    });

    return new Response(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${nomFichier}"`,
      },
    });
  } finally {
    await browser.close();
  }
}
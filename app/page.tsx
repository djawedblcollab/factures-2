export default function Page() {
  return (
    <main style={{ fontFamily: "system-ui, sans-serif", padding: 48 }}>
      <h1>API Factures</h1>
      <p>POST /api/factures (en-tête x-api-key requis) renvoie la facture en PDF.</p>
    </main>
  );
}

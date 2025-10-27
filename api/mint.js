export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const NETWORK = "base";
  const USDC = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"; 
  const PRICE = 1_000_000;
  const PAY_TO = "0x73d46d0a83D7a21bA47eFD643Ab616Ea41cE3f77"; 

  if (req.method === "GET") {
    return res.status(402).json({
      x402Version: 1,
      error: "Payment required: 1 USDC to mint Codex402 NFT.",
      accepts: [{
        schema: "exact",
        network: NETWORK,
        resource: USDC,
        maxAmountRequired: `${PRICE}`,
        description: "Mint Codex402 NFT on Base for 1 USDC",
        mimeType: "application/json",
        payTo: PAY_TO,
        maxTimeoutSeconds: 600,
        asset: "USDC"
      }],
      outputSchema: {
        input: { type: "http", method: "POST", bodyType: "json",
          bodyFields: {
            to: { type: "string", required: true },
            suffix: { type: "string", required: false, default: "0.json" }
          }
        },
        output: { txHash: "string", tokenId: "number", note: "string" }
      }
    });
  }


  if (req.method === "POST") {
    const { to, suffix = "0.json" } = req.body || {};
    return res.status(200).json({
      txHash: "", tokenId: -1,
      note: `Approve 1 USDC to your NFT contract, then call mint("${suffix}") from ${to}.`
    });
  }

  return res.status(405).json({ error: "Method not allowed" });
}

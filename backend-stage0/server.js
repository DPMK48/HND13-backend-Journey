// server.js
import express from "express";
import helmet from "helmet";
import cors from "cors";

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const CAT_FACT_URL = process.env.CAT_FACT_URL || "https://catfact.ninja/fact";
const EXTERNAL_TIMEOUT_MS = parseInt(process.env.EXTERNAL_TIMEOUT_MS || "3000", 10);

// fetch with timeout using AbortController
async function fetchWithTimeout(url, opts = {}, timeout = 3000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { ...opts, signal: controller.signal });
    clearTimeout(id);
    return res;
  } finally {
    clearTimeout(id);
  }
}

app.get("/me", async (req, res) => {

  const responseBody = {
    status: "success",
    user: {
      email: process.env.USER_EMAIL || "dorathypaul48@gmail.com",
      name: process.env.USER_NAME || "Dorathy Paul",
      stack: process.env.USER_STACK || "Node.js/Express"
    },
    timestamp: new Date().toISOString(),
    fact: null
  };

  // Try to fetch a cat fact
  try {
    const externalRes = await fetchWithTimeout(CAT_FACT_URL, {}, EXTERNAL_TIMEOUT_MS);
    if (!externalRes.ok) throw new Error(`Cat facts API responded ${externalRes.status}`);
    const data = await externalRes.json();
    responseBody.fact = data.fact ?? "No fact available from upstream";
    
    return res.status(200).json(responseBody);
  } catch (err) {
    console.error("Failed to fetch cat fact:", err?.message ?? err);

    responseBody.fact = process.env.FALLBACK_FACT || "Could not fetch a cat fact right now — try again shortly.";
    res.setHeader("X-Upstream-Error", "CatFactFetchFailed");
    return res.status(200).json(responseBody);
  }
});

// Basic health check
app.get("/health", (req, res) => res.status(200).json({ status: "ok", timestamp: new Date().toISOString() }));

// start
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

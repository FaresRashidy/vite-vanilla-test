import express from "express";
import { fetchVideoData } from "./scraper.js";

const app = express();
app.use(express.json());

app.post("/api/scrape", async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res
      .status(400)
      .json({ success: false, error: "Missing URL in request body" });
  }

  try {
    const data = await fetchVideoData(url);
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Scraper error:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch video data" });
  }
});

// For Vercel, export as default a function that handles (req, res)
export default app;

import express from "express";
import { fetchVideoData } from "../api/scraper.js"; // Your scraper function

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Add JSON body parsing middleware at the top before routes:
app.use(express.json());

// 2. Your API route with improved error handling and logging:
app.post("/api/scrape", async (req, res) => {
  const { url } = req.body;

  // Validate input
  if (!url) {
    return res
      .status(400)
      .json({ success: false, error: "Missing URL in request body" });
  }

  try {
    const data = await fetchVideoData(url);
    res.json({ success: true, data });
  } catch (error) {
    console.error("Scraper error:", error); // Log full error to server console
    res.status(500).json({ success: false, error: error.message });
  }
});

// ... rest of your server setup (static files, catch-all route, etc.)

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

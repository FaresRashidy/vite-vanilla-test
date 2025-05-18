// src/worker.js
import { ttdl } from "ruhend-scraper";

self.onmessage = async (event) => {
  const { url } = event.data;
  try {
    const data = await ttdl(url);
    self.postMessage({ success: true, data });
  } catch (error) {
    self.postMessage({ success: false, error: error.message });
  }
};

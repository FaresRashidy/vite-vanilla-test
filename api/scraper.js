import { ttdl } from "ruhend-scraper";

export async function fetchVideoData(url) {
  return await ttdl(url);
}

// proxy.mjs (ES Module)
export async function getVideoData(url) {
  const module = await import(/* @vite-ignore */ "./worker.js");
  return module.default(url); // Use `default` because CommonJS is imported as a default export
}

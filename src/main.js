import "./style.css";

document
  .querySelector("#downloadButton")
  .addEventListener("click", async () => {
    const url = document.querySelector("#urlInput").value.trim();
    const output = document.querySelector("#output");
    const loading = document.querySelector("#loading");

    if (!url) {
      output.innerHTML =
        "<p class='text-red-500'>Please enter a valid URL.</p>";
      return;
    }

    output.innerHTML = "";
    loading.classList.remove("hidden");

    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const result = await response.json();

      if (result.success) {
        const data = result.data;

        // Sanitize the title for filename use
        const safeTitle = data.title
          .replace(/[\\/:"*?<>|]+/g, "_")
          .slice(0, 100);

        output.innerHTML = `
        <p class='text-green-500 mb-2'>${data.title}</p>
        <button id="downloadHD" class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded mr-2">
          Download HD Video
        </button>
        <button id="downloadNormal" class="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded">
          Download Video
        </button>
      `;

        function downloadFile(url, filename) {
          fetch(url, { mode: "cors" })
            .then((response) => response.blob())
            .then((blob) => {
              const blobUrl = window.URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.style.display = "none";
              a.href = blobUrl;
              a.download = filename;
              document.body.appendChild(a);
              a.click();
              window.URL.revokeObjectURL(blobUrl);
              a.remove();
            })
            .catch(() => {
              // fallback if fetch fails (e.g., CORS)
              const a = document.createElement("a");
              a.href = url;
              a.download = filename;
              document.body.appendChild(a);
              a.click();
              a.remove();
            });
        }

        document.querySelector("#downloadHD").addEventListener("click", () => {
          downloadFile(
            data.video_hd,
            `${safeTitle.split("#")[0].slice(0, -1)}_HD.mp4`
          );
        });

        document
          .querySelector("#downloadNormal")
          .addEventListener("click", () => {
            downloadFile(
              data.video,
              `${safeTitle.split("#")[0].slice(0, -1)}_SD.mp4`
            );
          });
      } else {
        output.innerHTML = `<p class='text-red-500'>Error: ${result.error}</p>`;
      }
    } catch (error) {
      output.innerHTML = `<p class='text-red-500'>Unexpected error: ${error.message}</p>`;
    } finally {
      loading.classList.add("hidden");
    }
  });

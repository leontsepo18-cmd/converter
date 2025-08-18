const dropArea = document.getElementById("drop-area");
const fileInput = document.getElementById("fileInput");
const uploadBtn = document.getElementById("uploadBtn");
const status = document.getElementById("status");

let selectedFile = null;

// Open file dialog on click
dropArea.addEventListener("click", () => fileInput.click());

// Handle file selection
fileInput.addEventListener("change", (e) => {
  selectedFile = e.target.files[0];
  dropArea.innerHTML = `<p>${selectedFile.name}</p>`;
});

// Drag and drop events
dropArea.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropArea.classList.add("highlight");
});

dropArea.addEventListener("dragleave", () => {
  dropArea.classList.remove("highlight");
});

dropArea.addEventListener("drop", (e) => {
  e.preventDefault();
  dropArea.classList.remove("highlight");
  selectedFile = e.dataTransfer.files[0];
  dropArea.innerHTML = `<p>${selectedFile.name}</p>`;
});

// Upload file to backend
uploadBtn.addEventListener("click", async () => {
  if (!selectedFile) {
    status.textContent = "Please select or drop a file first.";
    return;
  }

  const formData = new FormData();
  formData.append("file", selectedFile);

  status.textContent = "Converting...";

  try {
    const response = await fetch("/upload", {
      method: "POST",
      body: formData
    });

    if (!response.ok) throw new Error("Conversion failed");

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "converted.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();

    status.textContent = "Conversion complete! PDF downloaded.";
  } catch (err) {
    console.error(err);
    status.textContent = "Error converting file.";
  }
});

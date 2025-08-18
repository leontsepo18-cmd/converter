uploadBtn.addEventListener("click", () => {
  if (!selectedFile) {
    status.textContent = "Please select or drop a file first.";
    return;
  }

  const formData = new FormData();
  formData.append("file", selectedFile);

  const xhr = new XMLHttpRequest();
  xhr.open("POST", "/upload");

  const progressContainer = document.getElementById("progressContainer");
  const progressBar = document.getElementById("progressBar");

  // Reset progress bar
  progressBar.style.width = "0%";
  progressContainer.style.display = "block";
  status.textContent = "Uploading...";

  // Track upload progress
  xhr.upload.onprogress = (e) => {
    if (e.lengthComputable) {
      const percent = (e.loaded / e.total) * 100;
      progressBar.style.width = `${percent}%`;
      status.textContent = `Uploading... ${Math.round(percent)}%`;
    }
  };

  // On complete
  xhr.onload = () => {
    if (xhr.status === 200) {
      const blob = new Blob([xhr.response], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "converted.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();

      status.textContent = "Conversion complete! PDF downloaded.";
    } else {
      status.textContent = "Error converting file.";
    }

    progressContainer.style.display = "none";
  };

  xhr.onerror = () => {
    status.textContent = "Upload failed.";
    progressContainer.style.display = "none";
  };

  xhr.responseType = "blob";
  xhr.send(formData);
});

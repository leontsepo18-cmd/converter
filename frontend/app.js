async function convertToPDF() {
  const text = document.getElementById("textInput").value;
  const fileInput = document.getElementById("fileInput").files[0];

  const formData = new FormData();
  if (fileInput) formData.append("file", fileInput);
  if (text) formData.append("text", text);

  const response = await fetch("/convert", {
    method: "POST",
    body: formData
  });

  if (response.ok) {
    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "document.pdf";
    link.click();
  } else {
    alert("Error converting file.");
  }
}

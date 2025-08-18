const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('uploadBtn');

let selectedFile = null;

// Handle file input change
fileInput.addEventListener('change', (e) => {
  selectedFile = e.target.files[0];
});

// Drag & Drop events
dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('dragover');
  if (e.dataTransfer.files.length > 0) {
    selectedFile = e.dataTransfer.files[0];
    fileInput.files = e.dataTransfer.files; // sync with input
  }
});

// Upload button click
uploadBtn.addEventListener('click', async () => {
  if (!selectedFile) {
    alert('Please select or drop a file first.');
    return;
  }

  const formData = new FormData();
  formData.append('file', selectedFile);

  try {
    const response = await fetch('/upload', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'converted.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } else {
      alert('Failed to convert file.');
    }
  } catch (err) {
    console.error(err);
    alert('Error uploading file.');
  }
});

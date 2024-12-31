document.addEventListener('DOMContentLoaded', () => {
    const uploadInput = document.getElementById('uploadInput');
    const preview = document.getElementById('preview');
    const removeBtn = document.getElementById('removeBtn');
    const resultSection = document.getElementById('resultSection');
    const originalImage = document.getElementById('originalImage');
    const processedImage = document.getElementById('processedImage');
    const downloadBtn = document.getElementById('downloadBtn');
    const uploadArea = document.querySelector('.upload-area');

    let uploadedFile = null;

    // Handle file input change
    uploadInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        handleFile(file);
    });

    // Drag and Drop Handlers
    uploadArea.addEventListener('dragover', (event) => {
        event.preventDefault();
        uploadArea.classList.add('dragging');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragging');
    });

    uploadArea.addEventListener('drop', (event) => {
        event.preventDefault();
        uploadArea.classList.remove('dragging');
        const file = event.dataTransfer.files[0];
        handleFile(file);
    });

    // Function to handle file preview and enabling the remove button
    function handleFile(file) {
        if (file && file.type.startsWith('image/')) {
            uploadedFile = file;
            const reader = new FileReader();
            reader.onload = (e) => {
                preview.innerHTML = `<img src="${e.target.result}" class="img-fluid rounded mt-2" alt="Preview">`;
                removeBtn.disabled = false;
            };
            reader.readAsDataURL(file);
        } else {
            alert('Please upload a valid image file.');
        }
    }

    // Remove background (Mock functionality)
    removeBtn.addEventListener('click', () => {
        if (uploadedFile) {

            // Show original image
            originalImage.src = URL.createObjectURL(uploadedFile);

            // reset preview
            preview.innerHTML = "<img src=''>";
            
            // Simulate processing and show processed image
            setTimeout(() => {
                processedImage.src = URL.createObjectURL(uploadedFile); // Replace this with backend result
                downloadBtn.href = URL.createObjectURL(uploadedFile);  // Replace with processed image URL
                resultSection.classList.remove('d-none');
            }, 1000);
        }
    });
});

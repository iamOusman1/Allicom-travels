document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("tourUpload");
  const submitBtn = document.getElementById("submitBtn");
  const imageInput = document.getElementById("selectedImage");
  const previewImages = document.getElementById("preview-images");
  const previewBtn = document.querySelector(".preview-btn");
  const previewSection = document.querySelector(".preview-section");
  const closePreviewBtn = document.createElement("button");
  closePreviewBtn.textContent = "Close Preview";
  closePreviewBtn.style.display = "block";
  closePreviewBtn.style.marginTop = "10px";
  closePreviewBtn.addEventListener("click", () => {
    previewSection.style.display = "none";
  });
  previewSection.appendChild(closePreviewBtn);
  const loadingOverlay = document.querySelector(".overlay");
  const token = localStorage.getItem("authToken");
  const apiUrl = "https://api.allicomtravels.com/tour/tourism-site/";

  // Function to show loading state
  function showLoading(state) {
    loadingOverlay.style.display = state ? "block" : "none";
  }

  // Validate form fields before submission
  function validateForm() {
    let isValid = true;
    const fields = ["city", "country", "desc", "duration", "price", "ageLimit"];
    fields.forEach((field) => {
      const input = document.getElementById(field);
      if (!input.value.trim()) {
        isValid = false;
      } else {
      }
    });

    if (imageInput.files.length > 4) {
      isValid = false;
      alert("Please upload between 1 to 4 images.");
    }

    submitBtn.disabled = !isValid;
    return isValid;
  }

  // Handle image preview
  imageInput.addEventListener("change", () => {
    imageInput.setAttribute("multiple", "true");
    imageInput.setAttribute("accept", "image/*");
    imageInput.setAttribute("accept", "image/*");
    previewImages.innerHTML = "";
    Array.from(imageInput.files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement("img");
        img.src = e.target.result;
        img.style.width = "100px";
        img.style.margin = "5px";
        previewImages.appendChild(img);
      };
      reader.readAsDataURL(file);
    });
    validateForm();
  });

  form.addEventListener("input", validateForm);

  previewBtn.addEventListener("click", (event) => {
    event.preventDefault();
    document.getElementById("preview-city").textContent =
      document.getElementById("city").value;
    document.getElementById("preview-country").textContent =
      document.getElementById("country").value;
    document.getElementById("preview-title").textContent =
      document.getElementById("title").value;
    document.getElementById("preview-desc").textContent =
      document.getElementById("desc").value;
    document.getElementById("preview-price").textContent =
      "N " + document.getElementById("price").value;
    document.getElementById("preview-ageLimit").textContent =
      document.getElementById("ageLimit").value;
    document.getElementById("preview-duration").textContent =
      document.getElementById("duration").value + " hours";

    const availableDays = [];
    document.querySelectorAll(".tour-radio:checked").forEach((input) => {
      availableDays.push(input.value);
    });
    document.getElementById("preview-available-days").textContent =
      availableDays.join(", ");

    previewSection.style.display = "block";
  });

  submitBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    submitBtn.disabled = true;
    showLoading(true);

    const formData = new FormData();
    formData.append("city", document.getElementById("city").value);
    formData.append("country", document.getElementById("country").value);
    formData.append("description", document.getElementById("desc").value);
    formData.append("duration", document.getElementById("duration").value);
    formData.append("price", document.getElementById("price").value);
    formData.append("age_limit", document.getElementById("ageLimit").value);

    // Handle Available Days
    const availableDays = [];
    document.querySelectorAll(".tour-radio:checked").forEach((input) => {
      availableDays.push({
        day_of_week: input.dataset.day.toLowerCase(),
        is_open: true,
      });
    });
    formData.append("available_days", JSON.stringify(availableDays));

    // Handle Image Uploads
    Array.from(imageInput.files).forEach((file) => {
      formData.append("uploaded_images", file);
    });

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Token ${token.replace("Token ", "").trim()}`,
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        alert("Tour uploaded successfully!");
        form.reset();
        previewImages.innerHTML = "";
      } else {
        const errorData = await response.json();
        alert("Error: " + JSON.stringify(errorData));
      }
    } catch (error) {
      alert("Network error. Please try again.");
    } finally {
      submitBtn.disabled = false;
      showLoading(false);
    }
  });
});

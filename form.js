const apiUrl = "https://api.allicomtravels.com/tour/tourism-site/";

document.getElementById("tourUpload").addEventListener("submit", async function(event) {
  event.preventDefault();

  const formData = new FormData();
  formData.append("city", document.getElementById("city").value);
  console.log("city:", document.getElementById("city").value)
  formData.append("country", document.getElementById("country").value )
  formData.append("description", document.getElementById("desc").value )
  formData.append("price", document.getElementById("price").value )
  formData.append("age_limit", document.getElementById("ageLimit").value )

  const imageInput = document.getElementById("selectedImage").files[0];
  if(imageInput) {
    formData.append("uploaded_images", imageInput);
  }

  const availableDays = [];
  document.querySelectorAll(".tour-radio").forEach((checkbox) => {
    availableDays.push({
      day_of_week: checkbox.getAttribute("data-day"),
      is_open: checkbox.checked
    })
  })
  formData.append("available_days", JSON.stringify(availableDays))
  formData.append("duration", document.getElementById("duration").value );

  const authToken = localStorage.getItem("authToken") || "PASTE YOUR GENERATED TOKEN HERE"


  // const crsfToken = document.cookie
  // .split(": ")
  // .find(row => row.startsWith("crsfToken="))
  // ?.split("=")[1];

  const headers = {
    "Authorization": `Bearer ${authToken}`,
    "Accept": "application/json",
    // "X-CSRFTOKEN": crsfToken || "FBbyn7ctD06tHvMMe4RSCmCdiELxQUpugRLELs89TNcBiXfyg7rdduhfYdm6qjMK"
}

  console.log("submitting form with headers:", headers);
  console.log("submitting form with data:", Object.fromEntries(formData));


  fetch( apiUrl, {
    method: "POST",
    headers: headers,
    body: formData
})
.then(response => {
    if(!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
    }
    return response.json();
})
.then(data => {
    console.log("Form Submitted successful:", data);
    alert("Form Submitted Successful")
})
.catch(error => {
    console.error("Error:", error);
    // alert("Error submitting Form")
})

})





// FORM PREVIEW SECTION
const previewBtn = document.querySelector('.preview-btn');
const previewSection = document.querySelector('.preview-section');
const previewCity = document.getElementById('preview-city')
const previewCountry = document.getElementById('preview-country')
const previewTitle = document.getElementById('preview-title')
const previewDesc = document.getElementById('preview-desc')
const previewPrice = document.getElementById('preview-price')
const previewAge = document.getElementById('preview-ageLimit')
// const previewMaxAge = document.getElementById('preview-maxAge')
const previewImage = document.getElementById('preview-images')
const previewDuration = document.getElementById('preview-duration')
const submitBtn = document.querySelector('.submitBtn')
const overlay = document.querySelector('.overlay');
const previewAvailableDays = document.getElementById("preview-available-days")


// show preview
previewBtn.addEventListener('click',  (event) => {

  event.preventDefault()
    const city = document.getElementById("city").value;
    const country = document.getElementById('country').value;
    const desc = document.getElementById('desc').value;
    const price = document.getElementById('price').value;
    const ageLimit = document.getElementById('ageLimit').value;
    // const minAge = document.getElementById('minAge').value;
    // const maxAge = document.getElementById('maxAge').value;
    const duration = document.getElementById('duration').value
    const selectedImage = document.getElementById('selectedImage').value;
    const availableDays = document.querySelectorAll("input[name='day']");

    availableDays.forEach(checkbox => {
      checkbox.addEventListener("change", () => {
        let selectedDays = Array.from(availableDays)
                                .filter(cb => cb.checked)
                                .map(cb => cb.value)
                                // .join(", ");

        previewAvailableDays.textContent = selectedDays.length ? selectedDays.join(", "): ""; 

        document.getElementById("submitBtn").disabled = false;
      })
    })


  // Set preview values
previewCity.textContent = city;
previewCountry.textContent = country;
previewDesc.textContent = desc;
previewPrice.textContent = price;
previewAge.textContent = ageLimit;
// previewMinAge.textContent = minAge;
// previewMaxAge.textContent = maxAge;
previewDuration.textContent = duration;

previewImage.textContent = selectedImage;

if (!city || !country || !desc || !price || !ageLimit || !selectedImage) {
    alert('Please fill out all fields')
}

// show preview
previewSection.style.display = 'block'
overlay.style.display = 'block';
});

// submitBtn.addEventListener('click', () => {
//   alert("Form Submitted");
//   form.reset();
//   previewSection.style.display = 'none'
// })

overlay.addEventListener('click', () => {
  previewSection.style.display = 'none'
  overlay.style.display = 'none'
})


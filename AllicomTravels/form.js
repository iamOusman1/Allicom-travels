// FORM PREVIEW SECTION
const previewBtn = document.querySelector('.preview-btn');
const previewSection = document.querySelector('.preview-section');
const previewCity = document.getElementById('preview-city')
const previewCountry = document.getElementById('preview-country')
const previewDesc = document.getElementById('preview-desc')
const previewPrice = document.getElementById('preview-price')
const previewAge = document.getElementById('preview-age')
const submitBtn = document.querySelector('.submitBtn')
const overlay = document.querySelector('.overlay');


// show preview
previewBtn.addEventListener('click',  (event) => {

  event.preventDefault()
    const city = document.getElementById("city").value;
    const country = document.getElementById('country').value;
    const desc = document.getElementById('desc').value;
    const price = document.getElementById('price').value;
    const age = document.getElementById('age').value;

  // Set preview values
previewCity.textContent = city;
previewCountry.textContent = country;
previewDesc.textContent = desc;
previewPrice.textContent = price;
previewAge.textContent = age;

if (!city || !country || !desc || !price || !age) {
    alert('Please fill out all fields')
}

// show preview
previewSection.style.display = 'block'
overlay.style.display = 'block';
});

submitBtn.addEventListener('click', () => {
  alert("Form Submitted");
  form.reset();
  previewSection.style.display = 'none'
})

overlay.addEventListener('click', () => {
  previewSection.style.display = 'none'
  overlay.style.display = 'none'
})


// HAMBURGER
const hamburger = document.getElementById("hamburger");
const navLinks = document.querySelector(".nav-links");

hamburger.addEventListener("click", e => {
    navLinks.classList.toggle("active");
})


// IMAGE GALLERY SECTION
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('.slide');
    let currentIndex = 0;

    function showImage(index) {
        images.forEach(img => img.classList.remove('active'));
        images[index].classList.add('active');
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % images.length;
        showImage(currentIndex);
    }

    // Set interval for automatic sliding , Change image every 5 seconds
    setInterval(nextImage, 5000);
});
// END


function searchTourism() {
    
    const searchInput = document.getElementById("searchInput").value.trim();
    const dateInput = document.getElementById("date").value

    
    if (!searchInput || !dateInput) {
        alert("Please fill all details")
        return;
    }

    // convert date to days of week
    const daysOfWeek = new Date(dateInput).toLocaleString('en-US', {weekday: 'long'});

    let city = "";
    let country = "";

    if (searchInput.includes(",")) {
        const parts = searchInput.split(",").map(part => part.trim());
        city = parts[0] ;
        country = parts[1];
    } else {
        city = searchInput;
        country = getCountryByCity(city)
    }

    document.getElementById("loaderOverlay").style.display = "flex"


    const apiUrl = `https://api.allicomtravels.com/tour/get-available-tourism-site/?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&day_of_week=${encodeURIComponent(daysOfWeek)}`;

    fetch( apiUrl, {
        method: 'GET',
        headers: {
            "Accept": "application/json"
        }
    })
    .then(response => {
        if(!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
            
        }
        return response.json();
    })
    .then(data => {
        console.log("API Response:", data)

        const resultList = document.getElementById("results")
        resultList.innerHTML = "";

         document.getElementById("loaderOverlay").style.display = "none"


        if(!data.results || data.results.length === 0) {
            resultList.innerHTML = `<li class="noTours">No tours available for this date<li>`;
            return;
        }

        if (data.error) {
            console.error("Error:", data.error);
            resultList.innerHTML = `<li>Error: ${data.error}</li>`
            return;

        } else {
            console.log("Tourism Details:", data)
        }

        if (!document.querySelector(".tour-header")) {
            const header = document.createElement("h1")
            header.textContent = "Available Tours";
            header.classList.add("tour-header")
            resultList.appendChild(header)
        }

         // display the available tourism site
        data.results.forEach((tour, index )=> { 
        const resultDiv = document.createElement('div');
        resultDiv.classList.add("tour-result");

        tourImages[index] = tour.images.map(img => img.image);
        console.log(`Tour ${index} images:`, tourImages[index])

        // get first image for the gallery
        let firstImage = tourImages[index].length > 0 ? tourImages[index][0] : "";

        // add image to image gallery
        let imageGallery = tourImages[index].length > 0
            ? `
            <div class="image-gallery">
                <button class="prev-btn" onclick="changeImage(${index}, -1)">&#10094;</button>
                <img src="${firstImage}" id="image-${index}" alt="Tour Image" class="tour-image">
                <button class="next-btn" onclick="changeImage(${index}, 1)">&#10095;</button>
            </div>
            `
            : `<p>No images available`;


        resultDiv.innerHTML = `
            
            ${imageGallery}
            <p><strong>Title:</strong> ${tour.title}</p>
            <p><strong>City:</strong> ${tour.city}</p>
            <p><strong>Country:</strong> ${tour.country}</p>
            <p><strong>Price:</strong>NGN ${tour.price}</p>
            <p><strong>Duration:</strong> ${tour.duration} hours</p>
            <p><strong>Description:</strong> ${tour.description}</p>
            <p><strong>Min Age:</strong> ${tour.age_limit}</p>
            <p><strong>Available days:</strong> ${tour.availability_days.map(day => day.day_of_week).join(", ")}</p><br>
           <center><a href="bookingtour.html?id=${tour.id}" class="book-now" '>Book Now</a></center>
            
        `
        resultList.appendChild(resultDiv)
    });
    
        
    })

    .catch(error => {
        console.error("Error fetching tourism details:", error);
        alert("Failed to fetch data. Please try again.")
        location.reload()

        document.getElementById("loaderOverlay").style.display = "none"

    })
}

document.getElementById('searchTour').addEventListener('click', function () {
    document.getElementById('noDisplay').style.display = "none";
   })


   function getCountryByCity(city) {
    const cityToCountry =  {
        "Lagos": "Nigeria",
        "Abuja": "Nigeria",
        "Accra": "Ghana",
        "Mombasa": "Kenya",
        "Nairobi": "Kenya",
        "Kigali": "Rwanda",
        "Nairobi": "Kenya",
        "Dar Salam": "Tanzani",
        "Zanzibar": "Tanzania",
        "Seychelles": "Africa",
        "Mauldive": "Africa",
        "Uganda": "Africa",
        "Mauritius": "Africa",
        "Morocco": "Africa",
        "Namibia": "Africa",
        "South Africa": "Africa",
        "Morocco": "Africa",
        "Gambia": "Africa"
    }

    return cityToCountry[city] || "";
   }

//    store image for each tour
let tourImages = {};

// function to change image in gallery
function changeImage(tourIndex, direction) {
    const imgElement = document.getElementById(`image-${tourIndex}`);
    const images = tourImages[tourIndex];

    if(!imgElement || !images || images.length === 0) return;

    let currentImageUrl = imgElement.src
    // currentImageUrl = currentImageUrl.split("? ")[0];
    console.log("Current image url:", currentImageUrl)
    console.log("Available image:", images)

    let currentIndex = images.findIndex(imgUrl => imgUrl === currentImageUrl);


    if(currentIndex === -1) currentIndex = 0;

    let newIndex = (currentIndex + direction + images.length) % images.length;

    // let newIndex = currentIndex + direction;

    // if(newIndex < 0) newIndex = images.length - 1
    // if(newIndex >= images.length) newIndex = 0

    imgElement.src = images[newIndex];
    console.log(`Tour ${tourIndex}: Switched to image ${newIndex}: ${imgElement.src}`)
}
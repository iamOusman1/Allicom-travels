// const API_URL = "https://cors-anywhere.herokuapp.com/https://api.allicomtravels.com/tour/get-available-tourism-site/?city=string&country=string&days-of-week=monday";

// async function getTourismFlight() {
    
//     try {
//         const response = await fetch(API_URL, {
//             headers: {
//                 accept: "application/json",
//             },   
//         });
//         if(!response.ok) {
//             throw new Error("Failed to fetch data");
//         }
//         const data = await response.json(); 
//         const container = document.querySelector(".result");

//         container.innerHTML = ""

//         if(!data.results || data.results.length === 0) {
//             container.innerHTML = '<p>No tourism site available right now</p>'
//             return;
//         }

//         data.results.forEach((site) => {
//             const card = `
//                 <div>
//                     <img src = ${
//                         site.image || "https://via.placeholder.com/150"
//                     } alt="image of ${site.city}"
//                     <h3>${site.city}, ${site.country}</h3>
//                     <p>${site.description || "No description available."}</p>
//                     <p>${site.price || "N/A"}</p>
//                 </div>
//             `;

//             container.innerHTML += card
//         });

//     } catch (error) {
//         console.error("Error fetching tourism site:", error) // <div class="image-gallery">${imageHtml}</div>
//     }
// }

// getTourismFlight();


// HAMBURGER
const hamburger = document.getElementById("hamburger");
const navLinks = document.querySelector(".nav-links");

hamburger.addEventListener("click", e => {
    navLinks.classList.toggle("active");
})



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


    // console.log("Fetching:", apiUrl)

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
            <p><strong>City:</strong> ${tour.city}</p>
            <p><strong>Country:</strong> ${tour.country}</p>
            <p><strong>Price:</strong>NGN ${tour.price}</p>
            <p><strong>Duration:</strong> ${tour.duration} hours</p>
            <p><strong>Description:</strong> ${tour.description}</p>
            <p><strong>Age Range:</strong> ${tour.age_limit}</p>
            <p><strong>Available days:</strong> ${tour.availability_days.map(day => day.day_of_week).join(", ")}</p>
           <center><button class="book-now">Book Now</button></center>
            
        `
    console.log("Tour images", tour.images)

        resultList.appendChild(resultDiv)
    });
    
        
    })

    .catch(error => {
        console.error("Error fetching tourism details:", error);
        alert("Failed to fetch data. Please try again.")
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
        "Lagos": "Nigeria",
        "Kigali": "Rwanda",
        "Nairobi": "Kenya",
        "Dar Salam": "Tanzani",
        "Zanzibar": "Tanzania"
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

    let currentIndex = images.indexOf(imgElement.src);
    let newIndex = currentIndex + direction;

    if(newIndex < 0) newIndex = images.length - 1
    if(newIndex >= images.length) newIndex = 0

    imgElement.src = images[newIndex];
}
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
//         console.error("Error fetching tourism site:", error)
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

    const city = document.getElementById("city").value;
    const country = document.getElementById("city").value;
    const dateInput = document.getElementById("date").value
    
    if (!city || !dateInput) {
        alert("Please fill all details")
        return;
    }

    // convert date to days of week
    const daysOfWeek = new Date(dateInput).toLocaleString('en-US', {weekday: 'long'});

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

        if(!data || data.length === 0) {
            resultList.innerHTML = "<li>No tours available for this date<li>";
            return;
        }

        if (data.error) {
            console.error("Error:", data.error);
            resultList.innerHTML = `<li>Error: ${data.error}</li>`
            return;

        } else {
            console.log("Tourism Details:", data)
        }

         // display the available tourism site
        data.forEach(tour => {
        const resultDiv = document.createElement('div');
        resultDiv.textContent = `${tour.name} - ${tour.description}`;
        resultList.appendChild(resultDiv)
    });
        
    })

    .catch(error => {
        console.error("Error fetching tourism details:", error);
        alert("Failed to fetch data. Please try again.")
    })
}
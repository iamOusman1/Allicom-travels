const hamburger = document.getElementById("hamburger");
const navLinks = document.querySelector(".nav-links");

hamburger.addEventListener("click", e => {
    navLinks.classList.toggle("active");
})

// SEARCH API
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchBtn");
const resultContainer = document.getElementById("resultContainer");
const resultList = document.getElementById(".resultList") 

// console.log(searchButton)




const city = 'Lagos';
const country = 'Nigeria';
const dayOfWeek = 'Wednesday';
const page = 1;

const apiUrl = `https://cors-anywhere.herokuapp.com/https://api.allicomtravels.com/tour/get-available-tourism-site/?city=${city}&country=${country}&day_of_week=${dayOfWeek}%20&page=${page}`;

// API function
async function fetchSearchResult() {
    try {
        const response = await fetch(apiUrl, {
            headers: {
                accept: "application/json",
            },
        })
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error("Error fetching data:", error);
        return[];
    }
}

// Eventlistener for search button
searchButton.addEventListener("clcik", async () => {
    const query = searchInput.ariaValueMax.trim();
    if (!query) {
        alert("Please enter a search term!");
        return;
    }
})

// const results = await fetchSearchResult(query);

if(results.length > 0) {
    resultList.innerHTML = ""
    results.forEach((result) => {
        const div = document.createElement("div")
        div.classList.add("result-item");
        div.textContent = result.city || result.country || result.dayOfWeek
        resultList.appendChild(div)
    });

    resultContainer.style.display ="block";
}else {
    resultList.innerHTML = "<p>No result found</p>";
    resultContainer.style.display = "block";
}





























// katthy134 
// fetch (apiUrl, {
//     method: "GET",
//     headers: {
//         "accept": "application/json"
//     }
// })
// .then(response => {
//     if(!response.ok) {
//         throw new Error('HTTP error! status: ${response.status}');
//     }
//     return response.json()
// })
// .then(data => {
//     console.log("API Response:", data);
// })
// .catch(error => {
//     console.error("Error:", error)
// })





// `https://api.allicomtravels.com/tour/get-available-tourism-site/?city=${city}&country=${country}&day_of_week=${dayOfWeek}%20&page=${page}`;

// https://api.allicomtravels.com/tour/get-available-tourism-site/${encodeURIComponent(city)}/${encodeURIComponent(country)}/${encodeURIComponent(dayOfWeek)}?&page=${page}

    // fetch ("https://api.allicomtravels.com/tour/get-available-tourism-site/?city=Lagos&country=Nigeria&day_of_week=Wednesday%20&page=1" )

    // curl -X 'GET' \
    //         "https://api.allicomtravels.com/tour/get-available-tourism-site/?city=Lagos&country=Nigeria&day_of_week=Wednesday%20&page=1" \
    //         -H 'accept: application/json'
    //     .then(response => console.log(response))
    //     .catch(error => console.error(error));


// https://cors-anywhere.herokuapp.com/
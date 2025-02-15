const hamburger = document.getElementById("hamburger");
const navLinks = document.querySelector(".nav-links");

hamburger.addEventListener("click", e => {
    navLinks.classList.toggle("active");
})

// API


// function formatDate(inputDate) {
//     if(!/^\d{2}\/\d{2}\/\d{4}$/.test(inputDate)) {
//         throw new Error("Date format must be DD/MM/YYYY")
//     }
//     const [day, month, year] = inputDate.split("/");
//     return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
// }


    // iatacode function
    async function getIATACode(cityName) {
        try {
            const token = await getAccessToken();

            const response = await fetch(`https://test.api.amadeus.com/v1/reference-data/locations?subType=CITY&keyword=${cityName}`, {
                method: "GET",
                headers: {"Authorization": `Bearer ${token}` }
            });
            const data = await response.json();

            if (data.data && data.length > 0) {
                return data.data[0].iataCode
            } else {
                console.error("no IATA code found for:", cityName);
               return null
            }
        } catch (error) {
            console.error("Error fetching IATA code:", error);
            return null
        }
    }
    // end


document.getElementById('flightForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const departureInput = document.getElementById("departure-city").value;
    const arrivalInput = document.getElementById("arrival-city").value;
    const departureDateInput = document.getElementById("departure-date").value;
    const arrivalDateInput = document.getElementById("arrival-date").value;
    const adultNo = document.getElementById("adult-no").value || 1;
    const childNo = document.getElementById("child-no").value || 0;
    const infant = document.getElementById("infant-no").value || 0;
    const services = document.getElementById("services").value;
    const fullName = document.getElementById("fullname").value;
    const email = document.getElementById("email").value;
    const mobileNo = document.getElementById("mobile-no").value;

    let currentPage = 1;
    const resultsPerPage = 10;

    // convert date to required format
    // const departureDateFormatted = formatDate(departureDateInput)
    // const arrivalDateFormatted = formatDate(arrivalDateInput);

    console.log("Raw Departure Date:", departureDateInput)
    // console.log("Formatted Departure Date:", departureDateFormatted)

    // convert city name to iata code
    const departureCode = departureInput.length === 3 ? departureInput.toUppercase() : await getIATACode(departureInput);
    const arrivalCode = arrivalInput.length === 3 ? arrivalInput.toUppercase() : await getIATACode(arrivalInput);

    if(!departureCode || arrivalCode) {
        console.error("invalid departure or arrival code")
        return;
    }


    const API_KEY = "4QW3lOGkp6AYfsjXiUTwYebkX3zjhjSN";
    const API_SECRET = "rzCxZq8lD6d009Mo";
    const AUTH_URL = "https://test.api.amadeus.com/v1/security/oauth2/token";
    const FLIGHT_OFFERS_URL = "https://test.api.amadeus.com/v2/shopping/flight-offers";
    const LOCATION_SEARCH_URL = "https://test.api.amadeus.com/v1/reference-data/locations";

    try {
        let token = await getAccessToken();
        const tokenResponse = await fetch(AUTH_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: API_KEY,
                client_secret: API_SECRET,
            }),
        });

        if (!tokenResponse.ok) {
            throw new Error("Failed to get access token: ${tokenResponse.status};");
        }  
        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;
        console.log("Access Token:", accessToken)

        const requestUrl = `${FLIGHT_OFFERS_URL}?originLocationCode=${departureCode}&destinationLocationCode=${arrivalCode}&departureDate=${departureDateInput}&returnDate=${arrivalDateInput}&adults=${adultNo}&children=${childNo}&infants=${infant}`
        console.log("Request Url:", requestUrl)

        // step2
    const response = await fetch(requestUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error("Error fetching flight offers: ${response.status}");
        
    }
        const data = await response.json()
        console.log(data)
        // document.getElementById('result').textContent = JSON.stringify(data, null, 2)
        displayFlightOffers(data);
    } catch (error) {
        console.log(error)
        document.getElementById('result').textContent = `Error: ${error.message}`
    }
    // Function to display flight offers neatly
    function displayFlightOffers(data) {
        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = "";

        if(data && data.data && data.data.length > 0) {

            const totalResults = data.data.length;
            const totalPages = Math.ceil(totalResults / resultsPerPage);

            // get data for current page
            const startIndex = (currentPage - 1) * resultsPerPage;
            const endIndex = Math.min(startIndex + resultsPerPage, totalResults);
            const PageData = data.data.slice(startIndex, endIndex)

            PageData.forEach((offer, index) => {
                const offerDiv = document.createElement('div');
                offerDiv.style.border = "1px solid #ccc";
                offerDiv.style.margin = "10px";
                offerDiv.style.padding = "10px";
                offerDiv.style.borderRadius = "10px";
                offerDiv.className = 'flight-offer';

                offerDiv.innerHTML = `
                    <h2>Allicom Travels</h2>
                    <h2><strong>Price:</strong> ${offer.price.total} ${offer.price.currency}</h2>
                    <p><strong>Departure:</strong> ${offer.itineraries[0].segments[0].departure.iataCode} at ${offer.itineraries[0].segments[0].departure.at} </p>
                    <p><strong>Arrival:</strong> ${offer.itineraries[0].segments[0].arrival.iataCode} at ${offer.itineraries[0].segments[0].arrival.at} </p>  
                `;

                // Button for details
                const detailsButton = document.createElement('button');
                detailsButton.textContent = 'Details';
                detailsButton.className = 'details-button';

                detailsButton.addEventListener('click', () => {
                    // show flight details in a modal
                    showModal(offer)
                });

                offerDiv.appendChild(detailsButton);
                resultDiv.appendChild(offerDiv);
            });

            // Add Pagination controls
            const paginationDiv = document.createElement('div');
            paginationDiv.style.textAlign = "center";
            paginationDiv.style.marginTop = "20px";

            for (let i = 1; i <= totalPages; i++) {
                const pagButton = document.createElement('pagButton');
                pagButton.textContent = i;
                pagButton.style.margin = "0 5px";
                pagButton.style.padding = "5px 10px";
                pagButton.style.cursor = "pointer";

                if(i === currentPage) {
                    pagButton.style.backgroundColor = "blue";
                    pagButton.style.color = "#fff";
                }

                pagButton.addEventListener('click', () => {
                    currentPage = i;
                    displayFlightOffers(data)
                });

                paginationDiv.appendChild(pagButton)

            }

            resultDiv.appendChild(paginationDiv)

        }else {
            resultDiv.innerHTML = "<p>No flight offer available</p>"
        }
    }

    // function to show the modal
    function showModal(offer) {
        const segments = offer.itineraries[0].segments;
        const departure = segments[0].departure;
        const arrival = segments[segments.length - 1].arrival;

        // create modal content
        const modalContent = `
            <div class="modal-header">
                <h2>Flight Details</h2>
                <span class="close-button">&times;</span>
            </div>
            <div>               
                    <p><strong>Departure:</strong> ${offer.itineraries[0].segments[0].departure.iataCode} at ${offer.itineraries[0].segments[0].departure.at} </p>
                    <p><strong>Departure Full Name</strong> ${departure.airportName}</p>
                    <p><strong>Arrival:</strong> ${offer.itineraries[0].segments[0].arrival.iataCode} at ${offer.itineraries[0].segments[0].arrival.at} </p>
                    <p><strong>Arrival Full Name</strong> ${arrival.airportName}</p>
                    <p><strong>Duration:</strong> ${offer.itineraries[0].duration} </p>
                    <p><strong>Price:</strong> ${offer.price.total} ${offer.price.currency}</p>
                    <p><strong>Carrier:</strong> ${offer.itineraries[0].segments[0].carrierCode}</p>
                    <p><strong>Flight Number:</strong> ${offer.itineraries[0].segments[0].number}</p>
                    <p><strong>Stops:</strong> ${offer.itineraries[0].segments.length - 1} </p>  
            </div>
        `;
          // check for multiple segment (layovers)

        //   if(segments.length > 1) {
        //     modalContent.innerHTML += `<div class="">
        //         <h3>Layover Details:</h3><ul>`;

        //     for (let i = 0; i < segments.length - 1; i++) {
        //         const layover = segments[i].arrival;
        //         const nextDeparture = segments[i + 1].departure;

        //         // calcuulate layover time
        //         const layoverTime = new Date(nextDeparture.at) - new Date(layover.at);
        //         const layoverHours = Math.floor(layoverTime / (1000 * 60 * 60));
        //         const layoverMinute = Math.floor((layoverTime / (1000 * 60)) % 60);

        //         modalContent.innerHTML += `
        //             <li>
        //                 <p><strong>Layover at:</strong> ${layover.iataCode}</p>
        //                 </li>
        //                 <p><strong>Layover Duration:</strong> ${layoverHours}h ${layoverMinute}m</p>
        //                 <p><strong>Next Flight Departs:</strong> ${nextDeparture.at}</p>
        //             </li>
        //         `;
        //     }
        //     modalContent.innerHTML += `</ul></div>`
        //   }

        //   if(offer.itineraries[0]?.segments.length > 1) {
        //     modalContent.innerHTML += `<p><strong>Layovers:</strong></p>`;
        //     offer.itineraries[0].segments.slice(1).forEach((segment, idx) => {
        //         modalContent.innerHTML += `
        //             <p>&nbsp;&nbsp;Layover ${idx + 1} at ${segment?.departure?.iataCode} (${segment.departure.at})</P>
        //         `;
        //     })
        // };

        // additional flight details
        // if(offer.travelerPricings && offer.travelerPricings.length > 0) {
        //     modalContent.innerHTML += `<p><strong>Traveler Details:</strong></p>`;
        //     offer.travelerPricings.forEach((traveler, idx) => {
        //         modalContent.innerHTML += `
        //             <p>&nbsp;&nbsp;Traveler ${idx + 1}; ${traveler.travelerType} - ${traveler.price.total} ${traveler.price.currency}</P>
        //         `
        //     })
        // }
       

        // add modal content to the modal container
        const modal = document.getElementById('modal');
        modal.innerHTML = modalContent

        // show the modal
        modal.style.display = 'block';

        // close modal
        const closeButton = document.querySelector('.close-button');
        closeButton.addEventListener('click', () => {
            modal.style.display = 'none';
        })

      


    }
    
})
// when search btn is clicked the page content disapper
document.getElementById('search-flight').addEventListener('click', function () {
    document.getElementById('noDisplay').style.display = "none";
   })
   console.log('noDisplay')

// tab switching
document.querySelectorAll(".trip-type").forEach(select => {
    select.addEventListener('change', function() {
        const selectedTrip = this.value;

    document.querySelectorAll('.tab-content').forEach(form => form.classList.remove('active'));

    document.getElementById(`${selectedTrip}-form`).classList.add('active');
    });
    
});

// Add another flight div()
document.getElementById('add-flight-btn').addEventListener('click', function () {
    // const container = document.getElementById("multi-city-form")
    const container = document.getElementById('flightContainer');
    console.log(container)

    // get the current number of flight sections
    const flightCount = document.querySelectorAll('.flight-details').length + 1;

    const flightDiv = document.createElement("div");
    flightDiv.classList.add("flight-details");
    

    flightDiv.innerHTML = `
        <h3>Flight ${flightCount}</h3>
         <input class="city2" id="departure-city-1" type="text" placeholder="Departure City">
         <input class="city2" id="arrival-city-1" type="text" placeholder="Arrival City">
         <input class="city2" id="departure-date-1" type="date" >

         <button type="button" class="removeFlightBtn">Remove</button>
    `;

    container.appendChild(flightDiv);

    flightDiv.querySelector(".removeFlightBtn").addEventListener('click', function() {
        flightDiv.remove();
    })
    console.log("Added flight:", flightCount)
})


// multi-city for submission

// function formatDate(inputDate) {
//         if(/^\d{2}\/\d{2}\/\d{4}$/.test(inputDate)) {
//             throw new Error("Date format must be DD/MM/YYYY")
//         }
//         const [day, month, year] = inputDate.split("/");
//         return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
//     }
// function formatDate(inputDate) {
//     if (!inputDate) {
//         console.error("formatDate: inputDate is undefined or empty");
//         return"";
//     }
//     if(/^\d{4}-\d{2}-\d{2}$/.test(inputDate)) {
//         return inputDate
//     }
//     const parts = inputDate.split("/")
//     if(parts.length !== 3) {
//         console.error("formatDate: invalid date format", inputDate)
//         return"";
//     }
//         const [day, month, year] = parts;
//         return `${year}-${month}-${day}`;
//     }

document.getElementById('multiCityForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const travelers = [{
        id: "1", 
        travelerType: "ADULT",
        fareOptions: ["STANDARD"]
    }];

    const flights = [];
    const flightInput = document.querySelectorAll(".flight-details")

    flightInput.forEach((flight, index) => {
          const departureCity = flight.querySelector(`#departure-city-1`).value
          const arrivalCity = flight.querySelector(`#arrival-city-1`).value
          const departureDate = String(flight.querySelector(`#departure-date-1`).value)
          const departureDateFormatted = `${departureDate}` 


          console.log("Raw departure date:", departureDate);
          console.log("Before formating:", departureDate)

          if (departureCity && arrivalCity && departureDate) {
            flights.push({
                id: `${index + 1}`,
                originLocationCode: departureCity,
                destinationLocationCode: arrivalCity,
                departureDateTimeRange: {date: departureDateFormatted}
                // "id": "1",
                // "originLocationCode": "LOS",
                // "destinationLocationCode": "LON",
                // "departureDateTimeRange": {date: "2025-02-20"},
            })
          }
    });

    console.log("Flights:", flights)
    if (flights.length < 2) {
        alert("Please Enter at least two flights for multi-city trip");
        return;
    }

    const API_KEY = "4QW3lOGkp6AYfsjXiUTwYebkX3zjhjSN";
    const API_SECRET = "rzCxZq8lD6d009Mo";
    const AUTH_URL = "https://test.api.amadeus.com/v1/security/oauth2/token";
    const FLIGHT_OFFERS_URL = "https://test.api.amadeus.com/v2/shopping/flight-offers";

    try {
        const tokenResponse = await fetch(AUTH_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: API_KEY,
                client_secret: API_SECRET,
            }),
        });

        if (!tokenResponse.ok) throw new Error("Failed to get access token: ${tokenResponse.status};");
        
        const requestBody = {
            originDestinations: flights.map((flights, index) => ({
                id: `${index + 1}`,
                originLocationCode: flights.originLocationCode,
                destinationLocationCode: flights.destinationLocationCode,
                departureDateTimeRange: {
                    date: (flights.departureDate),
                    time: "00:00:00"
                }
            })),
            travelers: travelers,
            sources: ["GDS"],
            searchCriteria: {maxFlightOffers: 10}
        };
        console.log("Request Body:", JSON.stringify (requestBody, null, 2));

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;
        console.log("Access Token:", accessToken)

        const response = await fetch(FLIGHT_OFFERS_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
                // currencyCode: "USD",
                // originDestinations: flights,
                // travelers: travelers,
                // sources: ["GDS"],
                // searchCriteria: {
                //     maxFlightOffers: 10,
                //     flightFilters: {cabinRestriction: [{cabin: "ECONOMY", coverage: "MOST_SEGMENTS"}]},
                // },
                // itineraries: flights,
            // }),
        });

        const responseText = await response.text();
        console.log("Raw Response:", responseText)

        if (!response.ok) throw new Error("Error fetching flights offers");
         const data = await response.json()
        console.log(data);
        document.getElementById('result').textContent = JSON,stringify(data, null, 2);
    } catch (error) {
        console.error(error);
        document.getElementById('result').textContent = `Error: ${error.message}`
    }

})






// Tab Switching
// const tabs = document.querySelectorAll('.tab-button');
// const tabContents = document.querySelectorAll('.tab-content');

// tabs.forEach(tab => {
//     tab.addEventListener('click', function () {
//         // remove 'active' class from all tabs and contents
//         tabs.forEach(t => t.classList.remove('active'));
//         tabContents.forEach(content => content.classList.remove('active'));

//         // Add active class to cliclked tab
//         this.classList.add('active');
//         const tabId = this.getAttribute('data-tab');
//         // document.getElementById(`${tabId}-form`).classList.add('active')
//         const formToActivate = document.getElementById(`${tabId}-form`);
//         if(formToActivate) {
//             formToActivate.classList.add('active')
//         }
//     })
// })
// console.log(tabs)
// console.log(tabContents)



    // const API_KEY = "Rg0Ov1CyzoMOFL75AlOMfIoxREH76Lkf"
    // const apiUrl = `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${departureCity}&destinationLocationCode=${arrivalCity}&departureDate=${departureDateFormatted}&returnDate=${arrivalDateFormatted}&adults=${adultNo}&children=${childNo}&infant=${infant}&max=2`;

    // try {
    //     const response = await fetch(apiUrl, {
    //         method: 'GET',
    //         headers: {
    //             'Authorization': `Bearer ${API_KEY}`
    //         }
    //     });

    //     if (!response.ok) {
    //         throw new Error(`Error: ${response.status}`);
    //     }
// console.log(searchButton)




// const city = 'Lagos';
// const country = 'Nigeria';
// const dayOfWeek = 'Wednesday';
// const page = 1;

// const apiUrl = `https://cors-anywhere.herokuapp.com/https://api.allicomtravels.com/tour/get-available-tourism-site/?city=${city}&country=${country}&day_of_week=${dayOfWeek}%20&page=${page}`;

// API function
// async function fetchSearchResult() {
//     try {
//         const response = await fetch(apiUrl, {
//             headers: {
//                 accept: "application/json",
//             },
//         })
//         const data = await response.json();
//         return data.results;
//     } catch (error) {
//         console.error("Error fetching data:", error);
//         return[];
//     }
// }

// Eventlistener for search button
// searchButton.addEventListener("clcik", async () => {
//     const query = searchInput.ariaValueMax.trim();
//     if (!query) {
//         alert("Please enter a search term!");
//         return;
//     }
// })

// const results = await fetchSearchResult(query);

// if(results.length > 0) {
//     resultList.innerHTML = ""
//     results.forEach((result) => {
//         const div = document.createElement("div")
//         div.classList.add("result-item");
//         div.textContent = result.city || result.country || result.dayOfWeek
//         resultList.appendChild(div)
//     });

//     resultContainer.style.display ="block";
// }else {
//     resultList.innerHTML = "<p>No result found</p>";
//     resultContainer.style.display = "block";
// }
{/* <p><strong>Carrier:</strong> ${offer.itineraries[0].segments[0].carrierCode}</p>
                    <p><strong>Flight Number:</strong> ${offer.itineraries[0].segments[0].number}</p>
                    <p><strong>Duration:</strong> ${offer.itineraries[0].duration} </p>
                    <p><strong>Stops:</strong> ${offer.itineraries[0].segments.length - 1} </p> */}





























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
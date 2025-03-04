// HAMBURGER
const hamburger = document.getElementById("hamburger");
const navLinks = document.querySelector(".nav-links");

hamburger.addEventListener("click", e => {
    navLinks.classList.toggle("active");
})




const API_KEY = "4QW3lOGkp6AYfsjXiUTwYebkX3zjhjSN";
const API_SECRET = "rzCxZq8lD6d009Mo";
const AUTH_URL = "https://test.api.amadeus.com/v1/security/oauth2/token";
const FLIGHT_OFFERS_URL = "https://test.api.amadeus.com/v2/shopping/flight-offers";
const LOCATION_SEARCH_URL = "https://test.api.amadeus.com/v1/reference-data/locations";

// function to get access token
async function getAccessToken() {
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

        if (!tokenResponse.ok) {
            throw new Error(`Failed to get access token: ${tokenResponse.status};`);
        }  
        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;
        console.log("Access Token:", accessToken)
        

           // get city input values
    // const departureInput = document.getElementById("departure-city").value
    // const arrivalInput = document.getElementById("arrival-city").value
    // const departureDateInput = document.getElementById("departure-date").value;
    // const arrivalDateInput = document.getElementById("arrival-date").value;
    // const adultNo = document.getElementById("adult-no").value || 1;
    // const childNo = document.getElementById("child-no").value || 0;
    // const infant = document.getElementById("infant-no").value || 0;
    //  // convert city name to iata code
    // const departureCode = departureInput.length === 3 ? departureInput.toUpperCase() : await getIATACode(departureInput, accessToken);
    // const arrivalCode = arrivalInput.length === 3 ? arrivalInput.toUpperCase() : await getIATACode(arrivalInput, accessToken);

    // if(!departureCode || !arrivalCode) {
    //         console.error("invalid departure or arrival code")
    //         return;
    //     }

    //     const requestUrl = `${FLIGHT_OFFERS_URL}?originLocationCode=${departureCode}&destinationLocationCode=${arrivalCode}&departureDate=${departureDateInput}&returnDate=${arrivalDateInput}&adults=${adultNo}&children=${childNo}&infants=${infant}`

    //     console.log("Request Url:", requestUrl)

    //     const response = await fetch(requestUrl, {
    //         method: 'GET',
    //         headers: {
    //             'Authorization': `Bearer ${accessToken}`,
    //         },
    //     });
    
    //     if (!response.ok) {
    //         throw new Error(`Error fetching flight offers: ${response.status}`);     
    //         }
    //         const data = await response.json()
    //         console.log(data)
    //         // document.getElementById('result').textContent = JSON.stringify(data, null, 2)
    //         displayResult(data);
            return tokenData.access_token;
    } catch (error) {
        console.log(error)
        document.getElementById('result').textContent = `Error: ${error.message}`
    }
}

// function to convert city name to IATA code
async function getIATACode(cityName, token) {
    try {

        if(!token) {
            console.error("missing access token for IATA Code lookup");
            return null
        }
        // console.log("API response for city lookup:", data)

         if (!cityName|| cityName.length < 3) {
            console.error("city name must be 3 characters for this api");
            return null
         }

        const response = await fetch(`https://test.api.amadeus.com/v1/reference-data/locations?subType=AIRPORT,CITY&keyword=${encodeURIComponent(cityName)}`, {
            method: "GET",
            headers: {"Authorization": `Bearer ${token}` }
        });

        if(!response.ok) {
            throw new Error(`Failed to fetch IATA code: ${response.status}`)
        }
        const data = await response.json();
        console.log("API Response for", cityName, ":", JSON.stringify(data, null,2))

        if (!data || !data.data || data.data.length === 0) {
            console.error(`No IATA code found for: ${cityName}`)
            return null
        }

        // if (data.data && data.data.length > 0) {
        //     const matchedCity = data.data.find(city => city.name && city.name.toLowerCase() === cityName.toLowerCase());

        //     if(matchedCity) {
        //         return matchedCity.iataCode;
        //     } 
        
           
        //         console.warn(`No exact match for: ${cityName}. Using first result:`, data.data[0].iataCode);
                return data.data[0].iataCode;
        
        
        // console.log(data)

        // } else {
        //     console.error("no IATA code found for:", cityName);
        //    return null
        // }
    } catch (error) {
        console.error("Error fetching IATA code:", error);
        return null
    }
}

// function to fetch flight offers
async function fetchFlights(formType) {
    const token = await getAccessToken();
    if (!token) {
        console.error("failed to receive access token")
        return;
    } 

    let requestBody;

    // get city input values
    const departureInput = document.getElementById("departure-city").value
    const arrivalInput = document.getElementById("arrival-city").value
    const departureDateInput = document.getElementById("departure-date").value;
    const arrivalDateInput = document.getElementById("arrival-date").value;
    const adultNo = document.getElementById("adult-no").value || 1;
    const childNo = document.getElementById("child-no").value || 0;
    const infant = document.getElementById("infant-no").value || 0;
     // convert city name to iata code
    const departureCode = departureInput.length === 3 ? departureInput.toUpperCase() : await getIATACode(departureInput, token);
    const arrivalCode = arrivalInput.length === 3 ? arrivalInput.toUpperCase() : await getIATACode(arrivalInput, token);

    if(!departureCode || !arrivalCode) {
            console.error("invalid departure or arrival code")
            document.getElementById("result").textContent = "Error: Invalid city name. Please enter a valid city"
            return;
        }

        let requestUrl = `${FLIGHT_OFFERS_URL}?originLocationCode=${departureCode}&destinationLocationCode=${arrivalCode}&departureDate=${departureDateInput}&adults=${adultNo}&children=${childNo}&infants=${infant}`

        if (arrivalDateInput && arrivalDateInput.trim() !== "") {
            requestUrl += `&returnDate=${arrivalDateInput}`
        } else {
            requestUrl += `&returnDate=${departureDateInput}`
        }

        console.log("Request Url:", requestUrl)

        // step2 fetch flight offers
     try {
        const response = await fetch(requestUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${await getAccessToken()}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Error fetching flight offers: ${response.status}`);     
        }
        const data = await response.json()
        console.log(data)
        // document.getElementById('result').textContent = JSON.stringify(data, null, 2)
        displayResult(data);
    } catch(error) {
        console.error("Error fetching flights:", error)
    }

        console.log("Departure code:", departureCode)
        console.log("Arrival code:", arrivalCode)
        // console.log("IATA API Response:", data)

    if (formType === "one-way") {
        const departureDate = document.getElementById("departure-date").value
        const adults = document.getElementById("adult-no").value || 1;
        const childNo = document.getElementById("child-no").value || 0;
        const infant = document.getElementById("infant-no").value || 0;

        requestBody = {
            originDestinations: [{id: "1", originLocationCode: departureCode, destinationLocationCode: arrivalCode, departureDateTimeRange: {date: departureDate}}],
            travelers: [{id: "1", travelerType: "ADULT"}],
            sources: ["GDS"],
            searchCriteria: {maxFlightOffers: 10},
        };

    } else if (formType === "multi-city") {
        const flights = [];
        const flightDetails = document.querySelectorAll(".flight-details")

        for (const [index, flight] of flightDetails.entries()) {
            let departureCity1 = flight.querySelector(".departure-city-1").value.trim()
            let arrivalCity1 = flight.querySelector(".arrival-city-1").value.trim()
            let departureDate1 = flight.querySelector(".departure-date-1").value.trim()

            console.log(`Raw input - Flight ${index + 1}:`, departureCity1, arrivalCity1, departureDate1)

              // convert city name to iata code
            departureCity1 = departureCity1.length === 3 ? departureCity1.toUpperCase() : await getIATACode(departureCity1, token);
            arrivalCity1 = arrivalCity1.length === 3 ? arrivalInput.toUpperCase() : await getIATACode(arrivalCity1, token);

            if(!departureCity1 || !arrivalCity1) {
                console.error("invalid departure or arrival code")
                document.getElementById("result").textContent = "Error: Invalid city name. Please enter a valid city"
                return;
            }

            console.log(`Flight ${index + 1}: ${departureCity1} - ${arrivalCity1} on ${departureDate1}`)
            console.log(departureCity1)

            flights.push({id: (index + 1).toString(), originLocationCode: departureCity1, destinationLocationCode: arrivalCity1, departureDateTimeRange: {date: departureDate1} });
        };
        

        requestBody = {
            originDestinations: flights,
            travelers: [{id: "1", travelerType: "ADULT"}],
            sources: ["GDS"],
            searchCriteria: {maxFlightOffers: 10},
        };
    }

    const response = await fetch(FLIGHT_OFFERS_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    displayResult(data);
}

let currentPage = 1;
const resultsPerPage = 10;

// function to display flight results
function displayResult(data) {
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "";


    // data.data.forEach((offer, index) => {
    //     const flightDiv = document.createElement('div')
    //     flightDiv.textContent = `offer ${index + 1}: ${JSON.stringify(offer)}`
    //     flightDiv.appendChild(flightDiv);
    // })

    if(!data || !data.data || data.data.length === 0) {
        resultDiv.innerHTML = "<p>No flights found</p>"
        return;
    }

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

             const detailsButton = document.createElement('button');
             detailsButton.textContent = 'Details';
             detailsButton.className = 'details-button';
             detailsButton.addEventListener('click', () => {
            // show flight details in a modal
             showModal(offer)
        });

        offerDiv.appendChild(detailsButton);
        resultDiv.appendChild(offerDiv);
        // resultDiv.innerHTML =  ` <pre>${JSON.stringify(data, null, 2)}</pre>`
        })

        // const jsonData = document.createElement("pre");
        // jsonData.textContent = JSON.stringify(data, null, 2);
        // resultDiv.appendChild(jsonData)

       // Add Pagination controls
       const paginationDiv = document.createElement('div');
       paginationDiv.style.textAlign = "center";
       paginationDiv.style.marginTop = "20px";

       for (let i = 1; i <= totalPages; i++) {
           const pagButton = document.createElement('button');
           pagButton.textContent = i;
           pagButton.style.margin = "0 5px";
           pagButton.style.padding = "5px 10px";
           pagButton.style.cursor = "pointer";

           if(i === currentPage) {
               pagButton.style.backgroundColor = "blue";
               pagButton.style.color = "#fff";
           }

           pagButton.addEventListener('click', async () => {
               currentPage = i;
               displayResult(data)
           });

           paginationDiv.appendChild(pagButton)
        }

       resultDiv.appendChild(paginationDiv)
    }else {
        resultDiv.innerHTML = "<p>No flight offer available</p>"
    }
}
// function to fetch data for current page
// async function fetchFlightData(page) {
//     const response = await fetch(`https://test.api.amadeus.com/v2/shopping/flight-offers?page=${page}`)
//     const data = await response.json();
//     return data;
// }

// event listeners
document.getElementById("oneWayForm").addEventListener("submit", (e) => {e.preventDefault(); fetchFlights("one-way")})
document.getElementById("multiCityForm").addEventListener("submit", (e) => {e.preventDefault(); fetchFlights("multi-city")});
document.querySelectorAll(".trip-type").forEach(select => {
    select.addEventListener('change', function() {
        const selectedTrip = this.value;

    document.querySelectorAll('.tab-content').forEach(form => form.classList.remove('active'));

    document.getElementById(`${selectedTrip}-form`).classList.add('active');
    });
    
});


  // function to show the modal
  function showModal(offer) {
    // const offer = JSON.parse(offer)
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

    // when search btn is clicked the page content disapper
document.getElementById('search-flight').addEventListener('click', function () {
    document.getElementById('noDisplay').style.display = "none";
   })
//    console.log('noDisplay')


// Add another flight div()
document.getElementById('add-flight-btn').addEventListener('click', function () {
    // const container = document.getElementById("multi-city-form")
    const container = document.getElementById('flightContainer');
    // console.log(container)

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


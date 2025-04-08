document.getElementById('submit-btn').addEventListener('click', async(event) => {
    event.preventDefault()

    const formData = new FormData();

    formData.append("email", document.getElementById("email").value);
    formData.append("tourism_site", document.getElementById("tourism-site").value);
    formData.append("sex", document.getElementById("sex").value);
    formData.append("first_name", document.getElementById("first-name").value);
    formData.append("last_name", document.getElementById("last-name").value);
    formData.append("middle_name", document.getElementById("middle-name").value);
    formData.append("passport_expiration_date", document.getElementById("passport-exp-date").value);
    formData.append("passport_image", document.getElementById("passport-img").files[0]);
    formData.append("passport_number", document.getElementById("passport-number").value);
    formData.append("phone_number", document.getElementById("phone-number").value);

    formData.forEach((value, key) => {
        console.log(`${key}:`, value)
    })

    const headers = {
        'accept': 'application/json',
        'X-CSRFTOKEN':'TYthHWjQf9098kmwRp5dUMLQRFg6ZrOQue3n5hfwvW6hJMPiTsFyvUqSxeRFzQb6'
    }

    fetch('https://api.allicomtravels.com/tour/booking-tour/', {
        method: 'POST',
        headers: headers,
        body: formData,
    })

    .then(response => {
        if(!response.ok) {
            return response.text().then(errorText => {
            throw new Error(`Error ${response.status}: ${errorText}`);
        });
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        alert('Form submitted successfully!');

        // const imageContainer = document.getElementById("imageContainer")
        // const passpoortImageUrl = booking.passport_image

        // if(passpoortImageUrl) {
        //     const img = document.createElement("img")
        //         img.src = passpoortImageUrl;
        //         img.alt = "uploaded passport image"
        //         img.width = 200
        //     )
        // }
    })
    .catch(error => {
        console.log('Error:', error);
        alert('An error occured: ' + error.message)
    })
})





async function loadTourismSite () {
    try {
        const response = await fetch('https://api.allicomtravels.com/tour/tourism-site/', {
            method: 'GET',
            headers: {
                'accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: unable to fetch tourism sites`)
        }

        const data = await response.json();
        console.log('API Response:', data);

        const tourismSiteSelect = document.getElementById('tourism-site');
        tourismSiteSelect.innerHTML = '';

        if (Array.isArray(data.results) && data.results.length > 0) {
        data.results.forEach(site => {
            // console.log('Adding site:', site)

            const option = document.createElement('option');
            option.value = site.id
            option.textContent = site.city
            tourismSiteSelect.appendChild(option);;
        });
    } else {
        // throw new Error('API response does not contain a valid array');
        console.error('No tourism sites found in response');
        tourismSiteSelect.innerHTML = '<option disabled selected>No sites available</option>'
    }
    } catch (error) {
        console.error('Error loading tourism:', error.message);

        const tourismSiteSelect = document.getElementById('tourism-site');
        tourismSiteSelect.innerHTML = '<option disabled selected>Error loading sites</option>'
    }
}


loadTourismSite();
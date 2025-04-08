async function loadBookings() {
    try {
        const response = await fetch('https://api.allicomtravels.com/tour/booking-tour/', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        })
        if (!response.ok) {
            throw new Error(`Error ${response.status}: Unable to fetch bookings`);
        }


        const data = await response.json();
        console.log("Bookings:", data);

        const bookingTable = document.querySelector('#bookingTable tbody');
        bookingTable.innnerHTML = "";

        data.results.forEach(booking => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${booking.id}</td>
                <td>${booking.email}</td>
                <td>${booking.tourism_site}</td>
                <td>${booking.sex}</td>
                <td>${booking.first_name}</td>
                <td>${booking.last_name}</td>
                <td>${booking.middle_name}</td>
                <td>${booking.passport_expiration_date}</td>
                <img src="${booking.passport_image}" alt="Passport" width="100">
                <td>${booking.passport_number}</td>
                <td>${booking.phone_number}</td>
                <td>
                    <button class="editbtn" onclick="editBooking(${booking.id})">Edit</button>
                    <button class="editbtn" onclick="deleteBooking(${booking.id})">Delete</button>
                </td>
            `;
            bookingTable.appendChild(row)
        });
    } catch (error) {
        console.error('Error loading bookings:', error.message)
    }
}

loadBookings();

//  function to delete booking
async function deleteBooking(bookingid) {
    if (!confirm("Are you sure you want to delete this booking?")) return

    try {
        const response = await fetch(`https://api.allicomtravels.com/tour/booking-tour/${bookingid}/`, {
            method: 'DELETE',
            headers: {
                'accept': 'application/json',
            }
        })

        if (!response.ok) {
            throw new Error(`Error ${response.status}: Unable to delete booking`)
        }

        alert("Booking deleted successfully!");
        loadBookings()
    } catch {
        console.error("Error deleting booking:", error.message)
    }
}

//  function to edit booking
async function editBooking(bookingid) {
    const row = Array.from(document.querySelectorAll("tr"))
    .find(r => r.firstElementChild && r.firstElementChild.textContent == bookingid)

    if(!row) return alert("Booking not found")

    const cells = row.querySelectorAll("td");

    // promt user to edit each value
    const email = prompt("Email:",cells[1].textContent)
    const tourism_site = prompt("Tourism Site ID:",cells[2].textContent)
    const sex = prompt("sex:",cells[3].textContent)
    const first_name = prompt("First Name:",cells[4].textContent)
    const last_name = prompt("Last Name:",cells[5].textContent)
    const middle_name = prompt("Middle Name:",cells[6].textContent)
    const passport_expiration_date = prompt("Passpor expiration Date (YYYY-MM-DD):",cells[7].textContent)
    const passport_number = prompt("Passport Number:",cells[8].textContent)
    const phone_number = prompt("Phone Number:",cells[9].textContent)

    // build the payload
    const formData = new FormData();
       formData.append("email", email) 
        formData.append("tourism_site", tourism_site)
        formData.append("sex", sex)
        formData.append("first_name", first_name)
        formData.append("last_name", last_name)
        formData.append("middle_name", middle_name)
        formData.append("passport_expiration_date", passport_expiration_date)
        formData.append("passport_number", passport_number)
        formData.append("phone_number", phone_number)
        
    

    try {
        const response = await fetch(`https://api.allicomtravels.com/tour/booking-tour/${bookingid}/`, {
            method: 'PATCH',
            headers: {
                'accept': 'application/json',
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: Unable to update booking`)
        }

        alert("Booking updated successfully!")
        // loadBookings();
        location.reload()
    } catch {
        console.error('Error updating booking:', error.message)
    }
}
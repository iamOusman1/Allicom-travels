// HAMBURGER
const hamburger = document.getElementById("hamburger");
const navLinks = document.querySelector(".nav-links");

hamburger.addEventListener("click", e => {
    navLinks.classList.toggle("active");
})
   
  
const apiBaseUrl = "https://api.allicomtravels.com/auth";

// SIGN UP FUNCTION

 document.getElementById("signupForm").addEventListener("submit", async function(event) {
    event.preventDefault();
    
    const formData = new FormData();
    formData.append("email", document.getElementById("email").value);
    formData.append("name", document.getElementById("name").value);
    formData.append("password", document.getElementById("password").value);
    formData.append("trading_name", document.getElementById("trading_name").value);
    formData.append("company_name", document.getElementById("company_name").value);
    formData.append("registration_number", document.getElementById("registration_number").value);
    formData.append("business_address", document.getElementById("business_address").value);
    formData.append("business_phone_number", document.getElementById("business_phone_number").value);
    formData.append("business_email", document.getElementById("business_email_address").value);
    formData.append("business_owner_full_name", document.getElementById("business_owner_full_name").value);
    formData.append("business_owner_phone_number", document.getElementById("business_owner_phone_number").value);
    formData.append("business_owner_email", document.getElementById("business_owner_email").value);
    formData.append("contact_person_full_name", document.getElementById("contact_person_full_name").value);
    formData.append("contact_person_phone_number", document.getElementById("contact_person_phone_number").value);
    formData.append("contact_person_email", document.getElementById("contact_person_email").value);
    formData.append("association_membership_certificate", document.getElementById("association_membership_certificate").files[0]);
    formData.append("business_certificate", document.getElementById("business_certificate").files[0]);

   


    try {
    const response = await fetch(`${apiBaseUrl}/signup-supplier/`, {
        method: "POST",
        body: formData
    })

    const responseText = await response.text()
    console.log("Response Text:", responseText)

    let data;
    try {
        data= JSON.parse(responseText);
    }catch (jsonError) {
        console.error("Error parsing JSON:", jsonError);
        alert("unexpected error occurred");
        return;
    }
    
    if (!response.ok) {
        if (data.email) {
            alert(`Error: ${data.email}`)
        } else {
            alert(`Error: ${data.message || "An error occurred"}`)
        }
        throw new Error(`HTTP Error! status: ${response.status}`)
    }
    // const data = await response.json();
        console.log("API Response:", data)
        alert(data.message || "Sign-up Successful")

        window.location.href = "login.html";

   
    
} catch(error) {
    console.error("Error:", error);
    }
    
})




function togglePassword() {
    let passwordInput = document.getElementById("password");
    if (passwordInput.type === "password") {
        passwordInput.type = "text"
    } else {
        passwordInput.type = "password"
    }
}


function validatePassword() {
    let confirmPassword = document.getElementById("confirmPassword")
    let password = document.getElementById("password").value;
    let message = document.getElementById("message");

    let uppercase = /[A-Z]/.test(password);
    let lowercase = /[a-z]/.test(password);
    let number = /[0-9]/.test(password);
    let length = password.length >= 8;

    if(uppercase && lowercase && number && length) {
        message.style.color = "green";
        message.textContent = "Strong Password";
    } else {
        message.style.color = "red";
        message.textContent = "Must be 8+ characters, uppercase, lowercase & number";
    }

   
}

function validateConfirmPassword() {
    let confirmPassword = document.getElementById("confirmPassword").value
    let password = document.getElementById("password").value
    let confirmMessage = document.getElementById("confirmMessage")

    if(confirmPassword === password) {
        confirmMessage.style.color = "green"
        confirmMessage.textContent = "Password Match"
    } else {
        confirmMessage.style.color = "red"
        confirmMessage.textContent = "Password Mismatch"
    }
}

// userData("John doe", "johndoe@example.com", "password123")


// LOGIN FUNCTION
// document.getElementById("loginForm").addEventListener("submit", function(event) {
//     event.preventDefault();
//     console.log (loginForm)

//     const email = document.getElementById("loginEmail").value;
//     const password = document.getElementById("loginPassword").value;

//     fetch(`${apiBaseUrl}/login-supplier/`, {
//         method: "POST",
//         headers: {"Content-Type": "application/json"},
//         body: JSON.stringify({email, password})
//     })
//     .then(reponse => Response.json())
//     .then(data => {
//        if(data.token) {
//         localStorage.setItem("authToken", data.token);
//         alert("Login Successful");
//        } else {
//         alert("Login Failed");
//        }
//     })
//     .catch(error => console.error("Error:", error))
// })

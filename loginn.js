// HAMBURGER
const hamburger = document.getElementById("hamburger");
const navLinks = document.querySelector(".nav-links");

hamburger.addEventListener("click", (e) => {
  navLinks.classList.toggle("active");
});

const apiBaseUrl = "https://api.allicomtravels.com/auth";
// LOGIN FUNCTION
function loginUser(event) {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    alert("Please enter both email and password");
  }
  const requestData = {
    email: email,
    password: password,
  };
  // try {
  fetch(`${apiBaseUrl}/login-supplier/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(requestData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      //   console.log("Login successful:", data);
      alert("Login Successful");

      if (data.token) {
        localStorage.setItem("authToken", data.token);
        window.location.href = "supplierupload.html";
      } else {
        alert("An error occured. Try again ");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Login failed. Please check your credentials and try again");
    });
}
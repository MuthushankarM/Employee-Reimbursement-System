function redirect(page) {
  if (page === "home") {
    window.location.href = "./employeeDashboard.html";
  }

  if (page === "reimbursements") {
    window.location.href = "./requestPage.html";
  }
}

const form = document.querySelector("form");

form.addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent page reload

  // Get form values
  const name = document.getElementById("name").value.trim();
  const purpose = document.getElementById("purpose").value.trim();
  const amount = document.getElementById("amount").value.trim();
  const proofFile = document.querySelector('input[type="file"]').files[0];

  const request = { name, purpose, amount };

  try {
    const response = await fetch("http://localhost:3000/requests", {
      method: "POST",
      body: JSON.stringify(request),
    });

    const result = await response.json();
    console.log("Server response:", result);
    alert("Form submitted successfully!");
  } catch (err) {
    console.error("Error submitting form:", err);
    alert("Error submitting form!");
  }
});

function logout() {
  localStorage.removeItem("token");
  window.location.href = "./Login.html";
}

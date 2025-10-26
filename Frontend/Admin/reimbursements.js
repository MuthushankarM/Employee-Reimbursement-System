function redirect(page) {
  if (page === "home") {
    window.location.href = "./adminDashboard.html";
  }
  if (page === "reimbursements") {
    window.location.href = "./reimbursements.html";
  }
  if (page === "adduser") {
    window.location.href = "./addEmployee.html";
  }
}

async function generateCards() {
  const token = localStorage.getItem("token");
  const mainArea = document.getElementsByClassName("main-area")[0];
  mainArea.innerHTML = "";
  const response = await fetch("http://localhost:3000/requests", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  console.log(data);
  data.forEach((request) => {
    const card = document.createElement("div");
    card.className = "reimburse-cards";
    const decorClass =
      request.role.toLowerCase() === "manager" ? "Managerdecor" : "Empdecor";
    console.log(request.role, "\n", decorClass);
    card.dataset.id = request.id; // <-- attach ID to card
    card.innerHTML = `
    <div class="card-content">
      <div class="${decorClass}"></div>
      <h3>${request.reqName}</h3>
      <p>Amount: ₹${request.amount}</p>
      <p>Status: ${request.state}</p>
      <br>
      <p>Created by: <b>${request.username}</b> | ${request.role} </p>
      <p>Date: ${new Date(request.createdAt).toLocaleDateString()}</p>
      <p>Time: ${new Date(request.createdAt).toLocaleTimeString()}</p>
    </div>
    <div class="card-actions">
      <button class="approve-btn">Approve</button>
      <button class="reject-btn">Reject</button>
    </div>
  `;

    mainArea.appendChild(card);
  });
}

generateCards();

const mainArea = document.getElementsByClassName("main-area")[0];

mainArea.addEventListener("click", (e) => {
  if (e.target.classList.contains("approve-btn")) {
    const card = e.target.closest(".reimburse-cards");
    const id = card.dataset.id;
    updateRequest(id, "Approved");
  }
  if (e.target.classList.contains("reject-btn")) {
    const card = e.target.closest(".reimburse-cards");
    const id = card.dataset.id;
    updateRequest(id, "Rejected");
  }
});

async function updateRequest(id, state) {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`http://localhost:3000/requests/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ state }),
    });

    if (response.ok) {
      alert(`Request ${state}`);
      generateCards(); // refresh cards
    } else {
      const errData = await response.json();
      alert(errData.message || "Error occurred, try again");
    }
  } catch (err) {
    console.error(err);
    alert("Network or server error, try again");
  }
}

const addUser = document.getElementById("addUser");

addUser.addEventListener("click", () => {
  window.location.href = "./addUser.html";
});

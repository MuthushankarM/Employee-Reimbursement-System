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

function logout() {
  localStorage.removeItem("token");
  window.location.href = "../../Frontend/Login.html";
}

async function generateUser() {
  const token = localStorage.getItem("token");
  const response = await fetch("http://localhost:3000/users", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  const mainArea = document.getElementsByClassName("main-area")[0];
  mainArea.innerHTML = "";
  data.forEach((user) => {
    const container = document.createElement("div");
    container.classList = "user-card";
    container.dataset.id = user.id;
    container.innerHTML = `<div class="card-content">
        <div class="card-profile"></div>
        <p><b>Username: </b> ${user.username}</p>
        <p><b>Email: </b> ${user.email}</p>
        <p><b>Role: </b> ${user.role}</p>
    </div>
        <div class="delete-action">
          <button class="delete-user">Delete</button>
        </div>
        `;
    mainArea.appendChild(container);
  });
}

generateUser();

const mainArea = document.getElementsByClassName("main-area")[0];

mainArea.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-user")) {
    const card = e.target.closest(".user-card");
    const id = card.dataset.id;
    deleteUser(id);
  }
});

async function deleteUser(id) {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`http://localhost:3000/users/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    });
    console.log(response);
    if (response.ok) {
      alert("User Deleted !");
      generateUser();
    } else {
      alert("Error While Deleting User ! Try Again");
    }
  } catch (err) {
    console.err(err);
    alert("Network or Server Error, try again..");
  }
}

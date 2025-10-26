const receiptBtn = document.getElementById("receipt");

function logout() {
  localStorage.removeItem("token");
  window.location.href = "../login.html";
}

function redirect(page) {
  if (page === "home") {
    window.location.href = "./adminDashboard.html";
  }
  if (page === "reimbursements") {
    window.location.href = "./reimbursements.html";
  }
  if (page === "adduser") {
    window.location.href = "./addUser.html";
  }
}

// Function tp generatre the random password:
const generateBtn = document.getElementById("generate-password");

function generatePassword(length) {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+[]{}";
  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    password += chars[randomIndex];
  }

  return password;
}
generateBtn.addEventListener("click", () => {
  let passwordField = document.getElementById("passwordField");
  passwordField.innerText = "";
  const password = generatePassword(8);
  console.log(password);
  passwordField.value = password;
});

const addBtn = document.getElementById("add-user");

async function addUser() {
  try {
    const token = localStorage.getItem("token");
    const name = document.getElementById("EmployeeName").value;
    const role = document.getElementById("Role").value;
    const email = document.getElementById("emailId").value;
    const password = document.getElementById("passwordField").value;

    const response = await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, role, email, password }),
    });
    const data = await response.json();
    if (response.ok) {
      alert("User Added to the Database");
    } else {
      alert("Error While adding user to the Database");
    }
  } catch (err) {
    alert("Error While Adding users : " + err);
  }
}

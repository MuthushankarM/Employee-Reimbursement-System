function requestForm() {
  window.location.href = "./requestForm.html";
}

function track() {
  window.location.href = "./requestPage.html";
}

function redirect(page) {
  if (page === "home") {
    window.location.href = "./employeeDashboard.html";
  }

  if (page === "reimbursements") {
    window.location.href = "./requestPage.html";
  }
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "./Login.html";
}

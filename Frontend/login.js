async function handleLogin() {
  const email = document.getElementById("emailid").value;
  const password = document.getElementById("password").value;

  const body = { email, password };

  console.log(body);

  const res = await fetch("http://localhost:3000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  console.log(data);

  if (res.ok && data.success) {
    localStorage.setItem("token", data.token);
    if (data.role === "admin") {
      window.location.href = "./Admin/adminDashboard.html";
    } else {
      window.location.href = "./employeeDashboard.html";
    }
  } else {
    alert("Invalid credentials !");
  }
}

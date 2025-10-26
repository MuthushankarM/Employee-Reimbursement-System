window.addEventListener("load", () => {
  fetchAnalysticsData();
});

// REDIRECTION:
function redirect(page) {
  if (page === "user") {
    window.location.href = "./addUser.html";
  }
  if (page === "reimbursements") {
    window.location.href = "./reimbursements.html";
  }
}

// LOGOUT
function logout() {
  localStorage.removeItem("token");
  window.location.href = "../../Frontend/Login.html";
}

// UPDATING TIMER
function updateTimer() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, "0");

  // Convert to 12-hour format
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  hours = String(hours).padStart(2, "0");

  document.getElementById("timer").textContent = `${hours}:${minutes} ${ampm}`;
  const dayName = now.toLocaleDateString("en-US", { weekday: "long" });
  document.getElementById("day").textContent = `${dayName}`;
  // Thursday
  console.log(dayName);
}
setInterval(updateTimer, 1000);

//QUOTES API
async function updateQuote() {
  let data = await fetch("http://localhost:3000/quotes");
  console.log(data.ok);
  if (data.ok) {
    const response = await data.json();
    document.getElementById("quotes").textContent = `${response.data.quote}`;
  } else {
    console.log("Hi");
    document.getElementById("quotes").textContent = `Made with time`;
  }
}
updateQuote();

async function fetchAnalysticsData() {
  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:3000/analytics", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  let approved = 0,
    pending = 0,
    rejected = 0;

  const reimbursementByCategory = {};
  data.forEach((requests) => {
    if (requests.state === "Approved") {
      approved++;
      const category = requests.category;
      const amount = parseFloat(requests.amount);

      if (category && !isNaN(amount)) {
        reimbursementByCategory[category] =
          (reimbursementByCategory[category] || 0) + amount;
      }
    } else if (requests.state === "Pending") pending++;
    else rejected++;
  });
  const chartData = Object.keys(reimbursementByCategory).map((cat) => ({
    category: cat,
    amount: parseFloat(reimbursementByCategory[cat].toFixed(2)),
  }));

  chartData.sort((a, b) => b.amount - a.amount);

  console.log(chartData);

  // LINE CHART
  const reimbursementsByMonth = {};

  data.forEach((request) => {
    if (request.state === "Approved") {
      const date = new Date(request.createdAt);
      // Key format: YYYY-MM (e.g., 2024-10) to ensure correct chronological sorting
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;
      const amount = parseFloat(request.amount);

      reimbursementsByMonth[monthKey] =
        (reimbursementsByMonth[monthKey] || 0) + amount;
    }
  });

  // Transform into sorted array
  const trendData = Object.keys(reimbursementsByMonth)
    .sort()
    .map((month) => ({
      month: month,
      amount: parseFloat(reimbursementsByMonth[month].toFixed(2)),
    }));

  // Call the new render function

  renderPrimaryCards(approved, pending, rejected);
  renderBarCharts(chartData);
  renderLineChart(trendData);
  renderDoughnutChart({ approved, pending, rejected });
}
// fetchAnalysticsData();
function renderPrimaryCards(approved, pending, rejected) {
  const total = approved + pending + rejected;
  const totalContainer = document.getElementById("total");
  const approvedContainer = document.getElementById("approved");
  const pendingContainer = document.getElementById("pending");
  const rejectedContainer = document.getElementById("rejected");

  totalContainer.innerHTML = `Total Requests<h1>${total}</h1>`;
  approvedContainer.innerHTML = `Approved Requests<h1>${approved}</h1>`;
  pendingContainer.innerHTML = `Pending Requests<h1>${pending}</h1>`;
  rejectedContainer.innerHTML = `Rejected Requests<h1>${rejected}</h1>`;
}

// RENDER BAR CHART
function renderBarCharts(data) {
  const categories = data.map((item) => item.category);
  const amounts = data.map((item) => item.amount);

  const ctx = document.getElementById("reimbursementChart").getContext("2d");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: categories,
      datasets: [
        {
          label: "Total Approved Reimbursement ($)",
          data: amounts,
          backgroundColor: "rgba(54, 162, 235, 0.7)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: true, title: { display: true, text: "Amount ($)" } },
      },
      plugins: {
        title: { display: true, text: "Total Reimbursement by Category" },
      },
    },
  });
}

// RENDER LINE CHART
function renderLineChart(data) {
  const months = data.map((item) => item.month);
  const amounts = data.map((item) => item.amount);

  const ctx = document.getElementById("linechart")?.getContext("2d");
  if (!ctx) return;

  new Chart(ctx, {
    type: "line", // Line charts are essential for trends over time
    data: {
      labels: months, // Monthly labels
      datasets: [
        {
          label: "Total Approved Amount",
          data: amounts,
          borderColor: "rgba(255, 99, 132, 1)", // Red line
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          fill: true,
          tension: 0.1,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          title: { display: true, text: "Amount ($)" },
          ticks: {
            callback: function (value) {
              return "₹" + value.toFixed(2);
            },
          },
        },
        x: {
          title: { display: true, text: "Month (YYYY-MM)" },
        },
      },
      plugins: {
        title: { display: true, text: "Monthly Approved Reimbursements" },
      },
    },
  });
}

// PIE CHART
function renderDoughnutChart(counts) {
  // Only focus on Approved and Rejected requests for the success rate
  const ctx = document.getElementById("piechart")?.getContext("2d");

  // Check if the canvas exists before trying to draw
  if (!ctx) return;

  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Approved", "Pending", "Rejected"],
      datasets: [
        {
          // Data points are the approved and rejected counts
          data: [counts.approved, counts.pending, counts.rejected],
          backgroundColor: [
            "#28a745",
            "#cecb19ff", // Green for Approved
            "#dc3545", // Red for Rejected
          ],
          hoverOffset: 8,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, // Use the size defined by .chart-box-small
      plugins: {
        title: {
          display: true,
          text: "Approved vs. Pending vs. Rejected",
        },
        legend: {
          position: "bottom",
        },
      },
    },
  });
}

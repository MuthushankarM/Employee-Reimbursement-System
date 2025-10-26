technologies:
  frontend: "HTML, CSS, JavaScript"
  backend: "Node.js (No framework)"
  database: "MySQL"

project_structure:
  backend:
    - config/
    - controllers/
    - helpers/
    - middleware/
    - models/
    - node_modules/
    - utils/
    - .env
    - package-lock.json
    - package.json
    - server.js
  frontend:
    - Admin/
    - assets/
    - employeeDashboard.css
    - employeeDashboard.html
    - employeeDashboard.js
    - login.css
    - login.html
    - login.js
    - normalize.css
    - requestForm.css
    - requestForm.html
    - requestForm.js

getting_started:
  steps:
    - "Clone the repository: git clone <repository-url> && cd Employee-Reimbursement-System"
    - "Run Backend: cd Backend && npm install && npm run dev"
    - "Run Frontend: Open Frontend/Login.html in your browser (project entry point)"

admin_credentials:
  email: "admin@muthucorp.org"
  password: "muthucorp1234"

admin_pages:
  adminDashboard:
    file: "adminDashboard.html"
    features:
      - "Bar chart → Department-wise spending"
      - "Pie chart → Approved, Pending, Total, Rejected requests"
      - "Line chart → Monthly spending"
      - "Timer → Current date & time and random quotes from quote.io"
  reimbursements:
    file: "reimbursements.html"
    features:
      - "Displays pending user requests"
      - "Admin can approve or reject requests"
  addUser:
    file: "addUser.html"
    features:
      - "Admin can view and remove users"
  addEmployee:
    file: "addEmployee.html"
    features:
      - "Admin can add new employees"

user_pages:
  credentials:
    email: "muthushankar@muthucorp.org"
    password: "pPVgVoXO"
  employeeDashboard:
    file: "employeeDashboard.html"
    features:
      - "Options to submit a claim or track existing requests"
  requestForm:
    file: "requestForm.html"
    features:
      - "User can fill claim details and submit reimbursement request"

entry_points:
  frontend: "Login.html"
  backend: "server.js"

backend_architecture:
  server: "server.js – Main entry file, routes requests based on path & method"
  controllers: "controllers/ – Processes requests and interacts with models"
  models: "models/ – Handles database operations"
  helpers: "helpers/ – response.js for sending API responses"
  utils: "utils/ – JWT token signing"
  config: "config/ – Database connection configuration"

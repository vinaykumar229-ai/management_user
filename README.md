# User Management App

A simple web application where users can view, add, edit, delete, search, filter, and paginate user details.  
Built with **React** and interacts with [JSONPlaceholder](https://jsonplaceholder.typicode.com/users) mock API.

---

## Features
- View all users with details (ID, First Name, Last Name, Email, Department).
- Add, Edit, Delete user (using mock API requests).
- Pagination with limits: 10, 25, 50, 100 (or infinite scrolling).
- Filter popup for First Name, Last Name, Email, Department.
- Search and sorting.
- Responsive clean UI.
- Error handling and form validations.

---

## Tech Stack
- **React** (Vite or Create React App)
- **Axios** (API calls)
- **CSS** (responsive styling)

---

## Setup & Run Instructions
 Clone the repo:
   bash
   git clone https://github.com/your-username/user-management-app.git
   cd user-management-app
Install dependencies:

npm install


Run the development server:

npm start


or if using Vite:

npm run dev


Open in browser:

http://localhost:3000

Challenges Faced

Mock API Limitations: JSONPlaceholder does not persist changes. So add, edit, and delete requests return success but won’t affect the actual API data.

Pagination & Filtering: Since API doesn’t provide server-side pagination or filters, these were implemented client-side.

Form Validation: Ensuring proper validation for all fields (like email format) required extra handling.

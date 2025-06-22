# Clinical Trial Data Visualization Dashboard

> A dynamic, interactive, and fully-featured single-page application (SPA) for visualizing and exploring mock clinical trial data. This project serves as a portfolio piece to demonstrate advanced front-end development skills, complex state management, and the ability to present complex data in a user-friendly way.

## ✨ Live Demo

**[Link to your deployed application here]**

*(Replace the text above with the actual link once you deploy the project on a service like Vercel, Netlify, or your BlueHost account.)*

---

## 📸 Screenshots

Here’s a glimpse of the dashboard in action, showcasing its key features.

**Main Dashboard with Draggable Grid Layout**
*A complete overview of the selected trial, featuring KPI cards and dynamic charts. All elements can be rearranged by the user.*
![Main Dashboard View](https://github.com/user-attachments/assets/a436c477-d607-426f-8f0e-edc69fc08162)



**Advanced Patient Data Table**
*A dedicated view for all trial participants, featuring case-insensitive search and column sorting.*
![Patient Data Table](https://github.com/user-attachments/assets/cae5afdc-d796-48e1-b5c0-3f9be5e1eea4)


**Custom Trial Creation**
*A user-friendly form that allows users to create and analyze their own trials by simply pasting in CSV data.*
![Create Trial Form](https://github.com/user-attachments/assets/23cd8d05-de28-40dd-9a2c-403211e83a71)


---

## 🚀 Features

This application is packed with features designed to showcase modern web development capabilities:

- **Multi-Trial Management:** Seamlessly switch between different clinical trial datasets using a sidebar dropdown.
- **Dynamic Data Visualization:** Charts and KPIs instantly update to reflect the data from the currently selected trial.
- **Draggable & Resizable Grid:** Customize your view by dragging and resizing the dashboard cards into any layout you prefer, powered by `react-grid-layout`.
- **Advanced Data Table:** The "Patients" page features a high-performance table with global case-insensitive search and column sorting, built with `TanStack Table`.
- **Custom Trial Creation:** Users can add new trials to the application by filling out a form and pasting their own raw CSV data, which is parsed on the client side.
- **Data Export:**
  - **Download as CSV:** Download the complete patient dataset for the current trial.
  - **Export as PDF:** Capture the current dashboard view as a high-resolution PDF for reporting and sharing.
- **Responsive Design:** The application is fully responsive and provides a great user experience on desktop, tablet, and mobile devices.

---

## 🛠️ Tech Stack

This project was built using a modern, efficient, and powerful tech stack:

- **Front-End Framework:** **React** (with Vite for project scaffolding)
- **Styling:** **Tailwind CSS**
- **Routing:** **React Router**
- **Data Visualization:** **Recharts**
- **Data Table:** **TanStack Table (v8)**
- **Dashboard Layout:** **React Grid Layout**
- **Data Parsing:** **PapaParse**
- **PDF/Image Export:** **html2canvas** & **jsPDF**
- **Icons:** **Lucide React**
- **State Management:** React Hooks (`useState`, `useEffect`, `useMemo`)

---

## ⚙️ Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have Node.js and npm installed on your machine.
- You can download them from [nodejs.org](https://nodejs.org/).

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd your-repo-name
    ```
3.  **Install NPM packages:**
    ```sh
    npm install
    ```
4.  **Run the development server:**
    ```sh
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

---

## 📂 Project Structure

The project is organized with a clean and scalable component-based architecture.

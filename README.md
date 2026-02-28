# Chadar Samaj Matrimony Platform 🤝

Welcome to the **Chadar Samaj Matrimony Platform** repository! This is a simple, clean, and fast matrimony platform explicitly designed for rural and village communities (specifically the Chadar Samaj). The goal of this application is to provide an accessible interface for users to find suitable matches within their community.

## 🚀 Key Features
- **Mobile Number Authentication:** Simple login and registration using just a mobile number (OTP functionality is mocked for simplicity).
- **Profile Management:** Users can create detailed profiles including Personal Details (Age, Height, Gender), Community Details (Religion, Caste, Gotra), Professional Details (Education, Occupation), and Location Details (Village, District, State).
- **Photo Uploads:** Users can easily upload and manage profile pictures.
- **Smart Filtering & Search:** Search for profiles based on Gender, Minimum/Maximum Age, District, Name, Religion, Caste, and Disability status.
- **Admin Dashboard:** A dedicated admin panel to approve or delete profiles, maintaining community standards.
- **Fully Responsive:** Beautifully designed using Tailwind CSS to look great on both mobile devices and desktop computers.
- **Hindi & English Support:** (Optional) Support for regional languages to ensure maximum accessibility for all users.
- **Local JSON Database:** Extremely easy to set up! No external database servers like MongoDB are required to start developing. Data is saved locally in a `data.json` file.

---

## 🛠️ Technology Stack
- **Frontend:** React.js, Vite, Tailwind CSS, React Router DOM, Axios
- **Backend:** Node.js, Express.js
- **Database:** Local JSON File System (No extra database installation needed!)
- **File Uploads:** Multer (Saves images to `/server/uploads`)

---

## ⚙️ How to Run the Project (Local Setup)

Follow these simple steps to run the product on your local machine.

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your computer.

### 1. Start the Backend Server
First, we need to run the API server.
1. Open your terminal or command prompt.
2. Navigate to the server folder: `cd server`
3. Install dependencies: `npm install`
4. Start the backend: `node index.js`
   
*(The server will start running on http://localhost:5001. A `data.json` file will automatically be created to act as your database).*

### 2. Start the Frontend Client
Next, we run the frontend web application.
1. Open a **new** terminal window.
2. Navigate to the client folder: `cd client`
3. Install dependencies: `npm install`
4. Start the Vite development server: `npm run dev`
   
*(Vite will provide a local URL, usually http://localhost:5173. Open this in your browser to view the website).*

---

## 👑 Default Admin Access
To test the admin features of the platform:
- Go to the **Login** page.
- Enter the mobile number: `admin` or `9999999999`
- You will automatically be granted admin privileges to view the dashboard!

---

## 📁 Project Structure Overview
```
ChadarSamaj/
├── client/                 # React Frontend Application
│   ├── src/                # Front-end React Code (Pages, Components)
│   ├── tailwind.config.js  # Styling Configuration
│   └── package.json        
├── server/                 # Node.js Backend API
│   ├── routes/             # API Endpoints (auth, profile, admin)
│   ├── uploads/            # Uploaded Profile Pictures
│   ├── db.js               # Logic for reading/writing to data.json
│   ├── index.js            # Main Server Entry Point
│   └── data.json           # Local Database File
└── README.md               # Project Documentation
```

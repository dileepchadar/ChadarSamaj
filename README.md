# Simple Matrimony Website

A simple, clean, and fast matrimony platform designed for village/rural users.

## Features
- **User Registration**: Mobile number based (OTP mocked).
- **Profile Creation**: Upload photos and enter details (Age, Caste, Village, etc.).
- **Search**: simple filters for Gender, Age, District.
- **Admin Panel**: Approve/Delete profiles, manage reports.
- **Responsive Design**: Works on Mobile and Desktop.

## Project Structure
- `client/`: Frontend (React + Vite + Tailwind CSS)
- `server/`: Backend (Node.js + Express + MongoDB)

## Setup Instructions

### Prerequisites
- Node.js installed.
- MongoDB installed and running locally, OR a MongoDB Atlas URI.

### 1. Backend Setup
1. Open a terminal.
2. Navigate to the server folder: `cd server`
3. Install dependencies (if not done): `npm install`
4. Start the server:
   ```bash
   node index.js
   ```
   *The server runs on http://localhost:5000*

### 2. Frontend Setup
1. Open a new terminal.
2. Navigate to the client folder: `cd client`
3. Install dependencies (if not done): `npm install`
4. Start the application:
   ```bash
   npm run dev
   ```
5. Open the link shown (usually http://localhost:5173).

## Default Admin Stats
To login as admin, use the mobile number: `admin` (no password for this demo).
Or register a user and manually change `role` to `admin` in MongoDB if you want to test fully.
*Note: The code contains a hardcoded check for mobile='admin' to verify as admin for demo purposes.*

## API Endpoints
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/profiles` (Search)
- POST `/api/profiles` (Create)
- POST `/api/profiles/upload` (Images)

## Design Notes
- Large buttons and clear text for accessibility.
- No chat, no payments, no AI matching as requested.

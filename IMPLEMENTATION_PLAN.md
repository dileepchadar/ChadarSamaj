# Simple Matrimony Implementation Plan

## Project Overview
A simple, clean matrimony website designed for rural users.
**Core Philosophy:** Minimalism, ease of use (large buttons, readable text), and essential features only.

## architecture
- **Frontend**: React (Vite) + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Structure**:
  - `/client`: Frontend application
  - `/server`: Backend API

## Step 1: Project Initialization
- Create `client` directory using Vite (React).
- Create `server` directory with Node.js.
- Set up concurrent running (optional) or separate terminals.

## Step 2: Backend Development (Node.js + Express + MongoDB)
- **Dependencies**: `express`, `mongoose`, `cors`, `dotenv`, `multer` (for images), `nodemon`.
- **Database Schema**:
  - `User`: Mobile, OTP (temp/mock), Role (User/Admin).
  - `Profile`: Name, Age, Gender, Religion, Caste, Village, PhotoURL, etc.
- **API Endpoints**:
  - `POST /api/auth/register` (Mobile + OTP)
  - `POST /api/auth/login`
  - `POST /api/profiles` (Create)
  - `GET /api/profiles` (Search + Filter)
  - `GET /api/profiles/:id` (View Details)
  - `PUT /api/profiles/:id` (Edit)
  - `POST /api/upload` (Photo Upload - Local/Cloudinary)
  - `DELETE /api/profiles/:id` (Admin/Owner)
  - `POST /api/report/:id` (Report)

## Step 3: Frontend Development (React + Tailwind)
- **Styling**: High contrast, large fonts, simple color palette (Warm/Trustworthy colors).
- **Pages**:
  - **Public**: Home (Search/Hero), Login, Register.
  - **Private**: Create/Edit Profile, Dashboard.
  - **Admin**: Dashboard (List, Approve, Delete).
- **Components**:
  - `Navbar` (Simple Logo + Login/Logout)
  - `ProfileCard` (Photo + Key Details)
  - `SearchForm` (Simple Dropdowns)
  - `ContactView` (Hidden until logged in/clicked)

## Step 4: Integration & Testing
- Connect Frontend to Backend APIs.
- storage for images (using local `uploads` folder for simplicity initially, or Cloudinary if configured).
- Test user flow: Register -> Create Profile -> Search -> View Contact.

## Deliverables
- Fully functional source code.
- `README.md` with setup instructions.

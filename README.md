#  Lost & Found Web App

A full-stack web application that enables users to report, track, and recover lost and found items on a campus. This platform is built to streamline the lost-and-found process, improving visibility and increasing the chances of recovering misplaced belongings.

🌐 Live Site: [https://lostfoundapi.netlify.app](https://lostfoundapi.netlify.app)
📆 GitHub Repo: [https://github.com/L-Praveen36/LostFound](https://github.com/L-Praveen36/LostFound)

---

## 📌 Features

### 🧑‍💻 Users

* Report **Lost** or **Found** items by submitting a form with title, description, category, photo, and contact info.
* Browse all items with **filtering** (date, category, location, status).
* Claim items via **email/contact link**.
* Login/Register with **Google authentication**.

### 🔐 Admin Panel

* Moderate and approve posts.
* Mark items as **resolved** or **archived**.

### 📱 UI/UX

* Fully responsive layout for desktop & mobile.
* Modal-based sign-in/sign-up forms.
* Searchable & categorized item listings.

---

## 🛠️ Tech Stack

### Frontend

* **React.js** (with Hooks + Context API)
* **Tailwind CSS** for responsive design
* **Firebase Authentication**
* **Cloudinary** for image uploads

### Backend

* **Node.js** + **Express**
* **Firebase Admin SDK** for auth verification
* **MongoDB** for item storage
* **Nodemailer** for contact notifications

---

## 📁 Project Structure

```
LostFound/
🔹 backend/
│   🔹 routes/          # auth & report routes
│   🔹 models/          # MongoDB schemas (Item, OTP)
│   🔹 middlewares/     # Token verification (user/admin)
│   🔹 utils/           # mailer & Cloudinary config
│   └── firebaseAdmin.js
🔹 frontend/
│   🔹 public/          # static assets, HTML entry
│   └── src/
│       🔹 components/  # all UI components (modals, nav, forms)
│       🔹 pages/       # main app routes
│       🔹 contexts/    # Theme & Auth contexts
│       └── firebase.js      # frontend Firebase config
```

---

##  Getting Started

### Prerequisites

* Node.js ≥ 14
* MongoDB Atlas or local instance
* Firebase project for auth
* Cloudinary account for image storage

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_uri
FIREBASE_PROJECT_ID=your_firebase_project_id
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

Start the backend server:

```bash
npm start
```

---

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

##  Features In Progress / Planned

* 🔔 Email notifications for matched reports
* 🧠 AI-powered image-based search (Future)
* 📊 Analytics dashboard for recovery rates
* 📱 QR Code for mobile access

---

##  Inspiration

This project was built as part of a campus initiative to simplify how students and staff recover lost belongings. Traditional noticeboards and group chats are inefficient. We aimed to solve that with a modern, user-friendly interface backed by real-time data and admin moderation.

---

##  Acknowledgements

* [Firebase](https://firebase.google.com/)
* [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
* [Cloudinary](https://cloudinary.com/)
* [Tailwind CSS](https://tailwindcss.com/)
* [React Icons](https://react-icons.github.io/react-icons/)

---

##  License

MIT License. See `LICENSE` for more details.

---


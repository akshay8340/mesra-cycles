# MesraCycles 🚲 — Campus Cycle Rental App

A peer-to-peer cycle rental platform built for BIT Mesra students. Students who own a cycle can list it
for rent; students who need one (running late for class, or an evening ride) can book it for a few hours.

**Tech Stack:** MongoDB, Express.js, React (Vite), Node.js — MERN
**Extras:** JWT auth, image upload via Cloudinary, role-based Admin Dashboard

---

## Features

- Student signup/login (JWT-based auth)
- List a cycle for rent (with photo, price/hour, pickup location)
- Browse & search available cycles
- Request a booking for a specific time slot, auto-calculated cost
- Owner can accept/reject booking requests
- Renter/owner can mark a booking completed or cancel
- **Admin Dashboard**: view platform stats, block/unblock users, approve/hide/delete cycle
  listings, view all bookings
- Fully responsive (mobile, tablet, desktop)

---

## Project Structure

```
cycle-rental-app/
├── server/              # Backend (Node + Express + MongoDB)
│   ├── config/          # DB & Cloudinary config
│   ├── controllers/     # Route logic
│   ├── middleware/      # Auth & upload middleware
│   ├── models/          # Mongoose schemas (User, Cycle, Booking)
│   ├── routes/          # API routes
│   ├── .env.example
│   └── server.js
└── client/              # Frontend (React + Vite + Tailwind v4)
    ├── src/
    │   ├── api/          # Axios instance
    │   ├── components/   # Navbar, Footer, CycleCard, ProtectedRoute
    │   ├── context/       # AuthContext (global login state)
    │   ├── pages/          # Home, Login, Signup, Browse, CycleDetail,
    │   │                    AddCycle, MyBookings, AdminDashboard, NotFound
    │   └── App.jsx
    └── .env.example
```

---

## PART 1 — Run it on your laptop

### Step 0: Install prerequisites (skip if already done)
- Node.js (v18+) — https://nodejs.org
- Git — https://git-scm.com
- VS Code — https://code.visualstudio.com

### Step 1: Unzip the project
Extract `cycle-rental-app.zip` anywhere on your laptop, e.g. Desktop. Open the extracted
`cycle-rental-app` folder in VS Code (File → Open Folder).

### Step 2: Create a free MongoDB Atlas database
1. Go to https://www.mongodb.com/cloud/atlas/register and sign up (free).
2. Create a free "M0" cluster (any provider/region, defaults are fine).
3. Under **Database Access**, create a database user (username + password — save these).
4. Under **Network Access**, click "Add IP Address" → "Allow access from anywhere" (0.0.0.0/0).
5. Click **Connect** on your cluster → **Drivers** → copy the connection string. It looks like:
   `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
6. Replace `<username>` and `<password>` with the ones you created, and add a database name
   before the `?`, e.g. `.../cycleRentalDB?retryWrites=true...`

### Step 3: Create a free Cloudinary account (for cycle photos)
1. Go to https://cloudinary.com/users/register/free and sign up.
2. On your Dashboard, copy: **Cloud Name**, **API Key**, **API Secret**.

### Step 4: Set up the backend
Open a terminal in VS Code, navigate to the server folder:
```bash
cd cycle-rental-app/server
npm install
```
Now create your real `.env` file:
```bash
cp .env.example .env
```
Open the new `.env` file and fill in your real values:
```
PORT=5000
MONGO_URI=<your MongoDB Atlas connection string from Step 2>
JWT_SECRET=<type any random long string, e.g. mesra_cycles_super_secret_2026>
CLOUDINARY_CLOUD_NAME=<from Step 3>
CLOUDINARY_API_KEY=<from Step 3>
CLOUDINARY_API_SECRET=<from Step 3>
CLIENT_URL=http://localhost:5173
```
Start the backend:
```bash
npm run dev
```
You should see: `Server running on port 5000` and `MongoDB Connected: ...`
Leave this terminal running. Open http://localhost:5000 in a browser — you should see
"BIT Mesra Cycle Rental API is running".

### Step 5: Set up the frontend
Open a **second, new terminal** (keep the backend one running):
```bash
cd cycle-rental-app/client
npm install
```
Create the env file:
```bash
cp .env.example .env
```
The default value `VITE_API_URL=http://localhost:5000/api` is already correct for local dev — no change needed.

Start the frontend:
```bash
npm run dev
```
You'll see something like `Local: http://localhost:5173/`. Open that URL in your browser —
the app should load with the homepage.

### Step 6: Create an admin account
1. On the site, sign up normally like any student (fill the signup form).
2. Go to MongoDB Atlas → Browse Collections → `cycleRentalDB` → `users` collection.
3. Find your user document, click Edit, change `"role": "user"` to `"role": "admin"`, save.
4. Log out and log back in on the site — you'll now see an "Admin" link in the navbar.

You're fully running locally now. 🎉

---

## PART 2 — Deploy it live (so you can share a link)

### Deploy the backend (Render — free tier)
1. Push your code to a GitHub repo (see Part 3 below if you haven't done this yet).
2. Go to https://render.com, sign up, click **New → Web Service**.
3. Connect your GitHub repo, set **Root Directory** to `server`.
4. Build Command: `npm install` | Start Command: `npm start`
5. Add all the same environment variables from your `.env` file (in Render's "Environment" tab).
6. Set `CLIENT_URL` to your future Vercel URL (you can update this after Step 3 below).
7. Deploy. Render will give you a URL like `https://mesracycles-api.onrender.com`.

### Deploy the frontend (Vercel — free tier)
1. Go to https://vercel.com, sign up, click **Add New → Project**.
2. Import the same GitHub repo, set **Root Directory** to `client`.
3. Framework Preset: Vite (auto-detected).
4. Add environment variable: `VITE_API_URL` = `https://mesracycles-api.onrender.com/api`
   (your Render URL + `/api`)
5. Deploy. Vercel gives you a URL like `https://mesracycles.vercel.app`.
6. Go back to Render, update `CLIENT_URL` env variable to this Vercel URL, and redeploy the backend.

Your app is now live and shareable! 🚀

---

## PART 3 — Push to GitHub (do this before deploying)

From the root `cycle-rental-app` folder:
```bash
git init
git add .
git commit -m "Initial commit - MesraCycles cycle rental app"
```
Create a new empty repo on https://github.com/new (don't initialize with README), then:
```bash
git remote add origin https://github.com/<your-username>/cycle-rental-app.git
git branch -M main
git push -u origin main
```

**Important:** `.env` files are already excluded via `.gitignore` — your secrets won't be
pushed to GitHub. Good practice; keep it that way.

---

## Notes for your resume / interview

- Two-sided marketplace model (owner lists supply, renter creates demand) — same core pattern
  as Airbnb/Uber, worth mentioning explicitly.
- Booking has explicit state transitions (`pending → accepted/rejected → completed/cancelled`)
  — a small state machine, good talking point for system design questions.
- Role-based access control (`user` vs `admin`) enforced via middleware, not just hidden UI.
- Image uploads handled via Cloudinary (not stored on your own server) — a common real-world pattern.

## Possible future additions (mention these as "roadmap" in interviews)
- Online payment integration (Razorpay/Stripe) instead of cash/UPI
- Real-time booking status updates via WebSockets
- Rating/review system after each completed booking
- AI chatbot for FAQs using an LLM API

# MesraCycles — Campus Cycle Rental App

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

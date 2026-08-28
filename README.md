# MesraCycles — Campus Cycle Rental & Marketplace

A peer-to-peer platform built for BIT Mesra students. Students who own a cycle can rent it out
by the hour, or list it for sale outright when they're moving on. Students who need a cycle —
running late for class, or want an evening ride — can book or buy one from a hostel-mate.

Designed and built by **Akshay Mishra**.

**Tech Stack:** MongoDB, Express.js, React (Vite), Node.js — MERN
**Extras:** JWT auth, image + video upload via Cloudinary, in-app notifications, role-based Admin Dashboard

---

## Features

- Student signup/login (JWT-based auth)
- **Rent a Cycle** — list a cycle for hourly rent (multiple photos + optional video, price/hour, pickup location)
- **Marketplace** — list a cycle for outright sale (great for graduating seniors passing theirs on)
- Browse & search both rentals and sale listings separately
- Request a booking for a specific time slot, auto-calculated cost
- Owner can accept/reject booking requests; contact details (including a direct WhatsApp link)
  only unlock for the renter once the owner accepts
- Marketplace listings show the seller's contact and WhatsApp link directly to any logged-in student
- In-app notification bell — get notified when your listing is approved, when someone requests
  a booking, and when your booking is accepted or rejected
- Renter/owner can mark a booking completed or cancel
- Payments always happen in person, cash — no in-app payment
- **Admin Dashboard**: view platform stats, block/unblock users, approve/hide/delete listings
  (rent and sell), view all bookings
- Fully responsive (mobile, tablet, desktop)

---

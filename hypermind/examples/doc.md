# Salon Management System - Requirements Document

## 1. Project Overview

### Project Name

Salon Management System

### Project Description

A complete salon management platform for managing appointments, customers, staff, services, inventory, and business operations.

The system consists of:

* Customer Web Panel (No Login)
* Barber Panel
* Manager Panel
* Owner Panel
* Super Admin Panel

---

# 2. User Roles

## 2.1 Customer

* Book appointments without login.
* View upcoming bookings.
* Reschedule appointments.
* Cancel appointments.

## 2.2 Barber

* View assigned appointments.
* Manage appointment status.
* View today's schedule.

## 2.3 Manager

* Manage appointments.
* Manage customers.
* Manage barbers.
* Manage inventory.
* View reports.

## 2.4 Owner

* View all branches.
* View reports and analytics.
* Manage managers.
* View customer history.

## 2.5 Super Admin

* Create salons.
* Block/Unblock salons.
* Manage subscriptions.
* Create branches.
* Manage system settings.

---

# 3. Modules

# 3.1 Customer Web Panel (No Login)

## Customer Identification

1. Enter Phone Number
2. Customer Details

## Booking Flow

3. Category Selection
4. Service Selection
5. Barber Selection
6. Select Date & Time Slot
7. Booking Confirmation
8. Thank You Screen

## Booking Management

9. My Bookings (Current + Upcoming)
10. Booking Details
11. Reschedule Booking
12. Cancel Booking Confirmation
13. Booking Cancelled Success

## System Screens

14. No Booking Found
15. Something Went Wrong
16. 404 Page

---

# 3.2 Barber Panel

## Dashboard

* Today's Appointments
* Upcoming Appointments
* Completed Appointments
* Earnings Summary

## Appointments

* Appointment List
* Appointment Details
* Start Service
* Complete Service

## Profile

* My Profile
* Working Hours
* Holidays

---

# 3.3 Manager Panel

## Dashboard

* Today's Bookings
* Revenue Summary
* Staff Summary
* Inventory Alerts

## Appointment Management

* Appointment List
* Appointment Details
* Create Appointment
* Cancel Appointment
* Reschedule Appointment

## Customer Management

* Customer List
* Customer Details
* Customer History

## Barber Management

* Barber List
* Add Barber
* Update Barber
* Delete Barber

## Service Management

* Category Management
* Service Management

## Inventory Management

* Product List
* Current Stock
* Purchase History
* Sales History

## Reports

* Booking Reports
* Revenue Reports
* Staff Reports
* Inventory Reports

---

# 3.4 Owner Panel

## Dashboard

* Total Revenue
* Total Bookings
* Total Customers
* Total Staff
* Branch Performance

## Branch Management

* View Branches

## Customer Management

* Customer History

## Reports & Analytics

* Revenue Analytics
* Booking Analytics
* Service Analytics
* Staff Analytics

---

# 3.5 Super Admin Panel

## Dashboard

* Total Salons
* Active Salons
* Blocked Salons
* Subscription Summary

## Salon Management

* Create Salon
* Update Salon
* Block Salon
* Unblock Salon
* Delete Salon

## Branch Management

* Add Branch
* Update Branch
* Delete Branch

## Subscription Management

* Subscription Plans
* Assign Plan
* Renew Plan

## System Settings

* Categories
* Languages
* Email Templates
* Global Settings

---

# 4. Appointment Flow

Customer enters phone number
→ Existing customer:
Select Category
→ New customer:
Enter Details
→ Select Service
→ Select Barber
→ Select Date & Time
→ Confirm Booking
→ Thank You

---

# 5. Inventory Flow

Purchase Product
→ Stock Increase

Use Product During Service
→ Stock Decrease

View:

* Current Stock
* Purchase History
* Sales History

---

# 6. Notifications

* Appointment Created
* Appointment Rescheduled
* Appointment Cancelled
* Appointment Reminder

---

# 7. Reports

* Daily Revenue
* Monthly Revenue
* Service Reports
* Customer Reports
* Barber Performance Reports
* Inventory Reports

---

# 8. Non-Functional Requirements

## Performance

* Response Time < 2 seconds
* Pagination for all listing pages
* Lazy loading for large data

## Security

* Role-based access control
* Password encryption
* Input validation
* Audit logs

## UI/UX

* Clean and minimal design
* Responsive layout
* Light theme
* Mobile-friendly
* Consistent design system

---

# 9. Tech Stack (Suggested)

Frontend:

* Next.js
* TypeScript
* Tailwind CSS
* Shadcn UI

Backend:

* Node.js
* Express.js

Database:

* MySQL

Storage:

* AWS S3

Authentication:

* JWT (Admin Panels only)

Deployment:

* Docker
* AWS EC2
* Nginx

---

# 10. Out of Scope

❌ Payment Gateway
❌ Membership System
❌ Rewards System
❌ Customer Login
❌ OTP Verification
❌ Invoices
❌ Loyalty Points
❌ Social Login
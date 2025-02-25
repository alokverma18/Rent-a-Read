# Rent-a-Read

## Introduction

**Rent-a-Read** is a cloud-powered eBook rental platform that enables users to rent books for a limited period securely. It integrates real-time access, role-based authentication, cloud storage for eBook streaming, and additional features such as voice search and recommendations.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Backend Implementation](#backend-implementation)
- [Setting Up Flask](#setting-up-flask)
- [Database Schema](#database-schema)
- [Authentication & Authorization](#authentication--authorization)
- [Google & GitHub OAuth](#google--github-oauth)
- [AWS S3 Integration](#aws-s3-integration)
- [Frontend Implementation](#frontend-implementation)
- [Setting Up Angular](#setting-up-angular)
- [Login & Registration](#login--registration)
- [Book Management](#book-management)
- [Rentals Component](#rentals-component)
- [Streaming eBooks](#streaming-ebooks)
- [Additional Features](#additional-features)
- [Deployment](#deployment)
- [Future Enhancements](#future-enhancements)

---

## Project Overview

Rent-a-Read allows users to:

✅ Sign up as **Reader** or **Bookowner**  
✅ Upload & manage eBooks  
✅ Rent books & access them via **time-limited signed URLs**  
✅ Secure authentication with **JWT & OAuth (Google, GitHub)**  
✅ Cloud storage using **AWS S3**  
✅ Payment processing with **Razorpay (test mode)**  
✅ Advanced filtering & sorting for books  
✅ Voice search for book discovery  
✅ AI-based book recommendations  
✅ Option to listen to book content via text-to-speech  

---

## Tech Stack

- **Frontend:** Angular, TypeScript, Bootstrap  
- **Backend:** Flask, Python, MongoDB  
- **Storage:** AWS S3  
- **Authentication:** JWT, Google OAuth, GitHub OAuth  
- **Payment Gateway:** Razorpay (Test Mode)  
- **Deployment:** Vercel (Frontend), Render (Backend)  

---

## Getting Started

### Prerequisites

- Install [Node.js](https://nodejs.org/)
- Install [MongoDB](https://www.mongodb.com/)
- Install [Python](https://www.python.org/)
- Create a Google OAuth App 
- Create a GitHub OAuth App 
- Set up AWS S3 bucket for eBook storage (can be done via browser)

### Clone the Repository

- Clone the project repository and install dependencies for the backend and frontend.

---

## Backend Implementation

### Setting Up Flask

- Flask is used for backend API development, handling authentication, book rentals, and payment processing.

### Database Schema

- MongoDB is used to store users, books, and rental transactions.

### Authentication & Authorization

- Implements JWT authentication for session management.

### Google & GitHub OAuth

- Supports third-party login authentication.

### AWS S3 Integration

- Used for secure eBook storage and retrieval via signed URLs.

---

## Frontend Implementation

### Setting Up Angular

- Developed using Angular with a responsive UI.

### Login & Registration

- Role-based access for readers and bookowners.
- OAuth login options for Google and GitHub.

### Book Management

- Bookowners can upload, update, and manage books.
- Books are stored in MongoDB and linked to AWS S3.

### Rentals Component

- Readers can rent books and track active rentals.
- Expired rentals disable access automatically.

### Streaming eBooks

- Secure streaming using signed URLs with expiration.

---

## Additional Features

- **Payment Integration:** Razorpay test mode for rental payments.
- **Advanced Filtering & Sorting:** Users can filter books based on genre, author, and price.
- **Analytics Dashboard:** Owners can see their earnings, active renatals etc
- **Voice Search:** Allows searching for books via voice input.
- **Book Recommendations:** AI-powered recommendations based on user preferences.
- **Text-to-Speech:** Readers can listen to book content.

---

## Deployment

### Backend Deployment (Render)

- Hosted on Render for reliable API management.
- Environment variables are configured securely.

### Frontend Deployment (Vercel)

- Hosted on Vercel for efficient frontend delivery.
- Optimized for fast loading and smooth performance.

---

## Future Enhancements

🚀 **Profile Management:** Enabling users to update their profile details.  
🚀 **Subscription Plans:** Introducing premium rental plans for extended access.  
🚀 **Live Reading Sessions:** Allowing multiple readers to engage in shared reading sessions.  

---

## Conclusion

This guide provides a complete step-by-step overview of Rent-a-Read, covering its implementation, features, and deployment strategies. The system ensures secure authentication, seamless cloud storage, and user-friendly eBook rentals with additional functionalities for an enhanced reading experience. 🎉


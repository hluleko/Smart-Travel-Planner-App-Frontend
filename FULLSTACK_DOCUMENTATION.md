# Smart Travel Planner App - Fullstack Documentation

## Overview

The **Smart Travel Planner App** is a fullstack web application that helps users plan, organize, and manage their trips. It provides features such as trip creation, destination management, budgeting, stopovers, allergy tracking, and admin analytics. The app is split into two main parts:

- **Frontend:** Vue.js SPA (Single Page Application)
- **Backend:** Node.js/Express REST API with MySQL database

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [APIs & External Services](#apis--external-services)
- [Frontend](#frontend)
  - [Project Structure](#frontend-project-structure)
  - [Key Components](#frontend-key-components)
  - [API Integration](#frontend-api-integration)
- [Backend](#backend)
  - [Project Structure](#backend-project-structure)
  - [API Endpoints](#backend-api-endpoints)
  - [Database Schema & ERD](#backend-database-schema--erd)
- [Setup & Running](#setup--running)
- [Extending the App](#extending-the-app)
- [License](#license)

---

## Features

- **User Authentication:** Register, login, and manage user profiles.
- **Trip Planning:** Create, view, update, and delete trips.
- **Destinations:** Add and manage destinations for trips.
- **Stops:** Add multiple stops (waypoints) to a trip.
- **Budgeting:** Set and view trip budgets.
- **Allergy Tracking:** Track and manage user allergies.
- **Alerts:** Receive notifications for important actions.
- **Admin Dashboard:** View user and trip statistics, manage data.
- **Export:** Export data to Excel for reporting.

---

## Architecture

- **Frontend:** Vue 3, Vuex, Vue Router, Axios
- **Backend:** Node.js, Express, MySQL, JWT (for authentication), dotenv, CORS

---

## APIs & External Services

- **Google Places API:** Used for place search and autocomplete in trip and stop selection.
- **Google Maps JavaScript API:** Used for displaying maps and directions with stops/waypoints.
- **Axios:** For HTTP requests from frontend to backend.

---

## Frontend

### Frontend Project Structure

```
Smart-Travel-Planner-App-Frontend/
├── public/
│   └── index.html
├── src/
│   ├── api/                # API calls to backend
│   ├── assets/             # Images and static assets
│   ├── components/         # Vue components (TripPlanner, StopSelector, etc.)
│   ├── utils/              # Utility functions
│   ├── views/              # Page-level Vue components (TripsPage, HomePage, etc.)
│   ├── App.vue
│   ├── main.js
│   ├── router.js
│   ├── store.js
│   └── config.js           # API keys and config
├── package.json
└── README.md
```

### Frontend Key Components

- **TripPlanner.vue:** Main trip creation wizard, integrates destination, stops, and budget.
- **StopSelector.vue:** UI for adding/removing stops to a trip (uses Google Places API for search).
- **TripsPage.vue:** Lists all trips for the user, including stops and details.
- **TripDirectionsPage.vue:** Shows trip route with stops on a map (uses Google Maps API).
- **AdminDashboard.vue:** Admin analytics and management.
- **API Integration:** All backend calls are in `src/api/BackendApi.js`.

### Frontend API Integration

- Uses Axios for HTTP requests.
- All endpoints require an `Authorization: Bearer <token>` header for protected routes.
- API base URL is set in `src/api/BackendApi.js`.

---

## Backend

### Backend Project Structure

```
Smart-Travel-Planner-App-Backend/
├── routes/
│   ├── adminRoutes.js
│   ├── alertRoutes.js
│   ├── allergyRoutes.js
│   ├── budgetRoutes.js
│   ├── destinationRoutes.js
│   ├── exportRoutes.js
│   ├── profileRoutes.js
│   ├── stopRoutes.js
│   ├── tripRoutes.js
│   └── userRoutes.js
├── server.js
├── package.json
└── README.md
```

### Backend API Endpoints

- **User:** `/api/users/register`, `/api/users/login`
- **Profile:** `/api/profile/:userId`
- **Trips:** `/api/trips`, `/api/trips/user/:userId`, `/api/trips/:tripId`
- **Destinations:** `/api/destinations`, `/api/destinations/user/:userId`
- **Stops:** `/api/stops`, `/api/stops/trip/:tripId`
- **Budgets:** `/api/budgets`, `/api/budgets/:tripId`
- **Allergies:** `/api/allergies`, `/api/allergies/:userId`
- **Alerts:** `/api/alerts`
- **Admin:** `/api/admin/stats`, `/api/admin/users`, `/api/admin/trips`
- **Export:** `/api/export/:table`, `/api/preview/:table`

All endpoints are RESTful and return JSON.

### Backend Database Schema & ERD

#### Tables

- **user** (`user_id`, `user_role`, `username`, `email`, `password`, `created_at`)
- **trip** (`trip_id`, `user_id`, `destination_id`, `title`, `start_date`, `end_date`, `description`, `starting_point`, `number_of_people`)
- **destination** (`destination_id`, `user_id`, `location`, `address`, `rating`, `photo_url`)
- **stop** (`stop_id`, `trip_id`, `name`, `address`, `location`, `photo_url`, `order_index`)
- **budget** (`budget_id`, `trip_id`, `min_amount`, `max_amount`)
- **allergy** (`allergy_id`, `user_id`, `allergy_type`, `severity`, `notes`)
- **alert** (`alert_id`, `user_id`, `type`, `message`, `created_at`, `seen`)
- **admin** (`id`, `number_of_users_registered`, `number_of_users_deleted`)

#### Entity Relationship Diagram (ERD)

```
[user] 1---n [trip] n---1 [destination]
  |                |
  |                n
  |                [stop]
  |
  n
[allergy]
  |
  n
[alert]

[trip] 1---1 [budget]

[admin] (aggregates stats, not directly related)
```

**Legend:**
- `1---n` = one-to-many
- `n---1` = many-to-one
- `1---1` = one-to-one

#### Relationships Explained
- **user** can have many **trips**, **allergies**, and **alerts**.
- **trip** belongs to one **user** and one **destination**; has many **stops** and one **budget**.
- **destination** can be referenced by many **trips**.
- **stop** belongs to one **trip**.
- **budget** is linked to one **trip**.
- **allergy** and **alert** belong to one **user**.
- **admin** is a stats table (not directly related to other tables).

---

## Setup & Running

### Backend

1. Install dependencies:
   ```
   npm install
   ```
2. Set up `.env` with your MySQL credentials.
3. Start the server:
   ```
   node server.js
   ```
   The backend runs on port 5000 by default.

### Frontend

1. Install dependencies:
   ```
   npm install
   ```
2. Set up `src/config.js` with your Google Maps and Places API key.
3. Start the frontend:
   ```
   npm run serve
   ```
   The frontend runs on port 8080 by default.

---

## Extending the App

- **Add new features:** Create new Vue components and backend routes as needed.
- **API Security:** All protected routes require JWT authentication.
- **Database:** Use MySQL Workbench or CLI to inspect and manage data.
- **Deployment:** Deploy backend (Node.js) and frontend (Vue) separately. Update API URLs as needed.

---

## License

This project is for educational/demo purposes. See individual `README.md` files for more details.
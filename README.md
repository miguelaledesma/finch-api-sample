# Finch Take Home Project

This is a full-stack project to interact with the Finch API. The frontend is built using React (with Vite), and the backend is built using Express. The two are run concurrently using the `concurrently` package.

## Project Structure

- **frontend**: Contains the React frontend built with Vite.
- **backend**: Contains the Express backend that interacts with the Finch API.

## Prerequisites

- Node.js installed on your machine.
- npm (Node Package Manager) installed.

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/miguelaledesma/finch-api-sample.git
cd finch-takehome-project
```

### 2. Install Dependencies

- At the root level run:

`npm install`

### 3. Update `.env` Files as Needed

- You can find `.env` files in both the `frontend` and `backend` folders.
- The **backend** `.env` file allows you to configure the **PORT** for the server (default is 5000).
- The **frontend** `.env` file allows you to configure the **URL** of the backend server (default is `http://localhost:5000`).

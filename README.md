﻿# CryptoDash 📈 - AI-Powered Cryptocurrency Dashboard

CryptoDash is a sleek, modern, and responsive web application that provides real-time cryptocurrency market data. It features an interactive interface, beautiful charts, and leverages the power of the Google Gemini API to deliver AI-generated analysis for individual coins.

![image](https://github.com/user-attachments/assets/5abada00-e25d-49e9-bb7f-5d640081ce0e)


---

## ✨ Key Features

* **Real-Time Data**: Fetches and displays the latest market data for the top 100 cryptocurrencies.
* **Interactive Charts**: Visualizes price history with beautiful, interactive charts from Recharts.
* **💡 AI-Powered Analysis**: Integrates Google's Gemini API to provide on-demand, in-depth analysis of any selected cryptocurrency.
* **🌓 Light & Dark Mode**: A seamless theme-switching experience for user comfort.
* **🔍 Live Search**: Instantly filter and find coins by name or symbol.
* **📱 Fully Responsive**: A clean and functional UI that works perfectly on desktop, tablets, and mobile devices.
* **Robust Backend**: A dedicated Node.js/Express server to proxy API requests, keeping API keys and logic secure.
* **Fallback Mechanism**: Gracefully falls back to mock data if the backend server is unavailable, allowing for uninterrupted frontend development.

---

## 🛠️ Tech Stack

This project is a full-stack application built with modern technologies.

**Frontend:**
* **[React](https://reactjs.org/)**: A JavaScript library for building user interfaces.
* **[Tailwind CSS](https://tailwindcss.com/)**: A utility-first CSS framework for rapid UI development.
* **[Recharts](https://recharts.org/)**: A composable charting library built on React components.
* **[Lucide React](https://lucide.dev/)**: Beautiful and consistent icons.

**Backend:**
* **[Node.js](https://nodejs.org/)**: A JavaScript runtime built on Chrome's V8 engine.
* **[Express.js](https://expressjs.com/)**: A minimal and flexible Node.js web application framework.
* **[Axios](https://axios-http.com/)**: A promise-based HTTP client for making requests.
* **[CORS](https://expressjs.com/en/resources/middleware/cors.html)**: Middleware for enabling Cross-Origin Resource Sharing.

**API & Services:**
* **[CoinGecko API](https://www.coingecko.com/en/api)**: For real-time cryptocurrency market data.
* **[Google Gemini API](https://ai.google.dev/)**: For generating AI-powered coin analysis.

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

* **Node.js**: Make sure you have Node.js installed (which includes npm). You can download it from [nodejs.org](https://nodejs.org/).
* **Gemini API Key**: You need an API key from Google to use the AI features. Get one for free at [Google AI Studio](https://aistudio.google.com/app/apikey).

### Installation & Setup

1.  **Clone the Repository**
    ```bash
    git clone [https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git](https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git)
    cd YOUR_REPOSITORY_NAME
    ```

2.  **Set Up the Backend**
    ```bash
    # Navigate to the backend directory
    cd backend

    # Install dependencies
    npm install

    # Start the backend server (it will run on http://localhost:5000)
    node server.js
    ```
    Keep this terminal window open.

3.  **Set Up the Frontend**
    Open a **new terminal window**.
    ```bash
    # Navigate to the frontend directory from the project root
    cd frontend

    # Install dependencies
    npm install
    ```

4.  **Create the Environment File**
    * In the `frontend` directory, create a new file named `.env`.
    * Add your Google Gemini API key to this file:
        ```
        REACT_APP_GEMINI_API_KEY=YOUR_API_KEY_HERE
        ```

5.  **Run the Frontend**
    ```bash
    # Start the React development server (it will open in your browser)
    npm start
    ```

The application should now be running, with the frontend at `http://localhost:3000` communicating with the backend at `http://localhost:5000`.

---

## 📁 Folder Structure

The project uses a monorepo-style structure to keep the frontend and backend code separate but within the same repository.

    crypto-dashboard-project/
    ├── backend/
    │   ├── node_modules/
    │   ├── package.json
    │   └── server.js             # Express server and API logic
    ├── frontend/
    │   ├── node_modules/
    │   ├── public/
    │   ├── src/
    │   │   ├── App.js            # Main React application component
    │   │   └── index.css         # Tailwind CSS directives
    │   ├── .env                  # Environment variables (for API keys)
    │   ├── package.json
    │   └── tailwind.config.js    # Tailwind CSS configuration
    ├── .env                      # Environment variables (for API keys)
    ├── package.json
    └── tailwind.config.js        # Tailwind CSS configuration


## 📄 API Reference

### GET `/api/crypto`

Fetches market data for the top 100 cryptocurrencies from the CoinGecko API.

**Parameters:** None

**Success Response:**
* **Code:** 200
* **Content:** An array of coin objects.
    ```json
    [
      {
        "id": "bitcoin",
        "symbol": "btc",
        "name": "Bitcoin",
        "current_price": 61000.50,
        "market_cap": 1200000000000,
        "price_change_percentage_24h": 1.25,
        "sparkline_in_7d": { "price": [...] }
      },
      ...
    ]
    ```

**Error Response:**
* **Code:** 500 Internal Server Error
* **Content:** `{ "message": "Internal Server Error..." }`

---

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
</markdown>

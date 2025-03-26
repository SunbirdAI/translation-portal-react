# Translation Portal

## Description

Translation Portal is a Vite-powered React application for performing translations efficiently. It integrates with Sunbird AI's translation API to provide seamless language translation.

## Features

- **Fast Development** with Vite
- **React Router** for seamless navigation
- **API Integration** with `api.sunbird.ai`

## Tech Stack

- **Frontend:** Vite + React
- **Styling:** Tailwind CSS, Material-UI

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- npm or yarn package manager

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SunbirdAI/translation-portal-react.git
   ```
2. **Navigate to the project directory:**
   ```bash
   cd translation-portal-react
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Create a `.env` file in the root directory** and add the following environment variables:
   ```bash
   VITE_SB_API_URL=<your_api_url>
   VITE_SB_API_TOKEN=<your_api_token>
   VITE_GA4_TRACKING_ID=<your_tracking_id>
   VITE_GA4_MEASUREMENT_ID=<your_measurement_id>
   VITE_FEEDBACK_URL=<your_feedback_url>
   ```
5. **Start the development server:**

   ```bash
   npm run dev
   ```

   or

   ```bash
   npm start
   ```

   The application will be available at `http://localhost:3000/`

# Medico Backend - Local Development Guide

This guide explains how to run the Medico backend locally and connect it to a Vercel-hosted frontend.

## Prerequisites
- Node.js installed
- MongoDB installed and running locally
- [ngrok](https://ngrok.com/download) installed (for exposing local server to Vercel)

## Setup & Installation

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Variables**:
    Create a `.env` file in the root directory (copy `.env.example` as a template) and set your variables.

3.  **Start the Server**:
    ```bash
    npm start
    ```
    The server typically runs on `http://localhost:5000`.

## Connecting to Vercel Frontend (Fixing Mixed Content)

Since Vercel serves your frontend over HTTPS, it cannot talk to `http://localhost:5000` directly due to security rules (Mixed Content). You must expose your local backend via HTTPS using `ngrok`.

### Steps:

1.  **Start ngrok**:
    Open a new terminal and run:
    ```bash
    ngrok http 5000
    ```
    *This assumes your backend runs on port 5000.*

2.  **Copy the Forwarding URL**:
    ngrok will display a URL like `https://a1b2-c3d4.ngrok-free.app`. Copy this URL.

3.  **Update Local Backend Config**:
    In your local `.env` file, update:
    ```
    FRONTEND_URL=https://your-vercel-app.vercel.app
    ```
    *This allows the Vercel app to make requests to your backend (CORS).*

4.  **Update Vercel Frontend Config**:
    Go to your Vercel Dashboard -> Settings -> Environment Variables.
    Update `NEXT_PUBLIC_API_URL` to your **ngrok URL** (e.g., `https://a1b2-c3d4.ngrok-free.app/api`).

5.  **Restart**:
    Restart your local backend (`npm start`) if you changed the `.env` file.

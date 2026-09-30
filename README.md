# Student Tech Hub ⚡

A beginner-friendly, lightweight full-stack web application designed for student tech communities to view upcoming technical events and register for workshops.

Built with **plain HTML, CSS, JavaScript** on the frontend and **Python FastAPI** on the backend.

---

## 📖 Table of Contents

- [What the Project Does](#what-the-project-does)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [How to Install the Backend](#how-to-install-the-backend)
- [How to Run the Backend](#how-to-run-the-backend)
- [How to Run the Frontend Locally](#how-to-run-the-frontend-locally)
- [How the Frontend Communicates with the Backend](#how-the-frontend-communicates-with-the-backend)
- [API Endpoints](#api-endpoints)
- [Troubleshooting & Beginner FAQ](#troubleshooting--beginner-faq)

---

## What the Project Does

The **Student Tech Hub** application provides a clean, responsive interface where students can:
1. **View Upcoming Events**: Browse technical workshops, hackathons, and webinars loaded dynamically from the backend.
2. **On-Demand Loading**: Fetch the latest events at any time with a click of the **Load Events** button.
3. **Student Registration**: Register by submitting their name and email through a clean form that sends the data to the backend API with real-time feedback.

There are **no databases, no authentication systems, and no complex frameworks** (like React or Next.js) — making this an ideal project to understand how frontend web pages communicate with Python backend APIs using HTTP and JSON.

---

## Project Structure

```text
student-tech-hub/
├── frontend/
│   ├── index.html       # Webpage structure & layout
│   ├── style.css        # Clean, modern, responsive styling
│   └── script.js        # Logic for fetching events & submitting registration
├── backend/
│   ├── main.py          # FastAPI application & API endpoints
│   └── requirements.txt # Python dependencies (fastapi, uvicorn, pydantic)
└── README.md            # Documentation & setup instructions
```

---

## Prerequisites

Before starting, ensure you have:
- **Python 3.8 or higher** installed on your computer. You can check your version by running:
  ```bash
  python --version
  ```
- Any modern web browser (e.g., Google Chrome, Firefox, Microsoft Edge, Brave).

---

## How to Install the Backend

1. **Open your terminal or command prompt** and navigate into the `backend` folder:
   ```bash
   cd student-tech-hub/backend
   ```

2. *(Recommended)* **Create a virtual environment** to keep project dependencies isolated:
   - **On Windows (PowerShell / Command Prompt):**
     ```powershell
     python -m venv venv
     ```
   - **On macOS / Linux:**
     ```bash
     python3 -m venv venv
     ```

3. **Activate the virtual environment**:
   - **Windows PowerShell:**
     ```powershell
     .\venv\Scripts\Activate.ps1
     ```
     *(If PowerShell displays a script execution error, run: `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` then activate again).*
   - **Windows Command Prompt (cmd):**
     ```cmd
     venv\Scripts\activate.bat
     ```
   - **macOS / Linux:**
     ```bash
     source venv/bin/activate
     ```

4. **Install the required packages**:
   ```bash
   pip install -r requirements.txt
   ```

---

## How to Run the Backend

Make sure you are inside the `backend` directory (with your virtual environment activated, if used):

```bash
python -m uvicorn main:app --reload
```

- `main`: points to the `main.py` file.
- `app`: refers to the `app = FastAPI()` object inside `main.py`.
- `--reload`: automatically restarts the server whenever you edit and save `main.py`.

Once running, you will see output similar to:
```text
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Application startup complete.
```

### Useful Backend URLs:
- **API Base:** [http://127.0.0.1:8000](http://127.0.0.1:8000)
- **Events JSON Endpoint:** [http://127.0.0.1:8000/api/events](http://127.0.0.1:8000/api/events)
- **Interactive Swagger Docs:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) (Try out endpoints right from your browser!)

---

## How to Run the Frontend Locally

Keep the backend terminal running, and open a **second terminal window** to run the frontend.

You can run the frontend using any of the following methods:

### Method 1: Using Python's built-in HTTP server (Recommended)
1. Open a new terminal and navigate to the `frontend` folder:
   ```bash
   cd student-tech-hub/frontend
   ```
2. Start a simple local web server:
   ```bash
   python -m http.server 3000
   ```
3. Open your browser and visit:
   [http://127.0.0.1:3000](http://127.0.0.1:3000)

### Method 2: Open `index.html` directly in your browser
1. Open your computer's File Explorer (or Finder on macOS).
2. Go to `student-tech-hub/frontend/`.
3. Double-click `index.html` to open it in your browser (or right-click → **Open with** → your favorite browser).

### Method 3: Using VS Code Live Server
1. Open the `student-tech-hub` folder in Visual Studio Code.
2. If you have the **Live Server** extension installed, right-click `frontend/index.html` and select **"Open with Live Server"**.

---

## How the Frontend Communicates with the Backend

Here is a simplified step-by-step overview of how the two sides talk to each other:

```
+--------------------------+                         +--------------------------+
|         FRONTEND         |                         |         BACKEND          |
| (HTML + CSS + JavaScript)|                         |     (Python + FastAPI)   |
|                          |                         |                          |
|  User clicks             |   GET /api/events       |                          |
|  "Load Events"    ------>|------------------------>|  Reads SAMPLE_EVENTS     |
|                          |   Returns JSON Array    |                          |
|  Renders event cards <---|-------------------------|<-------------------------+
|                          |                         |
|  User fills form &       |   POST /api/register    |                          |
|  clicks "Register"------>|  {"name": "...", ...}   |  Validates name & email  |
|                          |------------------------>|                          |
|  Shows success     <-----|   HTTP 201 Response     |                          |
|  notification            |<------------------------|<-------------------------+
+--------------------------+                         +--------------------------+
```

### 1. HTTP GET Request (Fetching Events)
- When the user clicks the **Load Events** button, JavaScript executes:
  ```javascript
  const response = await fetch('http://127.0.0.1:8000/api/events');
  const data = await response.json();
  ```
- The backend handles this in `main.py` under the `@app.get("/api/events")` function and returns sample event data formatted as JSON.
- JavaScript receives this JSON and dynamically generates the HTML cards.

### 2. HTTP POST Request (Registering a Student)
- When the user submits the registration form, JavaScript prevents the default page reload (`e.preventDefault()`).
- It grabs the user's name and email, packages them into a JSON string, and sends a POST request:
  ```javascript
  const response = await fetch('http://127.0.0.1:8000/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: name, email: email })
  });
  ```
- FastAPI receives this payload, validates it using Pydantic's `StudentRegistration` model, and replies with a `201 Created` status and a friendly confirmation message.
- The frontend reads this confirmation and displays a green success banner.

### 3. What is CORS and why is it needed?
- **CORS** stands for **Cross-Origin Resource Sharing**.
- For security, web browsers prevent a frontend running on one origin (like `http://127.0.0.1:3000` or `file://`) from requesting data from another origin (like `http://127.0.0.1:8000`), unless the backend explicitly permits it.
- In `backend/main.py`, CORS is enabled with:
  ```python
  from fastapi.middleware.cors import CORSMiddleware

  app.add_middleware(
      CORSMiddleware,
      allow_origins=["*"],  # Allows all origins for local learning/development
      allow_credentials=True,
      allow_methods=["*"],
      allow_headers=["*"],
  )
  ```
  This header tells the browser: *"It's safe to let the frontend read responses from this backend!"*

---

## API Endpoints

| HTTP Method | Endpoint | Description | Request Body | Sample Response |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/` | API status check & endpoint guide | None | `{"status": "online", ...}` |
| `GET` | `/api/events` | List all upcoming events | None | `{"success": true, "events": [...]}` |
| `POST` | `/api/register` | Register a student | `{"name": "Alex", "email": "alex@uni.edu"}` | `{"success": true, "message": "..."}` |
| `GET` | `/docs` | Interactive Swagger API documentation | None | HTML Interface |

---

## Troubleshooting & Beginner FAQ

### 1. "Could Not Connect to Backend" error in the browser
- **Cause:** The FastAPI backend server is not running or running on a different port.
- **Fix:** Make sure you ran `python -m uvicorn main:app --reload` inside the `backend` folder and verify it says `http://127.0.0.1:8000`.

### 2. "Command not found: uvicorn" on Windows
- **Cause:** Python's `Scripts` folder might not be in your Windows system `PATH`.
- **Fix:** Use `python -m uvicorn main:app --reload` instead of typing `uvicorn` directly. This uses Python directly to execute the module.

### 3. `Script execution is disabled on this system` in PowerShell
- **Cause:** Windows PowerShell restricted execution policy for scripts.
- **Fix:** Run this command in PowerShell:
  ```powershell
  Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
  ```
  Then reactivate your virtual environment.

### 4. How do I stop the server?
- Press `Ctrl + C` in the terminal where the server is running.

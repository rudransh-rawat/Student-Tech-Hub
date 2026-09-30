from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any

# 1. Initialize the FastAPI application
app = FastAPI(
    title="Student Tech Hub API",
    description="A simple, beginner-friendly backend API for Student Tech Hub.",
    version="1.0.0"
)

# 2. Configure CORS (Cross-Origin Resource Sharing)
# This allows the frontend (running on a different port or file URL) to make requests to this backend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for local beginner development
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],  # Allows all HTTP headers
)

# 3. Pydantic model for registration request validation
class StudentRegistration(BaseModel):
    name: str = Field(..., min_length=2, description="Student's full name")
    email: str = Field(..., min_length=5, description="Student's email address")

# 4. Sample event data
# In a full-scale app, this would come from a database. For learning, a Python list is perfect!
SAMPLE_EVENTS: List[Dict[str, Any]] = [
    {
        "id": 1,
        "title": "Modern Web Development Workshop",
        "date": "October 15, 2026",
        "time": "10:00 AM - 1:00 PM",
        "location": "Innovation Lab & Online",
        "category": "Web Dev",
        "description": "Learn the essentials of HTML, CSS, and modern JavaScript to build interactive web applications."
    },
    {
        "id": 2,
        "title": "Introduction to AI & Prompt Engineering",
        "date": "October 22, 2026",
        "time": "2:00 PM - 4:30 PM",
        "location": "Auditorium A",
        "category": "AI / ML",
        "description": "Hands-on session exploring how Large Language Models work, prompt strategies, and AI-powered coding."
    },
    {
        "id": 3,
        "title": "Campus Hackathon 2026",
        "date": "November 05-06, 2026",
        "time": "24-Hour Event",
        "location": "Student Innovation Center",
        "category": "Hackathon",
        "description": "Collaborate in teams of 2 to 4 to design, build, and pitch creative tech solutions. Prizes for top 3 teams!"
    },
    {
        "id": 4,
        "title": "Cloud Computing & DevOps 101",
        "date": "November 18, 2026",
        "time": "3:00 PM - 5:00 PM",
        "location": "Virtual / Zoom",
        "category": "Cloud & DevOps",
        "description": "Discover containerization, serverless architectures, and CI/CD deployment pipelines from industry experts."
    },
    {
        "id": 5,
        "title": "Open Source Contribution Sprint",
        "date": "December 02, 2026",
        "time": "11:00 AM - 3:00 PM",
        "location": "Tech Hub Room 204",
        "category": "Open Source",
        "description": "Get guided assistance making your very first open-source contribution to popular developer tools."
    }
]

# In-memory storage for registrations (simple list, resets when server restarts)
registered_students: List[Dict[str, str]] = []


# 5. API Endpoints

@app.get("/")
def read_root():
    """Friendly welcome endpoint for beginners visiting the API URL directly."""
    return {
        "message": "Welcome to the Student Tech Hub API!",
        "status": "online",
        "available_endpoints": {
            "get_events": "/api/events",
            "register_student": "/api/register (POST)",
            "interactive_docs": "/docs"
        }
    }


@app.get("/api/events")
def get_events():
    """
    GET endpoint that returns sample upcoming technical events as JSON.
    """
    return {
        "success": True,
        "count": len(SAMPLE_EVENTS),
        "events": SAMPLE_EVENTS
    }


@app.post("/api/register", status_code=status.HTTP_201_CREATED)
def register_student(student: StudentRegistration):
    """
    POST endpoint that accepts a student's name and email, validates them,
    and returns a success confirmation.
    """
    clean_name = student.name.strip()
    clean_email = student.email.strip().lower()

    # Basic email format check without needing heavy external dependencies
    if "@" not in clean_email or "." not in clean_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please provide a valid email address with an '@' and a domain."
        )

    # Store registration in our simple in-memory list
    record = {
        "name": clean_name,
        "email": clean_email
    }
    registered_students.append(record)

    # Return confirmation response
    return {
        "success": True,
        "message": f"Congratulations {clean_name}! You have successfully registered for the Student Tech Hub.",
        "student": record,
        "total_registrations": len(registered_students)
    }

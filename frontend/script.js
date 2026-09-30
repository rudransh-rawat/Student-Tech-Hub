/**
 * Student Tech Hub - Frontend Logic (Vanilla JavaScript)
 * 
 * This file handles:
 * 1. Fetching upcoming technical events from the FastAPI backend (GET /api/events)
 * 2. Sending student registrations to the FastAPI backend (POST /api/register)
 * 3. Handling loading states and displaying feedback messages to the user
 */

// 1. Backend API Configuration
// When running locally, FastAPI defaults to port 8000
const API_BASE_URL = 'http://127.0.0.1:8000';

// 2. DOM Elements
const loadEventsBtn = document.getElementById('loadEventsBtn');
const loadEventsBtnText = document.getElementById('loadEventsBtnText');
const eventsContainer = document.getElementById('eventsContainer');

const registrationForm = document.getElementById('registrationForm');
const studentNameInput = document.getElementById('studentName');
const studentEmailInput = document.getElementById('studentEmail');
const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const submitBtn = document.getElementById('submitBtn');
const submitBtnText = document.getElementById('submitBtnText');
const statusMessage = document.getElementById('statusMessage');

// ==========================================================================
// Function: Fetch and Display Events (GET /api/events)
// ==========================================================================
async function loadEvents() {
  // Update button state while loading
  loadEventsBtn.disabled = true;
  loadEventsBtnText.textContent = 'Fetching Events...';

  // Show a temporary loading placeholder
  eventsContainer.innerHTML = `
    <div class="placeholder-card">
      <div class="placeholder-icon">⏳</div>
      <h3>Connecting to backend...</h3>
      <p>Fetching events from <code>${API_BASE_URL}/api/events</code></p>
    </div>
  `;

  try {
    // Send GET request to FastAPI backend
    const response = await fetch(`${API_BASE_URL}/api/events`);

    if (!response.ok) {
      throw new Error(`Server returned status: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const events = data.events || [];

    // Render events or show empty state
    if (events.length === 0) {
      eventsContainer.innerHTML = `
        <div class="placeholder-card">
          <div class="placeholder-icon">ℹ️</div>
          <h3>No events found</h3>
          <p>There are currently no scheduled events. Check back soon!</p>
        </div>
      `;
      return;
    }

    // Generate HTML for each event card
    eventsContainer.innerHTML = events.map(event => `
      <article class="event-card">
        <div>
          <div class="event-header">
            <span class="event-category">${escapeHTML(event.category || 'Event')}</span>
          </div>
          <h3>${escapeHTML(event.title)}</h3>
          <div class="event-meta">
            <div class="meta-item">
              <span>📅</span>
              <span><strong>${escapeHTML(event.date)}</strong></span>
            </div>
            <div class="meta-item">
              <span>⏰</span>
              <span>${escapeHTML(event.time || 'TBA')}</span>
            </div>
            <div class="meta-item">
              <span>📍</span>
              <span>${escapeHTML(event.location || 'Online')}</span>
            </div>
          </div>
        </div>
        <p class="event-description">${escapeHTML(event.description)}</p>
      </article>
    `).join('');

  } catch (error) {
    console.error('Error fetching events:', error);

    // Beginner-friendly error display explaining potential reasons
    eventsContainer.innerHTML = `
      <div class="placeholder-card" style="border-color: var(--error-border);">
        <div class="placeholder-icon">⚠️</div>
        <h3 style="color: var(--error-text);">Could Not Connect to Backend</h3>
        <p style="margin-bottom: 0.75rem;">
          Make sure your Python FastAPI server is running at <strong>${API_BASE_URL}</strong>.
        </p>
        <p style="font-size: 0.85rem; color: var(--text-muted);">
          To start the backend, open a terminal in <code>student-tech-hub/backend</code> and run:<br>
          <code style="background: #f1f5f9; padding: 2px 6px; border-radius: 4px; display: inline-block; margin-top: 4px;">
            python -m uvicorn main:app --reload
          </code>
        </p>
      </div>
    `;
  } finally {
    // Reset button state
    loadEventsBtn.disabled = false;
    loadEventsBtnText.textContent = 'Refresh Events';
  }
}

// ==========================================================================
// Function: Register Student (POST /api/register)
// ==========================================================================
async function handleRegistration(e) {
  e.preventDefault();

  // Reset errors and alerts
  nameError.textContent = '';
  emailError.textContent = '';
  hideStatusMessage();

  const name = studentNameInput.value.trim();
  const email = studentEmailInput.value.trim();

  // Basic client-side validation
  let hasError = false;

  if (!name || name.length < 2) {
    nameError.textContent = 'Please enter your full name (at least 2 characters).';
    hasError = true;
  }

  if (!email || !email.includes('@') || !email.includes('.')) {
    emailError.textContent = 'Please enter a valid email address.';
    hasError = true;
  }

  if (hasError) return;

  // Set loading state on submit button
  submitBtn.disabled = true;
  submitBtnText.textContent = 'Registering...';

  try {
    // Send POST request with JSON payload to backend
    const response = await fetch(`${API_BASE_URL}/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        email: email
      })
    });

    const result = await response.json();

    if (!response.ok) {
      // Backend returned an error response (like 400 or 422)
      const errorMsg = result.detail || 'Failed to register. Please check your information.';
      showStatusMessage(errorMsg, 'error');
      return;
    }

    // Registration succeeded!
    showStatusMessage(
      `🎉 ${result.message || 'You have successfully registered!'}`,
      'success'
    );

    // Clear form inputs
    registrationForm.reset();

  } catch (error) {
    console.error('Registration network error:', error);
    showStatusMessage(
      `⚠️ Could not connect to backend server at ${API_BASE_URL}. Ensure the FastAPI server is running.`,
      'error'
    );
  } finally {
    // Reset submit button
    submitBtn.disabled = false;
    submitBtnText.textContent = 'Register Now';
  }
}

// ==========================================================================
// Helper Functions
// ==========================================================================

/**
 * Display a user feedback banner (success or error)
 */
function showStatusMessage(text, type) {
  statusMessage.textContent = text;
  statusMessage.className = `status-box ${type}`;
  statusMessage.style.display = 'block';

  // Smooth scroll to message on smaller screens
  statusMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Hide the feedback banner
 */
function hideStatusMessage() {
  statusMessage.style.display = 'none';
  statusMessage.textContent = '';
  statusMessage.className = 'status-box';
}

/**
 * Escape HTML to prevent basic XSS when rendering dynamic text
 */
function escapeHTML(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ==========================================================================
// Event Listeners
// ==========================================================================
loadEventsBtn.addEventListener('click', loadEvents);
registrationForm.addEventListener('submit', handleRegistration);

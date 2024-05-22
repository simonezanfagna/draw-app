# Draw App

#### Description:

A web application that enables users to create and manage black and white drawings. This project combines various frontend and backend technologies to provide a user-friendly experience for drawing.

The main features of the application include user authentication, a drawing interface, and options to save, view, and manage drawings.

## Project Structure

#### Frontend

The frontend of the application is built using React and several supporting libraries and frameworks:

- React: Provides the foundation for building the user interface.
- React-Router: Manages the application's navigation and routing.
- Vite.js: Serves as the build tool and development server for a fast and optimized development experience.
- Axios: Handles HTTP requests to the backend API.
- Sass: Used for styling the application with more flexibility and efficiency.
  Key Files
- index.html: The main HTML file that includes the root element for the React app.
- App.jsx: The root React component that sets up routing and renders the main layout.
- components/: This directory contains reusable React components such as Navbar, Toolbar, Canvas, FormRow, and DrawingsContainer.
- pages/: This directory contains all pages Dashboard, Error, Landing, Register.

#### Backend

The backend is implemented using Python and Flask, along with several extensions and libraries:

- Flask: The core web framework used to build the server-side application.
- Flask-Session: Manages user sessions.
- Flask-SQLAlchemy: ORM for database interactions.
- Flask-Migrate: Handles database migrations.
- CORS: Enables cross-origin resource sharing, allowing the frontend to communicate with the backend.
- PIL (Pillow): Used for image processing.
- Werkzeug.security: Provides utilities for securely handling passwords.

Key Files

- app.py: The main application file containing all routes and configurations.
- helpers.py: Contains utility functions such as login_required and validate_email.

### Detailed File Descriptions

#### Frontend

- index.html: The entry point for the React application. It includes a root div where the React components are rendered.

- App.jsx: Sets up the main application routes using React-Router. It defines routes for the landing, dashboard, register, and drawings.

- components/:

  - Toolbar.jsx: It includes tools for selecting the background color, tool color, transparency, size, and eraser. It also provides options to clear the canvas and save the drawing.
  - Canvas.jsx: The core component for drawing.
  - Register.jsx: Manages user registration/login.
  - DrawingContainer.jsx: Displays saved drawings with options to delete or download each one.
  - FormRow.jsx: Component that can be used to create registration/login forms.
  - Navbar.jsx: component that allows the user to navigate the application.

- pages/:

  - Dashboard.jsx: The main dashboard page component.
  - Drawings.jsx: A component that lists all the user's drawings.
  - ProtectedRoute.jsx: Component that protects routes which require a logged-in user.
  - SharedLayout.jsx: Layout component that includes common UI parts used across various authenticated pages.
  - Error.jsx: Displays a not found page.
  - Landing.jsx: The landing page of the app, generally the first page a user sees before logging in.
  - Register.jsx: Handles user registration/login.

- context.jsx: Contains functions for making API calls to the backend endpoints for user registration, login, logout, saving drawings, fetching drawings, and deleting drawings.

#### Backend

- app.py: Contains the Flask application setup and all route handlers.

- User Registration (/api/register): Handles new user registrations, validating input, hashing passwords, and saving users to the database.
- User Login (/api/login): Manages user authentication, validating credentials, and maintaining session data.
- User Logout (/api/logout): Clears the session to log out users.
- Add Drawing (/api/addDrawing): Saves a new drawing for the logged-in user. It processes the drawing data, ensures it meets size requirements, and stores it in the database.
- Get All Drawings (/api/getAllDrawings): Retrieves all saved drawings for the logged-in user, encoding the image data for frontend display.
- Delete Drawing (/api/deleteDrawing): Deletes a specified drawing if the user is authorized.
- Download Drawing (/api/downloadDrawing/<int:drawing_id>): Provides a downloadable version of a specified drawing if the user is authorized.
- Database models:
  - User: Contains user information such as email, name, hashed password, and relationships to drawings.
  - Drawing: Contains drawing data and a foreign key relationship to the user.
- helpers.py:
  - login_required: A decorator to ensure routes are only accessible to logged-in users.
  - validate_email: Validates email format.

####

Design Choices

Authentication and Session Management
Flask-Session is used for session management to keep track of logged-in users. Passwords are hashed using Werkzeug's generate_password_hash function to ensure they are stored securely.

Image Processing

Pillow (PIL) is used for processing and handling image data. Drawings are received as base64-encoded strings, decoded, and then processed to ensure they meet the required dimensions before being saved.

Data Storage

SQLite is used as the database for simplicity and ease of use in a project of this scope. Flask-SQLAlchemy and Flask-Migrate provide ORM capabilities and database migration tools, making database interactions more straightforward and maintainable.

Frontend-Backend Communication

Axios is used for making HTTP requests from the frontend to the backend. This separation of concerns ensures that the frontend remains decoupled from the backend, allowing for better scalability and maintainability.

Styling

Sass is used for styling the frontend.

###

###

## Setup and Installation

To run this project locally, follow the steps below:

### Prerequisites

Ensure you have the following installed on your machine:

Node.js
npm (Node Package Manager)
Python
pip (Python Package Installer)
Virtualenv (for creating a virtual environment)

#### Frontend Setup

```
npm install

npm run dev
```

#### Backend Setup

```
python -m venv venv
source venv/bin/activate # On Windows use `venv\Scripts\activate`

pip install -r requirements.txt

flask db init
flask db migrate -m "Initial migration."
flask db upgrade

flask run
python app.py
```

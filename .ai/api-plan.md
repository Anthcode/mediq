# REST API Plan

This document outlines the comprehensive REST API design based on the provided database schema, product requirements (PRD), and technical stack.

## 1. Resources

- **Users**: Managed by Supabase Auth (read-only from our API perspective)
- **Profiles**: Extended user information (1:1 with users)
- **Doctors**: Main resource for physicians’ data
- **Addresses**: Addresses linked to doctors (1:N)
- **Specialties**: List of medical specialties
- **Doctors_Specialties**: Many-to-many relation between doctors and specialties
- **Expertise_Areas**: Administrator-defined areas of expertise
- **Doctors_Expertise_Areas**: Many-to-many relation between doctors and expertise areas
- **Ratings**: Patient ratings for doctors
- **Search_History**: Storage of users’ search queries and AI analysis results

## 2. Endpoints

### 2.1. Doctors (CRUD)

- **GET /doctors**  
  _Description_: Retrieve a paginated list of doctors with optional filters and sorting (e.g., by experience, specialty, location, and match score).  
  _Query Parameters_:  
  - `page`: Page number  
  - `limit`: Number of items per page  
  - `sort`: Field to sort (e.g., experience, match_score)  
  - `filter`: JSON object or query string to filter by specialty, city, active status, etc.  
  _Response JSON Example_:

  ```json
  {
    "data": [
      {
        "id": "uuid",
        "first_name": "John",
        "last_name": "Doe",
        "experience": 10,
        "education": "Medical School",
        "bio": "Experienced physician...",
        "profile_image_url": "...",
        "active": true,
        "created_at": "2025-05-02T12:00:00Z",
        "updated_at": "2025-05-02T12:00:00Z",
        "specialties": [ { "id": "uuid", "name": "Cardiology" } ],
        "expertise_areas": [ { "id": "uuid", "name": "Heart Disease" } ],
        "addresses": [ { "street": "...", "city": "City", "state": "State" } ]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100
    }
  }
  ```

  _Success Codes_: 200 OK  
  _Error Codes_: 400 Bad Request, 500 Internal Server Error

- **GET /doctors/{doctorId}**  
  _Description_: Retrieve detailed information of a specific doctor.  
  _URL Parameter_: `doctorId` - UUID of the doctor.  
  _Response JSON Example_:

  ```json
  {
    "id": "uuid",
    "first_name": "John",
    "last_name": "Doe",
    "experience": 10,
    "education": "Medical School",
    "bio": "Experienced physician...",
    "profile_image_url": "...",
    "active": true,
    "created_at": "2025-05-02T12:00:00Z",
    "updated_at": "2025-05-02T12:00:00Z",
    "specialties": [ { "id": "uuid", "name": "Cardiology" } ],
    "expertise_areas": [ { "id": "uuid", "name": "Heart Disease" } ],
    "addresses": [ { "street": "...", "city": "City", "state": "State", "postal_code": "12345", "country": "Country" } ]
  }
  ```

  _Success Codes_: 200 OK  
  _Error Codes_: 404 Not Found

- **POST /doctors**  
  _Description_: Create a new doctor profile (admin only).  
  _Request Body JSON Example_:

  ```json
  {
    "first_name": "Alice",
    "last_name": "Smith",
    "experience": 8,
    "education": "University Medical Center",
    "bio": "Specialist in internal medicine...",
    "profile_image_url": "http://...",
    "active": true,
    "specialties": [ "uuid-of-specialty" ],
    "expertise_areas": [ "uuid-of-expertise-area" ],
    "addresses": [
      {
        "street": "123 Main St",
        "city": "City",
        "state": "State",
        "postal_code": "12345",
        "country": "Country"
      }
    ]
  }
  ```

  _Success Codes_: 201 Created  
  _Error Codes_: 400 Bad Request, 401 Unauthorized, 500 Internal Server Error

- **PUT /doctors/{doctorId}**  
  _Description_: Update an existing doctor profile (admin and owner profiles).  
  _URL Parameter_: `doctorId`  
  _Request Body_: Same structure as POST with fields to update.  
  _Success Codes_: 200 OK  
  _Error Codes_: 400 Bad Request, 401 Unauthorized, 404 Not Found

- **DELETE /doctors/{doctorId}**  
  _Description_: Remove a doctor profile (admin only).  
  _URL Parameter_: `doctorId`  
  _Success Codes_: 200 OK with confirmation message  
  _Error Codes_: 401 Unauthorized, 404 Not Found

### 2.2. Profiles

- **GET /profiles/{userId}**  
  _Description_: Retrieve user profile details.  
  _Success Codes_: 200 OK  
  _Error Codes_: 404 Not Found, 401 Unauthorized

- **PUT /profiles/{userId}**  
  _Description_: Update user profile information.  
  _Request Body Example_:

  ```json
  {
    "first_name": "Alice",
    "last_name": "Smith",
    "role": "patient"
  }
  ```

  _Success Codes_: 200 OK  
  _Error Codes_: 400 Bad Request, 401 Unauthorized

### 2.3. Ratings

- **GET /doctors/{doctorId}/ratings**  
  _Description_: Retrieve list of ratings for the specified doctor.  
  _Success Codes_: 200 OK  
  _Error Codes_: 404 Not Found
  
- **POST /doctors/{doctorId}/ratings**  
  _Description_: Create a rating for a doctor from a logged in user.  
  _Request Body Example_:

  ```json
  {
    "user_id": "uuid",
    "rating": 4,
    "comment": "Great service"
  }
  ```

  _Validations_: Rating must be between 1 and 5.  
  _Success Codes_: 201 Created  
  _Error Codes_: 400 Bad Request, 401 Unauthorized

### 2.4. Search and AI Analysis

- **POST /ai/analyze**  
  _Description_: Submit a natural language description of symptoms to trigger AI analysis (integrates with OpenAI API).  
  _Request Body Example_:

  ```json
  {
    "query": "I have been experiencing chest pains and shortness of breath."
  }
  ```

  _Response JSON Example_:

  ```json
  {
    "identified_symptoms": ["chest pain", "shortness of breath"],
    "suggested_specialties": ["Cardiology", "Pulmonology"],
    "doctors_match": [
      { "doctor_id": "uuid", "match_percentage": 90 }
    ],
    "analysis_id": "uuid"
  }
  ```

  _Notes_: Implements caching and token optimization strategies.  
  _Success Codes_: 200 OK  
  _Error Codes_: 400 Bad Request, 429 Too Many Requests, 500 Internal Server Error

- **GET /search**  
  _Description_: Search for doctors based on the AI analysis results or manual filters. Can merge results from AI analysis with standard filters.  
  _Query Parameters_:  
  - `query` (optional): Natural language query  
  - Additional filter parameters (specialty, city, experience, etc.)  
  - `page` & `limit` for pagination  
  _Response_: Similar structure as GET /doctors  
  _Success Codes_: 200 OK  
  _Error Codes_: 400 Bad Request, 404 Not Found

- **GET /search/history**  
  _Description_: Retrieve search history for the authenticated user.  
  _Success Codes_: 200 OK  
  _Error Codes_: 401 Unauthorized

- **POST /search/history**  
  _Description_: Save a new search entry, including the analyzed query and suggested specialties (only for logged in users).  
  _Request Body Example_:

  ```json
  {
    "query": "headache and nausea",
    "specialties": ["Neurology", "General Practice"]
  }
  ```

  _Success Codes_: 201 Created  
  _Error Codes_: 400 Bad Request, 401 Unauthorized

### 2.5. Authentication Endpoints

*(Note: While Supabase handles major authentication operations, the API may offer the following proxy endpoints for integration purposes.)_

- **POST /auth/register**  
  _Description_: Register a new user using Supabase Auth API.  
  _Request Body Example_:

  ```json
  {
    "first_name": "Alice",
    "last_name": "Smith",
    "email": "alice@example.com",
    "password": "securePassword123"
  }
  ```

  _Success Codes_: 201 Created  
  _Error Codes_: 400 Bad Request, 409 Conflict

- **POST /auth/login**  
  _Description_: Log in a user and return a JWT token.  
  _Request Body Example_:

  ```json
  {
    "email": "alice@example.com",
    "password": "securePassword123"
  }
  ```

  _Response Example_:

  ```json
  {
    "token": "jwt-token",
    "user": { "id": "uuid", "email": "alice@example.com" }
  }
  ```

  _Success Codes_: 200 OK  
  _Error Codes_: 400 Bad Request, 401 Unauthorized

- **POST /auth/logout**  
  _Description_: Log out the user by invalidating the current token/session.  
  _Success Codes_: 200 OK  
  _Error Codes_: 401 Unauthorized

## 3. Authentication and Authorization

- **Mechanism**: JSON Web Tokens (JWT) issued by Supabase Auth.
- **Implementation Details**:
  - Protected endpoints (e.g., profile update, doctor creation, rating submission) require a valid JWT passed in the Authorization header as `Bearer <token>`.
  - Role-based access control (e.g., admin-only access for creating/deleting doctors) enforced via middleware.
  - Row Level Security (RLS) policies in the database (as specified in the DB Plan) will complement the API’s authorization logic.

## 4. Validation and Business Logic

### Validation Rules

- **Doctors**:  
  - Mandatory fields: first name, last name, active flag.  
  - Validate input lengths and type formats.
- **Ratings**:  
  - Rating value must be an integer between 1 and 5.
- **Profiles**:  
  - Email uniqueness and password/format validations handled by Supabase Auth.
- **Search History**:  
  - Ensure `query` is not empty and `specialties` is a valid JSON array.
  
### Business Logic Mapping

- **Doctor CRUD (US-009, US-010, US-011, US-012)**:  
  - Endpoints ensure data integrity and enforce authorization (only admins or respective doctor can update).
  - Cascade deletion of related data (addresses, ratings) enforced at the database level.
- **AI Symptoms Analysis (US-006)**:
  - Submission to `/ai/analyze` will trigger asynchronous processing using the OpenAI API.
  - Caching responses for similar queries to optimize token usage.
- **Search & Recommendation (US-005, US-007, US-008)**:  
  - Integrate AI analysis results with search results.
  - Include pagination, filtering, and sorting to improve performance.
  - Return a match percentage for each doctor based on AI-derived metrics.
- **Authentication & Route Protection (US-001 to US-004)**:  
  - Utilize middleware to restrict access to protected routes.
  - Automatic redirection at the frontend based on authentication status (handled by client-side logic consuming the API).

This plan ensures that the API design leverages the strengths of the technical stack (React, Supabase, OpenAI, etc.), meets the PRD requirements, incorporates necessary business logic, and enforces validation and security at both API and database levels.

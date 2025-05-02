# MedIQ 🚀

## Table of Contents

- [Project Description 📋](#project-description)
- [Tech Stack 🛠️](#tech-stack)
- [Getting Started Locally 🚀](#getting-started-locally)
- [Available Scripts ⚙️](#available-scripts)
- [Project Scope 🔍](#project-scope)
- [Project Status 📈](#project-status)
- [License 📜](#license)

## Project Description

MedIQ is an innovative web platform that leverages artificial intelligence to analyze patient symptoms and connect users with the most suitable medical specialists. By simply describing their symptoms, patients receive personalized recommendations and detailed profiles of doctors, streamlining the process of finding the right specialist.

Key features include:

- AI-driven symptom analysis using the OpenAI GPT-4o-mini model. 🤖
- Comprehensive CRUD functionalities for managing doctor profiles. 🏥
- User authentication and profile management powered by Supabase. 🔐
- Responsive, mobile-first design ensuring accessibility on all devices. 📱
- Automated testing and CI/CD pipeline to ensure code quality and deployment efficiency. ✅

## Tech Stack

- **Frontend:** React 18+, TypeScript, Vite, React Router v6, Styled Components, Tailwind CSS, Lucide-react for icons, and React hooks (useState, useEffect, etc.).
- **Backend:** Supabase for authentication, PostgreSQL for database, Supabase Storage for media, and integration with OpenAI API for health query analysis.
- **DevOps & Testing:** GitHub Actions for CI/CD, Jest and React Testing Library for unit tests, Cypress for end-to-end tests, ESLint, and Prettier for code quality.

## Getting Started Locally

1. **Clone the repository:**

   ```sh
   git clone https://github.com/your-username/mediq.git
   cd mediq
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Run the development server:**

   ```sh
   npm run dev
   ```

4. **Open your browser:**
   Visit [http://localhost:3000](http://localhost:3000) or the port specified by Vite.

## Available Scripts

- **`npm run dev`**: Starts the development server with hot module replacement.
- **`npm run build`**: Bundles the app into static files for production.
- **`npm run preview`**: Serves the production build locally.
- **`npm test`**: Runs unit and integration tests using Jest and React Testing Library.
- **`npm run e2e`**: Runs end-to-end tests with Cypress.
- **`npm run lint`**: Checks for code quality issues with ESLint.

## Project Scope

### In-Scope Features

- AI-powered search for doctors based on user-input symptoms.
- Full CRUD operations for managing doctor profiles (creation, editing, viewing, and deletion).
- User authentication and session management using Supabase.
- Responsive, mobile-first user interface designed per WCAG 2.1 AA guidelines.
- Automated testing (unit, integration, and e2e) and CI/CD pipeline through GitHub Actions.
- Caching mechanisms for optimizing API queries.
- Performance optimization using techniques like lazy loading and React.memo.

### Out-of-Scope Features

- Telemedicine functionalities (online consultations).
- Appointment booking systems.
- Payment processing systems.
- Comprehensive electronic health records.
- Chat or direct communication with doctors.
- Integration with external medical systems.
- Full mobile applications (only responsive web design).
- Multilingual support (Polish only).
- Integration with health insurance systems.
- Prescription management systems.

## Project Status

MedIQ is currently in active development as an MVP. The project focuses on core functionalities including AI-based analysis, doctor management, and user management. Continuous monitoring of performance metrics, code quality, and user feedback is in place to ensure rapid and reliable improvements.

## License

This project is licensed under the MIT License.

# Avatar Project Portal

Avatar Project Portal is a collaborative platform designed to connect students with beginner-friendly open-source projects. It helps students find projects matching their skills and interests, while providing a space for project creators to find contributors and foster collaboration.

## Features

- User onboarding and authentication using Clerk
- Browse and search for beginner-friendly projects and jobs
- Post new jobs or projects to attract contributors
- Save jobs/projects for later reference
- Collaborate with other users through dedicated project discussion areas
- Responsive UI with dark theme support
- Filtering and categorization of projects by domain and skills

## Technologies Used

- React 18
- Vite (build tool)
- TailwindCSS (styling)
- Clerk (authentication)
- Supabase (backend services)
- React Router (routing)
- Radix UI components
- Other libraries: react-hook-form, zod, embla-carousel, lucide-react, etc.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Sadiya-125/Avatar-Project-Portal
   cd Avatar-Project-Portal
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

## Running the Project

To start the development server:

```bash
npm run dev
```

This will start the app locally, usually accessible at `http://localhost:5173`.

To build the project for production:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Usage Overview

- **Landing Page:** Introduction and entry point to the platform.
- **Onboarding:** User setup and profile creation (requires login).
- **Job Listing:** Browse available projects and jobs (requires login).
- **Post Job:** Create new job/project listings (requires login).
- **My Jobs:** View jobs/projects you have posted (requires login).
- **Saved Jobs:** View jobs/projects you have saved (requires login).
- **Job Detail Page:** Detailed view of a specific job/project (requires login).
- **Collaborate Page:** Dedicated collaboration and discussion area for projects (requires login).

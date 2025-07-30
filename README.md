

# Leave Spark

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Netlify-brightgreen?style=for-the-badge&logo=netlify)](https://leave-spark.netlify.app/)


Employee Leave Management System built with React, Vite, TypeScript, Tailwind CSS, and Supabase.

## Features
- Employee and Admin Dashboards
- Leave Application and Calendar
- Authentication (Login/Register)
- Modern UI with dark mode support
- Supabase integration for backend

## Getting Started

### Prerequisites
- Node.js (v18 or above recommended)
- npm

### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/jhasachin02/leave-spark.git
   cd leave-spark
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```
   The app will be available at `http://localhost:8080` (or the next available port).

### Build for Production
```sh
npm run build
```

## Project Structure
- `src/components/` - UI and feature components
- `src/pages/` - Main pages/routes
- `src/integrations/supabase/` - Supabase client and types
- `public/` - Static assets (favicon, images)

## Customization
- Update the favicon by replacing `public/favicon.io.png`.
- Edit `index.html` for meta tags and branding.

## License
MIT


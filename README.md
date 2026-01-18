# TaskFlow | Modern Task Management

A premium, glassmorphic task management system built with Next.js and Prisma. Organize your projects with multiple boards, task priorities, and real-time status updates.

## Requirements

- **Node.js**: v18.17 or higher
- **Package Manager**: npm (or yarn/pnpm)
- **Database**: PostgreSQL (Supabase/Neon) or SQLite for local development

## Setup & Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/gpbaculio/taskflow-challenge.git
   cd emerald-omega
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Environment Variables**:
   Create a `.env` file in the root directory and add your database connection string:

   ```env
   # For Local SQLite:
   # DATABASE_URL="file:./dev.db"

   # For Production PostgreSQL (Supabase):
   DATABASE_URL="postgresql://postgres.[PROJ-ID]:[PASSWORD]@[HOST]:6543/postgres?pgbouncer=true"
   DIRECT_URL="postgresql://postgres.[PROJ-ID]:[PASSWORD]@[HOST]:5432/postgres"
   ```

4. **Set up the database**:

   ```bash
   npx prisma db push
   ```

5. **Run the application**:

   ```bash
   npm run dev
   ```

6. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000) to see the app in action.

## Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL (via Supabase)
- **Styling**: Tailwind CSS 4.0
- **Icons**: Lucide React
- **Hosting**: Vercel

## Key Features

- **Glassmorphic UI**: Modern, translucent design with smooth transitions.
- **Dynamic Board Management**: Create, customize, and delete project boards.
- **Advanced Task Logic**: Filter tasks by status and sort by priority or creation date.
- **Health Diagnostics**: Built-in `/api/health` endpoint for verifying database connectivity.

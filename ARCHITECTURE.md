# Architecture Decisions

## 1. Technology Choices

- **Next.js App Router**: Chosen for its robust server-side capabilities, built-in SEO optimizations, and seamless integration with Server Actions and API routes. The App Router provides a more modern developer experience compared to the legacy Pages Router.
- **PostgreSQL (Supabase)**: Selected as the production database for its reliability, scalability, and ease of deployment. During development, SQLite was used for rapid prototyping, but transitioned to PostgreSQL to ensure data persistence in a serverless environment (Vercel).
- **Tailwind CSS 4.0**: Used for styling to achieve a premium "glassmorphic" aesthetic. It allows for rapid UI development with a utility-first approach while maintaining a highly customizable design system.

## 2. Data Structure

The database follows a relational model using **Prisma ORM**:

- **Board**: The top-level entity containing a name, description, and color.
- **Task**: Belongs to a single Board. Includes title, description, status, and priority.
- **Cascade Deletion**: A `Cascade` relation is configured between Boards and Tasks. When a Board is deleted, all associated Tasks are automatically removed from the database to prevent orphaned data.

## 3. API Design

The API is designed following RESTful principles:

- `GET /api/boards`: Fetches all boards.
- `POST /api/boards`: Creates a new board.
- `DELETE /api/boards/[id]`: Deletes a specific board and its tasks.
- `GET /api/boards/[id]`: Fetches a single board with its tasks.
- `POST /api/tasks`: Creates a task for a specific board.
- `PATCH /api/tasks/[id]`: Updates task details (status, title, etc.).
- `DELETE /api/tasks/[id]`: Deletes a specific task.

These endpoints are separated by resource to keep the logic clean and maintainable.

## 4. Frontend Organization

- **State Management**: React's `useState` and `useEffect` are used for component-level state. For complex interactions (like task sorting and filtering), `useMemo` and `useCallback` are utilized to optimize performance.
- **Component Structure**: The UI is split into logical pages (`/` and `/board/[id]`) with reusable UI blocks. Modern design patterns like Modals and Glassmorphic Cards are implemented as inline components for simplicity in this assessment, but would be extracted to a `/components` directory in a larger project.
- **Routing**: Next.js dynamic routes (`/board/[id]`) are used to handle individual project workspaces.

## 5. What I would change

- **State Management**: For a larger app, I would implement **Zustand** or **TanStack Query** to handle server state more efficiently and reduce manual `useEffect` calls.
- **Authentication**: In a real production app, users would only see their own boards. I would add **NextAuth.js** or **Clerk** for secure user sessions.
- **Real-time Updates**: I would use **Supabase Realtime** or web sockets to allow multiple users to see task updates as they happen.
- **Drag and Drop**: I would integrate `@hello-pangea/dnd` to allow users to visually move tasks between columns.
- **Production Readiness**: In a real app, I would add comprehensive unit testing with **Vitest** and E2E testing with **Playwright**.

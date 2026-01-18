# AI Workflow

## Tool Used

I used **AntiGravity**, an agentic AI coding assistant designed by Google DeepMind.

## Example Prompts

1. **"Explain what this problem is and help me fix it: Unexpected any. Specify a different type. @src/app/board/[id]/page.tsx:L109"**
   - **Why**: Used the exact lint error provided by the IDE to find and fix type safety issues.
   - **Result**: Excellent. The AI identified that `as any` was being used to bypass union types and suggested creating `TaskStatus` and `TaskPriority` aliases.

2. **"how to deploy this free"**
   - **Why**: Needed a production-ready strategy that didn't cost money but stayed persistent.
   - **Result**: Good. It correctly warned about SQLite's limitations on Vercel and guided the migration to PostgreSQL (Supabase).

3. **"after deploying ... internal server error"**
   - **Why**: Troubleshooting the most common bottleneck in serverless deployments (database connectivity).
   - **Result**: Very effective. The AI implemented a /api/health endpoint to diagnose that the issue was an IPv4/IPv6 mismatch, which led to the correct fix (using the Supabase Pooler).

## My Process

- **AI for Architecture & Debugging**: Used AI to refactor the database layer from SQLite to PostgreSQL and to debug complex 500 errors in the deployed environment.
- **Manual Coding**: I manually handled the Git commands and the Vercel dashboard configuration, while the AI provided the values and instructions.
- **AI Refinement**: When the AI's first guess at a connection string failed (direct port 5432), I used the AI to build a diagnostic tool that confirmed the network error, allowing us to find the correct Pooler Port (6543).

## Time Management

- **Early Phase**: Focused on resolving code-quality issues (linting) and ensuring the app was type-safe.
- **Mid Phase**: Pivoted to deployment. Spent the majority of time on "Database DevOps"—migrating from SQLite to PostgreSQL and configuring connection pooling.
- **Late Phase**: Added diagnostic tools and professional documentation (README.md).
- **If I had more time**: I would add Drag-and-Drop functionality for tasks and User Authentication using NextAuth.

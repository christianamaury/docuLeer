# Claude Context for DocuLeer

## Project Overview
DocuLeer is a Spanish-language PDF chat application built with Next.js that allows users to upload PDF documents and have AI-powered conversations about their content.

## Tech Stack
- **Framework:** Next.js 14 with TypeScript
- **Database:** Prisma ORM with MongoDB/Mongoose
- **Authentication:** Kinde Auth
- **AI/ML:** OpenAI, LangChain, Pinecone vector database
- **Payments:** Stripe
- **File Handling:** UploadThing, react-pdf
- **UI:** Tailwind CSS, Radix UI components
- **State Management:** tRPC, TanStack Query

## Development Commands
```bash
# Development
pnpm dev

# Build
pnpm build

# Lint
pnpm lint

# Database
pnpm postinstall  # Generates Prisma client
```

## Key Directories
- `src/app/Components/` - Main React components
- `src/app/api/` - API routes (tRPC, auth, webhooks)
- `src/components/ui/` - Reusable UI components
- `src/lib/` - Utility functions and configurations
- `src/trpc/` - tRPC setup and procedures
- `prisma/` - Database schema

## Important Files
- `src/app/page.tsx` - Landing page (Spanish content)
- `src/app/dashboard/page.tsx` - Main dashboard
- `src/app/Components/ChatWrapper.tsx` - PDF chat interface
- `src/app/api/uploadthing/core.ts` - File upload configuration
- `src/lib/openai.ts` - OpenAI configuration
- `src/lib/pinecone.ts` - Vector database setup

## Environment Setup
The project uses:
- Kinde for authentication
- Stripe for payments
- OpenAI for AI functionality
- Pinecone for vector storage
- UploadThing for file uploads

## Code Conventions
- Spanish language for user-facing text
- TypeScript throughout
- Tailwind CSS for styling
- Component-based architecture
- tRPC for type-safe API calls

## Testing
No specific test framework configured - check with user before running tests.
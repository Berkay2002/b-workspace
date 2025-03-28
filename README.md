# B-Workspace

A Notion-style productivity workspace built with Next.js, TypeScript, and modern web technologies.

## Features

- 🔐 Authentication with Clerk
- 🎨 Modern UI with shadcn/ui and Tailwind CSS
- 📝 Block-based document editor
- 🤖 AI-powered assistance
- 📱 Responsive design
- 🚀 Fast performance with Next.js App Router

## Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Component Library:** shadcn/ui
- **Icons:** Lucide
- **Animations:** Framer Motion
- **AI Integration:** OpenAI API
- **Authentication:** Clerk
- **Database:** Convex

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.local.example` to `.env.local` and fill in your environment variables:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `OPENAI_API_KEY`
   - `NEXT_PUBLIC_CONVEX_URL`

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
b-workspace/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Protected dashboard routes
│   └── api/               # API routes
├── components/            # React components
│   ├── auth/             # Auth-related components
│   ├── dashboard/        # Dashboard components
│   ├── shared/           # Shared components
│   └── ui/               # shadcn/ui components
├── convex/               # Convex database
├── lib/                  # Utility functions
└── public/              # Static assets
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

MIT

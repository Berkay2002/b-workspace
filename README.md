# B-Workspace

A Notion-style productivity workspace built with Next.js, TypeScript, and modern web technologies.

## Features

- 🔐 Authentication with Clerk
- 🎨 Modern UI with shadcn/ui and Tailwind CSS
- 📝 Block-based document editor
- 🤖 AI-powered assistance with OpenAI GPT-4o-mini
- 📱 Responsive design
- 🚀 Fast performance with Next.js App Router

## Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Component Library:** shadcn/ui
- **Icons:** Lucide
- **Animations:** Framer Motion
- **AI Integration:** OpenAI API (GPT-4o-mini)
- **Authentication:** Clerk
- **Database:** Convex

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.local.example` to `.env.local` and fill in your environment variables:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Get from [Clerk Dashboard](https://dashboard.clerk.dev/)
   - `CLERK_SECRET_KEY` - Get from [Clerk Dashboard](https://dashboard.clerk.dev/)
   - `OPENAI_API_KEY` - Get from [OpenAI API Keys](https://platform.openai.com/api-keys)
   - `NEXT_PUBLIC_CONVEX_URL` - Get from [Convex Dashboard](https://dashboard.convex.dev/)

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## OpenAI Integration

This project uses OpenAI's GPT-4o-mini model to power the AI assistant. This provides a good balance between capability and cost-efficiency. To use this feature:

1. Create an account at [OpenAI](https://platform.openai.com/signup)
2. Generate an API key at [API Keys](https://platform.openai.com/api-keys)
3. Add the API key to your `.env.local` file as `OPENAI_API_KEY`

The AI assistant can help with writing, planning, brainstorming, and other productivity tasks, using Notion-like capabilities and instructions.

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

# BBB Manager

A SaaS application for managing BigBlueButton instances with automated scaling and cost optimization.

## Features

- 🚀 Automated instance management
- 💰 Cost optimization
- 📊 Usage analytics
- 🔄 Auto-scaling support
- 🎯 Meeting management
- 👥 Multi-tenant support

## Tech Stack

- **Frontend & Backend**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Cloud Infrastructure**: AWS EC2
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## Prerequisites

- Node.js 18.x or later
- npm 9.x or later
- Supabase account
- AWS account with EC2 access
- BigBlueButton server

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AWS Configuration
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=

# BBB Configuration
BBB_SECRET=
BBB_SERVER_BASE_URL=
```

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/bbb-manager.git
   cd bbb-manager
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your values
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/         # React components
├── lib/               # Utility functions and configurations
│   ├── aws/          # AWS related code
│   └── supabase/     # Supabase related code
├── types/            # TypeScript type definitions
└── hooks/            # Custom React hooks
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

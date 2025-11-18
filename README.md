# AI Resume & Portfolio Builder

Welcome — this is an easy-to-use, AI-powered web app that helps you create professional resumes, cover letters, and LinkedIn content, and practice interviews with AI coaching.

Live Project Links
- Miaoda project page: https://medo.dev/projects/app-7n7oib9pckjl
- Web app (user-friendly link): https://app-7n7oib9pckjl.appmedo.com

Quick overview
- Build ATS-friendly resumes from uploads or manual input
- Generate job-tailored cover letters
- Optimize LinkedIn headlines and About sections
- Practice interviews with detailed AI feedback and suggested improvements

Features

1. Resume Builder
- Upload TXT / DOCX / PDF and auto-extract fields
- Automatic form population from uploaded resumes
- Manual input available for full control
- AI-generated, ATS-optimized resumes targeting specific roles
- Tone options: Professional, Confident, Friendly
- Download generated resume as a text file

2. Cover Letter Generator
- Generate role- and job-description-specific cover letters
- Highlights 2–3 key achievements automatically
- Tailored, human-friendly language

3. LinkedIn Profile Optimizer
- Compelling headlines (max 120 characters)
- 3-paragraph About sections written to improve discoverability
- Keyword optimization for search visibility

4. AI Interview Coach
- Behavioral question practice with STAR-format guidance
- Technical design question review with suggestions
- Detailed scoring (0–10), strengths, improvement areas, and rewritten examples

Tech stack
- Frontend: React 18 + TypeScript
- UI: shadcn/ui + Tailwind CSS
- Build tool: Vite
- AI integration: Large Language Model API (Gemini 2.5 Flash)
- Routing: React Router v7
- Form handling: React Hook Form + Zod
- Notifications: Sonner Toast

Project structure (high level)
- src/
  - components/ (resume-specific and shared UI components)
  - pages/ (HomePage, etc.)
  - services/ (aiService.ts, documentService.ts)
  - types/ (resume.ts)
  - lib/, hooks/, data/, styles (index.css)
- index.html, package.json, vite.config.ts, tsconfig*.json, public/ (assets)

Getting started (local development)

Prerequisites
- Node.js >= 20
- npm >= 10

Install and run
1. Clone or download the repo
2. Install dependencies:
   npm install
3. Start dev server:
   npm run dev -- --host 127.0.0.1
   If that fails:
   npx vite --host 127.0.0.1
4. Open the local URL printed by Vite in your browser.

Usage guide (short)
- Resume: Upload or fill in profile → choose target role and tone → Generate → Review → Download
- Cover letter: Paste job description → target role → Generate → Review → Download
- LinkedIn: Enter target role → Generate headline and About section → Review → Copy/Download
- Interview coach: Select question type → pick or enter a question → Answer → Evaluate → Read feedback and example answers

Design notes
- Primary color: #4A90E2 (professional blue)
- 8px rounded corners, subtle shadows, smooth 0.3s transitions
- Responsive layout for desktop and mobile

Environment variables
Create a .env file (or set in your host) with:
VITE_APP_ID=app-7n7oib9pckjl
VITE_API_ENV=production

Development notes & roadmap
- MVP for demonstration and local testing
- Current exports: TXT format
- AI calls use Gemini 2.5 Flash (configurable in services/aiService.ts)
- Recommended improvements for production:
  - User authentication
  - Persistent storage (database)
  - Rate limiting and caching
  - Background task processing for heavy jobs
  - Enhanced error handling and validation

Browser support
- Chrome (recommended), Firefox, Safari, Edge

Contributing
This demo welcomes suggestions. For production usage, please add security, rate limiting, API keys safety, and tests.

License
2025 AI Resume & Portfolio Builder

Support & docs
- Miaoda documentation: https://intl.cloud.baidu.com/en/doc/MIAODA/s/download-and-building-the-app-en
- Project pages:
  - Miaoda: https://medo.dev/projects/app-7n7oib9pckjl
  - AppMedo public link: https://app-7n7oib9pckjl.appmedo.com

Notes
- I updated this README to add the friendly app link (app-7n7oib9pckjl.appmedo.com) and to make the language more concise and approachable for new users. If you want, I can also:
  - Open a PR that replaces the README in the repo,
  - Add badges (build / license / demo),
  - Or update other docs (CONTRIBUTING.md, CHANGELOG.md) to match this tone.

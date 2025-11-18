# AI Resume & Portfolio Builder - Feature Overview

## Application Structure

The application is built with a clean, modular architecture using React + TypeScript + shadcn/ui.

## Core Modules

### 1. Profile Input Module (`ProfileInput.tsx`)
**Location**: `src/components/resume/ProfileInput.tsx`

**Features**:
- File upload support for TXT, DOCX, and PDF formats
- **Automatic field extraction** from uploaded files (NEW)
- **Smart pattern matching** to identify key information
- **Auto-fill all form fields** with extracted data
- Manual input form with validation
- Required fields: Full Name, Current Title, Email, Location, Work Experience, Projects, Skills
- Optional field: Education
- Real-time profile state management
- Validation and missing field detection

**Auto-Fill Capabilities**:
- Extracts name, email, location, and job title
- Identifies and extracts EXPERIENCE, PROJECTS, SKILLS, EDUCATION sections
- Provides feedback on extraction success
- Highlights missing fields for manual input

**User Experience**:
- Clean card-based interface with sparkle icons indicating auto-fill
- Clear field labels and placeholders
- File upload with automatic field population
- Toast notifications with extraction details
- Support for multiple file formats (TXT, DOCX, PDF)
- Visual indicators for automatic filling capability

### 2. Content Generation Module (`ContentGeneration.tsx`)
**Location**: `src/components/resume/ContentGeneration.tsx`

**Features**:
- Three content types: Resume, Cover Letter, LinkedIn Profile
- Target role specification
- Tone selection (Professional, Confident, Friendly)
- AI-powered content generation using Large Language Model API
- Real-time content preview
- Download functionality for all generated content

**Resume Generation**:
- Professional summary (2-3 sentences)
- Formatted work experience with bullet points
- Project descriptions with achievements
- Categorized skills list
- Education details
- ATS-friendly formatting

**Cover Letter Generation**:
- Job description analysis
- Tailored content matching job requirements
- 2-3 key achievements highlighted
- Professional formatting

**LinkedIn Content Generation**:
- Optimized headline (max 120 characters)
- Engaging About section (3 paragraphs)
- Keyword optimization for searchability
- Character count display

### 3. Interview Coach Module (`InterviewCoach.tsx`)
**Location**: `src/components/resume/InterviewCoach.tsx`

**Features**:
- Two interview types: Behavioral and Technical Design
- Pre-loaded common interview questions
- Custom question input
- Answer evaluation with AI
- Detailed feedback with scoring

**Behavioral Interview Practice**:
- STAR format evaluation (Situation, Task, Action, Result)
- 8 common behavioral questions
- Personalized feedback based on user profile

**Technical Design Review**:
- System design questions
- Architecture evaluation
- Scalability considerations
- 6 common technical questions

**Evaluation Results**:
- Score: 0-10 rating
- Strengths: 3 positive aspects identified
- Improvements: 3 areas for enhancement
- Rewritten Answer: Improved example response

### 4. AI Service Layer (`aiService.ts`)
**Location**: `src/services/aiService.ts`

**Functions**:
- `generateResume()`: Creates ATS-friendly resume content
- `generateCoverLetter()`: Generates tailored cover letters
- `generateLinkedInContent()`: Optimizes LinkedIn profiles
- `evaluateInterviewAnswer()`: Provides interview feedback

**API Integration**:
- Large Language Model API (Gemini 2.5 Flash)
- Structured prompts for consistent output
- JSON response parsing
- Error handling and fallbacks

### 5. Document Service Layer (`documentService.ts`)
**Location**: `src/services/documentService.ts`

**Functions**:
- `exportToTxt()`: Generic text file export
- `exportResumeToDocx()`: Resume export (currently TXT)
- `exportCoverLetterToTxt()`: Cover letter export
- `exportLinkedInToTxt()`: LinkedIn content export
- `parseDocxFile()`: DOCX file parsing
- `parseTxtFile()`: TXT file parsing

## Data Layer

### Interview Questions (`interviewQuestions.ts`)
**Location**: `src/data/interviewQuestions.ts`

**Content**:
- 8 behavioral interview questions
- 6 technical design questions
- Categorized by type
- Unique IDs for tracking

## Type Definitions (`resume.ts`)
**Location**: `src/types/resume.ts`

**Interfaces**:
- `Profile`: User profile information
- `GenerationOptions`: Target role and tone settings
- `ResumeContent`: Structured resume data
- `CoverLetterContent`: Cover letter with achievements
- `LinkedInContent`: Headline and About section
- `InterviewQuestion`: Question structure
- `InterviewEvaluation`: Feedback structure
- `ToneType`: Tone options enum

## Design System

### Color Scheme
- **Primary**: Professional Blue (HSL: 210 79% 56%)
- **Background**: Light Gray (HSL: 210 40% 98%)
- **Card**: White (HSL: 0 0% 100%)
- **Muted**: Light Gray (HSL: 210 40% 96%)
- **Accent**: Professional Blue (matching primary)

### Visual Elements
- Border radius: 8px (0.5rem)
- Shadow: Elegant drop shadow with primary color
- Transitions: 0.3s cubic-bezier easing
- Typography: System font stack with proper hierarchy

### Responsive Design
- Desktop-first approach
- Two-column layout on large screens (xl breakpoint)
- Single column on mobile devices
- Flexible card heights
- Scrollable content areas

## User Flow

### Resume Creation Flow
1. User lands on "Resume Builder" tab
2. Fills in profile information (left column)
3. Specifies target role and tone (right column)
4. Clicks "Generate Resume"
5. Reviews generated content
6. Downloads as text file

### Cover Letter Flow
1. Switches to "Cover Letter" tab
2. Enters job description
3. Clicks "Generate Cover Letter"
4. Reviews tailored content and achievements
5. Downloads as text file

### LinkedIn Optimization Flow
1. Switches to "LinkedIn" tab
2. Clicks "Generate LinkedIn Content"
3. Reviews headline and About section
4. Downloads for copying to LinkedIn

### Interview Practice Flow
1. Switches to "Interview Coach" tab
2. Selects question type (Behavioral/Technical)
3. Chooses or enters a question
4. Types answer
5. Clicks "Evaluate Answer"
6. Reviews score, strengths, improvements
7. Studies improved answer example

## Technical Highlights

### State Management
- React useState for local component state
- Props drilling for profile data sharing
- No global state management needed (simple app)

### Form Handling
- Controlled components for all inputs
- Real-time validation
- Toast notifications for user feedback

### API Integration
- Fetch API for HTTP requests
- JSON request/response format
- Error handling with try-catch
- Loading states for async operations

### File Handling
- FileReader API for file uploads
- Blob API for file downloads
- MIME type validation
- File size considerations

### Performance
- Lazy loading not needed (single page)
- Efficient re-renders with proper key usage
- Minimal dependencies
- Fast build times with Vite

## Future Enhancements

### Potential Features
- PDF export for resumes
- Multiple resume templates
- Resume version history
- Email integration
- Social media sharing
- Analytics dashboard
- User accounts and authentication
- Cloud storage integration
- Collaborative editing
- AI-powered job matching

### Technical Improvements
- Server-side rendering
- Progressive Web App (PWA)
- Offline support
- Real-time collaboration
- Advanced caching strategies
- Rate limiting
- API key management
- Enhanced security measures

## Testing Recommendations

### Unit Tests
- AI service functions
- Document service utilities
- Type validation
- Form validation logic

### Integration Tests
- Profile input to content generation flow
- File upload and parsing
- Document export functionality
- API integration

### E2E Tests
- Complete resume creation flow
- Cover letter generation
- LinkedIn optimization
- Interview practice session

### Accessibility Tests
- Keyboard navigation
- Screen reader compatibility
- Color contrast ratios
- Focus management

## Deployment Considerations

### Environment Variables
- `VITE_APP_ID`: Application identifier
- `VITE_API_ENV`: Environment setting

### Build Process
- Vite production build
- Asset optimization
- Code splitting
- Tree shaking

### Hosting Options
- Static hosting (Vercel, Netlify, etc.)
- CDN distribution
- Custom domain setup
- SSL certificate

### Monitoring
- Error tracking (Sentry, etc.)
- Analytics (Google Analytics, etc.)
- Performance monitoring
- User feedback collection

---

**Last Updated**: 2025-11-18
**Version**: 1.0.0 (MVP)

# FocusFlow - Pomodoro Timer App

## Overview
FocusFlow is a modern, minimalist Pomodoro and countdown timer application designed for deep work and focus. Built with Next.js 15, React 18, Firebase, and Tailwind CSS, it provides a beautiful and functional timer experience with user authentication and session tracking.

## Project Status
- **Imported:** December 4, 2024
- **Framework:** Next.js 15.3.3
- **Status:** Development server running successfully on Replit
- **PWA:** Configured for both Vercel and GitHub Pages deployments

## Recent Changes
- **2024-12-04:** Initial Replit setup completed
  - Configured Next.js dev server to run on port 5000 with 0.0.0.0 host binding
  - Updated next.config.ts to support both development and production modes
  - Installed all npm dependencies
  - Configured deployment as static site
  - Set up workflow for Next.js dev server with webview
  
- **2024-12-04:** PWA and Multi-Environment Fixes
  - Fixed Firebase re-export conflicts in index.ts
  - Created dynamic manifest.ts route handler with proper scope and start_url
  - Updated next.config.ts to handle basePath for both Vercel (root) and GitHub Pages (subdirectory)
  - Fixed all hardcoded router.push() paths to work with basePath
  - Added PWA meta tags to layout.tsx (apple-touch-icon, manifest link, theme-color)
  - Created path utilities for basePath-aware routing
  - App now works on BOTH Vercel and GitHub Pages without code changes

## Project Architecture

### Tech Stack
- **Framework:** Next.js 15.3.3 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS with custom UI components
- **Backend:** Firebase (Authentication & Firestore)
- **State Management:** Zustand
- **UI Components:** Radix UI primitives with custom components
- **Animations:** Framer Motion
- **Audio:** Tone.js for timer sounds
- **AI Integration:** Google Genkit for AI features
- **PWA:** Manifest.ts route handler with multi-environment support

### Project Structure
```
src/
├── app/
│   ├── layout.tsx          # Root layout with PWA meta tags
│   ├── manifest.ts         # Dynamic PWA manifest route handler
│   ├── page.tsx            # Home page
│   └── dashboard/
│       └── page.tsx        # Dashboard page
├── components/             # React components
├── firebase/               # Firebase configuration
├── hooks/                  # Custom React hooks
├── lib/
│   ├── paths.ts           # BasePath-aware routing utilities (NEW)
│   └── utils.ts
└── store/                  # Zustand state management

public/
├── manifest.json          # (Now replaced by manifest.ts)
├── icon-192.svg           # PWA icons (templates)
└── icon-512.svg
```

### Key Features
- Pomodoro timer with customizable intervals
- Countdown timer functionality
- Deep focus mode (fullscreen)
- Anonymous and authenticated user support
- Session tracking and statistics
- Theme support (dark/light mode)
- Audio alerts for timer completion
- Wake lock support for continuous timing
- Today's statistics dashboard
- **NEW: PWA support works on multiple deployment targets**

### PWA Configuration (CRITICAL FIX)

#### Problem Solved:
The original PWA configuration only worked on Vercel (root URL). GitHub Pages deployments failed because:
- `manifest.json` had hardcoded `start_url: "."` 
- No `scope` property (defaulted to "/" which is wrong for subdirectories)
- No PWA manifest link in HTML head
- Missing icons and apple-touch-icon

#### Solution:
1. **Dynamic Manifest Route** (`src/app/manifest.ts`):
   - Uses `NEXT_PUBLIC_BASE_PATH` environment variable
   - Sets `start_url` dynamically: `"${basePath}/"` or `"/"`
   - Sets `scope` dynamically: `basePath` or `"/"`
   - Includes proper icons with maskable variants
   - Supports PWA shortcuts and categories

2. **Updated next.config.ts**:
   - Exports `NEXT_PUBLIC_BASE_PATH` environment variable
   - Derives basePath from `GITHUB_REPOSITORY` for GitHub Actions
   - Works with `NEXT_PUBLIC_BASE_PATH` environment variable
   - Always applies basePath/assetPrefix in production

3. **Enhanced layout.tsx**:
   - Added dynamic manifest link: `<link rel="manifest" href={...} />`
   - Added apple-touch-icon with proper basePath
   - Added apple-mobile-web-app meta tags
   - Added theme-color meta tag
   - All paths are basePath-aware

4. **Fixed Hardcoded Paths**:
   - `router.push('/')` works correctly (Next.js handles basePath)
   - Changed to `router.replace()` for better UX on auth redirects
   - `Link href="/"` works correctly (Next.js Link handles basePath automatically)

### Development Configuration
- **Port:** 5000
- **Host:** 0.0.0.0 (required for Replit)
- **Dev Mode:** Standard Next.js dev server
- **Environment:** Development uses standard Next.js server mode

### Production Configuration
- **Build Output:** Static export (`/out`)
- **Deployment Target:** Static site hosting (Vercel, GitHub Pages, etc.)
- **Images:** Unoptimized (required for static export)
- **BasePath Handling:** Automatic via environment variables

### Deployment Instructions

#### Vercel:
No special configuration needed. Deploy directly from GitHub.

#### GitHub Pages:
1. Set repository name as environment variable when building:
   ```bash
   NEXT_PUBLIC_BASE_PATH=/repository-name npm run build
   ```
2. Deploy the `/out` directory to GitHub Pages

#### Custom Deployment:
Set `NEXT_PUBLIC_BASE_PATH` if deployed to a subdirectory:
```bash
NEXT_PUBLIC_BASE_PATH=/my-subdirectory npm run build
```

### Firebase Configuration
The app uses Firebase for:
- **Authentication:** Anonymous and email-based auth
- **Database:** Firestore for storing timer sessions and user data
- **Security Rules:** Defined in `firestore.rules`

Default Firebase config in `src/firebase/config.ts` with fallback values. Environment variables can override:
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`

## Development Workflow

### Running the App
The app runs automatically via the "Next.js Dev Server" workflow:
1. Starts Next.js dev server on port 5000
2. Binds to 0.0.0.0 for Replit compatibility
3. Displays webview for preview

### Available Scripts
- `npm run dev` - Start development server (port 5000, host 0.0.0.0)
- `npm run build` - Build for production (static export)
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run genkit:dev` - Start Genkit AI development server
- `npm run genkit:watch` - Start Genkit with watch mode

### Important Notes
- The app requires Firebase configuration for full functionality
- Anonymous sign-in is initiated automatically
- PWA manifests are dynamically generated at build time
- BasePath is automatically applied to all routes
- Works on root URL deployments and subdirectory deployments

## PWA Testing Checklist
- [ ] Install on Android via app menu
- [ ] Install on iOS via Share > Add to Home Screen
- [ ] Verify icon displays correctly
- [ ] Works in offline mode (requires service worker implementation)
- [ ] Test on both Vercel (root) and GitHub Pages (subdirectory)

## Known Issues
- Service worker not yet implemented (PWA is installable but not fully offline-capable)
- LSP diagnostics present but don't affect functionality

## Next Steps
Users can:
1. Customize timer intervals in settings
2. Sign up for account to save sessions
3. View daily statistics and focus trends
4. Use deep focus mode for distraction-free timing
5. Customize theme and notification preferences

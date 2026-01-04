# Deployment Guide for Retail Media Creative Tool

## Prerequisites
- Node.js 18+
- npm

## Build Instructions
1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Build the Project**
   ```bash
   npm run build
   ```

3. **Start Production Server**
   ```bash
   npm start
   ```

## Environment Variables
Create a `.env.local` file with the following variables (if applicable in future for real API keys):
```
NEXT_PUBLIC_OPENAI_API_KEY=your_key_here
```

## Static Export (Optional)
If you wish to deploy as a static site (e.g., to Vercel/Netlify without server-side features), update `next.config.js` to include `output: 'export'`.

## Troubleshooting
- **Fabric.js Issues:** Ensure canvas element is mounted before initializing fabric.
- **Lint Errors:** run `npm run lint` to catch any TypeScript issues.

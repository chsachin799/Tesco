# Retail Media Creative Tool 🎨

A Generative AI-powered creative builder empowering advertisers to create guideline-compliant, multi-format retail media creatives.

![Powered by AI](https://img.shields.io/badge/Powered%20by-AI-purple)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## ✨ Features

### 🎯 Core Capabilities

- **Smart Canvas Editor** - Fabric.js-powered editor with drag-and-drop, layers, and undo/redo
- **Asset Management** - Upload and organize packshots, backgrounds, logos, and brand kits
- **Guideline Validator** - Real-time compliance checking for Amazon, Flipkart, and Meta
- **AI Assistance** - GPT-4o powered layout suggestions and auto-ad generation
- **Multi-Format Export** - Auto-generate all social media sizes (Instagram, Facebook, TikTok, LinkedIn)
- **Direct Publishing** - Publish directly to social media platforms

### 📋 5-Step Workflow

1. **Upload Assets** - Packshots, logos, brand kit
2. **Edit & Design** - Smart canvas with AI layouts
3. **Validate** - Check compliance rules
4. **AI Enhance** - Generate variants
5. **Export & Post** - Multi-format publishing

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- API keys (optional for full functionality):
  - OpenAI API key
  - Cloudinary account
  - Social media API credentials

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Add your API keys to .env file
# OPENAI_API_KEY=your_key_here
# NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🏗️ Project Structure

```
├── app/
│   ├── page.tsx              # Landing page
│   ├── creator/              # Main creative builder
│   ├── templates/            # Template gallery
│   └── layout.tsx            # Root layout
├── components/
│   ├── AssetUploader.tsx     # File upload component
│   ├── AssetLibrary.tsx      # Asset management
│   ├── CanvasEditor.tsx      # Fabric.js canvas
│   ├── TemplateGallery.tsx   # Template browser
│   ├── ValidationPanel.tsx   # Compliance checker
│   ├── AIAssistant.tsx       # AI suggestions
│   └── ExportPanel.tsx       # Export & publish
├── store/
│   ├── canvas-store.ts       # Canvas state (Zustand)
│   └── asset-store.ts        # Asset state (Zustand)
├── types/
│   └── index.ts              # TypeScript definitions
└── lib/                      # Utility functions
```

## 🎨 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Canvas**: Fabric.js
- **State**: Zustand
- **AI**: OpenAI GPT-4o & DALL-E
- **Storage**: Cloudinary / AWS S3
- **Image Processing**: Sharp
- **File Upload**: React Dropzone

## 📱 Supported Export Formats

- Instagram Post (1080×1080)
- Instagram Story (1080×1920)
- Facebook Feed (1200×628)
- Facebook Story (1080×1920)
- TikTok (1080×1920)
- LinkedIn Post (1200×627)
- Twitter Post (1200×675)

## 🔧 Configuration

### Environment Variables

Create a `.env` file with:

```env
# OpenAI
OPENAI_API_KEY=your_openai_key

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Social Media APIs (Optional)
META_APP_ID=your_meta_app_id
META_APP_SECRET=your_meta_app_secret
TIKTOK_CLIENT_KEY=your_tiktok_key
LINKEDIN_CLIENT_ID=your_linkedin_id
```

## 🎯 Retailer Guidelines Supported

- **Amazon** - Logo position, font size, safe margins, text ratio
- **Flipkart** - Image size, restricted colors, CTA placement
- **Meta** - File size limits, text-to-image ratio, safe zones

## 🤖 AI Features

- Layout suggestions based on product category
- Auto-generate 10 ad variants
- Image enhancement and retouching
- Brand-safe compliance corrections
- Auto-generated captions for social media

## 📦 Build & Deploy

```bash
# Build for production
npm run build

# Start production server
npm start

# Deploy to Vercel (recommended)
vercel deploy
```

## 🛣️ Roadmap

- [ ] AI adaptive resizing
- [ ] Intelligent guideline explanation
- [ ] Auto-generated channel-optimized creative sets
- [ ] Collaborative editing
- [ ] Background removal with AI
- [ ] Smart layout auto-arrange
- [ ] Brand kit management system

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 👥 Credits

**Binary Brains** - Retail Media Creative Tool

Powered by:
- Next.js
- OpenAI
- Fabric.js
- Tailwind CSS

---

Made with ❤️ for small businesses and advertisers

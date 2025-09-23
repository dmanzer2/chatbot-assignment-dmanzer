# BatchQuery Image Analysis Chatbot
 
A modern, responsive chatbot web app for analyzing images using OpenAI GPT-4o Vision API (or mock mode for demos). Upload up to 4 images, ask questions, and get instant AI-powered answers in a chat interface.

---

## Features

- **Image Upload**: Drag-and-drop or click to upload 1-4 images (JPEG, PNG, WebP, GIF, SVG).
- **Chatbot UI**: Conversational interface with chat bubbles for user and assistant.
- **Image Preview**: See uploaded images in a grid, remove images before submitting.
- **Duplicate Detection**: Prevents uploading the same image twice.
- **Responsive Design**: Mobile, tablet, and desktop layouts with adaptive preview and dropzone sizing.
- **Error Handling**: Friendly error messages auto-dismiss after 10 seconds.
- **Mock/Demo Mode**: Instantly demo the app without an OpenAI API key.
- **OpenAI Integration**: Real GPT-4o Vision API support (if API key is provided).
- **Icon Buttons**: Intuitive expand/collapse controls for image area.

---

## How It Works

1. **Upload Images**: Add up to 4 images using drag-and-drop or file picker.
2. **Ask a Question**: Type a question about the images (e.g., "Are there any defects?").
3. **Get AI Response**: The chatbot analyzes the images and responds in the chat.
4. **Remove Images**: Click the X icon to remove any image before submitting.
5. **Demo Mode**: If no API key is set, the app returns mock responses for instant testing.

---

## Usage Instructions

### 1. Install Dependencies

```bash
npm install
```

---

### 2. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or your chosen port) in your browser.

---

### 3. Environment Variables (Optional)

To use real OpenAI Vision API:

1. Create a `.env.local` file in the project root.
2. Add your OpenAI API key:
  ```
  OPENAI_API_KEY=sk-...
  MOCK_OPENAI=false
  ```
3. Restart the dev server.

If `MOCK_OPENAI=true` or in development mode, the app will use mock responses.

---

## API Details

- **Endpoint**: `/api/analyze-images`
- **Method**: `POST` (multipart/form-data)
- **Fields**:
  - `images`: 1-4 image files
  - `question`: string
- **Response**:
  - `{ results: [{ response: string }] }`

---

## Demo Mode

- No API key required.
- All questions return a generic mock response instantly.
- Useful for development, testing, and presentations.

---

## File Structure

- `src/app/chatbot/page.tsx`: Main chatbot UI and logic
- `pages/api/analyze-images.ts`: Backend API route for image analysis
- `public/`: Static assets and icons
- `tailwind.config.ts`: Tailwind CSS configuration

---

## Customization

- Add more mock Q&A pairs in `MOCK_QA` array in `page.tsx` for richer demo responses.
- Adjust accepted image types in `ACCEPTED_TYPES`.
- Tweak UI layout and styles in `chatbot.module.css` and Tailwind classes.

---

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

---

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

---

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

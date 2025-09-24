"use client";
import { useId, useRef, useState, useEffect } from "react";
import { ArrowUpIcon, XMarkIcon, PlusIcon, MinusIcon } from "@heroicons/react/24/solid";
import { RectangleStackIcon, PhotoIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import styles from "./chatbot.module.css";

const MAX_IMAGES = 4;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];

// --- API Call for Image Analysis when using API key ---
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function analyzeImages(question: string, imageFiles: File[]): Promise<string[]> {
	const formData = new FormData();
	formData.append("question", question);
	imageFiles.forEach((file: File) => formData.append("images", file));
	const res = await fetch("/api/analyze-images", {
		method: "POST",
		body: formData,
	});
	if (!res.ok) {
		const error = await res.json();
		throw new Error(error?.error || "Server error");
	}
	const data = await res.json();
	return data.results?.map((r: { response: string }) => r.response) || [];
}

// Demo mock Q&A pairs
const MOCK_QA: { q: string; a: string }[] = [
  {
    q: "Are there any visible defects or issues?",
    a: "No visible defects detected in any of the images.",
  },
  {
    q: "Is these images of a used product or new?",
    a: "All images appear to show new products.",
  },
  {
    q: "How many books are on this image?",
    a: "There are no books detected in any of the images."
  }
  // Add more mock Q&A pairs as needed
];

/**
 * ChatbotImageAnalysis Component
 * --------------------------------
 * Main UI and logic for the BatchQuery Image Analysis Chatbot.
 * - Handles image upload, preview, duplicate detection, and removal.
 * - Manages chat bubbles for user questions and AI (mock or real) responses.
 * - Integrates with backend API for image analysis (mock/demo or OpenAI Vision).
 * - Provides responsive layout for mobile, tablet, and desktop.
 * - Includes error handling, auto-dismiss, and intuitive controls.
 */
export default function ChatbotImageAnalysis() {
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const dropId = useId();
  const [imageAreaOpen, setImageAreaOpen] = useState(true);

  // Store only File objects in state, generate preview URLs on client
  const [images, setImages] = useState<Array<File>>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [error, setError] = useState<string>("");

  // Automatically clear error after 10 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError("") , 10000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Hidden file input ref for click-to-upload
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Chat bubbles state
  const [chat, setChat] = useState<Array<{ role: "user"|"assistant"; text: string }>>([]);

  // Scroll chat area to bottom when chat updates
  useEffect(() => {
    if (imageAreaOpen && chatAreaRef.current) {
      // Wait for DOM update and possible animation
      const timeout = setTimeout(() => {
        if (chatAreaRef.current) {
          chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
        }
      }, 100); // 100ms delay ensures layout is updated
      return () => clearTimeout(timeout);
    }
  }, [imageAreaOpen, chat]);

  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  // --- Image Uploader Logic ---

  // Handles file selection via the hidden file input (click-to-upload)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    // Convert FileList to Array and process
    processFiles(Array.from(e.target.files));
  };

  // Handles files dropped onto the dropzone (drag-and-drop)
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      // Convert FileList to Array and process
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  // Processes selected or dropped files: validates, updates state, and handles errors
  const processFiles = async (files: File[]) => {
    const newImages: Array<File> = [...images];
    let localError = "";
    // Validate each file
    for (const file of files) {
      if (newImages.length >= MAX_IMAGES) {
        localError = `You can only upload up to ${MAX_IMAGES} images.`;
        break;
      }
      if (!ACCEPTED_TYPES.includes(file.type)) {
        localError = "Unsupported file type.";
        break;
      }
      // Check for duplicates by name, size, lastModified
      const isDuplicate = newImages.some(img =>
        img.name === file.name &&
        img.size === file.size &&
        img.lastModified === file.lastModified
      );
      if (isDuplicate) {
        localError = "Duplicate image detected. Please select different images.";
        break;
      }
      newImages.push(file);
    }
    setError(localError);
    setImages(localError ? images : newImages);
  };

  // Handles user question submission
  const handleAsk = async (question: string, imageFiles: File[]) => {
    if (imageFiles.length < 1 || imageFiles.length > 4) {
      setError("Please upload 1-4 images to analyze.");
      return;
    }
    setChat((prev) => [...prev, { role: "user", text: question }]);
    setLoading(true);
    setChat((prev) => [...prev, { role: "assistant", text: "Analyzing images..." }]);
    setTimeout(() => {
      setChat((prev) => {
        const updated = prev.slice(0, -1);
        // Find mock answer for question
        const mock = MOCK_QA.find(qapair => qapair.q.toLowerCase() === question.toLowerCase());
        if (mock) {
          updated.push({ role: "assistant", text: mock.a });
        } else {
          updated.push({ role: "assistant", text: "Mock LLM response: Images analyzed successfully." });
        }
        return updated;
      });
      setLoading(false);
    }, 800); // Simulate network delay
  };

  // Removes an image from the preview grid and state
  const handleRemoveImage = (idx: number) => {
    setImages(prev => {
      const updated = [...prev];
      updated.splice(idx, 1);
      return updated;
    });
    setError("");
  };

  // Generate preview URLs only on client when images change
  useEffect(() => {
    // Generate new preview URLs
    const newPreviewUrls = images.map(file => URL.createObjectURL(file));
    setPreviewUrls(newPreviewUrls);
    // Cleanup only new URLs on unmount or images change
    return () => {
      newPreviewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [images]);

  // Triggers the hidden file input when dropzone is clicked
  const handleClickDropzone = () => {
    fileInputRef.current?.click();
  };

	return (
		<div className="min-h-dvh bg-[#F0F7FF] text-gray-900">
			{/* Top bar for concept only */}
			<header className="sticky top-0 z-10 bg-black text-white">
				<div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
					<h1 className="text-sm font-medium tracking-wide">BatchQuery Image Analysis — Chatbot</h1>
					<div className="h-6 w-6 rounded-full bg-neutral-300" aria-hidden />
				</div>
			</header>

			{/* Centered content card pinned to bottom */}
			<main className={`mx-auto max-w-5xl px-4 py-8 ${styles.centeredCard}`}> 
				<section
					aria-labelledby={titleId}
					className={`rounded-2xl p-6 backdrop-blur flex flex-col ${styles.gradientSection}`}
				>
					<h2 id={titleId} className="sr-only">Image analysis workspace</h2>

					{/* Chat and image area wrapper */}
					<div className="flex flex-col flex-1 min-h-0">
            {/* Chat area - always scrollable, flex-1 */}
            <div ref={chatAreaRef} className={`flex flex-col gap-3 flex-1 overflow-y-auto ${styles.chatScroll} bg-transparent`}>
              {chat.map((bubble, idx) => (
                <div
                  key={idx}
                  className={`w-fit rounded-full px-4 py-2 text-sm ${bubble.role === "assistant" ? "bg-purple-500/90 text-white" : "bg-white self-end"}`}
                >
                  {bubble.text}
                </div>
              ))}
            </div>

            {/* Image area - collapsible */}
            {imageAreaOpen && (
              <div>
                {/* Mobile/tablet layout: <768px width */}
                <div className="block lg:hidden w-full px-2 mt-4">
                  {/* Previews row: always show 4 slots, side-by-side */}
                  <div className="flex flex-row gap-3 w-full mb-4">
                    {[0,1,2,3].map((i) => (
                      <div key={i} className="relative flex-1 aspect-[16/13] rounded-2xl border border-gray-200 bg-gray-50 shadow-inner group">
                        {previewUrls[i] ? (
                          <>
                            <Image
                              src={previewUrls[i]}
                              alt={`preview-${i}`}
                              fill
                              sizes="100vw"
                              className="object-cover rounded-2xl transition duration-200 group-hover:opacity-40"
                              style={{ zIndex: 0 }}
                            />
                            <button
                              type="button"
                              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200 z-10"
                              onClick={() => handleRemoveImage(i)}
                              aria-label="Remove image"
                            >
                              <XMarkIcon className={`text-red-500 ${styles.xIconLarge}`} />
                            </button>
                          </>
                        ) : (
                          <div className={`absolute inset-0 flex flex-col items-center justify-center gap-1 text-gray-400 ${styles.imagePreviewBlur}`}>
                            <PhotoIcon className="h-6 w-6" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  {/* Dropzone row */}
                  <div className="w-full flex items-stretch justify-center">
                    <div aria-labelledby={dropId} className={`flex flex-col items-center justify-center rounded-2xl border-5 border-dashed border-gray-300 bg-white p-6 text-center w-full transition-colors duration-200 hover:bg-gray-100 cursor-grab active:cursor-grabbing ${styles.dropzone}`}
                      onClick={handleClickDropzone}
                      onDrop={handleDrop}
                      onDragOver={e => e.preventDefault()}
                    >
                      <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-50">
                        <RectangleStackIcon className="h-11 w-11 text-gray-500" />
                      </div>
                      <h3 id={dropId} className="text-2xl font-semibold text-gray-900">Drag and Drop or<br/>Click to add Images</h3>
                      <p className="mt-1 text-xs text-gray-500">Only 4 images can be uploaded at a time.</p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept={ACCEPTED_TYPES.join(",")}
                        multiple
                        className="hidden"
                        onChange={handleFileChange}
                        disabled={images.length >= MAX_IMAGES}
                      />
                      {error && <div className="text-red-500 mt-2 text-sm">{error}</div>}
                    </div>
                  </div>
                </div>
                {/* Desktop layout: >=768px width */}
                <div className="hidden lg:flex gap-4 items-stretch px-4 mt-8">
                  {/* 2×2 grid, 1/3 width */}
                  <div className="w-1/3 flex flex-col justify-center">
                    <div aria-label="Image slots (max 4)" className="grid grid-cols-2 grid-rows-2 gap-3 h-full">
                      {[0,1,2,3].map((i) => (
                        <div
                          key={i}
                          className="relative aspect-[5/4] rounded-2xl border border-gray-200 bg-gray-50 shadow-inner group"
                        >
                          {/* If image exists, show preview, else show placeholder */}
                          {previewUrls[i] ? (
                            <>
                              <Image
                                src={previewUrls[i]}
                                alt={`preview-${i}`}
                                fill
                                sizes="(max-width: 768px) 100vw, 33vw"
                                className="object-cover rounded-2xl transition duration-200 group-hover:opacity-40"
                                style={{ zIndex: 0 }}
                              />
                              <button
                                type="button"
                                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200 z-10"
                                onClick={() => handleRemoveImage(i)}
                                aria-label="Remove image"
                              >
                                <XMarkIcon className={`text-red-500 ${styles.xIconLarge}`} />
                              </button>
                            </>
                          ) : (
                            <div className={`absolute inset-0 flex flex-col items-center justify-center gap-1 text-gray-400 ${styles.imagePreviewBlur}`}>
                              <PhotoIcon className="h-6 w-6" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dashed dropzone, 2/3 width, full height */}
                  <div className="w-2/3 flex items-stretch justify-center">
                    <div aria-labelledby={dropId} className={`flex flex-col items-center justify-center rounded-2xl border-5 border-dashed border-gray-300 bg-white p-6 text-center w-full max-h-[400px] transition-colors duration-200 hover:bg-gray-100 cursor-grab active:cursor-grabbing ${styles.dropzone}`}
                      onClick={handleClickDropzone}
                      onDrop={handleDrop}
                      onDragOver={e => e.preventDefault()}
                    >
                      <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-50">
                        <RectangleStackIcon className="h-11 w-11 text-gray-500" />
                      </div>
                      <h3 id={dropId} className="text-2xl font-semibold text-gray-900">Drag and Drop or<br/>Click to add Images</h3>
                      <p className="mt-1 text-xs text-gray-500">Only 4 images can be uploaded at a time.</p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept={ACCEPTED_TYPES.join(",")}
                        multiple
                        className="hidden"
                        onChange={handleFileChange}
                        disabled={images.length >= MAX_IMAGES}
                      />
                      {error && <div className="text-red-500 mt-2 text-sm">{error}</div>}
                    </div>
                  </div>
                </div>
              </div>
            )}
					</div>

					{/* Composer with expand/collapse button */}
          <form
            className="mt-6 flex items-center gap-2"
            // Validate user input
            onSubmit={e => {
              e.preventDefault();
              if (inputValue.trim() && images.length >= 1 && images.length <= 4 && !loading) {
                handleAsk(inputValue.trim(), images);
                setInputValue("");
              }
            }}
          >
            <label htmlFor="ask" className="sr-only">Ask about your images</label>
            <div className="relative flex-1">
              <input
                id="ask"
                type="text"
                placeholder="Ask about your image(s)"
                className="w-full rounded-full bg-white px-5 py-3 pr-14 text-md outline-none focus:ring-2 focus:ring-purple-700"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                disabled={loading}
              />
              <div className="absolute right-[53px] top-1/2 -translate-y-1/2">
                {/* Show icon button on mobile/tablet, text on desktop */}
                <button
                  type="button"
                  aria-label="Toggle image area"
                  className="rounded-full bg-gray-200 p-2 shadow hover:bg-gray-300 active:scale-95 cursor-pointer relative group block lg:hidden"
                  onClick={() => setImageAreaOpen((open) => !open)}
                >
                  {imageAreaOpen ? (
                    <MinusIcon className="h-5 w-5" />
                  ) : (
                    <PlusIcon className="h-5 w-5" />
                  )}
                  <span className="absolute left-1/2 -translate-x-1/2 -top-8 z-20 whitespace-nowrap bg-black text-white text-xs rounded-lg px-3 py-1 opacity-0 group-hover:opacity-100 transition duration-200 shadow-lg pointer-events-none">
                    {imageAreaOpen ? "Hide image upload area" : "Show image upload area"}
                  </span>
                </button>
                <button
                  type="button"
                  aria-label="Toggle image area"
                  className="rounded-full bg-gray-200 px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-300 active:scale-95 transition cursor-pointer relative group hidden lg:block"
                  onClick={() => setImageAreaOpen((open) => !open)}
                >
                  {imageAreaOpen ? "Close Image Area" : "Open Image Area"}
                  <span className="absolute left-1/2 -translate-x-1/2 -top-8 z-20 whitespace-nowrap bg-black text-white text-xs rounded-lg px-3 py-1 opacity-0 group-hover:opacity-100 transition duration-200 shadow-lg pointer-events-none">
                    {imageAreaOpen ? "Hide image upload area" : "Show image upload area"}
                  </span>
                </button>
              </div>
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <button
                  type="submit"
                  aria-label="Send"
                  className="rounded-full bg-emerald-200 p-2 hover:bg-emerald-300 active:scale-95 cursor-pointer relative group"
                  disabled={loading || !inputValue.trim() || images.length < 1 || images.length > 4}
                >
                  <ArrowUpIcon className="h-5 w-5 text-emerald-700" />
                  <span className="absolute left-1/2 -translate-x-1/2 -top-8 z-20 whitespace-nowrap bg-black text-white text-xs rounded-lg px-3 py-1 opacity-0 group-hover:opacity-100 transition duration-200 shadow-lg pointer-events-none">
                    Send chat message
                  </span>
                </button>
              </div>
            </div>
          </form>
				</section>
			</main>
		</div>
	);
}

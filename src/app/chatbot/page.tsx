"use client";
import { useId, useRef, useState } from "react";
import { ArrowUpIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { RectangleStackIcon, PhotoIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import styles from "./chatbot.module.css";

const MAX_IMAGES = 4;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];

export default function ChatbotImageAnalysis() {
	const titleId = useId();
	const dropId = useId();
	const [imageAreaOpen, setImageAreaOpen] = useState(true);
	const [images, setImages] = useState<Array<{ url: string; file: File }>>([]);
	const [error, setError] = useState<string>("");
	const fileInputRef = useRef<HTMLInputElement>(null);

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
		const processFiles = (files: File[]) => {
			const newImages = [...images]; // Start with current images
			let localError = "";
			for (const file of files) {
				// Enforce max image count
				if (newImages.length >= MAX_IMAGES) {
					localError = `You can only upload up to ${MAX_IMAGES} images.`;
					break;
				}
				// Enforce accepted file types
				if (!ACCEPTED_TYPES.includes(file.type)) {
					localError = "Unsupported file type.";
					break;
				}
				// Add valid image to state (URL for preview, File for future upload)
				newImages.push({ url: URL.createObjectURL(file), file });
			}
			setError(localError); // Show error if any
			setImages(newImages); // Update image previews
		};

		// Removes an image from the preview grid and state
		const handleRemoveImage = (idx: number) => {
			setImages(prev => {
				const updated = [...prev];
				// Revoke object URL to free memory
				URL.revokeObjectURL(updated[idx].url);
				updated.splice(idx, 1);
				return updated;
			});
			setError(""); // Clear any error
		};

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
					style={{ maxHeight: "85vh", minHeight: "400px" }}
				>
					<h2 id={titleId} className="sr-only">Image analysis workspace</h2>

					{/* Chat and image area wrapper */}
					<div className="flex flex-col flex-1 min-h-0">
						{/* Chat area - always scrollable, flex-1 */}
						<div className={`flex flex-col gap-3 flex-1 overflow-y-auto ${styles.chatScroll} bg-transparent`}>
							{/* Assistant result pill (static placeholder) */}
							<div className="w-fit rounded-full bg-purple-500/90 px-4 py-2 text-sm text-white">No issues were detected</div>
							{/* User prompt bubble (static placeholder) */}
							<div className="w-fit self-end rounded-full bg-white px-4 py-2 text-sm">Are there any visible defects or issues?</div>
							{/* Add more bubbles here to test scroll */}
							<div className="w-fit rounded-full bg-purple-500/90 px-4 py-2 text-sm text-white">No issues were detected</div>
							<div className="w-fit self-end rounded-full bg-white px-4 py-2 text-sm">Are there any visible defects or issues?</div>
							<div className="w-fit rounded-full bg-purple-500/90 px-4 py-2 text-sm text-white">No issues were detected</div>
							<div className="w-fit self-end rounded-full bg-white px-4 py-2 text-sm">Are there any visible defects or issues?</div>
							{/* Assistant result pill (static placeholder) */}
							<div className="w-fit rounded-full bg-purple-500/90 px-4 py-2 text-sm text-white">No issues were detected</div>
							{/* User prompt bubble (static placeholder) */}
							<div className="w-fit self-end rounded-full bg-white px-4 py-2 text-sm">Are there any visible defects or issues?</div>
						</div>

						{/* Image area - collapsible */}
						{imageAreaOpen && (
							<div className="flex gap-4 items-stretch px-4 mt-8">
								{/* 2×2 grid, 1/3 width */}
								<div className="w-1/3 flex flex-col justify-center">
									<div aria-label="Image slots (max 4)" className="grid grid-cols-2 grid-rows-2 gap-3 h-full">
										{[0,1,2,3].map((i) => (
											<div
												key={i}
												className="relative aspect-square rounded-2xl border border-gray-200 bg-gray-50 shadow-inner group"
											>
												{/* If image exists, show preview, else show placeholder */}
												{images[i] ? (
													<>
														<Image
															src={images[i].url}
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
                              <XMarkIcon style={{ width: '90%', height: '90%' }} className="text-red-500" />
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
									<div aria-labelledby={dropId} className={`flex flex-col items-center justify-center rounded-2xl border-5 border-dashed border-gray-300 bg-white p-6 text-center w-full h-full transition-colors duration-200 hover:bg-gray-100 cursor-grab active:cursor-grabbing ${styles.dropzone}`}
										onClick={handleClickDropzone}
										onDrop={handleDrop}
										onDragOver={e => e.preventDefault()}
									>
										<div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-50">
											<RectangleStackIcon className="h-11 w-11 text-gray-500" />
										</div>
										<h3 id={dropId} className="text-2xl font-semibold text-gray-900">Drag and Drop or<br/>Click to add Images</h3>
										<p className="mt-1 text-xs text-gray-500">Only 4 images can be used for comparison.</p>
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
						)}
					</div>

					{/* Composer with expand/collapse button */}
					<form className="mt-6 flex items-center gap-2">
						<label htmlFor="ask" className="sr-only">Ask about your images</label>
						<div className="relative flex-1">
							<input
								id="ask"
								type="text"
								placeholder="Ask me anything"
								className="w-full rounded-full bg-white px-5 py-3 pr-14 text-md outline-none focus:ring-2 focus:ring-purple-700"
							/>
              <div className="absolute right-[53px] top-1/2 -translate-y-1/2">
                <button
                  type="button"
                  aria-label="Toggle image area"
                  className="rounded-full bg-gray-200 px-4 py-2 text-sm font-medium text-gray-500 shadow hover:bg-gray-300 active:scale-95 transition cursor-pointer relative group"
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
                  type="button"
                  aria-label="Send"
                  className="rounded-full bg-emerald-200 p-2 shadow hover:bg-emerald-300 active:scale-95 cursor-pointer relative group"
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

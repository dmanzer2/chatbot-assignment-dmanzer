"use client";

import { useId } from "react";
import { useState } from "react";
import { ArrowUpIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { RectangleStackIcon, PhotoIcon } from "@heroicons/react/24/outline";
import styles from "./chatbot.module.css";

export default function ChatbotImageAnalysis() {
  const titleId = useId();
  const dropId = useId();
  const [imageAreaOpen, setImageAreaOpen] = useState(true);

  return (
    <div className="min-h-dvh bg-[#F0F7FF] text-gray-900">
      {/* Top bar */}
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
              <div className="w-fit rounded-full bg-purple-500/90 px-4 py-2 text-sm text-white">
                No issues were detected
              </div>
              {/* User prompt bubble (static placeholder) */}
              <div className="w-fit self-end rounded-full bg-white px-4 py-2 text-sm">
                Are there any visible defects or issues?
              </div>
              {/* Add more bubbles here to test scroll */}
              <div className="w-fit rounded-full bg-purple-500/90 px-4 py-2 text-sm text-white">
                No issues were detected
              </div>
              <div className="w-fit self-end rounded-full bg-white px-4 py-2 text-sm">
                Are there any visible defects or issues?
              </div>
              <div className="w-fit rounded-full bg-purple-500/90 px-4 py-2 text-sm text-white">
                No issues were detected
              </div>
              <div className="w-fit self-end rounded-full bg-white px-4 py-2 text-sm">
                Are there any visible defects or issues?
              </div>
              {/* Assistant result pill (static placeholder) */}
              <div className="w-fit rounded-full bg-purple-500/90 px-4 py-2 text-sm text-white">
                No issues were detected
              </div>
              {/* User prompt bubble (static placeholder) */}
              <div className="w-fit self-end rounded-full bg-white px-4 py-2 text-sm">
                Are there any visible defects or issues?
              </div>
              {/* Add more bubbles here to test scroll */}
              <div className="w-fit rounded-full bg-purple-500/90 px-4 py-2 text-sm text-white">
                No issues were detected
              </div>
              <div className="w-fit self-end rounded-full bg-white px-4 py-2 text-sm">
                Are there any visible defects or issues?
              </div>
              <div className="w-fit rounded-full bg-purple-500/90 px-4 py-2 text-sm text-white">
                No issues were detected
              </div>
              <div className="w-fit self-end rounded-full bg-white px-4 py-2 text-sm">
                Are there any visible defects or issues?
              </div>
              {/* Assistant result pill (static placeholder) */}
              <div className="w-fit rounded-full bg-purple-500/90 px-4 py-2 text-sm text-white">
                No issues were detected
              </div>
              {/* User prompt bubble (static placeholder) */}
              <div className="w-fit self-end rounded-full bg-white px-4 py-2 text-sm">
                Are there any visible defects or issues?
              </div>
              {/* Add more bubbles here to test scroll */}
              <div className="w-fit rounded-full bg-purple-500/90 px-4 py-2 text-sm text-white">
                No issues were detected
              </div>
              <div className="w-fit self-end rounded-full bg-white px-4 py-2 text-sm">
                Are there any visible defects or issues?
              </div>
              <div className="w-fit rounded-full bg-purple-500/90 px-4 py-2 text-sm text-white">
                No issues were detected
              </div>
              <div className="w-fit self-end rounded-full bg-white px-4 py-2 text-sm">
                Are there any visible defects or issues?
              </div>
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
                        {/* Placeholder icon + plus */}
                        <div className={`absolute inset-0 flex flex-col items-center justify-center gap-1 text-gray-400 ${styles.imagePreviewBlur}`}>
                          <PhotoIcon className="h-6 w-6" />
                        </div>
                        {/* Remove X Heroicon, only on hover */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200">
                          <XMarkIcon className={`text-red-500 ${styles.xIcon}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dashed dropzone, 2/3 width, full height */}
                <div className="w-2/3 flex items-stretch justify-center">
                  <div aria-labelledby={dropId} className={`flex flex-col items-center justify-center rounded-2xl border-5 border-dashed border-gray-300 bg-white p-6 text-center w-full h-full transition-colors duration-200 hover:bg-gray-100 cursor-grab active:cursor-grabbing ${styles.dropzone}`}>
                    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-50">
                      <RectangleStackIcon className="h-11 w-11 text-gray-500" />
                    </div>
                    <h3 id={dropId} className="text-base font-semibold">Drag and Drop or<br/>Click to add Images</h3>
                    <p className="mt-1 text-xs text-gray-500">Only 4 images can be used for comparison.</p>
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
              <button
                type="button"
                aria-label="Toggle image area"
                title="Toggle image area"
                className="absolute right-[53px] top-1/2 -translate-y-1/2 rounded-full bg-gray-200 px-4 py-2 text-sm font-medium text-gray-500 shadow hover:bg-gray-300 transition cursor-pointer"
                onClick={() => setImageAreaOpen((open) => !open)}
              >
                {imageAreaOpen ? "Close Image Area" : "Open Image Area"}
              </button>
              <button
                type="button"
                aria-label="Send"
                title="Send chat message"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-emerald-200 p-2 shadow hover:bg-emerald-300 active:scale-95 cursor-pointer"
              >
                <ArrowUpIcon className="h-5 w-5 text-emerald-700" />
              </button>
            </div>
          </form>

        </section>
      </main>
    </div>
  );
}

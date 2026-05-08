import React from "react";

const SIZE_MAP = {
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-20 h-20",
};

export default function LoadingScreen({
  logo,
  title = "Loading",
  subtitle = "Please wait...",
  progress = null,
  size = "md",
  showDots = true,
}) {
  const spinnerSize = SIZE_MAP[size] || SIZE_MAP.md;

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#fdf6e3] to-[#f5f1e6] text-[#2d2d2d]">
      {/* Logo */}
      {logo && <img src={logo} alt="logo" className="w-20 h-20 mb-6" />}

      {/* Spinner */}
      <svg
        className={`${spinnerSize} animate-spin text-black mb-6`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        ></path>
      </svg>

      {/* Title & Subtitle */}
      <div className="text-center mb-4">
        <h1 className="text-xl font-semibold text-[#3b2f2f]">{title}</h1>
        <p className="text-sm text-[#6b5e5e]">{subtitle}</p>
      </div>

      {/* Progress Bar */}
      {typeof progress === "number" && progress >= 0 && progress <= 100 && (
        <div className="w-64">
          <div className="w-full bg-[#e6dccf] rounded-full h-2 overflow-hidden">
            <div
              className="h-2 bg-black transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-1 text-xs text-[#6b5e5e] text-right">{progress}%</div>
        </div>
      )}

      {/* Dots */}
      {showDots && (
        <div className="mt-4">
          <Dots />
        </div>
      )}
    </div>
  );
}

function Dots() {
  return (
    <div className="flex items-center gap-1 text-sm text-[#6b5e5e]" aria-hidden>
      <span className="dot animate-bounce inline-block">.</span>
      <span className="dot animate-bounce inline-block animation-delay-200">.</span>
      <span className="dot animate-bounce inline-block animation-delay-400">.</span>

      <style>{`
        .dot { font-weight: 700; font-size: 1.25rem; }
        .animation-delay-200 { animation-delay: 0.12s; }
        .animation-delay-400 { animation-delay: 0.24s; }
      `}</style>
    </div>
  );
}

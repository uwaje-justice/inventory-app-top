import React from "react";

function LoadingSpinner({ fullScreen = true, size = "md", className = "" }) {
  const sizes = { sm: "h-4 w-4 border-2", md: "h-8 w-8 border-4", lg: "h-12 w-12 border-[3px]" };

  // role="status" + visually hidden text announces "Loading..." to screen
  // readers. Without this, a screen reader user has no indication that
  // content is being fetched.
  if (fullScreen) {
    return (
      <div className="flex min-h-screen items-center justify-center" role="status">
        <span className="sr-only">Loading...</span>
        <div className={`${sizes[size]} animate-spin rounded-full border-transparent border-b-primary ${className}`} aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center py-8 ${className}`} role="status">
      <span className="sr-only">Loading...</span>
      <div className={`${sizes[size]} animate-spin rounded-full border-transparent border-b-primary`} aria-hidden="true" />
    </div>
  );
}

export default React.memo(LoadingSpinner);

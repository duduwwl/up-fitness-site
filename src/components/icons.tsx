/** Diagonal arrow for external and forward links. Decorative: the link text carries the meaning. */
export function ArrowIcon() {
  return (
    <svg className="arrow-icon" viewBox="0 0 12 12" aria-hidden="true" focusable="false">
      <path d="M2 10 10 2M4 2h6v6" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

/** Simplified UP mark: the U whose left stem rises into the arrow, then the P. */
export function UpMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 40" aria-hidden="true" focusable="false">
      <path d="M8 0 16 9h-5v20a5 5 0 0 0 10 0V12h6v17a11 11 0 0 1-22 0V9H0Z" fill="currentColor" />
      <path d="M32 12h12a9 9 0 0 1 0 18h-6v10h-6Zm6 6v6h6a3 3 0 0 0 0-6Z" fill="currentColor" />
    </svg>
  );
}

/** Wordmark used in the header: mark + "UP Fitness" text for screen readers. */
export function Logo() {
  return (
    <span className="logo">
      <span className="logo-disc">
        <UpMark className="logo-mark" />
      </span>
      <span className="logo-text" translate="no">
        UP <span>Fitness</span>
      </span>
    </span>
  );
}

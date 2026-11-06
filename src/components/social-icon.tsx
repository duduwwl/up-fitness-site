export function SocialIcon({ kind }: { kind: "instagram" | "whatsapp" }) {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
    {kind === "instagram" ? <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" /></> :
      <><path d="M4.5 18.5 3 22l4.5-1.2A9.5 9.5 0 1 0 4.5 18.5Z" /><path d="M8 7c-2 3 3 8 6 9l2-2-3-2-1 1-2-2 1-1-2-3Z" /></>}
  </svg>;
}

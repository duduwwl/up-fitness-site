"use client";

import { useEffect, useState } from "react";
import { getOpenStatus, weekdayHoursText, type OpenStatus as Status } from "@/lib/hours";

/** Live "open now" line in São Paulo time. Without script it shows the weekday hours. */
// No aria-live: the status is not urgent and appears twice on the page.
export function OpenStatus({ className }: { className?: string }) {
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    const update = () => setStatus(getOpenStatus(new Date()));
    update();
    const id = window.setInterval(update, 30_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <p className={className} data-open={status?.open ?? undefined} data-status>
      <span className="status-dot" aria-hidden="true" />
      {/* Holidays follow other hours, which the regular-schedule calculation does not know. */}
      {status ? `${status.text}, exceto feriados` : weekdayHoursText}
    </p>
  );
}

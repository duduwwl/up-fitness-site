"use client";

import { useState, type FormEvent } from "react";
import { sitePath } from "@/lib/paths";
import styles from "./checkout.module.css";

export function PrivacyManager() {
  const [requestId, setRequestId] = useState("");
  const [managementCode, setManagementCode] = useState("");
  const [message, setMessage] = useState("");

  async function call(action: "export" | "delete") {
    setMessage("");
    try {
      const response = await fetch(sitePath(`/api/privacy/${action}/`), {
        method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ requestId, managementCode }),
      });
      if (action === "delete" && response.ok) {
        setRequestId(""); setManagementCode(""); setMessage("Dados excluídos."); return;
      }
      const result = await response.json() as { data?: unknown; error?: string };
      if (!response.ok) { setMessage(result.error ?? "Não foi possível concluir."); return; }
      const blob = new Blob([JSON.stringify(result.data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url; anchor.download = `up-fitness-${requestId}.json`; anchor.click(); URL.revokeObjectURL(url);
      setMessage("Arquivo exportado.");
    } catch {
      setMessage("Não foi possível conectar. Tente novamente.");
    }
  }

  function submit(event: FormEvent) { event.preventDefault(); void call("export"); }

  return <form onSubmit={submit}>
    <label>ID da solicitação<input required value={requestId} onChange={(e) => setRequestId(e.target.value)} /></label>
    <label>Código de gestão<input required value={managementCode} onChange={(e) => setManagementCode(e.target.value)} /></label>
    <button className={styles.primary}>Exportar meus dados</button>
    <button type="button" onClick={() => window.confirm("Excluir estes dados de forma permanente?") && void call("delete")}>Excluir meus dados</button>
    <p role="status">{message}</p>
  </form>;
}

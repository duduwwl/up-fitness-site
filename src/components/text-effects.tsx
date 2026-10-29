import { Children, cloneElement, isValidElement, type ReactNode } from "react";

const skip = new Set(["svg", "script", "style", "canvas", "textarea", "select", "option", "a", "button"]);

/** Keep the original semantic elements and accessible text; animate visual words only. */
export function TextEffects({ children }: { children: ReactNode }): ReactNode {
  return Children.map(children, (child): ReactNode => {
    if (typeof child === "string") {
      if (!child.trim()) return child;
      return <span className="text-words">{child.split(/(\s+)/).map((word, i) =>
        /^\s+$/.test(word) ? word : <span key={i} className="text-word" style={{ animationDelay: `${Math.min(i * 0.025, 0.4)}s` }}>{word}</span>,
      )}</span>;
    }
    if (!isValidElement<{ children?: ReactNode; className?: string; "data-status"?: boolean }>(child)) return child;
    if ((typeof child.type === "string" && skip.has(child.type)) || (child.props.className?.includes("visually-hidden") || child.props.className?.includes("text-word")) || child.props["data-status"] !== undefined) return child;
    if (!child.props.children) return child;
    return cloneElement(child, {}, <TextEffects>{child.props.children}</TextEffects>);
  });
}


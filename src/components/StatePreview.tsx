import { Field, Select } from "@fluentui/react-components";
import { useSearchParams } from "react-router-dom";

export type PreviewState = "data" | "loading" | "error" | "empty";

export function usePreviewState(): PreviewState {
  const [params] = useSearchParams();
  const candidate = params.get("previewState");
  return candidate === "loading" || candidate === "error" || candidate === "empty" || candidate === "data"
    ? candidate
    : "data";
}

export function PreviewStatePicker() {
  const [params, setParams] = useSearchParams();
  const value = params.get("previewState") ?? "data";
  const onChange = (nextValue: string) => {
    const next = new URLSearchParams(params);
    if (nextValue === "data") next.delete("previewState");
    else next.set("previewState", nextValue);
    setParams(next, { replace: true });
  };

  if (!import.meta.env.DEV) return null;
  return (
    <Field label="Preview state" className="preview-switcher">
      <Select
        aria-label="Preview state"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="data">Data</option>
        <option value="loading">Loading</option>
        <option value="error">Error</option>
        <option value="empty">Empty</option>
      </Select>
    </Field>
  );
}

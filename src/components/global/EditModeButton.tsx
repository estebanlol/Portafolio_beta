import { useEffect, useState } from "react";
import {
  applyContentOverrides,
  collectEditableContent,
  getContentOverrides,
  saveContentOverrides,
  setEditMode,
} from "@/lib/contentStore";

export default function EditModeButton() {
  const [isEditing, setIsEditing] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  useEffect(() => {
    return () => setEditMode(false);
  }, []);

  const enterEditMode = () => {
    setEditMode(true);
    setIsEditing(true);
    setSavedAt(null);
  };

  const cancelEditMode = () => {
    setEditMode(false);
    setIsEditing(false);
    applyContentOverrides(getContentOverrides());
    window.dispatchEvent(new CustomEvent("content-overrides-applied"));
  };

  const saveChanges = () => {
    const overrides = {
      ...getContentOverrides(),
      ...collectEditableContent(),
    };
    saveContentOverrides(overrides);
    setEditMode(false);
    setIsEditing(false);
    setSavedAt(new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }));
    window.dispatchEvent(new CustomEvent("content-overrides-applied"));
  };

  const resetChanges = () => {
    if (
      !window.confirm(
        "Restaurar todos os textos, imagens e links para o padrão original? Suas edições salvas serão removidas.",
      )
    ) {
      return;
    }

    window.localStorage.removeItem("portfolio-content-overrides");
    window.location.reload();
  };

  return (
    <div className="fixed bottom-6 right-6 z-[10001] flex flex-col items-end gap-3">
      {savedAt && !isEditing && (
        <span className="rounded-full bg-base-900 px-3 py-1.5 text-[11px] tracking-tight text-white dark:bg-white dark:text-base-900">
          Salvo às {savedAt}
        </span>
      )}

      {isEditing ? (
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={cancelEditMode}
            className="rounded-full border border-base-300 bg-white px-5 py-2.5 text-xs tracking-tight text-base-900 transition-colors hover:border-base-400 dark:border-base-700 dark:bg-base-900 dark:text-white dark:hover:border-base-500"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={saveChanges}
            className="rounded-full bg-accent-600 px-5 py-2.5 text-xs tracking-tight text-white transition-colors hover:bg-accent-700"
          >
            Salvar
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2 sm:flex-row">
          {Object.keys(getContentOverrides()).length > 0 && (
            <button
              type="button"
              onClick={resetChanges}
              className="rounded-full border border-base-300 bg-white px-5 py-2.5 text-xs tracking-tight text-base-600 transition-colors hover:border-base-400 hover:text-base-900 dark:border-base-700 dark:bg-base-950 dark:text-base-300 dark:hover:text-white"
            >
              Restaurar padrão
            </button>
          )}
          <button
            type="button"
            onClick={enterEditMode}
            className="rounded-full bg-base-900 px-5 py-2.5 text-xs tracking-tight text-white transition-colors hover:bg-base-800 dark:bg-white dark:text-base-900 dark:hover:bg-base-100"
          >
            Editar conteúdo
          </button>
        </div>
      )}
    </div>
  );
}

import React from "react";
import { useToast } from "./use-toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`rounded-md shadow-lg p-4 w-80 text-white ${
            t.variant === "destructive" ? "bg-red-600" : "bg-green-600"
          }`}
        >
          <strong>{t.title}</strong>
          <p className="text-sm mt-1">{t.description}</p>
        </div>
      ))}
    </div>
  );
}
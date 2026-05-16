import { X } from "lucide-react";
import type { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}

export function Modal({ open, title, children, onClose }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/45 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-2xl bg-white shadow-lift">
        <div className="sticky top-0 flex items-center justify-between border-b border-outline/50 bg-white px-5 py-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button className="rounded-full p-2 text-muted hover:bg-surface-container" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

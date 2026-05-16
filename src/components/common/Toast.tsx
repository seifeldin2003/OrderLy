import { CheckCircle } from "lucide-react";

export function Toast({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-xl bg-ink px-4 py-3 text-white shadow-lift">
      <CheckCircle size={18} className="text-primary-bright" />
      <span className="text-sm font-semibold">{message}</span>
    </div>
  );
}

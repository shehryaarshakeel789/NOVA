import { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

const styles = {
  success: { icon: CheckCircle2, className: "bg-green-600" },
  error: { icon: XCircle, className: "bg-red-600" },
  info: { icon: Info, className: "bg-zinc-800" },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (message, type = "info") => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => removeToast(id), 3500);
    },
    [removeToast],
  );

  const toast = {
    success: (msg) => addToast(msg, "success"),
    error: (msg) => addToast(msg, "error"),
    info: (msg) => addToast(msg, "info"),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-4 right-4 z-[999] flex flex-col gap-2">
        {toasts.map(({ id, message, type }) => {
          const { icon: Icon, className } = styles[type];
          return (
            <div
              key={id}
              className={`flex items-center gap-2 text-white px-4 py-3 rounded-xl shadow-lg min-w-[260px] max-w-sm ${className}`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <p className="text-sm flex-1">{message}</p>
              <button onClick={() => removeToast(id)}>
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

import { createContext, useContext, useState, useCallback } from "react";

const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
  const [dialog, setDialog] = useState(null);

  const confirm = useCallback((message) => {
    return new Promise((resolve) => {
      setDialog({ message, resolve });
    });
  }, []);

  function handleChoice(result) {
    dialog.resolve(result);
    setDialog(null);
  }

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {dialog && (
        <div className="fixed inset-0 bg-black/40 z-[999] flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <p className="mb-6">{dialog.message}</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => handleChoice(false)}
                className="px-4 py-2 rounded-full border"
              >
                Cancel
              </button>
              <button
                onClick={() => handleChoice(true)}
                className="px-4 py-2 rounded-full bg-red-600 text-white"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  return useContext(ConfirmContext);
}

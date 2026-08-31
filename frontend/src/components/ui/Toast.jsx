import { useToast } from '../../hooks/useToast';

const STYLES = {
  success: 'bg-green-600',
  error: 'bg-red-600',
};

export default function ToastContainer() {
  const { toasts, dismissToast } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${STYLES[toast.type] || STYLES.success} cursor-pointer rounded-md px-4 py-3 text-sm text-white shadow-lg`}
          onClick={() => dismissToast(toast.id)}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}

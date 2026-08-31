import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AppRoutes from './AppRoutes';
import { ToastProvider } from './context/ToastContext';
import ToastContainer from './components/ui/Toast';

export default function App() {
  return (
    <ToastProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <AppRoutes />
        </main>
        <Footer />
        <ToastContainer />
      </div>
    </ToastProvider>
  );
}

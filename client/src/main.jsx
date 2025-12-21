import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';

import ToastProvider from "./components/ui/ToastProvider";
import { UserProvider } from "./context/UserContext";

createRoot(document.getElementById('root')).render(
  // You can REMOVE StrictMode in real builds – keep only during development if needed.
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <ToastProvider position="top-right">
          <App />
        </ToastProvider>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>
);

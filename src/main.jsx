import './index.css';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import App from './App';
import { AuthProvider } from './context/Auth/AuthProvider';

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <BrowserRouter>
      <CookiesProvider>
        <App />
      </CookiesProvider>
    </BrowserRouter>
  </AuthProvider>
);

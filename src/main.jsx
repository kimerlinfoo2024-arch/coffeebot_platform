import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { useStore } from './store/useStore';
import { startSync } from './lib/sync';
import { startAutomation } from './lib/automation';
import './index.css';

startSync(useStore);
startAutomation(useStore);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);

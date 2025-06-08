
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Force refresh for deployment
console.log('AgroSense App Loading - Version 2.0');

createRoot(document.getElementById("root")!).render(<App />);

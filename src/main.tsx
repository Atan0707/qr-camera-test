import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './App.css'

// Add error handling for app initialization
const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('Failed to find the root element');
  document.body.innerHTML = '<div style="color: red; padding: 20px;">Failed to initialize the application. Please refresh the page.</div>';
} else {
  const root = createRoot(rootElement);
  
  // Error boundary for the entire app
  try {
    root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  } catch (error) {
    console.error('Failed to render the application:', error);
    root.render(
      <div style={{ color: 'red', padding: '20px' }}>
        An error occurred while loading the application. Please refresh the page.
      </div>
    );
  }
}

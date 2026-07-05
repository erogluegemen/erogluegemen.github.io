import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';
import App from './App';

// Static SEO defaults in index.html exist only as a fallback for the rare
// case JS never executes. Once the app boots, every route's
// canonical/description/og:url is owned exclusively by that route's
// <Helmet> block — remove the static placeholders so react-snap's
// post-render capture doesn't freeze duplicate/conflicting tags.
document.getElementById('default-canonical')?.remove();
document.getElementById('default-og-url')?.remove();
document.getElementById('default-description')?.remove();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
);

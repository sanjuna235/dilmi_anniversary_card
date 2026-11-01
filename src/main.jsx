import React from 'react';
import ReactDOM from 'react-dom/client';
import { MotionGlobalConfig } from 'framer-motion';
import '@fontsource/great-vibes/latin-400.css';
import '@fontsource/cormorant-garamond/latin-300.css';
import '@fontsource/cormorant-garamond/latin-300-italic.css';
import '@fontsource/cormorant-garamond/latin-400.css';
import '@fontsource/cormorant-garamond/latin-400-italic.css';
import '@fontsource/cormorant-garamond/latin-500.css';
import '@fontsource/cormorant-garamond/latin-500-italic.css';
import '@fontsource/jost/latin-300.css';
import '@fontsource/jost/latin-400.css';
import '@fontsource/jost/latin-500.css';
import 'lenis/dist/lenis.css';
import './styles/global.css';
import App from './App.jsx';

// `?static` renders every animation at its end state (for screenshots and layout checks).
if (new URLSearchParams(window.location.search).has('static')) MotionGlobalConfig.skipAnimations = true;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

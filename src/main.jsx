import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { loadFirebaseData } from './db.js'

const Root = () => {
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    loadFirebaseData().then(() => setLoaded(true));
  }, []);

  if (!loaded) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '24px' }}>Loading Database...</div>;
  
  return (
    <StrictMode>
      <App />
    </StrictMode>
  );
};

createRoot(document.getElementById('root')).render(<Root />)

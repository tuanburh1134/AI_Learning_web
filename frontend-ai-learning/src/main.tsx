import React from 'react'
import { createRoot } from 'react-dom/client'
<<<<<<< HEAD
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App'
import { GOOGLE_CLIENT_ID } from './config/env'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
=======
import App from './App'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
>>>>>>> origin/develop
  </React.StrictMode>
)

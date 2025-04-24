// import { StrictMode } from 'react'
import { BrowserRouter } from "react-router-dom"
import { createRoot } from 'react-dom/client'
import './index.scss'
import App from './App.jsx'
import 'macro-css'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <BrowserRouter>
    <App />
  </BrowserRouter>
  // </StrictMode>,
)

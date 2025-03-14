import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
   {/* <div className="max-w-[1024px]  p-0"> */}
    <App />
    {/* </div> */}
  </StrictMode>,
)

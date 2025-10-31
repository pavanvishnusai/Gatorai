import React from "react";
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { createTheme, ThemeProvider } from '@mui/material';
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { Toaster } from "react-hot-toast";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_API_URL || "https://gatorai.onrender.com/api/v1";
axios.defaults.withCredentials = true;


const theme = createTheme({
  typography: {
    fontFamily: "Roboto Slab, serif",
    allVariants: {color: "white"},
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <Toaster position="top-right"/>
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>,
);

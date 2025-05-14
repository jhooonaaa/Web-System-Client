// main.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import './global.css';
import FrontPage from './FrontPage.jsx';             // RENAMED from App.jsx
import BorrowerPage from './pages/BorrowerPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FrontPage />} />
        <Route path="/borrower" element={<BorrowerPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

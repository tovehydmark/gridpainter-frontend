import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { ArtGallery } from './components/artGallery/ArtGallery';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  // <React.StrictMode>
  <HashRouter>
    <Routes>
      <Route path="/" element={<App />}></Route>
      <Route path="/artGallery" element={<ArtGallery></ArtGallery>}></Route>
    </Routes>
  </HashRouter>

  // </React.StrictMode>
);

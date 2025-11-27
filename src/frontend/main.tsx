import React from 'react';
import ReactDOM from 'react-dom/client';
import ReactGraphViewer from '../components/ReactGraphViewer.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ReactGraphViewer policyId="p1" />
  </React.StrictMode>
);

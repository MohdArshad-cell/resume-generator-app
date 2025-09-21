// src/pages/HomePage.tsx

import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="page-container">
      <div className="content-wrapper">
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>
            Resume Generator
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 2.5rem auto' }}>
            Create a professional, ATS-friendly resume in minutes. Choose a template, fill in your details, and download your new resume instantly.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <Link to="/build" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
              Make New Resume
            </Link>
            <button className="btn btn-outline" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
              Import JSON
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
import React from 'react';
import Navbar from '../../frontend/Navbar';
import Footer from '../../frontend/Footer';

const PFESIC = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-8">PF & ESIC</h1>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PFESIC;
import React from 'react';

const Footer = () => {
  return (
    <footer className="glass-header border-t border-white/20 py-3 sm:py-4 text-center text-xs text-neutral-500">
      <div className="container-responsive">
        <p>© {new Date().getFullYear()} K-Health. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
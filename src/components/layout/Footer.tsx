import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-neutral-200 py-3 text-center text-xs text-neutral-500 flex-shrink-0">
      <div className="px-6">
        <p>© {new Date().getFullYear()} K-Health. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
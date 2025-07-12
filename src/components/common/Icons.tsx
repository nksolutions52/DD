import React from 'react';
import { LucideCrop as LucideProps } from 'lucide-react';

export const ToothIcon: React.FC<LucideProps> = ({ className, ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M12 5.5c-1.5-1-4-1.5-4.5 1-2.5.5-3 3.5-3 5 0 .5 0 1 .5 1.5.5.5 1 .5 1.5.5h11c.5 0 1 0 1.5-.5s.5-1 .5-1.5c0-1.5-.5-4.5-3-5-.5-2.5-3-2-4.5-1z" />
      <path d="M8 13.5V18c0 .5.5 2 2 2s2-1.5 2-2v-1.5" />
      <path d="M12 13.5V18c0 .5.5 2 2 2s2-1.5 2-2v-4.5" />
    </svg>
  );
};

export const DoctorIcon: React.FC<LucideProps> = ({ className, ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M8.5 2h7L16 7h-2.5v2.5h4l-.5 4.5-2 1 3 3v4h-4v-3l-4 3v-3l-2-1-.5-4.5h4V7H9l.5-5z" />
    </svg>
  );
};

export const ClipboardIcon: React.FC<LucideProps> = ({ className, ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M12 11h4" />
      <path d="M12 16h4" />
      <path d="M8 11h.01" />
      <path d="M8 16h.01" />
    </svg>
  );
};
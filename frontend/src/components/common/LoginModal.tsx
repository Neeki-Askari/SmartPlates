import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, featureName }) => {
  const { loginWithRedirect } = useAuth0();

  if (!isOpen) return null;

  const handleLogin = () => {
    loginWithRedirect();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop - blurred so app background is visible */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal panel */}
      <div className="relative z-10 bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary-100">
          <svg
            className="h-6 w-6 text-primary-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <div className="mt-4 text-center">
          <h3 className="text-lg font-semibold text-neutral-900">
            Login Required
          </h3>
          <p className="mt-2 text-sm text-neutral-500">
            You need to be logged in to access <strong>{featureName}</strong>.
            Please log in to continue.
          </p>
        </div>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleLogin}
            className="flex-1 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors cursor-pointer"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

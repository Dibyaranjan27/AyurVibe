import React from 'react';

type AuthButtonProps = {
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit';
  className?: string;
};

const AuthButton: React.FC<AuthButtonProps> = ({
  onClick,
  children,
  disabled = false,
  loading = false,
  type = 'button',
  className = '',
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full p-3 ${className} bg-gradient-to-r from-ayurGreen to-green-400 text-white font-bold rounded-full hover:opacity-90 transition-all flex items-center justify-center disabled:opacity-50 ${loading ? 'cursor-not-allowed' : ''}`}
      disabled={disabled || loading}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h-8z" />
          </svg>
          Registering...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default AuthButton;
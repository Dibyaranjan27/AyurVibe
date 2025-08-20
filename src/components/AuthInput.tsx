import React from 'react';
import { Mail, Lock, Eye, EyeOff, UserCircleIcon } from 'lucide-react';

type AuthInputProps = {
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  showPassword?: boolean;
  toggleShowPassword?: () => void;
  disabled?: boolean;
  maxLength?: number;
  icon?: 'mail' | 'lock' | 'user';
};

const AuthInput: React.FC<AuthInputProps> = ({
  type,
  value,
  onChange,
  placeholder,
  showPassword,
  toggleShowPassword,
  disabled = false,
  maxLength,
  icon,
}) => {
  const getIcon = () => {
    switch (icon) {
      case 'mail': return <Mail className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />;
      case 'lock': return <Lock className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />;
      case 'user': return <UserCircleIcon className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />;
      default: return null;
    }
  };

  return (
    <div className="relative mb-4">
      <input
        type={showPassword ? 'text' : type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-10 p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-ayurGreen dark:focus:border-ayurGreen/70 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        disabled={disabled}
        maxLength={maxLength}
      />
      {getIcon()}
      {toggleShowPassword && (
        <button
          type="button"
          onClick={toggleShowPassword}
          className="absolute right-3 top-3.5 text-gray-400"
          disabled={disabled}
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      )}
    </div>
  );
};

export default AuthInput;
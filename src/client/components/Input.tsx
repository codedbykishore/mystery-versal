import React, { InputHTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { useAnimations } from '../hooks';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className = '',
  ...props
}, ref) => {
  const { inputVariants } = useAnimations();

  const baseInputClasses = `
    w-full px-4 py-3 text-lg border-2 rounded-xl
    transition-all duration-200
    focus:outline-none focus:ring-4 focus:ring-opacity-50
    placeholder-gray-400
    touch-target
  `;

  const inputClasses = error
    ? `${baseInputClasses} border-red-300 focus:border-red-500 focus:ring-red-300`
    : `${baseInputClasses} border-gray-300 focus:border-blue-500 focus:ring-blue-300`;

  return (
    <div className={`w-full ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}

        {/* Input Field */}
        <motion.input
          ref={ref}
          className={`
            ${inputClasses}
            ${leftIcon ? 'pl-12' : ''}
            ${rightIcon ? 'pr-12' : ''}
          `}
          variants={inputVariants}
          whileFocus="focus"
          {...props}
        />

        {/* Right Icon */}
        {rightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>

      {/* Helper Text or Error */}
      {(error || helperText) && (
        <div className="mt-2">
          {error ? (
            <motion.p
              className="text-sm text-red-600 flex items-center space-x-1"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{error}</span>
            </motion.p>
          ) : (
            <p className="text-sm text-gray-500">{helperText}</p>
          )}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
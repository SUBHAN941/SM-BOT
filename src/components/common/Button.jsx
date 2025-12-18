import React from "react";
import { LoadingSpinner } from "./LoadingSpinner";

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  className = "",
  ...props
}) => {
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-700 hover:bg-gray-600 text-white",
    ghost: "bg-transparent hover:bg-gray-700 text-gray-300",
    danger: "bg-red-600 hover:bg-red-700 text-white",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={`
        ${variants[variant]}
        ${sizes[size]}
        rounded-lg font-medium transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <LoadingSpinner size="sm" />}
      {children}
    </button>
  );
};
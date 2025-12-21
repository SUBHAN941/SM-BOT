import React from "react";
import { motion } from "framer-motion";
import { FaSpinner } from "react-icons/fa";

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  icon = null,
  iconPosition = "left",
  fullWidth = false,
  rounded = "lg",
  className = "",
  ...props
}) => {
  
  const variants = {
    primary: {
      base: "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25",
      hover: "hover:from-blue-500 hover:to-blue-400 hover:shadow-blue-500/40",
      active: "active:from-blue-700 active:to-blue-600",
      ring: "focus:ring-blue-500/50",
    },
    secondary: {
      base: "bg-gray-800 text-white border border-gray-700 shadow-lg shadow-black/20",
      hover: "hover:bg-gray-700 hover:border-gray-600",
      active: "active:bg-gray-900",
      ring: "focus:ring-gray-500/50",
    },
    ghost: {
      base: "bg-transparent text-gray-300",
      hover: "hover:bg-gray-800/50 hover:text-white",
      active: "active:bg-gray-800",
      ring: "focus:ring-gray-500/50",
    },
    danger: {
      base: "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-500/25",
      hover: "hover:from-red-500 hover:to-red-400 hover:shadow-red-500/40",
      active: "active:from-red-700 active:to-red-600",
      ring: "focus:ring-red-500/50",
    },
    success: {
      base: "bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow-lg shadow-green-500/25",
      hover: "hover:from-green-500 hover:to-emerald-400 hover:shadow-green-500/40",
      active: "active:from-green-700 active:to-emerald-600",
      ring: "focus:ring-green-500/50",
    },
    purple: {
      base: "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-500/25",
      hover: "hover:from-purple-500 hover:to-pink-400 hover:shadow-purple-500/40",
      active: "active:from-purple-700 active:to-pink-600",
      ring: "focus:ring-purple-500/50",
    },
    outline: {
      base: "bg-transparent border-2 border-gray-600 text-gray-300",
      hover: "hover:border-gray-500 hover:text-white hover:bg-gray-800/30",
      active: "active:bg-gray-800/50",
      ring: "focus:ring-gray-500/50",
    },
    glass: {
      base: "bg-white/10 backdrop-blur-sm text-white border border-white/20",
      hover: "hover:bg-white/20 hover:border-white/30",
      active: "active:bg-white/5",
      ring: "focus:ring-white/30",
    },
  };

  const sizes = {
    xs: "px-2.5 py-1 text-xs gap-1",
    sm: "px-3 py-1.5 text-sm gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-5 py-2.5 text-base gap-2",
    xl: "px-6 py-3 text-lg gap-2.5",
  };

  const iconSizes = {
    xs: "w-3 h-3",
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
    xl: "w-5 h-5",
  };

  const roundedStyles = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-full",
  };

  const currentVariant = variants[variant];

  return (
    <motion.button
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      className={`
        relative
        inline-flex items-center justify-center
        font-medium
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        ${currentVariant.base}
        ${currentVariant.hover}
        ${currentVariant.active}
        ${currentVariant.ring}
        ${sizes[size]}
        ${roundedStyles[rounded]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {/* Shine effect on hover */}
      <div className="absolute inset-0 overflow-hidden rounded-inherit">
        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />
        </div>
      </div>

      {/* Content */}
      <span className="relative flex items-center justify-center gap-inherit">
        {/* Loading spinner */}
        {isLoading && (
          <FaSpinner className={`${iconSizes[size]} animate-spin`} />
        )}
        
        {/* Left icon */}
        {!isLoading && icon && iconPosition === "left" && (
          <span className={iconSizes[size]}>{icon}</span>
        )}
        
        {/* Children */}
        {children}
        
        {/* Right icon */}
        {!isLoading && icon && iconPosition === "right" && (
          <span className={iconSizes[size]}>{icon}</span>
        )}
      </span>
    </motion.button>
  );
};

// Icon-only button variant
export const IconButton = ({
  icon,
  variant = "ghost",
  size = "md",
  isLoading = false,
  disabled = false,
  tooltip = "",
  className = "",
  ...props
}) => {
  
  const sizes = {
    xs: "p-1",
    sm: "p-1.5",
    md: "p-2",
    lg: "p-2.5",
    xl: "p-3",
  };

  const iconSizes = {
    xs: "w-3 h-3",
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
    xl: "w-6 h-6",
  };

  const variants = {
    primary: "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20",
    secondary: "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700",
    ghost: "bg-transparent hover:bg-gray-800 text-gray-400 hover:text-white",
    danger: "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/20",
    glass: "bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm",
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || isLoading ? 1 : 1.1 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.9 }}
      className={`
        relative
        inline-flex items-center justify-center
        rounded-lg
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-gray-500/50 focus:ring-offset-2 focus:ring-offset-gray-900
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      disabled={disabled || isLoading}
      title={tooltip}
      {...props}
    >
      {isLoading ? (
        <FaSpinner className={`${iconSizes[size]} animate-spin`} />
      ) : (
        <span className={iconSizes[size]}>{icon}</span>
      )}
    </motion.button>
  );
};

// Button Group component
export const ButtonGroup = ({ children, className = "" }) => {
  return (
    <div className={`inline-flex items-center rounded-lg overflow-hidden ${className}`}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return null;
        
        return React.cloneElement(child, {
          className: `
            ${child.props.className || ""}
            ${index === 0 ? "rounded-r-none" : ""}
            ${index === React.Children.count(children) - 1 ? "rounded-l-none" : ""}
            ${index !== 0 && index !== React.Children.count(children) - 1 ? "rounded-none" : ""}
            ${index !== 0 ? "-ml-px" : ""}
          `,
          rounded: "none",
        });
      })}
    </div>
  );
};
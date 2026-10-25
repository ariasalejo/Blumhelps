/**
 * ============================================================================
 * BLUMHELPS DESIGN SYSTEM - PREMIUM COMPONENTS
 * ============================================================================
 * 
 * Sistema de componentes atómicos reutilizables con:
 * - Animaciones fluidas (framer-motion)
 * - Glassmorphism y efectos visuales premium
 * - Accesibilidad WCAG 2.2 AA
 * - TypeScript estricto
 * - Variantes configurables
 * 
 * @author BlumHelps Engineering Team
 * @version 1.0.0
 * @license GPL-3.0-or-later
 * ============================================================================
 */

import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { 
  X, 
  Check, 
  AlertCircle, 
  Info, 
  Loader2,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff
} from 'lucide-react';

// ============================================================================
// TIPOS Y INTERFACES
// ============================================================================

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'premium';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';
export type InputVariant = 'default' | 'error' | 'success';
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  ariaLabel?: string;
}

export interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'glass' | 'elevated' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
  dot?: boolean;
  removable?: boolean;
  onRemove?: () => void;
}

export interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  variant?: InputVariant;
  error?: string;
  helperText?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
  disabled?: boolean;
  required?: boolean;
  className?: string;
  icon?: ReactNode;
  maxLength?: number;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: ModalSize;
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
}

export interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: 'default' | 'success' | 'warning' | 'error';
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
}

export interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export interface AccordionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export interface TabsProps {
  tabs: { id: string; label: string; content: ReactNode }[];
  defaultTab?: string;
  className?: string;
}

export interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'circular' | 'rectangular';
  className?: string;
  animation?: 'pulse' | 'wave';
}

// ============================================================================
// CONSTANTES Y CONFIGURACIÓN
// ============================================================================

const ANIMATION_VARIANTS: Record<string, Variants> = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 }
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 }
  },
  slideDown: {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  }
};

const TRANSITION_DEFAULT = {
  duration: 0.3,
  ease: [0.16, 1, 0.3, 1] as const
};

// ============================================================================
// COMPONENTE: BUTTON
// ============================================================================

/**
 * Button - Componente de botón premium con múltiples variantes
 * 
 * @example
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Click me
 * </Button>
 */
export function Button({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  type = 'button',
  ariaLabel
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantStyles: Record<ButtonVariant, string> = {
    primary: 'bg-[var(--moss)] text-white hover:bg-[var(--moss-deep)] focus:ring-[var(--moss)] shadow-lg hover:shadow-xl hover:-translate-y-0.5',
    secondary: 'bg-white text-[var(--ink)] border-2 border-gray-200 hover:border-[var(--moss)] hover:text-[var(--moss)] focus:ring-[var(--moss)]',
    ghost: 'bg-transparent text-[var(--ink)] hover:bg-gray-100 focus:ring-gray-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-lg hover:shadow-xl',
    premium: 'bg-gradient-to-r from-[var(--moss)] to-[var(--gold)] text-white hover:shadow-2xl hover:-translate-y-1 focus:ring-[var(--gold)] shadow-lg'
  };

  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-4 py-2 text-sm gap-2',
    md: 'px-6 py-3 text-base gap-2',
    lg: 'px-8 py-4 text-lg gap-3'
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <span className="flex-shrink-0">{icon}</span>
          )}
          <span>{children}</span>
          {icon && iconPosition === 'right' && (
            <span className="flex-shrink-0">{icon}</span>
          )}
        </>
      )}
    </motion.button>
  );
}

// ============================================================================
// COMPONENTE: CARD
// ============================================================================

/**
 * Card - Contenedor premium con múltiples variantes visuales
 * 
 * @example
 * <Card variant="glass" padding="lg">
 *   <h2>Content</h2>
 * </Card>
 */
export function Card({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  onClick,
  hoverable = false
}: CardProps) {
  const baseStyles = 'rounded-2xl transition-all duration-300';
  
  const variantStyles: Record<string, string> = {
    default: 'bg-white border border-gray-200',
    glass: 'bg-white/70 backdrop-blur-lg border border-white/20 shadow-lg',
    elevated: 'bg-white shadow-xl border border-gray-100',
    interactive: 'bg-white border-2 border-transparent hover:border-[var(--moss)] cursor-pointer shadow-md hover:shadow-xl'
  };

  const paddingStyles: Record<string, string> = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <motion.div
      onClick={onClick}
      whileHover={hoverable ? { y: -4, transition: { duration: 0.2 } } : {}}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${paddingStyles[padding]}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}

// ============================================================================
// COMPONENTE: BADGE
// ============================================================================

/**
 * Badge - Etiqueta visual con variantes de estado
 * 
 * @example
 * <Badge variant="success">Active</Badge>
 */
export function Badge({
  variant = 'neutral',
  children,
  className = '',
  dot = false,
  removable = false,
  onRemove
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-all duration-200';
  
  const variantStyles: Record<BadgeVariant, string> = {
    success: 'bg-green-100 text-green-800 border border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    error: 'bg-red-100 text-red-800 border border-red-200',
    info: 'bg-blue-100 text-blue-800 border border-blue-200',
    neutral: 'bg-gray-100 text-gray-800 border border-gray-200'
  };

  const dotColors: Record<BadgeVariant, string> = {
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    neutral: 'bg-gray-500'
  };

  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {dot && (
        <span className={`w-2 h-2 rounded-full ${dotColors[variant]}`} />
      )}
      <span>{children}</span>
      {removable && (
        <button
          onClick={onRemove}
          className="ml-1 hover:opacity-70 transition-opacity"
          aria-label="Remove badge"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </motion.span>
  );
}

// ============================================================================
// COMPONENTE: INPUT
// ============================================================================

/**
 * Input - Campo de entrada premium con validación visual
 * 
 * @example
 * <Input
 *   label="Email"
 *   value={email}
 *   onChange={setEmail}
 *   type="email"
 *   error={emailError}
 * />
 */
export function Input({
  label,
  placeholder,
  value,
  onChange,
  variant = 'default',
  error,
  helperText,
  type = 'text',
  disabled = false,
  required = false,
  className = '',
  icon,
  maxLength
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type;

  const baseStyles = 'w-full px-4 py-3 rounded-xl border-2 bg-white transition-all duration-200 focus:outline-none';
  
  const variantStyles: Record<InputVariant, string> = {
    default: isFocused 
      ? 'border-[var(--moss)] ring-2 ring-[var(--moss)]/20' 
      : 'border-gray-200 hover:border-gray-300',
    error: 'border-red-500 ring-2 ring-red-500/20',
    success: 'border-green-500 ring-2 ring-green-500/20'
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        
        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          className={`
            ${baseStyles}
            ${variantStyles[variant]}
            ${icon ? 'pl-10' : ''}
            ${type === 'password' ? 'pr-10' : ''}
            disabled:bg-gray-100 disabled:cursor-not-allowed
          `}
        />
        
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-600 flex items-center gap-1"
        >
          <AlertCircle className="w-4 h-4" />
          {error}
        </motion.p>
      )}

      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
}

// ============================================================================
// COMPONENTE: MODAL
// ============================================================================

/**
 * Modal - Diálogo modal premium con animaciones fluidas
 * 
 * @example
 * <Modal isOpen={isOpen} onClose={handleClose} title="Confirm">
 *   <p>Are you sure?</p>
 * </Modal>
 */
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnBackdrop = true
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const sizeStyles: Record<ModalSize, string> = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeOnBackdrop ? onClose : undefined}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={TRANSITION_DEFAULT}
            className={`
              relative w-full ${sizeStyles[size]}
              bg-white rounded-2xl shadow-2xl
              max-h-[90vh] overflow-y-auto
            `}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                {title && (
                  <h2 id="modal-title" className="text-xl font-bold text-[var(--ink)]">
                    {title}
                  </h2>
                )}
                {showCloseButton && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </motion.button>
                )}
              </div>
            )}

            {/* Body */}
            <div className="p-6">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// COMPONENTE: PROGRESS BAR
// ============================================================================

/**
 * ProgressBar - Barra de progreso animada con variantes
 * 
 * @example
 * <ProgressBar value={75} showLabel animated />
 */
export function ProgressBar({
  value,
  max = 100,
  variant = 'default',
  showLabel = false,
  animated = true,
  className = ''
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const variantStyles: Record<string, string> = {
    default: 'bg-gradient-to-r from-[var(--moss)] to-[var(--moss-deep)]',
    success: 'bg-gradient-to-r from-green-500 to-green-600',
    warning: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
    error: 'bg-gradient-to-r from-red-500 to-red-600'
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm font-bold text-[var(--ink)]">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: animated ? 0.8 : 0, ease: 'easeOut' }}
          className={`h-full ${variantStyles[variant]} rounded-full`}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
}

// ============================================================================
// COMPONENTE: TOOLTIP
// ============================================================================

/**
 * Tooltip - Información contextual al hover
 * 
 * @example
 * <Tooltip content="More info">
 *   <button>Hover me</button>
 * </Tooltip>
 */
export function Tooltip({
  content,
  children,
  position = 'top',
  className = ''
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const positionStyles: Record<string, string> = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className={`
              absolute z-50 px-3 py-2 text-sm text-white
              bg-gray-900 rounded-lg shadow-lg
              whitespace-nowrap pointer-events-none
              ${positionStyles[position]}
            `}
            role="tooltip"
          >
            {content}
            <div className={`
              absolute w-2 h-2 bg-gray-900 rotate-45
              ${position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -mt-1' : ''}
              ${position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 -mb-1' : ''}
              ${position === 'left' ? 'left-full top-1/2 -translate-y-1/2 -ml-1' : ''}
              ${position === 'right' ? 'right-full top-1/2 -translate-y-1/2 -mr-1' : ''}
            `} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// COMPONENTE: ACCORDION
// ============================================================================

/**
 * Accordion - Sección colapsable con animación suave
 * 
 * @example
 * <Accordion title="Click to expand">
 *   <p>Hidden content</p>
 * </Accordion>
 */
export function Accordion({
  title,
  children,
  defaultOpen = false,
  className = ''
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`border border-gray-200 rounded-xl overflow-hidden ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors"
        aria-expanded={isOpen}
      >
        <span className="font-medium text-[var(--ink)]">{title}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={TRANSITION_DEFAULT}
        >
          <ChevronDown className="w-5 h-5 text-gray-500" />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={TRANSITION_DEFAULT}
            className="overflow-hidden"
          >
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// COMPONENTE: TABS
// ============================================================================

/**
 * Tabs - Navegación por pestañas con contenido dinámico
 * 
 * @example
 * <Tabs tabs={[
 *   { id: 'tab1', label: 'Tab 1', content: <div>Content 1</div> },
 *   { id: 'tab2', label: 'Tab 2', content: <div>Content 2</div> }
 * ]} />
 */
export function Tabs({
  tabs,
  defaultTab,
  className = ''
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const activeContent = tabs.find(tab => tab.id === activeTab)?.content;

  return (
    <div className={className}>
      {/* Tab Headers */}
      <div className="flex border-b border-gray-200 mb-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              px-6 py-3 font-medium transition-all duration-200
              border-b-2 -mb-px
              ${activeTab === tab.id
                ? 'border-[var(--moss)] text-[var(--moss)]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
              }
            `}
            role="tab"
            aria-selected={activeTab === tab.id}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={TRANSITION_DEFAULT}
          role="tabpanel"
        >
          {activeContent}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// COMPONENTE: ALERT
// ============================================================================

/**
 * Alert - Mensaje de estado con variantes visuales
 * 
 * @example
 * <Alert variant="success" title="Success!">
 *   Operation completed.
 * </Alert>
 */
export function Alert({
  variant = 'info',
  title,
  children,
  dismissible = false,
  onDismiss,
  className = ''
}: AlertProps) {
  const [isVisible, setIsVisible] = useState(true);

  const variantStyles: Record<string, { bg: string; border: string; icon: string; text: string }> = {
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: 'text-blue-600',
      text: 'text-blue-800'
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: 'text-green-600',
      text: 'text-green-800'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: 'text-yellow-600',
      text: 'text-yellow-800'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: 'text-red-600',
      text: 'text-red-800'
    }
  };

  const icons: Record<string, ReactNode> = {
    info: <Info className="w-5 h-5" />,
    success: <Check className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />
  };

  if (!isVisible) return null;

  const styles = variantStyles[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`
        ${styles.bg} ${styles.border} border rounded-xl p-4
        ${className}
      `}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 ${styles.icon}`}>
          {icons[variant]}
        </div>
        
        <div className="flex-1">
          {title && (
            <h3 className={`font-semibold ${styles.text} mb-1`}>
              {title}
            </h3>
          )}
          <div className={`text-sm ${styles.text}`}>
            {children}
          </div>
        </div>

        {dismissible && (
          <button
            onClick={() => {
              setIsVisible(false);
              onDismiss?.();
            }}
            className={`flex-shrink-0 ${styles.icon} hover:opacity-70 transition-opacity`}
            aria-label="Dismiss alert"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ============================================================================
// COMPONENTE: SKELETON
// ============================================================================

/**
 * Skeleton - Placeholder de carga con animaciones
 * 
 * @example
 * <Skeleton width="100%" height="20px" variant="text" />
 */
export function Skeleton({
  width = '100%',
  height = '1rem',
  variant = 'text',
  className = '',
  animation = 'pulse'
}: SkeletonProps) {
  const baseStyles = 'bg-gray-200 rounded';
  
  const variantStyles: Record<string, string> = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg'
  };

  const animationStyles = animation === 'pulse' 
    ? 'animate-pulse' 
    : 'bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_infinite]';

  return (
    <div
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${animationStyles}
        ${className}
      `}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

// ============================================================================
// COMPONENTE: LOADING SPINNER
// ============================================================================

/**
 * LoadingSpinner - Indicador de carga animado
 * 
 * @example
 * <LoadingSpinner size="md" />
 */
export function LoadingSpinner({
  size = 'md',
  className = ''
}: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizeStyles: Record<string, string> = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className={`inline-block ${sizeStyles[size]} ${className}`}
      role="status"
      aria-label="Loading"
    >
      <Loader2 className="w-full h-full text-[var(--moss)]" />
    </motion.div>
  );
}

// ============================================================================
// COMPONENTE: DIVIDER
// ============================================================================

/**
 * Divider - Separador visual con opciones de estilo
 * 
 * @example
 * <Divider label="OR" />
 */
export function Divider({
  label,
  className = ''
}: { label?: string; className?: string }) {
  return (
    <div className={`flex items-center gap-4 my-6 ${className}`}>
      <div className="flex-1 h-px bg-gray-200" />
      {label && (
        <span className="text-sm text-gray-500 font-medium">{label}</span>
      )}
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  );
}

// ============================================================================
// COMPONENTE: EMPTY STATE
// ============================================================================

/**
 * EmptyState - Estado vacío con ilustración y CTA
 * 
 * @example
 * <EmptyState
 *   title="No items found"
 *   description="Try adjusting your filters"
 *   action={<Button>Create new</Button>}
 * />
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className = ''
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`text-center py-12 ${className}`}
    >
      {icon && (
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-[var(--ink)] mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          {description}
        </p>
      )}
      {action && (
        <div className="inline-block">
          {action}
        </div>
      )}
    </motion.div>
  );
}

// ============================================================================
// COMPONENTE: AVATAR
// ============================================================================

/**
 * Avatar - Imagen de perfil con fallback
 * 
 * @example
 * <Avatar src="/user.jpg" name="John Doe" size="md" />
 */
export function Avatar({
  src,
  name,
  size = 'md',
  className = ''
}: {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}) {
  const [imgError, setImgError] = useState(false);

  const sizeStyles: Record<string, string> = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-24 h-24 text-lg'
  };

  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const colors = [
    'bg-[var(--moss)]',
    'bg-[var(--gold)]',
    'bg-[var(--terra)]',
    'bg-blue-500',
    'bg-purple-500',
    'bg-pink-500'
  ];
  const colorIndex = name.charCodeAt(0) % colors.length;

  return (
    <div
      className={`
        ${sizeStyles[size]}
        rounded-full overflow-hidden flex items-center justify-center
        font-semibold text-white
        ${imgError || !src ? colors[colorIndex] : 'bg-gray-200'}
        ${className}
      `}
      role="img"
      aria-label={name}
    >
      {src && !imgError ? (
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}

// ============================================================================
// COMPONENTE: RATING
// ============================================================================

/**
 * Rating - Estrellas de calificación interactivas
 * 
 * @example
 * <Rating value={4} onChange={setRating} max={5} />
 */
export function Rating({
  value,
  onChange,
  max = 5,
  readonly = false,
  className = ''
}: {
  value: number;
  onChange?: (value: number) => void;
  max?: number;
  readonly?: boolean;
  className?: string;
}) {
  const [hoverValue, setHoverValue] = useState(0);

  return (
    <div className={`flex gap-1 ${className}`}>
      {Array.from({ length: max }, (_, i) => {
        const starValue = i + 1;
        const isFilled = starValue <= (hoverValue || value);

        return (
          <motion.button
            key={i}
            type="button"
            disabled={readonly}
            onClick={() => onChange?.(starValue)}
            onMouseEnter={() => !readonly && setHoverValue(starValue)}
            onMouseLeave={() => !readonly && setHoverValue(0)}
            whileHover={!readonly ? { scale: 1.2 } : {}}
            whileTap={!readonly ? { scale: 0.9 } : {}}
            className="focus:outline-none"
            aria-label={`Rate ${starValue} stars`}
          >
            <svg
              className={`w-6 h-6 transition-colors ${
                isFilled ? 'text-yellow-400' : 'text-gray-300'
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </motion.button>
        );
      })}
    </div>
  );
}

// ============================================================================
// COMPONENTE: TOAST NOTIFICATION
// ============================================================================

/**
 * Toast - Notificación temporal con auto-dismiss
 * 
 * @example
 * const [toasts, setToasts] = useToast();
 * toast.success('Operation completed');
 */
export interface Toast {
  id: string;
  message: string;
  variant: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

export function ToastContainer({
  toasts,
  onRemove
}: {
  toasts: Toast[];
  onRemove: (id: string) => void;
}) {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({
  toast,
  onRemove
}: {
  toast: Toast;
  onRemove: (id: string) => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, toast.duration || 3000);

    return () => clearTimeout(timer);
  }, [toast, onRemove]);

  const variantStyles: Record<string, string> = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={`${variantStyles[toast.variant]} text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 min-w-[300px]`}
      role="alert"
    >
      <span className="flex-1">{toast.message}</span>
      <button
        onClick={() => onRemove(toast.id)}
        className="hover:opacity-70 transition-opacity"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

// ============================================================================
// HOOK: useToast
// ============================================================================

/**
 * useToast - Hook para gestionar notificaciones toast
 * 
 * @example
 * const { toasts, success, error, info, warning, removeToast } = useToast();
 */
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, variant: Toast['variant'], duration?: number) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, variant, duration }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return {
    toasts,
    success: (message: string, duration?: number) => addToast(message, 'success', duration),
    error: (message: string, duration?: number) => addToast(message, 'error', duration),
    info: (message: string, duration?: number) => addToast(message, 'info', duration),
    warning: (message: string, duration?: number) => addToast(message, 'warning', duration),
    removeToast
  };
}

// ============================================================================
// EXPORTACIONES
// ============================================================================

export {
  ANIMATION_VARIANTS,
  TRANSITION_DEFAULT
};


/**
 * button.tsx
 * Composant Button réutilisable avec plusieurs variantes et tailles
 * Utilise Tailwind CSS pour le style
 */

import * as React from "react";

/**
 * Props du composant Button
 * @extends React.ButtonHTMLAttributes<HTMLButtonElement> - Props HTML natifs du bouton
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link" | "primary";
  size?: "default" | "sm" | "lg";
}

const baseClasses =
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-secondary disabled:opacity-50 disabled:pointer-events-none";

const variantClasses: Record<string, string> = {
  default: "bg-secondary text-white hover:bg-secondary/90",
  outline: "border border-secondary text-secondary hover:bg-secondary/10",
  ghost: "text-secondary hover:bg-secondary/10",
  link: "text-secondary underline-offset-4 hover:underline",
  primary: "bg-primary text-black hover:bg-primary/90",
};

const sizeClasses: Record<string, string> = {
  default: "h-10 py-2 px-4",
  sm: "h-8 px-3 rounded-md",
  lg: "h-12 px-8 rounded-md text-lg",
};

/**
 * Composant Button
 * Un bouton personnalisable avec différentes variantes et tailles
 * Supporte le forwarding de ref pour l'accessibilité
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className = "", variant = "default", size = "default", ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={[
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className,
        ].join(" ")}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

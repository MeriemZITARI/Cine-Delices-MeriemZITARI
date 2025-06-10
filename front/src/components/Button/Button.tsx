export default function Button({
  text,
  type = 'button',
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button className={`button ${className}`} {...props} type={type}>
      {text}
    </button>
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
}

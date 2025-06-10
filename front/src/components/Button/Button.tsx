export default function Button({
  text,
  type = 'button',
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button className={`bg-red-500 text-white font-bold rounded px-4 py-2 hover:bg-red-600 whitespace-nowrap max-h-10 ${className}`} {...props} type={type}>
      {text}
    </button>
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
}

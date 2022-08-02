import React from "react";

interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button: React.FC<IButtonProps> = ({ children, ...buttonProps }) => {
  return <button {...buttonProps}>{children}</button>;
};

export default Button;

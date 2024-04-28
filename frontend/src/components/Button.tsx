import React from "react";

const Button = ({
  btnFunc,
  children,
}: {
  btnFunc?: () => void;
  children: React.ReactNode;
}) => {
  return (
    <button
      className="bg-green-600 px-6 py-2 text-white hover:bg-green-800 transition"
      onClick={btnFunc}
    >
      {children}
    </button>
  );
};

export default Button;

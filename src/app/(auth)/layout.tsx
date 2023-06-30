import React from "react";

type Props = {
  children: React.ReactNode;
};

const AuthLayout = ({ children }: Props) => {
  return (
    <div className="flex items-center justify-center h-full w-full">
      {children}
    </div>
  );
};

export default AuthLayout;

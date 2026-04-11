import React from "react";

const LoginLeftSide = () => {
  return (
    <div
      className="hidden md:flex min-h-screen w-1/2 overflow-hidden flex-col justify-center p-10"
      style={{ background: "radial-gradient(ellipse 55% 45% at 0% 0%, #3b2f7e 0%, #1e1a5e 35%, #12123a 70%)" }}
    >
      <div className="relative z-10 w-full max-w-md">
        <h1 className="text-white text-5xl font-bold leading-tight tracking-tight mb-4">
          Employee
          <br />
          Management System
        </h1>
        <p className="text-[#8888bb] text-sm leading-relaxed">
          Streamline your workforce operations, track attendance, manage
          payroll, and empower your team securely.
        </p>
      </div>
    </div>
  );
};

export default LoginLeftSide;

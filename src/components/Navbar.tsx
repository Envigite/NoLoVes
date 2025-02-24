import React from "react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full h-16 bg-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <div className="h-10 w-32">
          <img
            src="/api/placeholder/128/40"
            alt="Logo"
            className="h-full w-full object-contain"
          />
        </div>
        <button className="px-6 py-2 rounded-md bg-gray-100 text-gray-600 transition-colors duration-300 hover:text-green-500">
          Mi Botón
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

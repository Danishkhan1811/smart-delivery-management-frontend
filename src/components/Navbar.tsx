import React from "react";
import { NavLink } from "react-router-dom";

const Navbar: React.FC = () => {
  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "text-blue-500 border-b-2 border-blue-500"
      : "text-gray-700 hover:text-blue-500";

  return (
    <nav className="bg-white shadow p-4">
      <ul className="flex space-x-4">
        <li>
          <NavLink to="/dashboard" className={navLinkClasses}>
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/partners" className={navLinkClasses}>
            Partners
          </NavLink>
        </li>
        <li>
          <NavLink to="/orders" className={navLinkClasses}>
            Orders
          </NavLink>
        </li>
        <li>
          <NavLink to="/assignments" className={navLinkClasses}>
            Assignments
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;

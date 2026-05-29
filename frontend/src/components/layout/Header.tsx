import React, { useState, useRef, useEffect } from "react";
import logo from "../../assets/logo-transparent.png";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

interface NavItem {
  label: string;
  to: string;
  requiresAuth?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Recipes", to: "/recipes" },
  { label: "Meal Plans", to: "/mealplans", requiresAuth: true },
  { label: "Grocery Lists", to: "/grocery-lists", requiresAuth: true },
];

const linkClass =
  "text-neutral-700 hover:text-primary-600 font-medium transition-colors";

export const Header: React.FC = () => {
  const { isAuthenticated, isLoading, loginWithRedirect, logout, user } =
    useAuth0();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderNavLink = (item: NavItem, mobile?: boolean) => {
    const isDisabled = item.requiresAuth && !isAuthenticated;

    if (isDisabled) {
      return (
        <span
          key={item.label}
          className={`text-neutral-300 font-medium cursor-default select-none ${mobile ? "block" : ""}`}
        >
          {item.label}
        </span>
      );
    }

    return (
      <Link
        key={item.label}
        to={item.to}
        onClick={() => {
          if (mobile) setMobileMenuOpen(false);
        }}
        className={mobile ? `block ${linkClass}` : linkClass}
      >
        {item.label}
      </Link>
    );
  };

  return (
    <>
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <img src={logo} alt="SmartPlates" className="h-13 w-auto " />
                <h3 className="text-2xl font-bold bottom mt-5">
                  <span className="text-primary-600">Smart</span>Plates
                </h3>
              </Link>
            </div>

            {/* Desktop nav + auth */}
            <div className="hidden md:flex items-center space-x-6">
              <nav className="flex items-center space-x-6">
                {NAV_ITEMS.map((item) => renderNavLink(item))}
              </nav>
              <div className="h-6 w-px bg-neutral-200" />
              <AuthSection
                isLoading={isLoading}
                isAuthenticated={isAuthenticated}
                userName={user?.name || user?.email}
                onLogin={() => loginWithRedirect()}
                onLogout={() =>
                  logout({ logoutParams: { returnTo: window.location.origin } })
                }
              />
            </div>

            {/* Mobile menu toggle */}
            <button
              type="button"
              className="md:hidden text-neutral-700 hover:text-primary-600 p-2 cursor-pointer"
              aria-label="Toggle menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <MenuIcon open={mobileMenuOpen} />
            </button>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-neutral-200 py-4 space-y-3">
              {NAV_ITEMS.map((item) => renderNavLink(item, true))}
              <div className="border-t border-neutral-200 pt-3 mt-3">
                <AuthSection
                  isLoading={isLoading}
                  isAuthenticated={isAuthenticated}
                  userName={user?.name || user?.email}
                  onLogin={() => {
                    loginWithRedirect();
                    setMobileMenuOpen(false);
                  }}
                  onLogout={() => {
                    logout({
                      logoutParams: { returnTo: window.location.origin },
                    });
                    setMobileMenuOpen(false);
                  }}
                  mobile
                />
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

function AuthSection({
  isLoading,
  isAuthenticated,
  userName,
  onLogin,
  onLogout,
  mobile,
}: {
  isLoading: boolean;
  isAuthenticated: boolean;
  userName?: string;
  onLogin: () => void;
  onLogout: () => void;
  mobile?: boolean;
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isLoading) {
    return <span className="text-sm text-neutral-600">Loading...</span>;
  }

  if (!isAuthenticated) {
    return (
      <button
        onClick={onLogin}
        className="px-4 py-1.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors cursor-pointer"
      >
        Login
      </button>
    );
  }

  if (mobile) {
    return (
      <div className="space-y-2">
        <span className="block text-sm text-neutral-600">{userName}</span>
        <button
          onClick={onLogout}
          className="text-sm font-medium text-neutral-700 hover:text-primary-600 transition-colors cursor-pointer"
        >
          Logout
        </button>
      </div>
    );
  }

  // Desktop: user avatar dropdown
  const initials = userName
    ? userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center justify-center h-8 w-8 rounded-full bg-primary-100 text-primary-700 text-sm font-semibold hover:bg-primary-200 transition-colors cursor-pointer"
        aria-label="User menu"
      >
        {initials}
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 z-50">
          <div className="px-4 py-3 border-b border-neutral-100">
            <p className="text-sm font-medium text-neutral-900 truncate">
              {userName}
            </p>
          </div>
          <div className="p-2">
            <button
              onClick={() => {
                setDropdownOpen(false);
                onLogout();
              }}
              className="w-full rounded-md px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
      />
    </svg>
  );
}

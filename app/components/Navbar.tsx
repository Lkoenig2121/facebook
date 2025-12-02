"use client";

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  if (!user) return null;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Left - Logo and Search */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <Link href="/" className="text-3xl font-bold text-blue-600">
              facebook
            </Link>
            <div className="hidden md:block">
              <input
                type="text"
                placeholder="Search Facebook"
                className="bg-gray-100 rounded-full px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Center - Navigation */}
          <div className="hidden md:flex space-x-2">
            <Link
              href="/"
              className={`px-8 py-2 rounded-lg transition-colors ${
                pathname === "/"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <svg
                className="w-7 h-7 mx-auto"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </Link>
          </div>

          {/* Right - Profile Menu */}
          <div className="flex items-center space-x-3">
            <Link
              href={`/profile/${user.id}`}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-full transition-colors ${
                pathname?.startsWith("/profile")
                  ? "bg-blue-50"
                  : "hover:bg-gray-100"
              }`}
            >
              <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 font-semibold">
                    {user.name.charAt(0)}
                  </div>
                )}
              </div>
              <span className="hidden md:inline font-semibold text-gray-800">
                {user.name}
              </span>
            </Link>

            <button
              onClick={logout}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              title="Logout"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <>
          {/* Slide-in Menu */}
          <div className="fixed top-0 left-0 bottom-0 w-80 bg-white shadow-2xl z-50 lg:hidden overflow-y-auto border-r border-gray-200">
            {/* Menu Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-800">Menu</h2>
              <button
                onClick={() => setShowMobileMenu(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Menu Items */}
            <div className="p-4">
              <Link
                href={`/profile/${user.id}`}
                onClick={() => setShowMobileMenu(false)}
                className="flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-gray-100 transition-colors mb-2"
              >
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                  {user.avatar ? (
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 font-semibold">
                      {user.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-500">View your profile</p>
                </div>
              </Link>

              <hr className="my-3" />

              <Link
                href="/friends"
                onClick={() => setShowMobileMenu(false)}
                className="flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-800"
              >
                <svg
                  className="w-7 h-7 text-cyan-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
                <span className="font-semibold">Friends</span>
              </Link>

              <Link
                href="/watch"
                onClick={() => setShowMobileMenu(false)}
                className="flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-800"
              >
                <svg
                  className="w-7 h-7 text-red-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
                <span className="font-semibold">Watch</span>
              </Link>

              <Link
                href="/messages"
                onClick={() => setShowMobileMenu(false)}
                className="flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-800"
              >
                <svg
                  className="w-7 h-7 text-purple-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                  <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                </svg>
                <span className="font-semibold">Messages</span>
              </Link>

              <Link
                href="/groups"
                onClick={() => setShowMobileMenu(false)}
                className="flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-800"
              >
                <svg
                  className="w-7 h-7 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
                </svg>
                <span className="font-semibold">Groups</span>
              </Link>

              <Link
                href="/gaming"
                onClick={() => setShowMobileMenu(false)}
                className="flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-800"
              >
                <svg
                  className="w-7 h-7 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-semibold">Gaming</span>
              </Link>

              <hr className="my-3" />

              <button
                onClick={() => {
                  logout();
                  setShowMobileMenu(false);
                }}
                className="flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-800 w-full"
              >
                <svg
                  className="w-7 h-7 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span className="font-semibold">Log Out</span>
              </button>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}

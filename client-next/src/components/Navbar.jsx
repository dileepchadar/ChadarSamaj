"use client";
import React, { useContext, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { toggleLanguage, language, t } = useContext(LanguageContext);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    router.push('/login');
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="bg-white shadow-md relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary" onClick={closeMenu}>Simple Matrimony</Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/" className="text-gray-700 hover:text-primary font-medium px-3 py-2">{t('home')}</Link>
            <Link href="/search" className="text-gray-700 hover:text-primary font-medium px-3 py-2">{t('allMembers')}</Link>
            
            <button onClick={toggleLanguage} className="bg-gray-100 px-3 py-1 rounded border border-gray-300 text-sm hover:bg-gray-200 transition">
                {language === 'en' ? 'हिंदी' : 'English'}
            </button>
            
            {user ? (
              <>
                <Link href="/profile" className="text-gray-700 hover:text-primary font-medium px-3 py-2">{t('myProfile')}</Link>
                {user.role === 'admin' && (
                   <Link href="/admin" className="text-red-600 font-bold px-3 py-2">{t('adminPanel')}</Link>
                )}
                <button onClick={handleLogout} className="text-gray-700 hover:text-red-600 font-medium px-3 py-2">{t('logout')}</button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 hover:text-primary font-medium px-3 py-2">{t('login')}</Link>
                <Link href="/register" className="btn btn-primary text-sm py-2 px-4 shadow-md transform transition hover:scale-105">{t('register')}</Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden gap-3">
             <button onClick={toggleLanguage} className="bg-gray-50 px-2 py-1 rounded border border-gray-200 text-xs">
                {language === 'en' ? 'हिंदी' : 'En'}
             </button>
             <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 hover:text-primary focus:outline-none">
                 {isOpen ? (
                     <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                 ) : (
                     <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                 )}
             </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 absolute w-full left-0 shadow-xl flex flex-col p-4 space-y-3 z-50 animate-fade-in-down">
            <Link href="/" onClick={closeMenu} className="text-gray-700 hover:text-primary font-medium px-3 py-2 rounded hover:bg-gray-50">{t('home')}</Link>
            <Link href="/search" onClick={closeMenu} className="text-gray-700 hover:text-primary font-medium px-3 py-2 rounded hover:bg-gray-50">{t('allMembers')}</Link>
            
            {user ? (
              <>
                <Link href="/profile" onClick={closeMenu} className="text-gray-700 hover:text-primary font-medium px-3 py-2 rounded hover:bg-gray-50">{t('myProfile')}</Link>
                {user.role === 'admin' && (
                   <Link href="/admin" onClick={closeMenu} className="text-red-600 font-bold px-3 py-2 rounded hover:bg-red-50">{t('adminPanel')}</Link>
                )}
                <button onClick={handleLogout} className="text-left text-gray-700 hover:text-red-600 font-medium px-3 py-2 rounded hover:bg-red-50 w-full">{t('logout')}</button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={closeMenu} className="text-gray-700 hover:text-primary font-medium px-3 py-2 rounded hover:bg-gray-50">{t('login')}</Link>
                <Link href="/register" onClick={closeMenu} className="bg-primary text-white text-center font-bold py-3 rounded-lg shadow-lg">{t('register')}</Link>
              </>
            )}
          </div>
      )}
    </nav>
  );
};

export default Navbar;

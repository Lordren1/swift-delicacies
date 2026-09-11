'use client';

import { useState } from 'react';
import Link from "next/link";
import styles from './main-header.module.css';
import MainHeaderBackground from "./main-header-background";
import NavLink from "./nav-link";
import { Menu } from 'lucide-react';
import MobileNav from './mobile-nav';
import { logout } from '@/actions/post';

export default function MainHeader({ user }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <MainHeaderBackground />

      {/* Logo */}
      <header className={styles.header}>
        <Link className={styles.logo} href='/'>
          Swift Delicacy
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.desktopNav} >
          <ul>
            <li>
              <NavLink href={'/meals'} onClick={() => setMenuOpen(false)}>
                Browse meals
              </NavLink>
            </li>
            <li>
              <NavLink href={'/meals/share-meal'} onClick={() => setMenuOpen(false)}>
                Share meal
              </NavLink>
            </li>
            {user ? (
              <>
                <li>
                  <NavLink href={'/profile'} onClick={() => setMenuOpen(false)}>
                    My Profile
                  </NavLink>
                </li>
                <li>
                  <form action={logout} /* method="post" */>
                    <button type="submit" className={styles.logoutBtn}>
                      Log out
                    </button>
                  </form>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink href={'/login'} onClick={() => setMenuOpen(false)}>
                    Log in
                  </NavLink>
                </li>
                <li>
                  <NavLink href={'/signup'} onClick={() => setMenuOpen(false)}>
                    Sign up
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className={styles.burger}
          onClick={() => setMenuOpen(true)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <Menu  />
        </button>

        {/* Mobile Sidebar */}
        <MobileNav
          open={menuOpen}
          close={() => setMenuOpen(false)}
          user={user}
        />
      </header>
    </>
  )
}
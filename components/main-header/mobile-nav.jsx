'use client';

import { useEffect } from 'react';
import styles from './mobile-nav.module.css';
import { X } from 'lucide-react';
import NavLink from './nav-link';



export default function MobileNav({open, close, user}) {

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div className={styles.overlay} onClick={close}>
       <aside className={styles.sidebar} onClick={(e) => e.stopPropagation()}>
          <div className={styles.top}>
            <h2 className={styles.brand}>
              Swift Delicacy
            </h2>

            <button className={styles.closeBtn} onClick={close}  aria-label="Close menu" >
              <X size={24} />
            </button>
          </div>

          <nav className={styles.nav}>
            <ul>
              <li>
                <NavLink
                  href="/meals"
                  onClick={close}
                >
                  Browse Meals
                </NavLink>
              </li>

              <li>
                <NavLink
                href="/meals/share-meal"
                onClick={close}
              >
                Share Meal
              </NavLink>
              </li>

              {user && ( 
                <li>
                  <NavLink href="/profile" onClick={close}> My Profile</NavLink>
                </li>
              )}
            </ul>
          </nav>

          <div className={styles.footer}>
            {user ? ( 
              <form action="/api/logout" method="post">
                <button tpe="submit" className={styles.logoutBtn}>
                  Log Out
                </button>
              </form>
            ) : (
              <>
                <Link href="/login" className={styles.loginBtn} onClick={close}>
                  Log In
                </Link>

                <Link href="/signup"></Link>
              </>
            )}
          </div>
        </aside> 
      </div>
    </>
  );
  
}
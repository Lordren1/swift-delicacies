import Link from "next/link";
import styles from './main-header.module.css';
import MainHeaderBackground from "./main-header-background";
import NavLink from "./nav-link";
import { verifyAuth } from "@/lib/auth";
import { logout } from "@/actions/post";


export default async function MainHeader() {
  const { user } = await verifyAuth();

  return (
    <>
      <MainHeaderBackground />
      <header className={styles.header}>
        <Link className={styles.logo} href='/'>
          Swift Delicacy
        </Link>

        <nav className={styles.nav}>
          <ul>
            <li>
              <NavLink href={'/meals'}>Browse meals</NavLink>
            </li>
            <li>
              <NavLink href={'/meals/share-meal'}>Share meal</NavLink>
            </li>
            {user ? (
              <>
                <li>
                  <NavLink href={'/profile'}>My profile</NavLink>
                </li>
                <li>
                  <form action={logout}>
                    <button type="submit" className={styles.logoutBtn}>Log out</button>
                  </form>
                </li>
              </>

            ) : (
              <>
                <li><NavLink href={'/login'}>Log in</NavLink></li>
                <li><NavLink href={'/signup'}>Sign up</NavLink></li>
              </>
            )}
          </ul>
        </nav>
      </header>
    </>
  );
}
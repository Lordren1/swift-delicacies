import Link from "next/link";
import styles from './main-header.module.css';
import MainHeaderBackground from "./main-header-background";
import NavLink from "./nav-link";


export default function MainHeader() {

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
          </ul>
        </nav>
      </header>
    </>
  )
}
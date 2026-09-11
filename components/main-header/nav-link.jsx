'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from './nav-link.module.css'


export default function NavLink({ href, children, onClick }) {
  const path = usePathname();

  return (
    <>
      <Link
        href={href}
        onClick={onClick}
        className={
          path === href
            ? `${styles.link} ${styles.active}`
            : styles.link
        }
      >
        {children}
      </Link>
    </>
  )
}
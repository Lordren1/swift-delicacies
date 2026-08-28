'use client';

import { useState, useRef, useEffect, startTransition } from 'react';
import Link from 'next/link';
import { deletePost } from '@/actions/post';
import styles from './meal-menu.module.css';

export default function MealMenu({ mealId, slug }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleDelete() {
    if (confirm('Delete this meal? This cannot be undone.')) {
      startTransition(async () => {
        await deletePost(mealId);
        setLocalMessage('Meal deleted')
      });
    }
    setOpen(false);
  }

  return (
    <div className={styles.wrapper} ref={menuRef}>
      <button
        className={styles.trigger}
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Post options"
      >
        ⋮
      </button>

      {open && (
        <div className={styles.dropdown}>
          <Link href={`/meals/${slug}/edit`} className={styles.item}>
            Edit
          </Link>
          <button onClick={handleDelete} className={styles.deleteItem}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
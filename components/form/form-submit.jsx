'use client';

import { useFormStatus } from "react-dom";
import styles from './meal-form.module.css';


export default function FormSubmit() {
  const { pending } = useFormStatus();

  if (pending) {
    return <p className={styles.pending}>Create posting...</p>
  }

  return (
    <>
      <button className={styles.reset} type='reset'>
        Reset
      </button>
      <button className={styles.submit} type='submit'>
        Create Post
      </button>
    </>
  );
}
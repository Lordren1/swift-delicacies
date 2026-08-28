'use client';

import { useActionState } from "react";
import styles from './profile-form.module.css';


export default function PasswordFord({ action }) {
  const [state, formAction, pending] = useActionState(action, { errors: null });

  return (
    <form action={formAction} className={styles.form}>
      <h2>Change Password</h2>

      <p className={styles.control}>
        <label htmlFor="currentPassword">Current password</label>
        <input type="password" id="currentPassword" name="currentPassword" autoComplete="current-password" />
      </p>

      <p className={styles.control}>
        <label htmlFor="newPassword">New password</label>
        <input type="password" id="newPassword" name="newPassword" autoComplete="new-password" />
      </p>

      <p className={styles.control}>
        <label htmlFor="confirmPassword">Confirm new password</label>
        <input type="password" id="confirmPassword" name="confirmPassword" autoComplete="new-password" />
      </p>

      <button type="submit" className={styles.submit} disabled={pending}>
        {pending ? 'Updating... ' : 'Update password'}
      </button>

      {state.success && <p className={styles.success}>Password changed.</p>}
      {state.errors && (
        <ul className={styles.errors}>
          {state.errors.map((error) => <li key={error}>{error}</li>)}
        </ul>
      )}
    </form>
  );
}
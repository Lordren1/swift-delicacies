'use client';

import { useActionState } from 'react';
import Image from 'next/image';
import styles from './profile-form.module.css';
import ImagePicker from '../meals/image-picker';

export default function ProfileForm({ action, user }) {
  const [state, formAction, pending] = useActionState(action, { errors: null });

  return (
    <form action={formAction} className={styles.form}>
      <h2>Personal Details</h2>

      {user.profile_image && (
        <div className={styles.avatarPreview}>
          <Image src={user.profile_image} alt={user.username} width={96} height={96} />
        </div>
      )}

      <div className={styles.row}>
        <p className={styles.control}>
          <label htmlFor="firstName">First name</label>
          <input type="text" id="firstName" name="firstName" defaultValue={user.first_name} />
        </p>
        <p className={styles.control}>
          <label htmlFor="lastName">Last name</label>
          <input type="text" id="lastName" name="lastName" defaultValue={user.last_name} />
        </p>
      </div>


      <ImagePicker />

      {/* <p className={styles.control}>
        <label htmlFor="image">Profile photo</label>
        <input type="file" id="image" name="image" accept="image/png, image/jpeg" />
      </p> */}

      <button type="submit" className={styles.submit} disabled={pending}>
        {pending ? 'Saving...' : 'Save changes'}
      </button>

      {state.success && <p className={styles.success}>Profile updated.</p>}
      {state.errors && (
        <ul className={styles.errors}>
          {state.errors.map((error) => <li key={error}>{error}</li>)}
        </ul>
      )}
    </form>
  );
}
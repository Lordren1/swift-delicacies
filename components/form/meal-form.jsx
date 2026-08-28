'use client';

import { useActionState } from 'react';
import FormSubmit from './form-submit';
import styles from './meal-form.module.css';
import ImagePicker from '../meals/image-picker';

export default function MealForm({ action }) {
  const [state, formAction] = useActionState(action, { errors: null });

  return (
    <>
      <h1 className={styles.heading}>Share your favorite recipe</h1>

      <form className={styles.form} action={formAction}>
        <div className={styles.row}>
          <p className={styles.control}>
            <label htmlFor='name'>Your name</label>
            <input type='text' id='name' name='name' />
          </p>
          <p className={styles.control}>
            <label htmlFor='email'>Your email</label>
            <input type='email' id='email' name='email' />
          </p>
        </div>

        <p className={styles.control}>
          <label htmlFor='title'>Title</label>
          <input type='text' id='title' name='title' />
        </p>

        <p className={styles.control}>
          <label htmlFor='summary'>Short Summary</label>
          <input type='text' id='summary' name='summary' />
        </p>

        <p className={styles.control}>
          <label htmlFor='instructions'>Instructions</label>
          <textarea id='instructions' name='instructions' rows='10' />
        </p>

        <ImagePicker />

        <div className={styles.actions}>
          <FormSubmit />
        </div>

        {state.errors && (
          <ul className={styles.errors}>
            {state.errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        )}
      </form>
    </>
  );
}
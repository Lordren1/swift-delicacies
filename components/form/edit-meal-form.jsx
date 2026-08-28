'use client';

import { useActionState } from 'react';
import styles from './meal-form.module.css';


export default function EditMealForm({ action, meal }) {
  const [state, formAction, pending] = useActionState(action, { errors: null });

  return (
    <>
      <h1 className={styles.heading}>Edit your recipe</h1>

      <form action={formAction} className={styles.form}>
        <input type="hidden" name="mealId" value={meal.id} />

        <p className={styles.control}>
          <label htmlFor='title'>Title</label>
          <input type="text" id="title" name="title" defaultValue={meal.title} />
        </p>

        <p className={styles.control}>
          <label htmlFor='summary'>Short Summary</label>
          <input type="text" id="summary" name="summary" defaultValue={meal.summary} />
        </p>

        <p className={styles.control}>
          <label htmlFor='instructions'>Instructions</label>
          <textarea
            id="instructions"
            name="instructions"
            rows="10"
            defaultValue={meal.instructions.replace(/<br \/>/g, '\n')}
          />
        </p>

        <p className={styles.control}>
          <label htmlFor='image'>Replace photo (optional)</label>
          <input type="file" id="image" name="image" accept="image/png, image/jpeg" />
        </p>

        <div className={styles.action}>
          <button type="submit" className={styles.submit} disabled={pending}>
            {pending ? 'Saving...' : 'Save changes'}
          </button>
        </div>

        {state.errors && (
          <ul className={styles.errors}>
            {state.errors.map((error) => <li key={error}>{error}</li>)}
          </ul>
        )}
      </form>
    </>
  );
}
'use client';

import { useActionState } from "react";
import { postComment } from "@/actions/post";
import styles from './comment-form.module.css';


export default function CommentForm({ mealId }) {
  const [state, formAction, pending] = useActionState(postComment, { error: null });

  return (
    <>
      <form action={formAction} className={styles.form}>
        <input type="hidden" name="mealId" value={mealId} />
        <textarea
          name="content"
          row="3"
          placeholder="Share your thoughts..."
          className={styles.textarea}
        />
        <button type="submit" className={styles.submit} disabled={pending}>
          {pending ? 'Posting...' : 'Post Comment'}
        </button>
        {state.error && <p className={styles.error}>{state.error}</p>}
      </form>
    </>
  );
}
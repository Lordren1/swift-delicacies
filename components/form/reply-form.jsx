'use client';

import { useActionState } from 'react';
import styles from './comment-form.module.css';
import { postComment } from '@/actions/post';


export default function ReplyForm({ mealId, parentId, onDone }) {
  const [state, formAction, pending] = useActionState(postComment, { error: null });

  return (
    <form action={formAction} className={styles.replying}>
      <input type="hidden" name="mealId" value={mealId} />
      <input type="hidden" name="parentId" value={parentId} />
      <textarea name="content" row="3" placeholder="write a reply..." className={styles.textarea} />
      <div className={styles.replyActions}>
        <button type="submit" disabled={pending} className={styles.submit}>
          {pending ? 'Posting...' : 'Reply'}
        </button>
        <button type="button" onClick={onDone} className={styles.cancel}>
          Cancel
        </button>
      </div>
      {state.error && <p className={styles.error}>{state.error}</p>}
    </form>
  );
}
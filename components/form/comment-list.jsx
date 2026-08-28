'use client';

import { useState, useEffect } from 'react';
import { useActionState } from 'react';
import { editComment, removeComment } from '@/actions/post';
import ReplyForm from './reply-form';
import styles from './comment-list.module.css';



function EditCommentForm({ comment, onSuccess, onCancel }) {
  const [state, formAction, pending] = useActionState(editComment, { error: null });

  useEffect(() => {
    if (state.success) {
      onSuccess();
    }
  }, [state.success, onSuccess]);

  return (
    <form action={formAction} className={styles.editForm}>
      <input type="hidden" name="commentId" value={comment.id} />
      <textarea
        name="content"
        defaultValue={comment.content}
        rows="3"
        className={styles.editTextarea}
      />
      <div className={styles.editAction}>
        <button type="submit" disabled={pending} className={styles.save}>
          {pending ? 'Saving...' : 'Save'}
        </button>
        <button type="button" onClick={onCancel} className={styles.cancel}>
          Cancel
        </button>
      </div>
      {state.error && <p className={styles.error}>{state.error}</p>}
    </form>
  );
}

function CommentItem({ comment, mealId, currentUserId, depth = 0 }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const isOwner = currentUserId && comment.user_id === currentUserId;

  if (isEditing) {
    return (
      <li className={styles.community}>
        <EditCommentForm
          comment={comment}
          onSuccess={() => setIsEditing(false)}
          onCancel={() => setIsEditing(false)}
        />
      </li>
    );
  }

  return (
    <li className={styles.comment} style={{ marginLeft: `${depth * 1.5}rem` }}>
      <p className={styles.meta}>
        <strong>{comment.first_name} {comment.last_name}</strong>{' '}
        <span>@{comment.username}</span>
      </p>
      <p className={styles.content}>{comment.content}</p>

      <div className={styles.ownerActions}>
        <button onClick={() => setIsReplying((v) => !v)} className={styles.editBtn}>
          Reply
        </button>

        {isOwner && (
          <>
            <button onClick={() => setIsEditing(true)} className={styles.editBtn}>
              Edit
            </button>
            <button
              onClick={() => removeComment(comment.id)}
              className={styles.deleteBtn}
            >
              Delete
            </button>
          </>
        )}
      </div>

      {isReplying && (
        <ReplyForm
          mealId={mealId}
          parentId={comment.id}
          onDone={() => setIsReplying(false)}
        />
      )}

      {comment.replies?.length > 0 && (
        <ul className={styles.list}>
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              mealId={mealId}
              currentUserId={currentUserId}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}

    </li>
  );
}


export default function CommentList({ comments, mealId, currentUserId }) {
  if (comments.length === 0) {
    return <p className={styles.empty}>No comments yet. Be the first!</p>;
  }

  return (
    <ul className={styles.list}>
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          mealId={mealId}
          currentUserId={currentUserId}
        />
      ))}
    </ul>
  );
}
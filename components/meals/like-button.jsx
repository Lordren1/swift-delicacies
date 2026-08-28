'use client';

import { useTransition } from "react";
import { toggleMealLike } from "@/actions/post";
import styles from './like-button.module.css';



export default function LikeButton({ mealId, initialLiked, initialCount }) {
  const [isPending, startTransition] = useTransition();


  function handleClick() {
    startTransition(() => {
      toggleMealLike(mealId);
    });
  }

  return (
    <button
      className={`${styles.like} ${initialLiked ? styles.liked : ''}`}
      onClick={handleClick}
      disabled={isPending}
    >
      ❤ {initialCount}
    </button>
  );
}
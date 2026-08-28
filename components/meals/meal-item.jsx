import Link from 'next/link';
import Image from 'next/image';
import styles from './meal-item.module.css';
import { formatDate } from '@/lib/format-date';
import LikeButton from './like-button';
import MealMenu from './meal-menu';

export default function MealItem({
  id,
  title,
  slug,
  image,
  summary,
  creator,
  creator_username,
  creator_avatar,
  created_at,
  like_count,
  liked,
  view_count,
  comment_count,
  user_id,
  currentUserId
}) {

  const isOwner = currentUserId && user_id === currentUserId;

  return (
    <>
      <article className={styles.meal}>
        <header>
          <div className={styles.image}>
            <Image src={image} alt={title} fill />
          </div>
          <div className={styles.headerText}>
            <div className={styles.titleRow}>
              <h2>{title}</h2>
              {isOwner && <MealMenu mealId={id} slug={slug} />}
            </div>
            <p className={styles.creatorRow}>
              {creator_username ? (
                <Link href={`/users/${creator_username}`} className={styles.creatorLink}>
                  {creator_avatar ? (
                    <Image
                      src={creator_avatar}
                      alt={creator}
                      width={24}
                      height={24}
                      className={styles.creatorAvatar}
                    />
                  ) : (
                    <span className={styles.creatorAvatarPlaceholder}>
                      {creator[0].toUpperCase()}
                    </span>
                  )}
                  <span>{creator}</span>
                </Link>
              ) : (
                <span>{creator}</span>
              )}
              {' '}on{' '}
              <time dateTime={created_at}>{formatDate(created_at)}</time>
              {/*  Shared by {creator} on{' '}
              <time dateTime={created_at}>
                {formatDate(created_at)}
              </time> */}
            </p>
          </div>
        </header>

        <div className={styles.content}>
          <p className={styles.summary}>{summary}</p>

          <div className={styles.stats}>
            <span className={styles.views}>👁{view_count} views</span>
            <Link href={`/meals/${slug}#comments`} className={styles.commentLink}>
              💬 {comment_count}
            </Link>
          </div>

          <div className={styles.actions}>
            <LikeButton mealId={id} initialLiked={!!liked} initialCount={like_count} />
            <Link href={`/meals/${slug}`}>View Details</Link>
          </div>
        </div>
      </article>
    </>
  );
}
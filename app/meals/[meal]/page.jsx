import Link from 'next/link';
import { getMeal } from '@/lib/meals';
import { recordView } from '@/lib/views';
import { getComments } from '@/lib/comments';
import styles from './page.module.css';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { formatDate } from '@/lib/format-date';
import LikeButton from '@/components/meals/like-button';
import CommentForm from '@/components/form/comment-form';
import CommentList from '@/components/form/comment-list';
import { verifyAuth } from '@/lib/auth';


export default async function MealDetailsPost({ params }) {
  const { user } = await verifyAuth();
  const { meal: slug } = await params;

  const meal = getMeal(slug, user?.id);

  if (!meal) {
    notFound();
  }

  if (user) {
    recordView(meal.id, user.id);
  }

  /* incrementViews(meal.id);
  meal.views += 1; // reflect the increment immediately without refetching
 */
  const comments = getComments(meal.id);

  meal.instructions = meal.instructions.replace(/\n/g, '<br />');

  return (
    <>
      <header className={styles.header}>
        <div className={styles.image}>
          <Image src={meal.image} alt={meal.title} fill />
        </div>

        <div className={styles.headerText}>
          <h1>{meal.title}</h1>

          <div className={styles.creatorRow}>
            {meal.creator_username ? (
              <Link href={`/users/${meal.creator_username}`} className={styles.creatorLink}>
                {meal.creator_avatar ? (
                  <Image
                    src={meal.creator_avatar}
                    alt={meal.creator}
                    width={36}
                    height={36}
                    className={styles.creatorAvatar}
                  />
                ) : (
                  <div className={styles.creatorAvatarPlaceholder}>
                    {meal.creator[0].toUpperCase()}
                  </div>
                )}
                <span>{meal.creator}</span>
              </Link>
            ) : (
              <a href={`mailto:${meal.creator_email}`} className={styles.creatorLink}>
                {meal.creator}
              </a>
            )}
            <span className={styles.creatorMeta}>
              {' '}shared this on{' '}
              <time dateTime={meal.created_at}>{formatDate(meal.created_at)}</time>
            </span>
          </div>
          {/* <p className={styles.creator}>
            Shared by{' '}
            <a href={`mailto:${meal.creator_email}`}>{meal.creator}</a> on{' '}
            <time dateTime={meal.created_at}>{formatDate(meal.created_at)}</time>
          </p> */}
          <p className={styles.summary}>{meal.summary}</p>
          <div className={styles.stats}>
            <span className={styles.views}>👁{meal.view_count} views</span>
          </div>
          <LikeButton
            mealId={meal.id}
            initialLiked={!!meal.liked}
            initialCount={meal.like_count}
          />
        </div>
      </header>

      <main>
        <p
          className={styles.instructions}
          dangerouslySetInnerHTML={{ __html: meal.instructions }}
        ></p>

        <section id="comments" className={styles.comments}>

          <CommentForm mealId={meal.id} />
          <h2 className={styles.comment}>Comments</h2>
          <CommentList
            comments={comments}
            mealId={meal.id}
            currentUserId={user?.id}
          />
        </section>
      </main>
    </>
  )
}
import { verifyAuth } from '@/lib/auth';
import styles from './page.module.css';
import { getPublicUserByUsername } from '@/lib/users';
import { notFound } from 'next/navigation';
import { getMealsByUser } from '@/lib/meals';
import MealsGrid from '@/components/meals/meals-grid';
import Image from 'next/image';



export default async function PublicProfilePage({ params }) {
  const { username } = await params;
  const { user: viewer } = await verifyAuth();

  const profileUser = getPublicUserByUsername(username);

  if (!profileUser) {
    notFound();
  }

  const meals = getMealsByUser(profileUser.id, viewer?.id);

  return (
    <main className={styles.main}>
      <div className={styles.profileHeader}>
        {profileUser.profile_image ? (
          <Image
            src={profileUser.profile_image}
            alt={profileUser.username}
            width={120}
            height={120}
            className={styles.avatar}
          />
        ) : (
          <div className={styles.avatarPlaceholder}>
            {profileUser.first_name?.[0]?.toUpperCase() ?? profileUser.username[0].toUpperCase()}
          </div>
        )}

        <div>
          <h1>{profileUser.first_name} {profileUser.last_name}</h1>
          <p className={styles.username}>@{profileUser.username}</p>
        </div>
      </div>

      <section className={styles.mealsSection}>
        <h2>Meals shared by {profileUser.first_name || profileUser.username}</h2>
        {meals.length === 0 ? (
          <p className={styles.empty}>No meals shared yet.</p>
        ) : (
          <MealsGrid meals={meals} currentUserId={viewer?.id} />
        )}
      </section>
    </main>
  );
}
import { Suspense } from 'react';
import { verifyAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getMealsByUser } from '@/lib/meals';
import { updateProfile, changePassword } from '@/actions/post';
import ProfileForm from '@/components/profile/profile-form';
import PasswordForm from '@/components/profile/password-form';
import MealsGrid from '@/components/meals/meals-grid';
import Toast from '@/components/ui/toast';
import Image from 'next/image';
import styles from './page.module.css';

export default async function ProfilePage() {
  const { user } = await verifyAuth();

  if (!user) {
    redirect('/login');
  }

  const myMeals = getMealsByUser(user.id, user.id);

  return (
    <main className={styles.main}>
      <div className={styles.profileHeader}>
        {user.profile_image ? (
          <Image
            src={user.profile_image}
            alt={user.username}
            width={120}
            height={120}
            className={styles.avatar}
          />
        ) : (
          <div className={styles.avatarPlaceholder}>
            {user.first_name?.[0]?.toUpperCase() ?? user.username[0].toUpperCase()}
          </div>
        )}

        <div>
          <h1>{user.first_name} {user.last_name}</h1>
          <p className={styles.username}>@{user.username}</p>
        </div>
      </div>

      <ProfileForm action={updateProfile} user={user} />
      <PasswordForm action={changePassword} />

      <section className={styles.mealsSection}>
        <h2>My Shared Meals</h2>
        {myMeals.length === 0 ? (
          <p className={styles.empty}>You haven&apos;t shared any meals yet.</p>
        ) : (
          <MealsGrid meals={myMeals} currentUserId={user.id} />
        )}
      </section>

      <Suspense>
        <Toast />
      </Suspense>
    </main>
  );
}
import { Suspense } from 'react';
import Link from "next/link";
import styles from './page.module.css';
import MealsGrid from '@/components/meals/meals-grid';
import MealsLoading from '@/components/meals/meals-loading';
import { getMeals } from '@/lib/meals';
import { verifyAuth } from '@/lib/auth';
import ImageSlideshow from '@/components/images/image-slideshow';


async function Meals() {
  const { user } = await verifyAuth();
  const meals = await getMeals(user?.id);

  return (
    <>
      <MealsGrid meals={meals.slice(0, 3)} currentUserId={user?.id} />
    </>
  )
}
export default function Home() {


  return (
    <>
      <header className={styles.header}>
        <div className={styles.hero}>
          <div className={styles.heroText}>
            <h1>Swift Delicacies for Foodies</h1>
            <p>Taste & share food from Naija.</p>

            <div className={styles.cta}>
              <Link href="/meals" className={styles.primaryBtn}>
                Explore Your Meals
              </Link>
              <Link href="/meals/share" className={styles.secondaryBtn}>
                Share a Meal
              </Link>
            </div>
          </div>

          <div className={styles.heroImage}>
            <ImageSlideshow />
          </div>
        </div>
      </header>

      

      <main>
        <section className={styles.section}>
          <h2>How it works</h2>
          <p>
            Swift Delicacy is a platform for foodies to share their favorite
            recipes with the world. It&apos;s a place to discover new dishes, and to
            connect with other food lovers.
          </p>
          <p>
            It is a place to discover new dishes, and to connect
            with other food lovers.
          </p>
        </section>

        <Suspense fallback={<MealsLoading />}>
          <Meals />
        </Suspense>
      </main>
    </>
  )
}
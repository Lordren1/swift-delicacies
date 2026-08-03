import { Suspense } from 'react';
import Link from "next/link";
import styles from './page.module.css';
import MealsGrid from '@/components/meals/meals-grid';
import MealsLoading from '@/components/meals/meals-loading';
import { getMeals } from '@/lib/meals';


async function Meals() {
  const meals = await getMeals();

  return (
    <>
      <MealsGrid meals={meals.slice(0, 3)} />
    </>
  )
}
export default function Home() {


  return (
    <>
      <header className={styles.header}>
        <div>
          <div className={styles.hero}>
            <h1>
              Swift Delicacies for Foodies
            </h1>
            <p>Taste & share food from Naija.</p>
          </div>

          <div className={styles.cta}>
            <Link href='/meals'>Explore Your Meals</Link>
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
            Swift Delicacy is a place to discover new dishes, and to connect
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
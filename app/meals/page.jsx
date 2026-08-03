import { Suspense } from 'react';
import styles from './page.module.css';
import MealsGrid from '@/components/meals/meals-grid';
import MealsLoading from '@/components/meals/meals-loading';
import { getMeals } from '@/lib/meals';

async function Meals() {
  const meals = await getMeals();

  return (
    <>
      <MealsGrid meals={meals} />
    </>
  );
}

export default function MealsPage() {
  return (
    <>
      <header className={styles.header}>
        <h1>
          Delicious meals, created{' '}
          <span className={styles.highlight}>by you!</span>
        </h1>
        <p>Choose your favourite recipe and try it yourself. It can only be fun!</p>
      </header>

      <main className={styles.main}>
        <Suspense fallback={<MealsLoading count={6} />}>
          <Meals />
        </Suspense>
      </main>
    </>
  )
}
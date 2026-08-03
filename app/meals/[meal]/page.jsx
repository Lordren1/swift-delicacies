import { getMeal } from '@/lib/meals';
import styles from './page.module.css';
import Image from 'next/image';
import { notFound } from 'next/navigation';


export default async function MealDetailsPost({ params }) {

  const { meal: slug } = await params;

  const meal = getMeal(slug);

  if (!meal) {
    notFound();
  }

  meal.instructions = meal.instructions.replace(/\n/g, '<br />');

  return (
    <>
      <header className={styles.header}>
        <div className={styles.image}>
          <Image src={meal.image} alt={meal.title} fill />
        </div>

        <div className={styles.headerText}>
          <h1>{meal.title}</h1>
          <p className={styles.creator}>
            By <a href={`mail to: ${meal.creator_email}`}>{meal.creator}</a>
          </p>
          <p className={styles.summary}> {meal.summary}</p>
        </div>
      </header>

      <main>
        <p
          className={styles.instructions}
          dangerouslySetInnerHTML={{ __html: meal.instructions, }}>
        </p>
      </main>
    </>
  )
}
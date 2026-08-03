// components/meals/meals-loading.jsx
import styles from './meals-loading.module.css';

export default function MealsLoading({ count = 3 }) {
  return (
    <ul className={styles.meals}>
      {Array.from({ length: count }, (_, i) => (
        <li key={i} className={styles.meal}>
          <div className={styles.image}></div>

          <div className={styles.headerText}>
            <div className={`${styles.line} ${styles.title}`}></div>
            <div className={`${styles.line} ${styles.subtitle}`}></div>
          </div>

          <div className={styles.summary}>
            <div className={styles.line}></div>
            <div className={styles.line}></div>
          </div>

          <div className={styles.actions}>
            <div className={styles.button}></div>
          </div>
        </li>
      ))}
    </ul>
  );
}
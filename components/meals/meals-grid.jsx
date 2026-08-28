import MealItem from "./meal-item";
import styles from './meals-grid.module.css'


export default function MealsGrid({ meals, currentUserId }) {


  return (
    <>
      <ul className={styles.meals}>
        {meals.map(meal => (
          <li key={meal.id}>
            <MealItem {...meal} currentUserId={currentUserId} />
          </li>
        ))}
      </ul>
    </>
  );
}
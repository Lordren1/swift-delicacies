import { verifyAuth } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { getMeal } from '@/lib/meals';
import { editPost } from '@/actions/post';
import EditMealForm from '@/components/form/edit-meal-form';

export default async function EditMealPage({ params }) {
  const { user } = await verifyAuth();

  if (!user) {
    redirect('/login');
  }

  const { meal: slug } = await params;
  const meal = getMeal(slug, user.id);

  if (!meal) {
    notFound();
  }

  if (meal.user_id !== user.id) {
    redirect('/profile?update=1');
  }

  return <EditMealForm action={editPost} meal={meal} />;
}
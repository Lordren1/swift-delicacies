import { verifyAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { sharePost } from "@/actions/post";
import MealForm from "@/components/form/meal-form";



export default async function NewPostPage() {
  const { user } = await verifyAuth();

  if (!user) {
    redirect('/login');
  }

  return (
    <MealForm action={sharePost} />
  );
}
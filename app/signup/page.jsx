import AuthForm from "@/components/auth/auth-form";
import { signup } from "@/actions/post";


export default function SignupPage() {
  return <AuthForm action={signup} mode="signup" />;
}
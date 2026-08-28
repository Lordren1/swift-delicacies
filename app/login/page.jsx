import AuthForm from "@/components/auth/auth-form";
import { login } from "@/actions/post";


export default function LoginPage() {
  return <AuthForm action={login} mode="login" />;
}
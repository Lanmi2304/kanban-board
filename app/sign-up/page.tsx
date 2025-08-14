import { SignUpForm } from "./_components/sign-up-form";

export default function SignUp() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6">
      <h1 className="text-2xl font-bold">Sign Up</h1>
      <SignUpForm />
    </div>
  );
}

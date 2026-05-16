import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { login } from "../../services/authService";
import { saveAuthSession } from "../../store/authStore";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("customer@example.com");
  const [password, setPassword] = useState("customer123");

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const session = await login({ email, password });
    saveAuthSession(session);
    navigate(session.user.role === "admin" ? "/admin" : "/home");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-5">
      <form className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lift" onSubmit={onSubmit}>
        <h1 className="text-3xl font-extrabold text-primary">Welcome back</h1>
        <p className="mt-2 text-muted">Use customer@example.com / customer123 or admin@example.com / admin123.</p>
        <div className="mt-6 space-y-4">
          <Input label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <Input label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        </div>
        <Button className="mt-6 w-full">Login</Button>
        <p className="mt-4 text-center text-sm text-muted">No account? <Link className="font-bold text-primary" to="/register">Register</Link></p>
      </form>
    </main>
  );
}

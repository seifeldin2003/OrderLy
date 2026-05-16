import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { register } from "../../services/authService";
import { saveAuthSession } from "../../store/authStore";

export function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const session = await register(form);
    saveAuthSession(session);
    navigate("/home");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-5">
      <form className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lift" onSubmit={onSubmit}>
        <h1 className="text-3xl font-extrabold text-primary">Create account</h1>
        <p className="mt-2 text-muted">Start ordering from your favorite menu.</p>
        <div className="mt-6 space-y-4">
          <Input label="Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
          <Input label="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
          <Input label="Phone" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
          <Input label="Password" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
        </div>
        <Button className="mt-6 w-full">Register</Button>
        <p className="mt-4 text-center text-sm text-muted">Already registered? <Link className="font-bold text-primary" to="/login">Login</Link></p>
      </form>
    </main>
  );
}

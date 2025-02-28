import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { FormEvent } from 'react';
import './login.css';
import { Input } from 'antd';

export const Route = createFileRoute('/')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate({ from: '/' });

  const login = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const res = await fetch('https://frontend-take-home-service.fetch.com/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.get('name'),
        email: formData.get('email'),
      }),
    });
    if (res.ok) {
      navigate({ to: '/adopt' });
    }
  };

  return (
    <form onSubmit={login} method="post" className="login-form">
      <h1>Login</h1>
      <label>
        <span>Name</span>
        <Input type="text" name="name" />
      </label>

      <label>
        <span>Email</span>
        <Input type="email" name="email" />
      </label>

      <button type="submit" className="button-primary">
        Login
      </button>
    </form>
  );
}

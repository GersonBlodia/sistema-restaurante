'use client';

import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface LoginForm {
  correo: string;
  contrasena: string;
}

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();
  const [error, setError] = useState('');
  const router = useRouter();

  const onSubmit = async (data: LoginForm) => {
    const res = await signIn('credentials', {
      redirect: false,
      correo: data.correo,
      contrasena: data.contrasena,
    });

    if (res?.error) {
      setError('Credenciales inválidas o usuario inactivo');
      return;
    }

    router.push('/dashboard');
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h1 className="text-xl font-bold text-center mb-4">Iniciar Sesión</h1>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <div className="mb-4">
          <label className="block text-sm mb-1">Correo</label>
          <input
            type="text"
            {...register('correo', { required: 'Campo obligatorio' })}
            className="w-full px-3 py-2 border rounded"
          />
          {errors.correo && <span className="text-red-500 text-xs">{errors.correo.message}</span>}
        </div>

        <div className="mb-6">
          <label className="block text-sm mb-1">Contraseña</label>
          <input
            type="password"
            {...register('contrasena', { required: 'Campo obligatorio' })}
            className="w-full px-3 py-2 border rounded"
          />
          {errors.contrasena && <span className="text-red-500 text-xs">{errors.contrasena.message}</span>}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Ingresar
        </button>
      </form>
    </main>
  );
}

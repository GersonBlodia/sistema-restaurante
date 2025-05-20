'use client'

import { useForm } from 'react-hook-form'
import { useState } from 'react'

type FormData = {
  correo: string
}

export default function ForgotPasswordForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()
  const [message, setMessage] = useState('')

  const onSubmit = async (data: FormData) => {
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    const result = await res.json()
    if (res.ok) {
      setMessage(result.message)
    } else {
      setMessage(result.error)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-semibold mb-4">¿Olvidaste tu contraseña?</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium">Correo electrónico</label>
          <input
            type="email"
            {...register('correo', { required: 'El correo es obligatorio' })}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.correo && <p className="text-red-500 text-sm">{errors.correo.message}</p>}
        </div>
        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Enviar enlace de restablecimiento
        </button>
      </form>
      {message && <p className="mt-4 text-center text-sm text-gray-600">{message}</p>}
    </div>
  )
}

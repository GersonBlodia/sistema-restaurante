'use client'

import { useForm } from 'react-hook-form'
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type FormData = {
  nuevaContrasena: string
}

export default function ResetPasswordForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)

  const onSubmit = async (data: FormData) => {
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, ...data })
    })

    const result = await res.json()
    if (res.ok) {
      setMessage('Contraseña actualizada. Redirigiendo al inicio de sesión...')
      setSuccess(true)
    } else {
      setMessage(result.error || 'Token inválido o expirado.')
    }
  }

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        router.push('/login')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [success, router])

  if (!token) {
    return <p className="text-center text-red-600 mt-10">Token inválido o faltante.</p>
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-semibold mb-4">Restablecer contraseña</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium">Nueva contraseña</label>
          <input
            type="password"
            {...register('nuevaContrasena', { required: 'La contraseña es obligatoria' })}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.nuevaContrasena && <p className="text-red-500 text-sm">{errors.nuevaContrasena.message}</p>}
        </div>
        <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Cambiar contraseña
        </button>
      </form>
      {message && (
        <p
          className={`mt-4 text-center text-sm ${
            success ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {message}
        </p>
      )}
    </div>
  )
}

"use client"
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import Link from 'next/link';

interface SignupFormData {
  username: string;
  email: string;
  password: string;
  dni: string;
}

export const TravelSignupForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [activeQuote, setActiveQuote] = useState(0);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<SignupFormData>();
  
  const password = watch('password', '');
  
  const quotes = [
  "Una sonrisa saludable es el reflejo de una vida feliz.",
  "Cada visita al dentista es un paso hacia una mejor versión de ti.",
  "Tu sonrisa es tu mejor carta de presentación.",
  "La salud bucal es el primer paso hacia el bienestar integral.",
  "Cuidar tus dientes es cuidar tu futuro.",
  "Sonríe sin miedo, confía en tu dentista.",
  "Una boca sana abre puertas y corazones.",
  "La prevención hoy, es la sonrisa de mañana."
  ];

  // Animate entrance
  useEffect(() => {
    setIsVisible(true);
    
    // Quote rotation
    const interval = setInterval(() => {
      setActiveQuote((prev) => (prev + 1) % quotes.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Password strength calculation
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }
    
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 20;
    
    // Contains uppercase
    if (/[A-Z]/.test(password)) strength += 20;
    
    // Contains lowercase
    if (/[a-z]/.test(password)) strength += 20;
    
    // Contains number
    if (/[0-9]/.test(password)) strength += 20;
    
    // Contains special character
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;
    
    setPasswordStrength(strength);
  }, [password]);
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const getStrengthColor = () => {
    if (passwordStrength < 40) return 'bg-red-500';
    if (passwordStrength < 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  const getStrengthText = () => {
    if (passwordStrength < 40) return 'Weak';
    if (passwordStrength < 80) return 'Medium';
    return 'Strong';
  };

  const onSubmit = async (data: SignupFormData) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          correo: data.email,
          contrasena: data.password,
          dni: data.dni,
          userName:data.username
        })
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        alert(result.error || 'Error en el registro');
        return;
      }
  
      alert(result.message);
    } catch (error) {
      console.error('Error en el registro:', error);
      alert('Ocurrió un error inesperado. Intenta de nuevo.');
    }
  };

  return (
    <div className="flex min-h-screen bg-sky-50">
      <div className={`m-auto w-full max-w-4xl rounded-lg overflow-hidden flex flex-col md:flex-row shadow-xl transition-all duration-700 ease-in-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Left side - Form */}
        <div className="w-full md:w-1/2 p-8 bg-cover bg-center relative bg-white">
         
          <div className="relative z-10 text-amber-800">
            <div className={`mb-8 transition-all duration-700 delay-100 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
              <h1 className="text-3xl font-bold mb-2">Registrate a Odonto Masters</h1>
              <p className="text-sm text-gray-500">Comienza tu camino hacia una sonrisa saludable y una atención dental de calidad. Únete a nuestra comunidad y accede a servicios odontológicos de primer nivel.</p>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className={`transition-all duration-700 delay-200 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <input
                  id="username"
                  type="text"
                  className="w-full bg-transparent border-b border-gray-400 text-black px-1 py-2 focus:outline-none focus:border-white transition-colors placeholder-gray-400"
                  placeholder="Username"
                  {...register('username', { 
                    required: 'Username is required',
                    minLength: { value: 3, message: 'Username must be at least 3 characters' }
                  })}
                />
                {errors.username && (
                  <p className="mt-1 text-xs text-red-400">{errors.username.message}</p>
                )}
              </div>
              
              <div className={`transition-all duration-700 delay-300 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <input
                  id="dni"
                  type="text"
                  className="w-full bg-transparent border-b border-gray-400 text-black px-1 py-2 focus:outline-none focus:border-white transition-colors placeholder-gray-400"
                  placeholder="DNI"
                  {...register('dni', { 
                    required: 'DNI is required',
                    pattern: { value: /^[0-9]{8}$/, message: 'Invalid DNI format' }
                  })}
                />
                {errors.dni && (
                  <p className="mt-1 text-xs text-red-400">{errors.dni.message}</p>
                )}
              </div>
              
              <div className={`transition-all duration-700 delay-400 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <input
                  id="email"
                  type="email"
                  className="w-full bg-transparent border-b border-gray-400 text-black px-1 py-2 focus:outline-none focus:border-white transition-colors placeholder-gray-400"
                  placeholder="Email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' }
                  })}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
                )}
              </div>
              
              <div className={`transition-all duration-700 delay-500 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className="w-full bg-transparent border-b border-gray-400 text-black px-1 py-2 focus:outline-none focus:border-white transition-colors placeholder-gray-400"
                    placeholder="Create password"
                    {...register('password', { 
                      required: 'Password is required',
                      minLength: { value: 3, message: 'Password must be at least 8 characters' }
                    })}
                  />
                  <button 
                    type="button"
                    className="absolute right-1 top-2 text-gray-400 hover:text-white transition-colors"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
                )}
                
                {/* Password strength meter */}
                {password && (
                  <div className="mt-3 space-y-2">
                    <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getStrengthColor()} transition-all duration-300 ease-out`} 
                        style={{ width: `${passwordStrength}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-white">{getStrengthText()} password</p>
                    
                    {/* Password requirements */}
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      <div className="flex items-center gap-1">
                        {/[A-Z]/.test(password) ? 
                          <Check size={12} className="text-green-400" /> : 
                          <X size={12} strokeWidth={5}  className="text-red-400" />
                        }
                        <span>Uppercase letter</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {/[a-z]/.test(password) ? 
                          <Check size={12} strokeWidth={5} className="text-green-400" /> : 
                          <X size={12} strokeWidth={5}  className="text-red-400" />
                        }
                        <span>Lowercase letter</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {/[0-9]/.test(password) ? 
                          <Check size={12} strokeWidth={5} className="text-green-400" /> : 
                          <X size={12} strokeWidth={5}  className="text-red-400" />
                        }
                        <span>Number</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {/[^A-Za-z0-9]/.test(password) ? 
                          <Check size={12} strokeWidth={5} className="text-green-400" /> : 
                          <X size={12} strokeWidth={5}  className="text-red-400" />
                        }
                        <span>Special character (@, &, etc)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {password.length >= 8 ? 
                          <Check size={12} strokeWidth={5} className="text-green-400" /> : 
                          <X size={12} strokeWidth={5}  className="text-red-400" />
                        }
                        <span>At least 8 characters</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className={`pt-4 transition-all duration-700 delay-600 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <button
                  type="submit"
                  className="w-full bg-amber-800 cursor-pointer  hover:bg-orange-400 text-white font-medium py-3 rounded transition-colors"
                >
                  Registrate
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Right side - Quote */}
        <div className="w-full md:w-1/2 bg-amber-800 flex flex-col justify-between items-center p-8 relative overflow-hidden">
  <div
    className="absolute inset-0 bg-cover bg-center opacity-100"
    style={{
      backgroundImage: `
        linear-gradient(to bottom right, rgba(0, 0, 0, 0.6), rgba(255, 193, 7, 0.4)),
        url('/background-odontologia.jpg')
      `
    }}
  ></div>

  {/* Quotes section */}
  <div className="w-full h-full flex flex-col justify-center items-center relative z-10">
    <div className="text-6xl text-white opacity-40 mb-4">"</div>
    <div className="relative w-full h-24">
      {quotes.map((quote, index) => (
        <p
          key={index}
          className={`absolute top-0 left-0 w-full text-center text-2xl italic text-white font-light transition-all duration-1000 ease-in-out ${
            activeQuote === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {quote}
        </p>
      ))}
    </div>

    {/* Quote navigation dots */}
    <div className="flex gap-2 mt-8">
      {quotes.map((_, index) => (
        <button
          key={index}
          className={`w-2 h-2 rounded-full transition-all ${
            activeQuote === index ? 'bg-white w-4' : 'bg-gray-400'
          }`}
          onClick={() => setActiveQuote(index)}
        />
      ))}
    </div>
  </div>

  {/* Sign in link */}
  <div className="relative z-10 mt-8 text-right w-full">
    <Link href="/auth/log" className="text-white">
      ¿Ya tienes una cuenta? <span className="font-medium underline  hover:underline hover:text-sky-600">Inicia sesión</span>
    </Link>
  </div>
</div>

      </div>
    </div>
  );
};

 
"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
 
import toast from "react-hot-toast";
import { AlertWithModal } from "./AlertWithModal";
 
interface LoginFormData {
  correo: string;
  password: string;
  rememberMe: boolean;
}

export const LuxoraLoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(false);
  const [authError, setAuthError] = React.useState<string | null>(null);
  const [isActive, setIsActive] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();
  const router = useRouter();

  useEffect(() => {
    // Trigger animation after component mounts
    setIsVisible(true);
  }, []);

  const onSubmit = async (data: LoginFormData) => {
    const res = await signIn("credentials", {
      redirect: false,
      correo: data.correo,
      contrasena: data.password,
    });

    if (res?.error) {
      setAuthError("Hubo un error, usuario no encontrado");
      setIsActive(true); // Activamos el modal solo una vez
    
     
    }

    if (res?.ok) {
      setAuthError("");
      setIsActive(true); // Activamos el modal solo una vez
      toast.success("¡Inicio de sesión exitoso!");
      router.push("/dashboard");
    }
    // Here you would typically handle authentication
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  useEffect(() => {
    if (authError && isActive) {
      const timer = setTimeout(() => {
        setIsActive(false); // Cerramos el modal después de cierto tiempo
      }, 3000); // 3 segundos de espera antes de cerrar el modal
      return () => clearTimeout(timer);
    }
  }, [authError, isActive]);
  return (
    <div className="flex min-h-screen bg-sky-50">
      <div
        className={`m-auto w-full max-w-4xl rounded-3xl overflow-hidden flex flex-col md:flex-row bg-white shadow-xl transition-all duration-700 ease-in-out transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
      >
        {/* Left side - Form */}
        <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center">
          <div
            className={`mb-6 md:mb-10 transition-all duration-700 delay-100 transform ${isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
              }`}
          >
            <h1 className="text-xl   uppercase tracking-wider text-amber-900 font-bold">
              Odonto Master
            </h1>
          </div>

          <div
            className={`transition-all duration-700 delay-200 transform ${isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
              }`}
          >
            <h2 className="text-2xl font-medium text-gray-800 mb-2">
              Inicio de Sesión
            </h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div
              className={`transition-all duration-700 delay-500 transform ${isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
                }`}
            >
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                className={`w-full p-3 rounded-lg border ${errors.correo ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-amber-800 focus:border-transparent transition-all`}
                placeholder="johncanny@gmail.com"
                {...register("correo", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.correo && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.correo.message}
                </p>
              )}
            </div>

            <div
              className={`transition-all duration-700 delay-600 transform ${isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
                }`}
            >
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className={`w-full p-3 rounded-lg border ${errors.password ? "border-red-500" : "border-gray-300"
                    } focus:ring-2 focus:ring-amber-800 focus:border-transparent transition-all`}
                  placeholder="********"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 3,//poner 8
                      message: "Password must be at least 8 characters",
                    },
                  })}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div
              className={`flex items-center justify-between mb-6 transition-all duration-700 delay-700 transform ${isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
                }`}
            >
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  type="checkbox"
                  className="h-4 w-4 text-amber-800 rounded border-gray-300 focus:ring-amber-800 transition-colors"
                  {...register("rememberMe")}
                />
                <label
                  htmlFor="rememberMe"
                  className="ml-2 text-sm text-gray-600"
                >
                  Remember Me
                </label>
              </div>
              <a
               href="/auth/forgot-password"
                className="text-sm text-gray-600 hover:text-amber-800 transition-colors"
              >
               Olvidó la contraseña?
              </a>
            </div>

            <div
              className={`flex items-center justify-between mb-6 transition-all duration-700 delay-700 transform ${isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
                }`}
            >
              <p className="text-sm text-gray-400">
                Si no tienes una cuenta Registrate
              </p>
              <Link
                href="/auth/register"
                className="text-sm text-gray-600 underline  hover:text-amber-800 transition-colors"
              >
                Registrate
              </Link>
            </div>

            <div
              className={`transition-all duration-700 delay-800 transform ${isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
                }`}
            >
              <button
                type="submit"
                className="w-full bg-amber-800 text-white py-3 rounded-lg hover:bg-amber-900 hover:shadow-lg transform hover:-translate-y-0.5 transition-all font-medium"
              >
                Login
              </button>
            </div>
          </form>
        </div>

        {/* Right side - Image */}
        <div
          className={`w-full md:w-1/2 bg-amber-100 transition-all duration-1000 delay-300 ${isVisible ? "opacity-100" : "opacity-0"
            }`}
        >
          <div className="relative w-full h-60 md:h-full">
            <img
              src="https://previews.123rf.com/images/bezikus/bezikus1610/bezikus161000084/64291698-la-muchacha-encantadora-con-el-babero-paciente-en-una-silla-dental-y-dentista-que-est%C3%A1-sentado-a-su.jpg"
              alt="Dental care"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {authError && <AlertWithModal message={authError} estado={isActive}  />}
    </div>
  );
};

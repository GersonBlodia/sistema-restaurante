'use client';

import React, { useState, useEffect } from 'react';

import { CheckCircle, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { Toaster } from '../ui/sonner';
 
export const AlertWithModal: React.FC<{ estado: boolean; message: string }> = ({
  estado,
  message,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false); // Estado para controlar la visibilidad del toast

  useEffect(() => {
    if (estado && message && !toastVisible) {
      // Mostrar el toast solo una vez
      showToast(message);
      setToastVisible(true); // Marcar el toast como visible para evitar duplicaciones
    }
  }, [estado, message, toastVisible]);

  const showToast = (message: string) => {
    const isError = message.length > 0; // Si hay mensaje, es un error

    toast.custom((t) => (
      <div
        onClick={() => {
          toast.dismiss(t.id); // Dismiss el toast
          setIsOpen(true); // Abrir el modal solo cuando el toast es clickeado
        }}
        className={`max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 p-4 cursor-pointer transition-all animate-fade-in-up ${
          isError ? 'bg-red-50 ring-red-500' : 'bg-green-50 ring-green-500'
        }`}
      >
        <div className="flex-shrink-0">
          {isError ? (
            <AlertTriangle className="h-6 w-6 text-red-600" />
          ) : (
            <CheckCircle className="h-6 w-6 text-green-500" />
          )}
        </div>
        <div className="ml-3 w-0 flex-1">
          <p className="text-sm font-medium text-gray-900">
            {isError ? 'Error en la acción' : '¡Acción exitosa!'}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            {message || 'Haz clic para ver más detalles.'}
          </p>
        </div>
      </div>
    ));
  };

  return (
    <>
      {/* El <Toaster /> solo debe ir aquí una vez */}
      <Toaster position="top-center" />

       
    </>
  );
};

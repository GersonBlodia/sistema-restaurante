// store/useStore.ts
 import { ClienteType } from '@/types/cliente';
import { create } from 'zustand';



type useTypeStore = {
  data: ClienteType;
  onSubmitForm: (data: ClienteType)=>void;
 // onSubmitForm: (data: ClienteType, router: any) => Promise<void>;
};

export const useAppStoreForm = create<useTypeStore>((set,get) => ({
  data: {
    nombre: '',
    apellido: '',
    email: '',
    dni: 0,
    doctor: '',
    enfermedad: '',
    fechaRegistrada: new Date(),
    sintomas:[],
    telefono: 0,
    fechaCita:''
  }, //router pasar parametro 
  onSubmitForm: async (data) => {
    
    try {
      /*const res = await fetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        throw new Error('Error en la solicitud');
      } else {
        router.push('/auth/log');
      }*/
       
     console.log("Registrado desde el store", data)
    } catch (error) {
      set({ error: 'Hubo un error al enviar el formulario' });
      console.error('Error al enviar el formulario:', error);
    }
  }
}));

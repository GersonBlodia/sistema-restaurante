import { getPersonas } from "@/actions/persona/get-personas"
import { TablaPerson } from "@/components/dashboard/table/ComponentTablaPersona"
import { PersonFormModal } from "@/components/dashboard/table/PersonFormModal"

 
export default async function PersonManagement() {
  const personas = await getPersonas()

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Gestión de Personas</h2>
        <PersonFormModal />
      </div>

       <TablaPerson
        personas={personas}
       />
    </div>
  )
}
import { getEmpleado } from "@/actions/empleado/get-empleado"
import { EmpleadoTable } from "@/components/dashboard/empleado/TableEmpleado";

 
const EmpleadosPage = async() => {
 
  return (
    <div>
          <EmpleadoTable key={1}/>   
    </div>
  )
}

export default EmpleadosPage

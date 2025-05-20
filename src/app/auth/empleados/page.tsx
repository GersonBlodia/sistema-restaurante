import { getEmpleadosConPersona } from "@/actions/persona/get-empleado"

 
const PageEmpleados = async() => {
      const empleados = await getEmpleadosConPersona()

  return (
    <div>
          <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Lista de Empleados</h1>
      <ul className="space-y-2">
        {empleados.map((emp) => (
          <li key={emp.idEmpleado} className="border p-3 rounded shadow-sm">
            <p><strong>Nombre:</strong> {emp.persona?.nombre} {emp.persona?.apellido}</p>
            <p><strong>Rol:</strong> {emp.rol}</p>
            <p><strong>Teléfono:</strong> {emp.persona?.telefono}</p>
            <p><strong>DNI:</strong> {emp.persona?.dni}</p>
          </li>
        ))}
      </ul>
    </div>

    </div>
  )
}

export default PageEmpleados

interface Distrito {
    idProvincia: number;
    nombreDistrito: string;
}

export const DistritoData: Distrito[] = [
    // ====== PROVINCIA DE ICA (idProvincia: 1) ======
    {nombreDistrito: "Ica", idProvincia: 1 },
    {nombreDistrito: "La Tinguiña", idProvincia: 1 },
    {nombreDistrito: "Los Aquijes", idProvincia: 1 },
    {nombreDistrito: "Ocucaje", idProvincia: 1 },
    {nombreDistrito: "Pachacútec", idProvincia: 1 },
    {nombreDistrito: "Parcona", idProvincia: 1 },
    {nombreDistrito: "Pueblo Nuevo", idProvincia: 1 },
    {nombreDistrito: "Salas Guadalupe", idProvincia: 1 },
    {nombreDistrito: "San José de Los Molinos", idProvincia: 1 },
    { nombreDistrito: "San Juan Bautista", idProvincia: 1 },
    { nombreDistrito: "Santiago", idProvincia: 1 },
    { nombreDistrito: "Subtanjalla", idProvincia: 1 },
    { nombreDistrito: "Tate", idProvincia: 1 },
    { nombreDistrito: "Yauca del Rosario", idProvincia: 1 },

    // ====== PROVINCIA DE CHINCHA (idProvincia: 2) ======
    {  nombreDistrito: "Chincha Alta", idProvincia: 2 },
    {  nombreDistrito: "Alto Laran", idProvincia: 2 },
    {  nombreDistrito: "Chavín", idProvincia: 2 },
    {  nombreDistrito: "Chincha Baja", idProvincia: 2 },
    {  nombreDistrito: "El Carmen", idProvincia: 2 },
    {  nombreDistrito: "Grocio Prado", idProvincia: 2 },
    {  nombreDistrito: "Pueblo Nuevo", idProvincia: 2 },
    {  nombreDistrito: "San Juan de Yanac", idProvincia: 2 },
    {  nombreDistrito: "San Pedro de Huacarpana", idProvincia: 2 },
    {  nombreDistrito: "Sunampe", idProvincia: 2 },
    {  nombreDistrito: "Tambo de Mora", idProvincia: 2 },

    // ====== PROVINCIA DE PISCO (idProvincia: 3) ======
    { nombreDistrito: "Pisco", idProvincia: 3 },
    { nombreDistrito: "Huancano", idProvincia: 3 },
    { nombreDistrito: "Humay", idProvincia: 3 },
    { nombreDistrito: "Independencia", idProvincia: 3 },
    { nombreDistrito: "Paracas", idProvincia: 3 },
    { nombreDistrito: "San Andrés", idProvincia: 3 },
    { nombreDistrito: "San Clemente", idProvincia: 3 },
    { nombreDistrito: "Túpac Amaru Inca", idProvincia: 3 },

    // ====== PROVINCIA DE PALPA (idProvincia: 4) ======
    { nombreDistrito: "Palpa", idProvincia: 4 },
    { nombreDistrito: "Llipata", idProvincia: 4 },
    { nombreDistrito: "Río Grande", idProvincia: 4 },
    { nombreDistrito: "Santa Cruz", idProvincia: 4 },
    { nombreDistrito: "Tibillo", idProvincia: 4 },

    // ====== PROVINCIA DE NASCA (idProvincia: 5) ======
    { nombreDistrito: "Nasca", idProvincia: 5 },
    { nombreDistrito: "Changuillo", idProvincia: 5 },
    { nombreDistrito: "El Ingenio", idProvincia: 5 },
    { nombreDistrito: "Marcona", idProvincia: 5 },
    { nombreDistrito: "Vista Alegre", idProvincia: 5 }
];


export const FormattedDistritoData = DistritoData.map(d => ({
  ...d,
  
}));
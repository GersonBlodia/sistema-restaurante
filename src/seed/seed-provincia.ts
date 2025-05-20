interface Provincia {
 
    idDepartamento: number;
    nombreProvincia: string;
}

export const ProvinciaData: Provincia[] = [
    { nombreProvincia: "Ica", idDepartamento: 1 },
    { nombreProvincia: "Chincha", idDepartamento: 1 },
    { nombreProvincia: "Pisco", idDepartamento: 1 },
    { nombreProvincia: "Palpa", idDepartamento: 1 },
    { nombreProvincia: "Nasca", idDepartamento: 1 }
];

export const FormattedProvinciaData = ProvinciaData.map(p => ({
  ...p,
 
}));
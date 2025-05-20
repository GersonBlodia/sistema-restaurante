interface DepartamentoType {
  nombreDepartamento: string;
  idPais: number;
  estado?: boolean;
}

export const DepartamentoSeed: DepartamentoType[] = [
  { nombreDepartamento: 'Ica', idPais: 1 }
];

export const FormattedDepartamentoSeed = DepartamentoSeed.map(dep => ({
  ...dep,
 
}));
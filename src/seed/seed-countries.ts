 
interface Country {
 
    nombrePais: string;
}
  export const countries:Country[] = [
    { nombrePais: "Perú" }
  ];

 
// Si necesitas agregar `estado: true` o alguna transformación:
export const formCountries = countries.map((c) => ({
  ...c,
}));
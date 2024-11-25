import { Bored } from "./interfaces/Bored";
import { Imagen } from "./interfaces/imagen";

let objetoRecibido: Bored[][] = [];
let subArrayActividades: Bored[];
let nombreActividad: string;
let imagenGenerada!: Imagen;
let tipoActividad: string;

const key = "47131435-27bc4920790a52b4dfb436a62";

export async function getDatosActividad(event: Event) {
  event.preventDefault();
  tipoActividad = (
    document.getElementById("tipoActividad") as HTMLSelectElement
  ).value;
  let numeroParticipantes: string = (
    document.getElementById("participantes") as HTMLInputElement
  ).value;

  await hacerPeticion(tipoActividad, numeroParticipantes);
  nombreActividad = getActividadRandom();
  await hacerPeticionFoto();

  const domNombreActividad = document.getElementById("nombreActividad");
  domNombreActividad!.innerHTML = nombreActividad;

  const imagen = document.getElementById("imagenGenerada") as HTMLImageElement;
  if (
    imagenGenerada.hits &&
    imagenGenerada.hits[0] &&
    imagenGenerada.hits[0].largeImageURL
  ) {
    imagen.setAttribute("src", imagenGenerada.hits[0].largeImageURL);
  } else {
    console.error("La imagen generada no está disponible.");
  }
}

document
  .getElementById("actividadForm")
  ?.addEventListener("submit", getDatosActividad);

async function hacerPeticion(
  tipoActividad: string,
  numeroParticipantes: string
): Promise<void> {
  try {
    const response = await fetch(
      `/api/filter?type=${tipoActividad}&participants=${numeroParticipantes}`
    );
    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.statusText}`);
    }
    const data = await response.json();
    objetoRecibido = [];
    subArrayActividades = [];
    objetoRecibido = [data];
    console.log(objetoRecibido);
  } catch (error) {
    console.error("Error al hacer la petición:", error);
    const tituloNoEncontrado = document.getElementById("nombreActividad");
    tituloNoEncontrado!.innerHTML =
      "Se ha producido un error al buscar la actividad";
    const imagen = document.getElementById(
      "imagenGenerada"
    ) as HTMLImageElement;
    imagen.setAttribute("src", "/error.jpg");
    objetoRecibido = [];
    subArrayActividades = [];
    const elementoPrecio = document.getElementById("precio");
    const imagenExistente = elementoPrecio!.querySelector("img");
    const parrafoExistente = elementoPrecio!.querySelector("p");
  
    if (imagenExistente) {
      elementoPrecio!.removeChild(imagenExistente);
    }
    if (parrafoExistente) {
      elementoPrecio!.removeChild(parrafoExistente);
    }
  }
}

function getActividadRandom(): string {
  subArrayActividades = objetoRecibido[0];
  const longitudArray = subArrayActividades.length;
  const numeroRandom = Math.floor(Math.random() * longitudArray);
  const precioActividad = subArrayActividades[numeroRandom].price;
  ponerIconoPrecio(precioActividad);
  return subArrayActividades[numeroRandom].activity;
}
//funcion para poner el icono y el parrafo con el precio
function ponerIconoPrecio(precioActividad: number): void {
  const elementoPrecio = document.getElementById("precio");
  const imagenExistente = elementoPrecio!.querySelector("img");
  const parrafoExistente = elementoPrecio!.querySelector("p");

  if (imagenExistente) {
    elementoPrecio!.removeChild(imagenExistente);
  }
  if (parrafoExistente) {
    elementoPrecio!.removeChild(parrafoExistente);
  }

  const imagenPrecio = document.createElement("img");
  const parrafoPrecio = document.createElement("p");

  switch (precioActividad) {
    case 0:
      imagenPrecio.setAttribute("src", "/free.svg");
      imagenPrecio.setAttribute("width", "25px");
      parrafoPrecio.textContent = "Gratis";
      break;

    default:
      imagenPrecio.setAttribute("src", "/money.svg");
      imagenPrecio.setAttribute("width", "25px");
      parrafoPrecio.textContent = "Cuesta algo de dinero";
      break;
  }

  // Añadir nuevos elementos
  elementoPrecio!.appendChild(imagenPrecio);
  elementoPrecio!.appendChild(parrafoPrecio);
}

async function hacerPeticionFoto(): Promise<void> {
  try {
    const resp = await fetch(
      `https://pixabay.com/api/?q=${tipoActividad}&key=${key}&per_page=3`
    );
    const data = await resp.json();
    imagenGenerada = data;
    console.log(imagenGenerada.hits[0].largeImageURL);
  } catch (error) {
    console.error("Error al hacer la petición de la imagen", error);
    const imagen = document.getElementById(
      "imagenGenerada"
    ) as HTMLImageElement;
    imagen.setAttribute("src", "/error.jpg");
  }
}

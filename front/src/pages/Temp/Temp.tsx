import GameCard from "../../components/GameCard/GameCard";



export default function Temp() {
  //0, "Monkey D. Luffy", "Personaje", 10, 5, 3, "Gomu Gomu no Pistol", "Sombrero de Paja"
  const carta = {
    id: 8,
    nombre: "Monkey D. Luffy",
    tipo: "Personaje",
    ataque: 10,
    defensa: 5,
    energia: 3,
    habilidad: "Gomu Gomu no Pistol",
    tripulacion: "Sombrero de Paja",
  }
  return (
    <>
      <p>PAGINA DE PRUEBAS</p>
      <GameCard {...carta} disabled={false} onClick={() => alert("CLICK")} />
    </>
  )
}


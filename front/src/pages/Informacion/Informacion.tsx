


export default function Informacion() {


  return (
    <>
      <h1>Jugadores:</h1>
      El juego permanecerá en espera hasta que se conecten un total de 2 jugadores.

      <h1>Tripulaciones:</h1>
      El jugador tendrá una de las dos tripulaciones definidas: Sombrero de Paja o Marina.

      <h1>Mazo:</h1>
      Cada mazo está compuesto por cartas que dependen de la tripulación escogída por el usuario y por unas cartas mágicas comunes para ambas tripulaciones.
      Cada mazo tendrá:
      <ul>
        <li>Cartas de personaje</li>
        <li>Cartas de campo</li>
        <li>Cartas mágicas</li>
      </ul>

      <h3>Cartas de personaje:</h3>
      Se representan con el color rojo.
      Representan a los personajes principales de One Piece (por ejemplo Luffy, Nami, Zoro, etc para la tripulacion de los Sombrero de Paja o Akainu, Kizaru, etc. Para la tripulacion de la Marina)
      Tienen atributos de ataque, defensa y energía.

      <h3>Cartas de campo:</h3>
      Se representan con el color verde.
      Cada carta de campo permite aumentar el maná del jugador en 1 por cada carta de campo que baje al tablero.
      Dicho maná será el que necesite para efectuar un ataque.
      Por ejemplo, si una carta de personaje tiene 3 puntos de energía pero el jugador tiene solo 1 punto de maná (el equivalente a tener una carta de campo en el tablero), no podrá atacar con ella.

      <h3>Cartas mágicas:</h3>
      Se representan con el color morado.
      Se divide en dos tipos de cartas mágicas:
      -	Las cartas que efectuan una acción sobre un jugador
      -	Las cartas que efectuan una acción sobre una carta de personaje.

      La habilidad de esta carta se efectua en el mismo momento en el que se baja al tablero.



      <h1>Mecánicas del Juego:</h1>
      <h3>Costes de invocación</h3>
      El número de cartas de campo que tengas en tu tablero determinará los costes de ataque disponibles.

      <h3>Invocación de Personajes:</h3>
      Tienen costos de energía y atributos que determinan su fuerza y resistencia.
      Durante el primer turno de partida no podrán atacar.


      <h1>Cada turno</h1>
      Robarás una carta y podrá bajarse al tablero una carta de campo y una carta de personaje o mágica y efectuar un ataque del que el enemigo podrá defenderse.


      <h1>Objetivo del Juego:</h1>

      Reducir los puntos de vida del oponente a cero.



      <h1>Fases del Turno:</h1>

      <h3>Fase de Robo:</h3>
      El jugador roba una carta al inicio de su turno.

      <h3>Fase Bajar campo:</h3>
      Baja una carta de campo de la mano al tablero.

      <h3>Fase Bajar no campo:</h3>
      Baja una carta de personaje o mágica de la mano al tablero.

      <h3>Fase Efectuar habilidad mágica:</h3>
      En caso de bajar una carta mágica que efectúe una acción sobre otra carta, se elegirá a que carta se le aplicará.


      <h3>Fase de Ataque:</h3>
      Permite atacar con una carta de personaje del tablero del jugador actual.

      <h3>Fase de Defensa:</h3>
      En caso de recibir un ataque, permite defenderse con una carta de personaje del tablero del jugador que recibe el ataque.

    </>
  )
}


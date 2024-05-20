import { useState } from 'react';
import './GameCard.css'
import { Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material';

interface ICardProps {
  id: number,
  nombre: string,
  tipo: string,
  ataque: number,
  defensa: number,
  energia: number,
  habilidad: string,
  tripulacion: string,
  disabled: boolean,
  img: string,
  onClick: () => void
}

export default function GameCard(props: ICardProps) {
  const [estaSeleccionado, setEstaSeleccionado] = useState(false)

  const getBotonEstilos = () => {
    let styles = `no-button ${props.tipo}`;

    if (props.disabled) styles = `${styles} cursor-default`
    else styles = `${styles} cursor-pointer`

    if (estaSeleccionado) styles = `${styles} button-lg`
    else styles = `${styles} button-xs`

    return styles
  }


  return (
    <>
      <button className={getBotonEstilos()} disabled={props.disabled} onMouseOver={() => setEstaSeleccionado(true)} onMouseOut={() => setEstaSeleccionado(false)}>
        <Card sx={estaSeleccionado ? { width: 250, height: 320 } : { width: 125, height: 160 }} className='game-card' onClick={() => props.onClick()}>
          <CardMedia
            component="img"
            alt={props.nombre}
            height={estaSeleccionado ? "140" : '120'}
            image={`./src/assets/cards/${props.img}`}
          />
          {estaSeleccionado && (
            <>
              <CardContent className="content-carta">
                <Typography gutterBottom variant="h5" component="div" textAlign="center">
                  {props.nombre}
                </Typography>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  {props.habilidad}
                </Typography>
              </CardContent>
            </>)}
          <CardActions className='footer-carta'>
            <div className={estaSeleccionado ? 'puntuacion-carta ataque' : 'puntuacion-carta ataque xs'} >
              <span>
                {props.ataque}
              </span>
            </div>
            <div className={estaSeleccionado ? 'puntuacion-carta energia' : 'puntuacion-carta energia xs'} >
              <span>
                {props.energia}
              </span>
            </div>
            <div className={estaSeleccionado ? 'puntuacion-carta defensa' : 'puntuacion-carta defensa xs'} >
              <span>
                {props.defensa}
              </span>
            </div>
          </CardActions>
        </Card>
      </button >
    </>
  );
}


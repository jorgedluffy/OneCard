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
  onClick: () => void
}

export default function GameCard(props: ICardProps) {
  return (
    <>
      <button className={props.disabled ? `no-button ${props.tipo} cursor-default` : `no-button ${props.tipo} cursor-pointer`} disabled={props.disabled}>
        <Card sx={{ width: 250, height: 320 }} className='game-card' onClick={() => props.onClick()}>
          <CardMedia
            component="img"
            alt={props.nombre}
            height="140"
            image={`./src/assets/cards/${props.id}.png`}
          />
          <CardContent className='content-carta'>
            <Typography gutterBottom variant="h5" component="div" textAlign="center">
              {props.nombre}
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              {props.habilidad}
            </Typography>
          </CardContent>
          <CardActions className='footer-carta'>
            <div className='puntuacion-carta ataque'>
              <span>
                {props.ataque}
              </span>
            </div>
            <div className='puntuacion-carta energia'>
              <span>
                {props.energia}
              </span>
            </div>
            <div className='puntuacion-carta defensa'>
              <span>
                {props.defensa}
              </span>
            </div>
          </CardActions>
        </Card>
      </button>
    </>
  );
}



import { Toolbar, IconButton, Box, Button } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import oneGif from '../../assets/logo2.gif';
import { socket } from '../../App'
import './Principal.css';
import { useNavigate } from 'react-router-dom';
import { TRIPULACIONES } from '../../constants';


export default function Principal() {
  const navigate = useNavigate();

  const irAInfo = () => {
    navigate("/informacion");
  }


  const irAJuego = (trip) => {
    socket.emit('listoParaJugar', trip)
    navigate("/juego");
  }


  return (
    <>

      <div className="container">
        <Toolbar>
          <IconButton edge="end" size="large" aria-label="info" onClick={() => irAInfo()}>
            <InfoIcon className="icon" style={{ fontSize: '4rem' }} />
          </IconButton>
        </Toolbar>

        <img src={oneGif} alt="ONE CARD GIF" className="gif" />

        <h1>
          Escoje tu tripulación
        </h1>

        <Box mt={4} display="flex" justifyContent="center" gap={30}>
          <Button variant="contained" size="large" color="primary" onClick={() => irAJuego(TRIPULACIONES.SOMBRERO_PAJA)}>
            <span className='texto-btn'>SOMBRERO <br /> DE PAJA</span>
          </Button>
          <Button variant="contained" size="large" color="secondary" onClick={() => irAJuego(TRIPULACIONES.MARINA)}>
            <span className='texto-btn'>MARINA</span>

          </Button>
        </Box>
      </div>
    </>
  )
}


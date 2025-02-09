import { Link } from 'react-router-dom'
import { Typography } from '@mui/material'

const Logo = () => {
  return (
    <div style={{display: 'flex', marginRight: 'auto', alignItems: 'center', gap: '8px',}}>
        <Link to ={"/"}>
            <img src="/Logo.png" alt="logo" width={"80px"} height={"50px"} className='image-inverted'/>
        </Link>
        <Typography sx={{display:{ md: "block", sm: "none", xs: "none"}, mr: "auto", fontWeight: "800", textShadow: "2px 2px 20px #000"}}><span style={{fontSize: "20px"}}>Gator</span>.ai
        </Typography>
    </div>
  )
}

export default Logo
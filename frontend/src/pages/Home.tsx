import { Box, useMediaQuery, useTheme } from '@mui/material'
import TyppingAnim from '../components/typer/TyppingAnim'
import Footer from '../components/footer/footer';

const home = () => {
  const theme = useTheme();
  const isBelowMd = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <Box width={'100%'} height={'100%'}>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          flexDirection: 'column',
          alignItems: 'center',
          mx: 'auto',
          mt: 3,
        }}>
          <Box>
            <TyppingAnim/>
          </Box>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: {md: "row", xs: "column", sm:"column"},
              gap: 5,
              my: 10,
            }}>
              <img src='/gatorhome.png' alt='gator' style={{ width: '200px', margin: 'auto'}}/>
              <img src='/ufhomelogo.png' alt='uflogo' className='rotate' style={{ width: '200px', margin: 'auto'}}/>
          </Box>
          <Box sx={{ display: "flex", width: "100%", mx:"auto"}}>
            <img 
              src="/chat.jpg" 
              alt="chat" 
              style={{
                display: "flex",
                margin: "auto",
                width: isBelowMd? "80%":"60%",
                borderRadius: 20,
                boxShadow: "-5px -5px 105px #64f3d5",
                marginTop: 20,
                marginBottom: 30,
              }}
              />
          </Box>
          <Footer/>
      </Box>

    </Box>
  )
}

export default home
import React, { useEffect } from 'react'
import { Box, Typography, Button } from '@mui/material'
import CustomizedInput from '../components/shared/customizedInput'
import {IoIosLogIn} from "react-icons/io"
import { toast } from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom';


const login = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    try {
      toast.loading("Signing In", {id: "login"});
      await auth?.login(email, password);
      toast.success("Signed in successfully", {id: "login"});
    } catch (error) {
      console.log(error);
      toast.error("Signing In Failed", {id: "login"});  
    }
  };

  useEffect(() => {
    if (auth?.user) {
      navigate("/chats");
    }
  }, [auth]);

  return (
    <Box width={"100%"} height={"100%"} display={"flex"} flex={1}>
      <Box padding={8} mt={8} display={{md: "flex", sm: "none", xs:"none"}} >
        <img src="/Gatorai.png" alt="Gatorai" style={{width:"400px"}} />
      </Box>
      <Box 
        display={"flex"} 
        flex={{xs: 1, md: 0.5 }} 
        justifyContent={"center"} 
        alignItems={"center"} 
        padding={2}
        ml={"auto"}
        mt={16}
      > 
        <form 
          onSubmit={handleSubmit}
          style={{
            margin: "auto",
            padding: "30px",
            boxShadow: "10px 10px 20px #000",
            borderRadius: "10px",
            border: "none",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography 
              variant='h4'
              textAlign={"center"}
              padding={2}
              fontWeight={"600"}
            >
              Login
            </Typography>
            <CustomizedInput type= "email" label="Email" name="email" />
            <CustomizedInput type= "password" label="Password" name="password" />
            <Button 
              type='submit'
              sx={{
                px: 2,
                py: 1,
                mt: 2,
                width: "428px",
                borderRadius: 2,
                backgroundColor: "#00fffc",
                ":hover": {
                  bgcolor: "white",
                  color: "black"
                },
              }}
              endIcon={<IoIosLogIn />}
            >Login</Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default login;
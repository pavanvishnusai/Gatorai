import { Avatar, Box, Typography, Button, IconButton } from '@mui/material';
import red from '@mui/material/colors/red';
import { useAuth } from '../contexts/AuthContext';
import ChatItem from '../components/chat/ChatItem';
import {IoMdSend} from 'react-icons/io';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { deleteUserChats, getUserChats, sendChatRequest } from '../helpers/api-communicator';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/footer/footer';

type Message = {
  content: string;
  role: "user" | "assistant";
}
const chats = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const auth = useAuth();
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const handleSubmit = async() => {
    const content = inputRef.current?.value as string;
    if (inputRef && inputRef.current){
      inputRef.current.value = "";
    }
    const newMessage: Message = {content, role: "user"};
    setChatMessages((prev) => [...prev, newMessage]);
    const chatData = await sendChatRequest(content);
    setChatMessages([...chatData.chats]);
  };

  const handleDeleteChats = async() => {
    try {
      toast.loading("Deleting Chats", {id: "deletechats"});
      await deleteUserChats();
      setChatMessages([]);
      toast.success("Deleted chats Successfully", {id: "deletechats"});
    } catch (error) {
      console.log(error);
      toast.error("Deleting chats failed", {id: "deletechats"});
    }
  };

  useLayoutEffect(() => {
    if (auth?.isLoggedIn && auth.user) {
      toast.loading("Loading Chats", {id: "LoadChats"});
      getUserChats().then((data) => {
        setChatMessages([...data.chats]);
        toast.success("Successfully loaded chats", {id: "LoadChats"});
      }).catch(err =>{
        console.log(err);
        toast.error("Loading Failed", {id: "LoadChats"})
      });
    }
  }, [auth]);

  useEffect(() => {
    if (!auth?.user) {
      navigate("/login");
    }
  }, [auth]);

  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        width: "100%",
        height: "100%",
        mt: 3,
        gap: 3,
      }}>
        <Box sx={{display: {md:'flex', xs:'none', sm:'none'}, flexDirection: "column", flex: 0.2}}>
          <Box
            sx={{
              display: "flex",
              width: "100%",
              height: "70vh",
              bgcolor: "rgb(17,29,39)",
              borderRadius: 5,
              flexDirection: "column",
              mx: 3,
              overflow: "scroll", 
              overflowX: "hidden", 
              overflowY: "auto"
            }}
          >
            <Avatar sx={{mx: "auto", my:2, bgcolor:"white", color:"black", fontWeight:700,}}>
              {auth?.user?.name ? auth.user.name[0] : "?"}
              {auth?.user?.name ? auth.user.name.split("")[1][0]: "?"}
            </Avatar>
            <Typography sx={{mx:"auto", fontFamily: "work-sans"}}>
              You are talking with GatorAI. 
            </Typography>
            <Typography sx={{mx:"auto", fontFamily: "work-sans", my:4, p:3}}>
            You can ask Gator AI about programming, coding issues, education, knowledge, business, advice, weather, and day-to-day topics. Gator AI is here to assist!
            <br />
            Note: Please do not share personal information. This AI is designed for general assistance and is created by Pavan Vishnu Sai Bestha. 🚀
            </Typography>
            <Button
              onClick={handleDeleteChats}
              sx={{
                mx: "auto",
                width: "200px",
                color: "white",
                fontWeight: 700,
                borderRadius: 3,
                bgcolor: red[300],
                ":hover": {
                  bgcolor: red.A400,
                },
              }}>Clear Conversation</Button>
            
          </Box>
        </Box>
        <Box sx={{display: "flex", flex:{md:0.8, xs:1, sm:1} , flexDirection: "column", px: 3}}>
          <Typography sx={{textAlign:"center", fontSize: 40, color: "white", mb:2, mx:"auto"}}>
            Gator.ai Assistant 🐊
          </Typography>
          <Box sx={{
            width: "100%",
            height: "70vh",
            display: "flex",
            flexDirection: "column",
            overflow: "scroll",
            overflowX: "hidden",
            overflowY: "auto",
            scrollBehavior: "smooth",
            mx: "auto",
            borderRadius: 3,
          }}>
       
          {chatMessages.map((chats, index) => (
            //@ts-ignore
            <ChatItem content = {chats.content} role= {chats.role} key={index}/>))} 
          </Box>
          <div style={{width: "100%", borderRadius:8, backgroundColor:"rgb(47, 47, 47)", display: "flex", margin: "auto", borderColor:'white'}}>
            {""}
            <input 
              ref={inputRef}
              type="text" 
              style={{
                width: "100%",
                backgroundColor: "transparent",
                padding: "20px",
                border: "none",
                outline: "none",
                color: "white",
                fontSize: "20px",
              }}/>
              <IconButton onClick={handleSubmit} sx={{ml:"auto", color:"white", mx: 3}}><IoMdSend/></IconButton>
          </div>
        </Box>
    </Box>
  );
};

export default chats;
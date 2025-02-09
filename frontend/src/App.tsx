import Header from "./components/Header";
import { Routes, Route} from "react-router-dom";
import Home from "./pages/Home.tsx"
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import NotFound from "./pages/NotFound.tsx";
import Chats from "./pages/Chats.tsx";
import { useAuth } from "./contexts/AuthContext.tsx";

function App() {
  const auth = useAuth();
  return (<main>
    <Header />
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      {auth?.isLoggedIn && auth.user && (
        <Route path="/chats" element={<Chats />} />
      )}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </main>)
};

export default App


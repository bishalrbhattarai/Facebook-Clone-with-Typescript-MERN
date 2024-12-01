import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import CreateAccount from "./pages/CreateAccount";
import Profile from "./pages/Profile";
import Layout from "./Layout";
import UserProfile from "./pages/UserProfile";
import { SocketProvider } from "./context/socketContext";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout wrapper route for authenticated pages */}
        <Route path="/" element={<Layout />}>
          {/* Wrap only the routes that need the socket context */}
          <Route
            index
            element={
              <SocketProvider>
                <Home />
              </SocketProvider>
            }
          />
          <Route
            path="profile"
            element={
              <SocketProvider>
                <Profile />
              </SocketProvider>
            }
          />
          <Route
            path="profile/:id"
            element={
              <SocketProvider>
                <UserProfile />
              </SocketProvider>
            }
          />
        </Route>

        {/* These routes don't need the SocketProvider */}
        <Route path="/login" element={<Login />} />
        <Route path="/create-account" element={<CreateAccount />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

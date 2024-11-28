import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import CreateAccount from "./pages/CreateAccount";
import Profile from "./pages/Profile";
import Layout from "./Layout";
import UserProfile from "./pages/UserProfile";
import Flex from "./component/Flex";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
function App() {
  return (
    <>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <Routes>
            <Route path="/flex" element={<Flex />} />

            <Route path="/" element={<Layout />}>
              <Route path="profile" element={<Profile />} />
              <Route path="profile/:id" element={<UserProfile />} />

              {/* <Route path="example" element= /> */}

              <Route path="/" element={<Home />} />
            </Route>

            <Route path="/login" element={<Login />} />
            <Route path="/create-account" element={<CreateAccount />} />
          </Routes>
        </QueryClientProvider>
      </BrowserRouter>
    </>
  );
}

export default App;

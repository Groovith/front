import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./pages/Main";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Search from "./pages/Search";
import Chat from "./pages/Chat";
import Setting from "./pages/Setting";
import User from "./pages/User";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Callback } from "./pages/Callback";
import ResetPassword from "./pages/ResetPassword";
import ChatRoomPage from "./pages/ChatRoomPage";
import ChangePassword from "./pages/ChangePassword";
import SettingDetailsPage from "./pages/settings/SettingDetailsPage";
import ChangePasswordPage from "./pages/settings/ChangePasswordPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />}>
            <Route path="/search" element={<Search />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/chat/:chatRoomId" element={<ChatRoomPage />} />
            <Route path="/user/:username" element={<User />} />
            <Route path="/setting" element={<Setting />} />
            <Route element={<SettingDetailsPage />}>
              <Route path="/setting/change-password" element={<ChangePasswordPage />} />
            </Route>
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/callback" element={<Callback />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

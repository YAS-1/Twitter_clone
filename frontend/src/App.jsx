import { Route, Routes } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";
import NotificationPage from "./pages/notification/notification";
import ProfilePage from "./pages/profile/ProfilePage";

import { Toaster } from "react-hot-toast";


function App() {
    return(
        <>
            <div className="flex mx-auto max-w-6xl">
              <Sidebar/>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/notifications" element={<NotificationPage />} />
                <Route path="/profile/:username" element={<ProfilePage />} />
              </Routes> 
              <RightPanel/>
              <Toaster />
            </div>
        </>
    );
}

export default App

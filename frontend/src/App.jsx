import { Navigate, Route, Routes } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";
import NotificationPage from "./pages/notification/notification";
import ProfilePage from "./pages/profile/ProfilePage";

import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/common/LoadingSpinner";


function App() {

  // getting the user who is currently logged in
  const { data:authUser, isLoading, error, isError} = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
            const res =  await fetch ("/api/auth/me");
            const data =  await res.json();

            if (!res.ok){throw new Error(data.error || "Something went wrong");}
            console.log("authUser is here", data);
            return data;
      } catch (error) {
        throw new Error(error);
      }
    }
  });

  if(isLoading){
    return (
      <div className=" h-scree flex justify-center items-center">
        <LoadingSpinner size="lg"/>
      </div>
    )
  }
    return(
        <>
            <div className="flex mx-auto max-w-6xl">
              <Sidebar/>
              <Routes>
                <Route path="/" element={ authUser ? <HomePage /> : <LoginPage/>} />
                <Route path="/signup" element={ !authUser ? <SignUpPage /> : <HomePage/>} />
                <Route path="/login" element={ !authUser ? <LoginPage /> : <HomePage/>} />
                <Route path="/notifications" element={authUser ? <NotificationPage /> : <LoginPage/>} />
                <Route path="/profile/:username" element={ authUser ? <ProfilePage /> : <LoginPage/>} />
              </Routes> 
              <RightPanel/>
              <Toaster />
            </div>
        </>
    );
}

export default App

"use client";
import {SessionProvider} from "next-auth/react"
// import UserButton from "@/components/user-button";
// import Chat from "@/components/chat";
import HomePage from '@/components/homePage';

const Home = () => {
  return (
    <div>
      <SessionProvider>
        {/* <UserButton /> */}
        <HomePage/>
        {/* <Chat/> */}
      </SessionProvider>
    </div>
  );
};

export default Home;
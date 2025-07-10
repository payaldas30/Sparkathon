"use client";
import {SessionProvider} from "next-auth/react"
// import UserButton from "@/components/user-button";
import Chat from "@/components/chat";

const Home = () => {
  return (
    <div>
      <SessionProvider>
        {/* <UserButton /> */}
        <Chat/>
      </SessionProvider>
    </div>
  );
};

export default Home;
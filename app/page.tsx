import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Header from "./_shared/Header";
import Hero from "./_shared/Hero";

export default function Home() {
  return (
    <div>
      <Header/>
      <Hero/>
      <div className="absolute -top-40 -left-40 
      h-[500px] w-[500px] bg-purple-400/20 blur-[120px] rounded-full"/>

      <div className="absolute -top-40 right-15 
      h-[500px] w-[500px] bg-pink-400/20 blur-[120px] rounded-full"/>

      <div className="absolute -bottom-10 left-10 
      h-[500px] w-[500px] bg-red-400/20 blur-[120px] rounded-full"/>

      <div className="absolute -bottom-4 right-60
      h-[500px] w-[500px] bg-blue-400/20 blur-[120px] rounded-full"/>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <h2>Hello bisahhhh</h2>
       <Button>Checkin it</Button>
       <UserButton/>
    </div>
  );
}

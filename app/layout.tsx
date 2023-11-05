"use client";

import "./globals.css";
import { Suspense } from "react";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import Link from "next/link";
import Loading from "./loading";
import { ModeToggle } from "@/components/dropdown";
import axios from 'axios';
import {
  ChevronRight,
  Tally3 as IconComponent,
  LogOut,
  ArrowBigDownDash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { useState, useEffect } from "react";
import { useWalletLogin } from "@lens-protocol/react-web";
import { useLogin } from "@privy-io/react-auth";
import { useWallets } from "@privy-io/react-auth";
import LensProvider from "./LensProvider";
import PrivyProvider from "./PrivyProvider";
import { useTheme } from "next-themes";
import background from "./background.png";
import Image from 'next/image'
const inter = Inter({ subsets: ["latin"] });
import { ParallaxProvider } from 'react-scroll-parallax'
import { isMobile } from "react-device-detect";

export default function RootLayout({ children }) {
  const { setTheme } = useTheme();
  setTheme("dark");
 
  return (
    <html lang="en">
      {/* PWA config */}
      <link rel="manifest" href="/manifest.json" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Magic Internet Frens" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/images/icons/iconmain-512x512.png" />
      <link rel="stylesheet" href="https://use.typekit.net/cfd5noi.css"/>

      <meta name="theme-color" content="#000000" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black" />

      <body className={inter.className} >
       <div  style={{zIndex:-1,position:"absolute",height: isMobile ?"130%":"150%",width:"110%",top:"-10px",left:"-25px"}}>
       <Image
      src="/background.svg"
      width={2000}
      height={500}
      alt="Picture of the author"
      priority={true}
      style={{zIndex:-1,position:"absolute",height:"200%",width:"110vw",objectFit:"cover"}}
    />
        </div>
     
        <PrivyProvider>
          <LensProvider>
          <Nav />
          <ParallaxProvider scrollAxis='vertical'>
          <Suspense fallback={<Loading />}>{children}</Suspense>
              </ParallaxProvider>
          </LensProvider>
        </PrivyProvider>
   
      </body>
    </html>
  );
}


function Nav() {
  const pathname = usePathname();
  const { logout, user } = usePrivy();
  const [isInstalled, setIsInstalled] = useState(false);
  const [picLink, setPicLink] = useState("");
  const [deferredPrompt, setDeferredPrompt] = useState<any>();
  const { execute: loginWithLens } = useWalletLogin();
  const { wallets } = useWallets();

  const { login } = useLogin({
    onComplete: async (user) => {
      console.log("wallets in useLogin: ", wallets);
      // if (!wallets[0]) return
      if (!user.wallet) return;
      console.log("user: ", user);
      getAddress();
      console.log("piclink",picLink)
      const loggedIn = await loginWithLens({
        // address: wallets[0].address,
        address: user.wallet?.address,
      });
      console.log("loggedIn: ", loggedIn);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
  });  
   async function getAddress() {
    if (user?.twitter){
    const response = await axios.get('https://prod-api.kosetto.com/search/users', {
params: {
  'username': user?.twitter.username
},
headers: {
  'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZGRyZXNzIjoiMHg4YmNkZTEzZTQ0ODBmMDQ2MDhiMjczZjlhOThkZjJjNTQwNjYyZTg3IiwiaWF0IjoxNjk1MTU1NTI2LCJleHAiOjE2OTc3NDc1MjZ9.Dn0zDCO8mmgXwIEW7PrNMucbJQEO1wergvOewtRjZCw',
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Referer': 'https://www.friend.tech/'
}
});
setPicLink(response.data.users[0].twitterPfpUrl);
console.log("profilepic:",picLink)
}

  };

  useEffect(() => {
 
    getAddress();
    window.addEventListener("DOMContentLoaded", () => {
      let displayMode = "browser tab";
      if (window.matchMedia("(display-mode: standalone)").matches) {
        displayMode = "standalone";
        setIsInstalled(true);
      }

      // Log launch display mode to analytics
      console.log("DISPLAY_MODE_LAUNCH:", displayMode);
    });
  }, []);
  async function addToHomeScreen() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        setIsInstalled(true);
      } else {
        console.log("User dismissed the A2HS prompt");
      }
      setDeferredPrompt(null);
    });
  }
  
  
  return (
    <nav
      className="
 flex
    flex-col sm:flex-row
    items-start sm:items-center
    sm:pr-10
    "
    style={{borderRadius:"10px",backdropFilter: " blur(4px)",background: "linear-gradient(145deg, rgba(213,213,230,0.0), rgba(250,250,250,0.0))", boxShadow:  "18px 18px 36px rgba(213,213,230,0.2), -18px -18px 36px  rgba(254,254,254,0.2))"}}
    
    >
      <div
        className="
        sm:px-8
        py-3 px-4 flex flex-1 items-center p"
        style={{marginTop:"3%"}}
      >

    

        
      </div>
      <div
        className="
        flex
        sm:items-center
        pl-4 pb-3 sm:p-0
      "
      >
        {!user && (
          <Button onClick={login} variant="secondary" className="mr-2 " style={{marginTop:"3%",fontFamily:"halogen"}}>
            Login
       
          </Button>
        )}

        {user && (
          <Button onClick={logout} variant="secondary" className="mr-4 manifestbutton">
           {picLink &&(<Image loader={() => picLink} src={picLink} width={40} height={40}  alt="Picture of the author" style={{borderRadius:"5px",marginRight:"10%"}}/>)}
            <Link
            href="/profile"
            className={`mr-5 text-sm ${pathname !== "/profile" && "opacity-60"}`}
          >
           {user.twitter?.username}
          </Link>
          
          </Button>
        )}
      </div>
    </nav>
  );
}

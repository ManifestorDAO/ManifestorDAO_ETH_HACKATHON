"use client";

import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import "./LoggedIn.css"; // Import your CSS file
import { useContractRead } from '../hooks/usecontractread';
import { useContractWrite } from '../hooks/usecontractwrite';
import axios from 'axios';


function LoggedIn() {
  const {
    ready,
    authenticated,
    logout,
    user,
    linkTwitter,
  } = usePrivy();

  const { wallets } = useWallets();
  const router = useRouter();
  const [embeddedWallet, setEmbeddedWallet] = useState<any>();
  const [walletBalance, setWalletBalance] = useState<string>("");
  const [twitterIMG, settwitterIMG] = useState<string>("");
  useEffect(() => {
    if (!ready) {
      return;
    } else {
      setUp();
      getAddress();
    }

    async function setUp() {
      const embeddedWallet = wallets.find(
        (wallet) => wallet.walletClientType === "privy"
      );
      if (embeddedWallet) {
        const provider = await embeddedWallet.getEthereumProvider();
        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `0x${Number(11155111).toString(16)}` }],
        });
        const ethProvider = new ethers.providers.Web3Provider(provider);
        const walletBalance = await ethProvider.getBalance(
          embeddedWallet.address
        );
        const ethStringAmount = ethers.utils.formatEther(walletBalance);
        setEmbeddedWallet(embeddedWallet);
        setWalletBalance(ethStringAmount);
       
      }
    }
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
settwitterIMG(response.data.users[0].twitterPfpUrl);
console.log(twitterIMG);}

    };



  }, [ready, wallets]);

  if (ready && !authenticated) router.push("/");

  if (!user) return <></>;

  const handleLinkTwitter = () => {
    linkTwitter();
  };

  return (
    <div className="profile-page">
        <div className="profile-header">

           
            {user.twitter && (
              
                <div className="twitter-info">
                   <img className="profile-picture" src={twitterIMG} alt={`${user.twitter.username}'s profile picture`} />
                    <p className="twitter-handle">{user.twitter.username}</p>
                   
                </div>
            )}
        </div>
        <div className="wallet-info">
            <p>{embeddedWallet?.address}</p>
            {walletBalance && <p> {walletBalance} ETH</p>}
        </div>
        <div className="ranks">
            <p>Ranks:</p>
            {/* Render user's ranks */}
        </div>
        <div className="actions">
            {!user.twitter && (
                <Button onClick={handleLinkTwitter} className="link-twitter-button">
                    Link Twitter
                </Button>
            )}
            <Button onClick={logout} className="logout-button">
                Log out
            </Button>
        </div>
    </div>
  );
}

export default LoggedIn;
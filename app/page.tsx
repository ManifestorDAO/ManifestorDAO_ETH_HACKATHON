"use client";
import { useState ,useEffect,useCallback} from "react";
import LoadingScreen from './loading'
import abi from './manifestor.json'
import {
  useExploreProfiles,
  useExplorePublications,
  PublicationTypes,
  PublicationSortCriteria,
  PublicationMainFocus,
  useReaction,
  useActiveProfile,
  ReactionType,
} from "@lens-protocol/react-web";
import {
  Loader2,
  ListMusic,
  Newspaper,
  PersonStanding,
  Shapes,
  Share,
  Globe,
  MessageSquare,
  Repeat2,
  Heart,
  Grab,
  ArrowRight,
} from "lucide-react";
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import { encodeFunctionData } from "viem"
import { usePrivySmartAccount } from '@zerodev/privy'
import { json } from "./json";
import { usePrivy } from "@privy-io/react-auth";
import { useLogin } from "@privy-io/react-auth";
import PrivyProvider from "./PrivyProvider";
import Typewriter from 'typewriter-effect';
import "survey-core/defaultV2.min.css";
import { themeJson } from "./theme";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { isMobile } from "react-device-detect";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import { Parallax } from "react-scroll-parallax";
import { useSpring, animated } from "@react-spring/web";
import { useWallets } from "@privy-io/react-auth";

export default function Home() {
  const { logout, user } = usePrivy();
  const { wallets } = useWallets();
  const [view, setView] = useState("profiles");

  const [manifestorData, setmanifestorData] = useState("");
  const [selectedSpell, setSelectedSpell] = useState("Spell 1");
  const [spellPrice, setSpellPrice] = useState("10"); // A
  const [loading, setLoading] = useState(true)
  const [isCLient, setIsClient] = useState(false)
  const smartPrivy = usePrivySmartAccount()

  const contractAddress = '0x34bE7f35132E97915633BC1fc020364EA5134863'
  const handleSurvey = useCallback(() => {
    console.log(smartPrivy.user?.wallet?.address !== undefined && !!smartPrivy.sendTransaction)
      if (smartPrivy.user?.wallet?.address !== undefined && !!smartPrivy.sendTransaction) {
          setLoading(true)
          smartPrivy.sendTransaction({
            to: contractAddress,
            data: encodeFunctionData({
              abi,
              functionName: 'mint',
              args: [smartPrivy.user.wallet.address],
            })
          }).then((receipt: any) => {
            setLoading(false)
            console.log(receipt)
          })
        }
  }, [smartPrivy])
  useEffect(() => {
    setIsClient(true);
    setTimeout(() => setLoading(false), 60)
  }, [])
  let { data: profiles, loading: loadingProfiles } = useExploreProfiles({
    limit: 50,
  }) as any;
  const survey = new Model(json);
  survey.applyTheme(themeJson);
  survey.onComplete.add((sender, options) => {
    setmanifestorData(JSON.stringify(sender.data, null, 3))
      console.log(JSON.stringify(sender.data, null, 3));
  });
  const { login } = useLogin({
    onComplete: async (user) => {
      console.log("wallets in useLogin: ", wallets);
      // if (!wallets[0]) return
      if (!user.wallet) return;
      console.log("user: ", user);
     
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
  });
  const { data: profile } = useActiveProfile();
  const handleSpellChange = (event) => {
    const spell = event.target.value;
    setSelectedSpell(spell);

    // Assume these are the prices, replace with real data
    const prices = { "Spell 1": "10", "Spell 2": "15", "Spell 3": "20" };
    setSpellPrice(prices[spell]);
  };
  let { data: musicPubs, loading: loadingMusicPubs } = useExplorePublications({
    limit: 25,
    sortCriteria: PublicationSortCriteria.CuratedProfiles,
    publicationTypes: [PublicationTypes.Post],
    metadataFilter: {
      restrictPublicationMainFocusTo: [PublicationMainFocus.Audio],
    },
  }) as any;

  let { data: publications, loading: loadingPubs } = useExplorePublications({
    limit: 25,
    sortCriteria: PublicationSortCriteria.CuratedProfiles,
    publicationTypes: [PublicationTypes.Post],
    metadataFilter: {
      restrictPublicationMainFocusTo: [PublicationMainFocus.Image],
    },
  }) as any;

  profiles = profiles?.filter((p) => p.picture?.original?.url);

  publications = publications?.filter((p) => {
    if (p.metadata && p.metadata.media[0]) {
      if (p.metadata.media[0].original.mimeType.includes("image")) return true;
      return false;
    }
    return true;
  });

  function openPublication(publication) {
    window.open(`https://share.lens.xyz/p/${publication.id}`, "_blank");
  }
  const [props, api] = useSpring(
    () => ({
      from: { opacity: 0 },
      to: { opacity: 1 },
    }),
    []
  );

  return (
    <>
    {loading === false ?(<main
      className="
     
    "
    >
      <div style={{width:"100%"}}>
      <Parallax
        speed={10}
        translateY={isMobile ? ["0px", "-100px"]:["100px", "-100px"]}
        scale={[1.5, 0.75]}
        easing="easeInQuad"
      >
        <div
          className="main-Text"
          style={{
            width: isMobile ? "90%":"60%",

            top: isMobile ? "0" : "0",
            left: isMobile ? "0": "0%",
            fontSize: isMobile ? "9vw" : "5vw",
            color: "white",
            fontFamily: "Frens, sans-serif",
            fontWeight: "400",
            fontStyle: "italic",
            textAlign:"center",
           
              WebkitTextStrokeWidth:"0.px",
              WebkitTextStrokeColor:"rgba(0,0,0,0.6)",
          }}
        >
          Manifestor{" "}
          <a style={{ fontFamily: "halogen, sans-serif", fontWeight: "800" }}>
            Dao
          </a>
          <div
            className="s"
            style={{
              position: "absolute",
              width: "70%",

              top:isMobile ? "60%":"75%",
              left: "15%",
              fontSize:isMobile ?  "3.5vw":"1.3vw",
              color: "white",
              fontFamily: "halogen, sans-serif",
              fontWeight: "100",
              fontStyle: "italic",
              lineHeight: 1.1,
              textShadow: "none",
            }}
          >
            {" "}
            <Typewriter
             options={{cursor:""}}
  onInit={(typewriter) => {
    typewriter.typeString('Evolve your on-chain manifesting powers to unlock the akashic abundance stored for you')
      .callFunction(() => {
        console.log('String typed out!');
      })
      .pauseFor(2500)
     
      .callFunction(() => {
        console.log('All strings were deleted');
      })
      .start();
  }}
/>
         
          </div>
        </div>
      </Parallax>
      <div style={{position:"relative", display:"flex",alignItems:"center",justifyContent:"center",height:"100px", width:"20%",left:"40%"}}>  {!user && (
          <Button onClick={login} variant="secondary" className="mr-2 " style={{marginTop:"3%",fontFamily:"halogen"}}>
           Login
       
          </Button>
        )}</div>
          <Parallax speed={10}  translateY={isMobile ? ["40vh", "-200vh"]:["10vh", "-20vh"]} easing="easeInQuad">
      <div
          style={{
            width: "100%",
            position:"absolute",
            zIndex:-5,

            top: isMobile ? "10px" : "10px",
            height:  isMobile ? "100px":"1000px",
            overflow: "hidden",
            objectFit: "cover",
            left: "0%",
            objectPosition: "25% 25%",
            clipPath:" ellipse(800px 600px at 750px 800px)"
          }}
        >
          {" "}
          <Image
            src="/psybackground.webp"
            width={5000}
            height={5000}
            alt="Picture of the author"
            className="rotate"
            style={{ zIndex:-5, position: "relative", left: "0%", width: "10000px" }}
          />
        </div>
        <Image
            src="/collumns.webp"
            width={2500}
            height={1000}
            alt="Picture of the author"
            className=""
            style={{ zIndex:-5, position: "absolute", top: "150px" }}
          />
        </Parallax>
 
  
      <Parallax speed={30} translateY={isMobile ? [ '-0vh','20vh']: ["10vh", "-20vh"]}  easing="easeInQuad">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          left: "25%",
         
        }}
      >
       
         <Image
          src="/meditativefrog.svg"
          width={500}
          height={500}
          alt="Picture of the author"
          style={{ position:"absolute",top:"700px",left:"35%",width:"30%",zIndex:2,}}
        />
        
        </div>
          </Parallax>
          <Parallax speed={30} translateY={[ '0vh','-30vh']}  easing="easeInQuad">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          left: "25%",
         
        }}
      >
        <Image
          src="/ohmfrog.svg"
          width={500}
          height={500}
          alt="Picture of the author"
          style={{ position:"absolute",left:"10%",width:"15%",zIndex:2,}}
        />
        
         <Image
          src="/ohmfrogmanifestright.svg"
          width={500}
          height={500}
          alt="Picture of the author"
          style={{ position:"absolute",right:"10%",width:"15%",zIndex:2,}}
        />
        </div>
          </Parallax>
          </div>



   
        <div className="md:flex min-h-[300px] mt-3" style={{marginTop:"1100px"}}>
          <div
            className=" bluring rounded-tl rounded-bl md:w-[230px] pt-3 px-2 pb-8 flex-col flex"
            style={{margin:isMobile ? "5%":"0",
              fontFamily: "halogen, sans-serif", fontWeight: "800" ,
              color:"#FFF",
              boxShadow:
                "0 0 2px #fff,0 0 5px #fff,0 0 7px #fff,0 0 10px #228dff,0 0 17px #228dff,0 0 20px #228dff",
              clipPath: isMobile ? "" : "inset(-40px 0px -40px -40px)",
              borderRadius: "10px",
              backdropFilter: " blur(10px)",
              background:
                "linear-gradient(180deg, rgba(223,232,244,0.15), rgba(179,253,255,0.15))",
            }}
          >
            <Button
              onClick={() => setView("spells")}
              variant={view === "spells" ? "secondary" : "ghost"}
              className="justify-start mb-1"
            >
              <ListMusic size={16} />
              <p className="text-sm ml-2">Join</p>
            </Button>
            <Button
              onClick={() => setView("activity")}
              variant={view === "activity" ? "secondary" : "ghost"}
              className="justify-start mb-1"
            >
              <Newspaper size={16} />
              <p className="text-sm ml-2">Activity</p>
            </Button>
            <Button
              onClick={() => setView("leaderboard")}
              variant={view === "leaderboard" ? "secondary" : "ghost"}
              className="justify-start mb-1"
            >
              <PersonStanding size={16} />
              <p className="text-sm ml-2">Manifest</p>
            </Button>

            <Button
              onClick={() => setView("collect")}
              variant={view === "collect" ? "secondary" : "ghost"}
              className="justify-start mb-1"
            >
              <Shapes size={16} />
              <p className="text-sm ml-2">Affirmations</p>
            </Button>
          </div>
          <div
            className="
          
          rounded-tr rounded-br flex flex-1 pb-4"
            style={{
              margin:isMobile ? "5%":"0",
              boxShadow:
                "0 0 2px #fff,0 0 5px #fff,0 0 7px #fff,0 0 10px #228dff,0 0 17px #228dff,0 0 20px #228dff",
              clipPath: isMobile ? "" : "inset(-40px -40px -40px 0px)",
              borderRadius: "10px",
              backdropFilter: " blur(10px)",
              background:
                "linear-gradient(180deg, rgba(223,232,244,0.15), rgba(179,253,255,0.15))",
            }}
          >
            {view === "leaderboard" && (
              <div className="flex flex-1 flex-wrap p-4">
                {loadingProfiles && (
                  <div
                    className="
                      flex flex-1 justify-center items-center
                    "
                  >
                    <Loader2 className="h-12 w-12 animate-spin" />
                  </div>
                )}
              </div>
            )}
            {view === "spells" && (
              <div style={{width: isMobile? "90%":"50%",left:"25%",backgroundColor:"FFF",margin:"10%",clipPath: isMobile ? "" : "inset(-40px -40px -40px 0px)",borderRadius:"55px",display:"flex",alignItems:"center"}}>
             <Survey model={survey} onComplete={console.log("survey completed")} style={{}}/>
             </div>
            )}
            {view === "music" && (
              <div className="flex flex-1 flex-wrap flex-col">
             
             
              </div>
            )}
          </div>
        </div>
    
    </main>      ) : (
      <LoadingScreen />
    )}
          </>
  );
}

function Reactions({ publication, profile }) {
  const { addReaction, removeReaction, hasReaction, isPending } = useReaction({
    profileId: profile.id,
  });

  const reactionType = ReactionType.UPVOTE;
  const hasReactionType = hasReaction({
    reactionType,
    publication,
  });
  console.log("hasReactionType: ", hasReactionType);

  async function likePublication() {
    if (!profile) return;
    if (hasReactionType) {
      await removeReaction({
        reactionType,
        publication,
      });
    } else {
      await addReaction({
        reactionType,
        publication,
      });
    }
  }
  return (
    <div>
      <Button className="rounded-full mr-1" variant="secondary">
        <MessageSquare className="mr-2 h-4 w-4" />
        {publication.stats.totalAmountOfComments}
      </Button>
      <Button className="rounded-full mr-1" variant="secondary">
        <Repeat2 className="mr-2 h-4 w-4" />
        {publication.stats.totalAmountOfMirrors}
      </Button>
      <Button
        onClick={likePublication}
        className="rounded-full mr-1"
        variant="secondary"
      >
        <Heart className="mr-2 h-4 w-4" />
        {publication.stats.totalUpvotes}
      </Button>
      <Button className="rounded-full mr-1" variant="secondary">
        <Grab className="mr-2 h-4 w-4" />
        {publication.stats.totalAmountOfCollects}
      </Button>
    </div>
  );
}

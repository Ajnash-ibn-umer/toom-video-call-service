import { useRef, useState } from "react";
import styles from "./style.module.css";
import homeIcon from "../../../public/home.svg";
import Image from "next/image";

export default function TopBar() {
const [time,setTime] =useState<string>("")
    // function refreshTime() {
    //     const dateString = new Date()
    //     const myString=dateString.toLocaleString("en-Us",{ timeZone: "Asia/Kolkata", hour12: true });
    //     const formattedString = myString.replace(", ", " - ");
    // setTime(formattedString)
    
    // }

    // setInterval(()=>{
    //     refreshTime()
    // },1000)
  return (
    <>
      <main className={styles.navMain}>
       
      <div className={styles.leftDiv}>
          <div className={styles.leftLogo}>
            <span>Toom Meet</span>
          </div>
        </div>
        <div className={styles.rightDiv}>
        <div  className={styles.rightTime}>
          <span  >{time}</span>
        </div>
        <div className={styles.rightButton}>
          <span><Image src={homeIcon} alt="icon"  /></span>
        </div> 
        </div>
        
      </main>
    </>
  );
}

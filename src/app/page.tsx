"use client";

import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import styles from "./main.module.css";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import TopBar from "@/components/NavBar";
import LandingPage from "@/components/LandingPage";
import { initializeApp } from "firebase/app";
// function classNames(...classes: any[]) {
//   return classes.filter(Boolean).join(" ");
// }
const firebaseConfig = {
  apiKey: "AIzaSyDeqfWAorFFj_bI3UJ1yks6LxFUw4oWdZQ",
  authDomain: "webrtc-eefbf.firebaseapp.com",
  projectId: "webrtc-eefbf",
  storageBucket: "webrtc-eefbf.appspot.com",
  messagingSenderId: "357808059385",
  appId: "1:357808059385:web:bf4d9a3aa03d4b2020c328"
};
export const firebaseApp = initializeApp(firebaseConfig);
export default function Main() {
  const router = useRouter();
  const handleSubmit = (e: any) => {
    e.preventDefault();

    const values: any = e?.target?.roomId.value;

    router.push(`/${values}`);
  };
  const handleNewMeet = () => {
    const newRoomId = Math.floor(Math.random() * 1000000000);
    router.push(`/${newRoomId}`);
  };



  return (
    <>
      <main className={styles.main}>
        <TopBar />

        <LandingPage  handleSubmit={handleSubmit} handleNewMeet={handleNewMeet} />
        
      </main>
    </>
  );
}

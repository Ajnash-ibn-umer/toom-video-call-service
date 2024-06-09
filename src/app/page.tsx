"use client";

import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import styles from "./main.module.css";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import TopBar from "@/app/components/NavBar";
import LandingPage from "@/app/components/LandingPage";
import { initializeApp } from "firebase/app";
// function classNames(...classes: any[]) {
//   return classes.filter(Boolean).join(" ");
// }

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

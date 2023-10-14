"use client";

import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import styles from "./main.module.css";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

const user = {
  name: "Tom Cook",
  imageUrl:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
};

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

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
        <div className={styles.leftDiv}>
          <button
            onClick={handleNewMeet}
            className="bg-green-600  hover:bg-green-700 text-white font-bold  rounded"
          >
            + New Meeting
          </button>
          <form onSubmit={handleSubmit}>
            <div className={styles.forms}>
              <input
                placeholder="Room Id"
                type="text"
                name="roomId"
                id="roomId"
                className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />

              <button
                type="submit"
                className="bg-blue-500  hover:bg-blue-700 text-white font-bold  rounded"
              >
                Join
              </button>
              <div></div>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}

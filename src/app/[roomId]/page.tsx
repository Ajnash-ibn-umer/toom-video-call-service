"use client";

import Image from "next/image";
import styles from "./main.module.css";
import { useEffect, useRef, useState } from "react";
import { createChannel, createClient } from "agora-rtm-react";
import { useRouter } from "next/navigation";

const APP_ID :string= process.env.NEXT_PUBLIC_APP_ID as string
console.log({APP_ID})
const useClient = createClient(APP_ID);
let token: string;
// create ICE  server
const servers: RTCConfiguration = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"], // free STUN servers provided by Google
    },
  ],
};
export default function Room({ params }: any) {
  const [userId, setUserId] = useState<string>(
    Math.floor(Math.random() * 1000).toString()
  );
  const router = useRouter();
  const client = useClient();
  const roomId = params.roomId;
  const [micEnabled, setMicEnabled] = useState<boolean>(true);
  const [cameraEnabled, setCameraEnabled] = useState<boolean>(true);

  console.log("roomid", roomId);
  console.log({ cameraEnabled });
  const useChannel = createChannel(roomId);

  const channel = useChannel(client);

  //initialze peerconnection
  let peerConnection = new RTCPeerConnection(servers);
  console.log("peer connection");
  const [localStream, setLocalStream] = useState<MediaStream | any>();
  // const [remoteStream, setRemoteStream] = useState<any>()
  const videoRef = useRef<any>();
  const remoteVideoRef = useRef<any>();

  // let localStream: MediaStream;
  let remoteStream: MediaStream;

  const handleUserJoined = async (memberId: any) => {
    console.log("new User joined", memberId);

    await createOffer(memberId);
  };

  const handleMemberLeft = async (memberId: any) => {
    remoteVideoRef.current.style.display = "none";
  };

  const handleMessageFromPeer = async (message: any, memberId: string) => {
    // console.log("Message:", message, memberId)

    message = JSON.parse(message.text);
    console.log("Message:", message, memberId);

    // catch offer from another user and create answer
    if (message.type === "offer") {
      await createAnswer(memberId, message.offer);
    }

    if (message.type === "answer") {
      await addAnswer(message.answer);
    }

    if (message.type === "candidate") {
      if (peerConnection) {
        peerConnection.addIceCandidate(message.candidate);
      }
    }
  };
  channel.on("MemberLeft", handleMemberLeft);
  channel.on("MemberJoined", handleUserJoined);
  client.on("MessageFromPeer", handleMessageFromPeer);

  useEffect(() => {
    client.login({ uid: userId, token }).then(async () => {
      await channel.join();
      // get media devices access
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((currentStream) => {
          setLocalStream(currentStream);
          videoRef.current.srcObject = currentStream;
        });
    });
  }, []);

  // create connection function
  const createConnection = (memberId: any) => {
    // set remote stream
    remoteStream = new MediaStream();
    console.log("remote stream", { remoteStream });
    remoteVideoRef.current.srcObject = remoteStream;
    remoteVideoRef.current.style.display = "block";
    // add localstram to peer connection
    console.log(" remote configured");
    console.log("tracks", localStream.getTracks());

    // handle initial error , when local stream is null
    if (!localStream) {
        navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((currentStream) => {
          setLocalStream(currentStream);
          videoRef.current.srcObject = currentStream;
        });
    }

    localStream.getTracks().forEach((track: any) => {
      console.log("locla track", track);

      peerConnection.addTrack(track, localStream);
    });

    // get remote streams
    peerConnection.ontrack = (event) => {
      console.log({ event });

      event.streams[0]?.getTracks().forEach((track: any) => {
        remoteStream.addTrack(track);
      });
    };
    console.log("new ice");
    peerConnection.onicecandidate = async (event) => {
      console.log("new ice");

      if (event.candidate) {
        console.log("new ICE candidate", event.candidate);
        client.sendMessageToPeer(
          {
            text: JSON.stringify({
              type: "candidate",
              candidate: event.candidate,
            }),
          },
          memberId
        );
      } else {
        console.log("ice candidate  not found");
      }
    };
  };
  const createOffer = async (memberId: any) => {
    await createConnection(memberId);
    // create offer
    let offer = await peerConnection.createOffer();
    // this contains sdp
    await peerConnection.setLocalDescription(offer);
    console.log("offer :", offer);
    client.sendMessageToPeer(
      { text: JSON.stringify({ type: "offer", offer }) },
      memberId
    );
  };

  const createAnswer = async (memberId: string, offer: any) => {
    await createConnection(memberId);
    await peerConnection.setRemoteDescription(offer);

    let answer = await peerConnection.createAnswer();
    // this contains sdp
    await peerConnection.setLocalDescription(answer);
    console.log("offer :", offer);
    client.sendMessageToPeer(
      { text: JSON.stringify({ type: "answer", answer }) },
      memberId
    );
  };

  const addAnswer = async (answer: any) => {
    if (!peerConnection.currentRemoteDescription) {
      peerConnection.setRemoteDescription(answer);
    }
  };

  const leaveChannel = async () => {
    await channel.leave();
    await client.logout();
  };

  const handleCamera = () => {
    var videoTrack: any = localStream
      ?.getTracks()
      .find((track: { kind: string }) => track.kind === "video");
    // if(videoTrack?.enabled !== undefined)

    if (videoTrack?.enabled) {
      videoTrack.enabled = false;
      // micEnabled=false
      setCameraEnabled(false);
    } else {
      videoTrack.enabled = true;
      setCameraEnabled(true);
    }
  };
  const handleMic = () => {
    var audioTrack: any = localStream
      ?.getTracks()
      .find((track: { kind: string }) => track.kind === "audio");
    // if(audioTrack?.enabled !== undefined) return
    console.log("in mic handler");
    if (audioTrack?.enabled) {
      audioTrack.enabled = false;
      setMicEnabled(false);
    } else {
      audioTrack.enabled = true;
      setMicEnabled(true);
    }
  };
  const handleEndCall = () => {
    leaveChannel();
    router.push("/");
  };
  window.addEventListener("beforeunload", leaveChannel);
  return (
    <main className={styles.main}>
      <div className={styles.videos} id="videos">
        <video
          ref={videoRef}
          className={`${styles.videoPlayer} ${styles.user1}`}
          id="user1"
          autoPlay
          playsInline
        ></video>
        <video
          ref={remoteVideoRef}
          className={`${styles.videoPlayer} ${styles.user2}`}
          id="user2"
          autoPlay
          playsInline
        ></video>
      </div>
      <div className={styles.controls}>
        <div className={styles.controlBtn} onClick={handleCamera}>
          {cameraEnabled ? (
            <span className="material-symbols-outlined">videocam</span>
          ) : (
            <span className="material-symbols-outlined">videocam_off</span>
          )}
        </div>
        <div className={styles.controlBtn} onClick={handleMic}>
          {micEnabled ? (
            <span className="material-symbols-outlined">mic</span>
          ) : (
            <span className="material-symbols-outlined">mic_off</span>
          )}
        </div>
        <div className={styles.controlBtn} onClick={handleEndCall}>
          <span className="material-symbols-outlined">logout</span>
        </div>
      </div>
    </main>

  );
}

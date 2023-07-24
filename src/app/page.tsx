"use client"

import Image from 'next/image'
import styles from './main.module.css'
import { useEffect, useRef, useState } from 'react'

// create ICE  server
const servers: RTCConfiguration = {
  iceServers: [
    {
      urls: [
        "stun:stun1.l.google.com:19302",
        "stun:stun2.l.google.com:19302",
      ], // free STUN servers provided by Google
    },
  ],

};
export default function Home() {


  // const [localStream, setLocalStream] = useState<any>()
  // const [remoteStream, setRemoteStream] = useState<any>()
  const videoRef = useRef<any>()
  const remoteVideoRef = useRef<any>()

  let localStream: MediaStream;
  let remoteStream: MediaStream;


  // useEffect(() => {

  //   (async () => {
  //     let stream = await navigator.mediaDevices.getDisplayMedia({ audio: false, video: true })
  //     console.log({stream});

  //     setLocalStream(stream)
  //     document.getElementById("user1").srcObject = localStream
  //   })()
  // }, [])

  useEffect(() => {
    getVideo();
  

  }, [videoRef]);
  


  var createOffer = async () => {
    //initialze peerconnection
    let peerConnection = new RTCPeerConnection(servers)
console.log('peer connection');

    // set remote stream
    remoteStream = new MediaStream()
    let video = remoteVideoRef.current;
    video.srcObject = remoteStream;

    // add localstram to peer connection
    console.log(' remote configured');
    console.log("tracks",localStream.getTracks());
    
    localStream.getTracks().forEach((track) => {
      console.log('locla track',track);
      
      peerConnection.addTrack(track, localStream)
    })

    // get remote streams
    peerConnection.ontrack=(event) => {
      console.log({event});
      
      event.streams[0]?.getTracks().forEach((track: any) => {
      remoteStream.addTrack(track)
      })
    }
    console.log('new ice');
    peerConnection.onicecandidate=async(event)=>{
      console.log('new ice');
      
      if(event.candidate){
        console.log('new ICE candidate',event.candidate);
        
      }else{
        console.log('ice candidate  not found',);
        
      }
    }

    // create offer
    let offer = await peerConnection.createOffer()
    // this contains sdp
    await peerConnection.setLocalDescription(offer)
    console.log('offer :', offer);

  }


  const getVideo = async () => {
    localStream = await navigator.mediaDevices
      .getUserMedia({ video: true })

    // setLocallocalStream(localStream)
    let video = videoRef.current;
     video.srcObject = localStream;

    createOffer()

  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className={styles.videos} id='videos'>

        <video ref={videoRef} className={styles.videoPlayer} id='user1' autoPlay playsInline ></video>
        <video ref={remoteVideoRef} className={styles.videoPlayer} id='user2' autoPlay playsInline ></video>

      </div>
    </main>
  )
}

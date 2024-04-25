"use client"

import Image from 'next/image'
import styles from './main.module.css'
import { useEffect, useRef, useState } from 'react'
import { createChannel, createClient } from 'agora-rtm-react'
import { useRouter } from 'next/navigation'
import { BsFillMicFill, BsFillCameraVideoFill, BsFillTelephoneFill ,BsFillMicMuteFill,BsFillCameraVideoOffFill } from 'react-icons/bs'

const APP_ID = "08a276257c5141d1abdbdf81b4bc016d"
const useClient = createClient(APP_ID);
let token: string;
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
export default function Room({ params }: any) {

    const [userId, setUserId] = useState<string>((Math.floor(Math.random() * 1000).toString()))
    const router = useRouter()
    const client = useClient();
    const roomId = params.roomId
    const [micEnabled, setMicEnabled] = useState<boolean>(true)
    const [cameraEnabled, setCameraEnabled] = useState<boolean>(true)

    console.log('roomid', roomId);
console.log({cameraEnabled})
    const useChannel = createChannel(roomId)

    const channel = useChannel(client)

    //initialze peerconnection
    let peerConnection = new RTCPeerConnection(servers)
    console.log('peer connection');
    // const [localStream, setLocalStream] = useState<any>()
    // const [remoteStream, setRemoteStream] = useState<any>()
    const videoRef = useRef<any>()
    const remoteVideoRef = useRef<any>()

    let localStream: MediaStream;
    let remoteStream: MediaStream;



    const getVideo = async () => {
        localStream = await navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })

        // setLocallocalStream(localStream)
        let video = videoRef.current;
        video.srcObject = localStream;


    };
    useEffect(() => {

        channel.on("MemberJoined", handleUserJoined)
        client.on("MessageFromPeer", handleMessageFromPeer)
        channel.on("MemberLeft", handleMemberLeft)
        client.login({ uid: userId, token }).then(async () => {
            await channel.join()
        getVideo();
            // get media devices access

        })



    }, [videoRef]);

    const handleUserJoined = async (memberId: any) => {
        console.log("new User joined", memberId);

        await createOffer(memberId)


    }
    const handleMemberLeft = async (memberId: any) => {
        remoteVideoRef.current.style.display = "none"
    }
    const handleMessageFromPeer = async (message: any, memberId: string) => {
        // console.log("Message:", message, memberId)

        message = JSON.parse(message.text)
        console.log("Message:", message, memberId)

        // catch offer from another user and create answer
        if (message.type === "offer") {
            await createAnswer(memberId, message.offer)
        }

        if (message.type === "answer") {
            await addAnswer(message.answer)
        }

        if (message.type === "candidate") {
            if (peerConnection) {
                peerConnection.addIceCandidate(message.candidate)
            }
        }
    }

    // create connection function
    const createConnection = (memberId: any) => {


        // set remote stream
        remoteStream = new MediaStream()
        var video = remoteVideoRef.current;
        video.srcObject = remoteStream;
        remoteVideoRef.current.style.display = "block"
        // add localstram to peer connection
        console.log(' remote configured');
        console.log("tracks", localStream.getTracks());

        // handle initial error , when local stream is null
        if (!localStream) {
            getVideo()
        }

        localStream.getTracks().forEach((track) => {
            console.log('locla track', track);

            peerConnection.addTrack(track, localStream)
        })

        // get remote streams
        peerConnection.ontrack = (event) => {
            console.log({ event });

            event.streams[0]?.getTracks().forEach((track: any) => {
                remoteStream.addTrack(track)
            })
        }
        console.log('new ice');
        peerConnection.onicecandidate = async (event) => {
            console.log('new ice');

            if (event.candidate) {
                console.log('new ICE candidate', event.candidate);
                client.sendMessageToPeer({ text: JSON.stringify({ "type": "candidate", "candidate": event.candidate }) }, memberId)


            } else {
                console.log('ice candidate  not found',);

            }
        }
    }
    const createOffer = async (memberId: any) => {

        await createConnection(memberId)
        // create offer
        let offer = await peerConnection.createOffer()
        // this contains sdp
        await peerConnection.setLocalDescription(offer)
        console.log('offer :', offer);
        client.sendMessageToPeer({ text: JSON.stringify({ "type": "offer", offer }) }, memberId)

    }

    const createAnswer = async (memberId: string, offer: any) => {
        await createConnection(memberId)
        await peerConnection.setRemoteDescription(offer)

        let answer = await peerConnection.createAnswer()
        // this contains sdp
        await peerConnection.setLocalDescription(answer)
        console.log('offer :', offer);
        client.sendMessageToPeer({ text: JSON.stringify({ "type": "answer", answer }) }, memberId)
    }

    const addAnswer = async (answer: any) => {
        if (!peerConnection.currentRemoteDescription) {
            peerConnection.setRemoteDescription(answer)
        }
    }


    const leaveChannel = async () => {

        await channel.leave()
        await client.logout()
    }


    const handleCamera = () => {
        var videoTrack: any =  localStream?.getTracks().find(track => track.kind === "video")
        // if(videoTrack?.enabled !== undefined) 

        if (videoTrack?.enabled ) {

            videoTrack.enabled = false;
            // micEnabled=false
            setCameraEnabled(false)

        } else {
            videoTrack.enabled = true;
            setCameraEnabled(true)


        }
    }
    const handleMic = () => {
        var audioTrack: any = localStream?.getTracks().find(track => track.kind === "audio")
// if(audioTrack?.enabled !== undefined) return
        if (audioTrack?.enabled ) {
            audioTrack.enabled = false;
            // setMicEnabled(false)

        } else {
            audioTrack.enabled = true;
            // setMicEnabled(true)


        }
    }
    const handleEndCall = () => {
        leaveChannel()
        router.push('/')
    }
    window.addEventListener("beforeunload", leaveChannel)
    return (
        <main className={styles.main}>
        <div className={styles.videos} id='videos'>

            <video ref={videoRef} className={`${styles.videoPlayer} ${styles.user1}`} id='user1' autoPlay playsInline ></video>
            <video ref={remoteVideoRef} className={`${styles.videoPlayer} ${styles.user2}`} id='user2' autoPlay playsInline ></video>

        </div>
        <div className={styles.controls}>
            <div className={styles.controlBtn} onClick={handleCamera}  >{ cameraEnabled ? <span className="material-symbols-outlined">videocam</span> :<span className="material-symbols-outlined">videocam_off</span>}</div>
            <div className={styles.controlBtn} onClick={handleMic}  >{ micEnabled?<span className="material-symbols-outlined">mic</span> :<span className="material-symbols-outlined">mic_off</span>}</div>
            <div className={styles.controlBtn} onClick={handleEndCall}  ><span className="material-symbols-outlined">logout</span></div>


        </div>
    </main>



        // <main className={styles.main}>
        //     <div className={styles.videos} id='videos'>

        //         <video ref={videoRef} className={`${styles.videoPlayer} ${styles.user1}`} id='user1' autoPlay playsInline ></video>
        //         <video ref={remoteVideoRef} className={`${styles.videoPlayer} ${styles.user2}`} id='user2' autoPlay playsInline ></video>

        //     </div>
        //     <div className={styles.controls}>
        //         <div className={styles.controlBtn} onClick={handleCamera}  >{ cameraEnabled ? <BsFillCameraVideoFill size={30} /> :<BsFillCameraVideoOffFill size={30} />}</div>
        //         <div className={styles.controlBtn} onClick={handleMic}  >{ micEnabled? <BsFillMicFill size={30} /> :<BsFillMicMuteFill size={30} />}</div>
        //         <div className={styles.controlBtn} onClick={handleEndCall} style={{ background: "red" }} ><BsFillTelephoneFill size={30} /></div>


        //     </div>
        // </main>
    )
}

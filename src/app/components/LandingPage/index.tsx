import Image from "next/image";
import styles from "./style.module.css";
import bannerImage from "../../../public/1618_U1RVRElPIEtBVCAzNTQtMTQ4.jpg";

interface LandingPageProps{
  handleSubmit:(e:any)=>any,
  handleNewMeet:()=>any,

}

export default function LandingPage({handleSubmit,handleNewMeet}:LandingPageProps) {
  return (
    <>
      <main className={styles.mainSec}>
        <div className={styles.leftDiv}>
          <div className={styles.leftContent}>
            <div className={styles.titleContainer}>
              <span className={styles.title}>
                Video calls and meetings for everyone
              </span>
            </div>
            <div className={styles.subtitleContainer}>
              <span className={styles.subtitle}>
                Toom Meet provides secure, easy-to-use video calls and meetings
                for everyone, on any device.
              </span>
            </div>
            <div className={styles.formDiv}>
              <button  onClick={handleNewMeet} className={styles.newMeetBtn}>+ New Meeting</button>
              <form onSubmit={handleSubmit}>
                <div className={styles.forms}>
                  <input
                    placeholder="Room Id"
                    type="text"
                    name="roomId"
                    id="roomId"
                    className={styles.inputField}
                  />

                  <button type="submit"  className={styles.joinBtn}>
                    Join
                  </button>
                  <div></div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className={styles.rightDiv}>
          <div className={styles.rightContents}>
            <div className={styles.banner}>
              <Image src={bannerImage} alt="banner" width={500} />
            </div>
            <div className={styles.rightDescription}>
              <span></span>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

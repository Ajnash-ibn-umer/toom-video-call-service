"use client"
import styles from "./main.module.css"
import { Circles } from 'react-loader-spinner'
const Loading=()=>{

    return<>
   <div className={styles.loadingContainer}>
   <Circles
  height="80"
  width="80"
  color="#0000fd"
  ariaLabel="circles-loading"
  wrapperStyle={{}}
  wrapperClass=""
  visible={true}
  />
   </div>
 
    </>
}

export default Loading;
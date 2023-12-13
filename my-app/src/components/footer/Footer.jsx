import React from 'react'
import styles from './footer.module.css'
import Image from 'next/image'

const Footer = () => {
  return (
    <div className={styles.container}>
        <div>&copy;2023 Smart Developing. All rights reserved</div>
        <div className={styles.social}>
          <Image src="/facebook.png" alt='1' width={15} height={15} className={styles.icon}/>
          <Image src="/instagram.png" alt='2' width={15} height={15} className={styles.icon}/>
          <Image src="/twitter.png" alt='3' width={15} height={15} className={styles.icon}/>
          <Image src="/youtube.png" alt='4' width={20} height={20} className={styles.icon}/>
        </div>
    </div>
  )
}

export default Footer
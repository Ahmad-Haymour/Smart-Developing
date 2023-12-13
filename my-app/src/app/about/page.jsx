import Image from 'next/image'
import React from 'react'

const About = () => {
  return (
    <div className={styles.container}>
      <div className={styles.imgContainer}>
        <Image 
          src="https://images.pexels.com/photos/3194521/pexels-photo-3194521.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
          fill={true} 
          alt='' 
          className={styles.img} 
        />
      </div>
      <div className={styles.textContainer}>
        <h1 className={styles.imgTitle}>Who Are We?</h1>
        <h2 className={styles.imgDec}></h2>
      </div>
    </div>
  )
}

export default About
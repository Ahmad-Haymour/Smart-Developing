import Link from 'next/link'
import React from 'react'
import styles from './page.module.css'

const Portfolio = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.selectTitle}>Choose a gallery</h1>
      <div className={styles.items}>
        <Link href="/portfolio/illustrations" className={styles.item}>
          <span>Illustrations</span>
        </Link>
        <Link href="/portfolio/websites" className={styles.item}>
          <span>Websites</span>
        </Link>
        <Link href="/portfolio/applications" className={styles.item}>
          <span>Applications</span>
        </Link>

      </div>
    </div>
  )
}

export default Portfolio
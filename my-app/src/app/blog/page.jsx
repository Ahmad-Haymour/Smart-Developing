import React from 'react'
import styles from "./page.module.css"
import Link from 'next/link'
import Image from 'next/image'

async function getData() {

  try {
    const res = await fetch(`/api/posts`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch data. Status: ${res.status}`);
    }
    
    return res.json();

  } catch (error) {
    throw new Error("Failed to fetch data")
  }
 
  // const res = await fetch(`http://localhost:3000/api/posts`, {
  //   cache: "no-store"
  // });

  // if (!res.ok) {
  //   throw new Error("Failed to fetch data")
  // }
  // return res.json();
}

const Blog = async () => {

  const data = await getData();

  return (
    <div className={styles.mainContainer}>
      {
        !data ? <h1>Data not found!!!</h1>:
        data.map( (item) => (
          <Link 
            href={`/blog/${item._id}`} 
            className={styles.container} 
            key={item.id}
          >
              <div className={styles.imgContainer}>
              <Image 
                className={styles.image}
                width={400}
                height={250}
                src={item.img}
                alt=''
              />
              </div>
              <div className={styles.content}>
                <h1 className={styles.title}>{item.title}</h1>
                <p className={styles.desc}>{item.desc}</p>
              </div>
          </Link>
        ))
      }
    </div>
  )
}

export default Blog;
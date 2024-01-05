"use client"

import styles from "./page.module.css"
import useSWR from 'swr'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image';
import { useState } from "react"
import Link from "next/link"

const Dashboard = () => {

  const session = useSession();
  const router = useRouter();
  
  const fetcher = (...args) => fetch(...args).then(res=> res.json())
  
  const { data, mutate, error, isLoading } = useSWR(`/api/posts?username=${session?.data?.user.name}`, fetcher) 

  if (session.status === "loading") {
    return <p>Loading...</p>;
  }
  
  if (session.status === "unauthenticated") {
    router?.push("/dashboard/login");
  }
  
  const [allowedDomains] = useState(['https://cdn.pixabay.com/', 'https://images.pexels.com/']);
  const [err, setErr] = useState(null);

  const checkDomain = (imageURL) =>{
    const isMatched = allowedDomains.some(domain => imageURL.startsWith(domain));

    if (!isMatched) {
      setErr (
        `The URL must start with one of the allowed domains. 
         Allowed domains are: ${allowedDomains.join(' OR ')}`
      )
      return false;
    } else {
        setErr(null);
        return true; 
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setErr(null);

    if (!session || !session.data || !session.data.user || !session.data.user.name) {
      router?.push("/dashboard/login");
      return;
    }

    const title = e.target[0].value;
    const desc = e.target[1].value;
    const img = e.target[2].value;
    const content = e.target[3].value;

    const imageDomainMessage = checkDomain(img);

    if (!imageDomainMessage) {
      console.log("LOOK HERE: ", imageDomainMessage);
      return;
    }

    try {
      await fetch("/api/posts", {
        method: "POST",
        body: JSON.stringify({
          title,
          desc,
          img,
          content,
          username: session.data.user.name,
        }),
      });
      mutate();
      e.target.reset()
    } catch (err) {
      console.log(err);
    }
  }

  const handleDelete = async (id) => {

    try {
        await fetch(`/api/posts/${id}`, {
          method: "DELETE",
        });
        mutate();
    } catch (err) {
        console.log(err);
    }
  }

  if (session.status === "authenticated") {
    return (
      <div className={styles.container}>
        <div className={styles.posts}>
          {
            isLoading ? "Loading"
            :
            data?.map((post) => (
              <Link 
                href={`/blog/${post._id}`} 
                className={styles.post} 
                key={post._id}
              > 
                  <div className={styles.imgContainer}>
                    <Image
                        src={post.img} alt="" width="200" height="100"
                    />
                  </div>
                  <h2  className={styles.postTitle}>
                    {post.title}
                  </h2>
                  <span 
                    className={styles.delete}
                    onClick={() => handleDelete(post._id)}
                  >
                    X
                  </span>
                </Link>
            ))
          }
        </div>
        <form className={styles.new} onSubmit={handleSubmit}>
          <h1>Add New Post</h1>
          <input type="text" placeholder='Title' className={styles.input}/>
          <input type="text" placeholder='Desc' className={styles.input} />
          <input type="text" placeholder='Image' className={styles.input} />
          {
            err && <p className={styles.errMessage}>{err}</p>
          }
          <textarea placeholder='Content' className={styles.textArea} cols="30" rows="10"></textarea>
          <button className={styles.button}>Send</button>
        </form>
      </div>
    )
  }
}

export default Dashboard
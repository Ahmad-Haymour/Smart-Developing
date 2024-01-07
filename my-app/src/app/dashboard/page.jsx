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
  
  const { data, mutate, error, isLoading } = useSWR(session ? `/api/posts?username=${session?.data?.user?.name}` : null, fetcher) 

  if (session.status === "loading" || isLoading) {
    return <p>Loading...</p>;
  }
  
  if (session.status === "unauthenticated" || !session) {
    router?.push("/dashboard/login");
    return null; // Stop rendering if not authenticated
  }
  
  const allowedDomains = ['https://cdn.pixabay.com/', 'https://images.pexels.com/'];
  const [err, setErr] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setErr(false);

    if (!session || !session.data || !session.data.user || !session.data.user.name) {
      router?.push("/dashboard/login");
      return;
    }

    const title = e.target[0].value;
    const desc = e.target[1].value;
    const img = e.target[2].value;
    const content = e.target[3].value;

    const isMatched = allowedDomains.some(domain => img.startsWith(domain));

    if (!isMatched) {
      console.log("LOOK HERE: ", imageDomainMessage);
      console.log("LOOK HERE ERROR: ", error);
      setErr(true);
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
            err && 
            <p className={styles.errMessage}>
              The URL must start with one of the allowed domains. 
                Allowed domains are: { allowedDomains.join(' OR ') }
            </p>
          }
          <textarea placeholder='Content' className={styles.textArea} cols="30" rows="10"></textarea>
          <button className={styles.button}>Send</button>
        </form>
      </div>
    )
  }
}

export default Dashboard
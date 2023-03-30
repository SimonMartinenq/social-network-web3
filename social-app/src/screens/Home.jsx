import { useEffect, useState } from "react";
import axios from "axios";
import PostCard from "./PostCard";

function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("https://restcountries.com/v3.1/all").then((response) => {
      setData(response.data);
    });
  }, []);
  return (
    <>
      <header><h1>File d'actualité</h1></header>
      <main>
        <section className="feed">
          <ul>
            {data.map((country, index) => (
              <PostCard key={index} country={country} />
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}

export default Home;

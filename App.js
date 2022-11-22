import React, { useState, useEffect} from "react"
import './App.css';

function App({ login }){
  const [data, setData] = useState(null);
  const [loading,setloading] = useState(null);
  const [error, setError] = useState(null);

    useEffect(() => {
      if(!login) return;
      setloading(true);

      fetch(`https://api.github.com/users/${login}`)
        .then(response => response.json())
        .then(setData)
        .then(()=> setloading(false))
        .catch(setError);
    },[login]);

    if(loading) return <h1>Loading...</h1>;
    if(error) 
      return <pre>{JSON.stringify(error, null, 2)}</pre>;
    if(!data) return null;

      return <div>
        <h1>{data.name}</h1>
        <p>{"this is my pic"}</p>
        <p>{data.location}</p>
        <img alt ={data.login} src = {data.avatar_url}/>
        <button onClick={sayHello}>Default</button>;
      </div>

}

function sayHello(){
  alert('You clicked me!');
}

export default App;

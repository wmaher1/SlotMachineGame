import logo from './logo.svg';
import './App.css';
import './index.html'
import React, {useState, useEffect } from 'react';
import { GoogleLogin, googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

function App() {
    const [user, setUser] = useState([]);
    const [profile, setProfile] = useState([]);

    const login = useGoogleLogin({
      onSuccess: (codeResponse) => setUser(codeResponse),
      onError: (error) => console.log('Login Failed', error)
    });

    useEffect(
      () => {
          if (user) {
              axios
                  .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                      headers: {
                          Authorization: `Bearer ${user.access_token}`,
                          Accept: 'application/json'
                      }
                  })
                  .then((res) => {
                      setProfile(res.data);
                  })
                  .catch((err) => console.log(err));
          }
      },
      [ user ]
    );

    // log out function, sets profile array to null when user logs out
    const logOut = () => {
      googleLogout();
      setProfile(null);
    };
 
  return (
    <div>
      <h2>React Google Login</h2>
      <br />
      <br />
      {profile ? (
          <div>
              <img src={profile.picture} alt="user.image" />
              <h3>User Logged in</h3>
              <p>Name: {profile.name}</p>
              <p>Email Address: {profile.email}</p>
              <br />
              <br />
              <button onClick={logOut}>Log Out</button>
          </div>
          ) : (
            <button onClick={() => login()}>Sign in with Google 🚀 </button>
        
      )}
      <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
    </div>
  )
}

export default App;

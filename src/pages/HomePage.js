import React from 'react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import '../App.css';

function HomePage() {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <div className="App">
      <h1>Welcome to the Home Page!</h1>
      <p>You are logged in.</p>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
}

export default HomePage;

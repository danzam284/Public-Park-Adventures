import './App.css';
import React from 'react';
import { SignedOut, SignedIn, SignIn, SignUp, UserButton } from "@clerk/clerk-react";
import { Routes, Route } from "react-router-dom";
import Home from './components/Home.jsx';
import SignedOutPage from './components/SignedOutPage.jsx';

function App() {
  return (
    <div>
      <SignedOut>
          <SignedOutPage />
      </SignedOut>

      <SignedIn>
        <UserButton />
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path="/sign-in/*" element={<SignIn />} />
          <Route path="/sign-up/*" element={<SignUp />} />
        </Routes>
      </SignedIn>
    </div>
  );
}

export default App;

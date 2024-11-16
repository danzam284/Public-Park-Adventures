import './App.css';
import React from 'react';
import { SignedOut, SignedIn, SignIn, SignUp, UserButton } from "@clerk/clerk-react";
import { Routes, Route } from "react-router-dom";
import Home from './components/Home.jsx';
import SignedOutPage from './components/SignedOutPage.jsx';
import Rate from './components/Rate.jsx';
import Park from './components/Park.jsx';
import Search from './components/Search.jsx';
import Location from './components/Location.jsx';

function App() {
  return (
    <div>
      <SignedOut>
          <SignedOutPage />
      </SignedOut>

      <SignedIn>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/park/:id' element={<Park/>} />
          <Route path='/rate' element={<Rate/>} />
          <Route path='/search' element={<Search/>} />
          <Route path='/location' element={<Location/>} />
          <Route path="/sign-in/*" element={<SignIn />} />
          <Route path="/sign-up/*" element={<SignUp />} />
        </Routes>
      </SignedIn>
    </div>
  );
}

export default App;

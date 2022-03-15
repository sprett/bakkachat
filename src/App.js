import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyClUzESsqn21DXOVXIfAqxr-XcdUCKFDhg",
    authDomain: "superchat-auth.firebaseapp.com",
    projectId: "superchat-auth",
    storageBucket: "superchat-auth.appspot.com",
    messagingSenderId: "247989522189",
    appId: "1:247989522189:web:69a5a1c6e2b27ca337aa44"
})

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {

const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1>BakkaChat</h1>
        <SignOut />
      </header>
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return(
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
}

function SignOut () {
  return auth.currentUser && (

    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom() {

  const dummy = useRef()

  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query);

  const [formValue, setFormValue] = useState('');

  const sendMessage = async(e) => {

  e.preventDefault();
  
  const { uid, photoURL } = auth.currentUser;

  await messagesRef.add({
    text: formValue,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    uid,
    photoURL
  });

    setFormValue('');

    dummy.current.scrollIntoView({ behavior: 'smooth'})

  }

  return (
    <>
    <main>
      {messages && messages.map(msg => <ChatMessages key={msg.id} message={msg} />)}

      <div ref={dummy}></div>

    </main>

    <form onSubmit={sendMessage}>

      <input placeholder='Send message...' value={formValue} onChange={(e) => setFormValue(e.target.value)} />

      <button type='submit'><svg height={40} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
</svg></button>

    </form>

    </>
  )
}

function ChatMessages(props) {
  const {text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'recieved';

  return (
  <div className={`message ${messageClass}`}>
    <img src={photoURL} />
    <p>{text}</p>
  </div>
  )
}

export default App;

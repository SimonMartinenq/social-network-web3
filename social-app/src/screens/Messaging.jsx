import React, { useRef, useState } from "react";
import { AiOutlineSend } from "react-icons/ai";
import { VscSignOut } from "react-icons/vsc";

import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

firebase.initializeApp({
  apiKey: "AIzaSyD2yROpxU26lTglNWqJrNWQTOJD8xfywRs",
  authDomain: "social-app-39296.firebaseapp.com",
  projectId: "social-app-39296",
  storageBucket: "social-app-39296.appspot.com",
  messagingSenderId: "239734817527",
  appId: "1:239734817527:web:f2c26ddf40d12d4aabc9f2",
});

export const auth = firebase.auth();
const firestore = firebase.firestore();

function Messaging() {
  const [user] = useAuthState(auth);
  return (
    <>
      <header>
        <h1>Message</h1>
      </header>
      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>
        Sign in with Google
      </button>
    </>
  );
}

export function SignOut() {
  return (
    auth.currentUser && (
      <button className="sign-out" onClick={() => auth.signOut()}>
        <VscSignOut />
      </button>
    )
  );
}

function ChatRoom() {
  const dummy = useRef();

  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt").limit(25);

  const [messages] = useCollectionData(query, { idField: "id" });
  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    });

    setFormValue("");
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <main>
        <section className="feed">
          <div className="listMessage">
            {messages &&
              messages.map((msg, index) => (
                <ChatMessage key={index} message={msg} />
              ))}

            <span ref={dummy}></span>
          </div>
          <div className="m-4">
            <form onSubmit={sendMessage} className="flex">
              <input
                value={formValue}
                onChange={(e) => setFormValue(e.target.value)}
                placeholder="say something nice"
                className="inputMessage"
              />

              <button
                type="submit"
                className="buttonSend"
                disabled={!formValue}
              >
                <AiOutlineSend />
              </button>
            </form>
          </div>
        </section>
      </main>
    </>
  );
}

function ChatMessage(props) {
  const { text, uid } = props.message;

  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";

  return (
    <>
      <div className={`message ${messageClass}`}>
        <p>{text}</p>
      </div>
    </>
  );
}

export default Messaging;

import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase-config";
import {
  collection,
  addDoc,
  where,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

export const TeamChat = ({ room }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const messagesRef = collection(db, "messages");

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      console.log("Auth state changed:", user?.displayName);
      setCurrentUser(user);
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!room) {
      console.log("Room not set yet");
      return;
    }

    const queryMessages = query(
      messagesRef,
      where("room", "==", room),
      orderBy("createdAt")
    );

    const unsubscribe = onSnapshot(
      queryMessages,
      (snapshot) => {
        let messages = [];
        snapshot.forEach((doc) => {
          messages.push({ ...doc.data(), id: doc.id });
        });
        console.log("Messages loaded for room", room, ":", messages.length);
        setMessages(messages);
      },
      (error) => {
        console.error("Error loading messages for room", room, ":", error);
      }
    );

    return () => unsubscribe();
  }, [room]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (newMessage.trim() === "") return;

    if (!currentUser) {
      console.error("User not authenticated");
      alert("Please sign in first");
      return;
    }

    try {
      console.log("Sending message:", { text: newMessage, user: currentUser.displayName, room });
      await addDoc(messagesRef, {
        text: newMessage,
        createdAt: serverTimestamp(),
        user: currentUser.displayName,
        room,
        userId: currentUser.uid,
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Check console for details.");
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0f0f0f] rounded-lg border border-primary/20">
      <div className="chat-container">
        <div className="chat-header">
          <h2 className="gradient-title text-xl font-bold text-center">
            {room.toUpperCase()}
          </h2>
        </div>

        <div className="chat-messages">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`message-bubble ${
                  message.user === auth.currentUser.displayName ? "sent" : "received"
                }`}
              >
                <div className="text-sm font-semibold mb-1 gradient-text">
                  {message.user}
                </div>
                <div className="text-white/90">
                  {message.text}
                </div>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleSubmit} className="chat-input-container">
          <div className="chat-input-wrapper">
            <input
              type="text"
              value={newMessage}
              onChange={(event) => setNewMessage(event.target.value)}
              className="message-input"
              placeholder="Type your Message Here..."
            />
            <button
              type="submit"
              className="send-button"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

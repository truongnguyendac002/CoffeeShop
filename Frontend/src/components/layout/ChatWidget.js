import React, { useState, useEffect, useRef } from "react";
import { MessageOutlined, CloseOutlined } from "@ant-design/icons";
import { Input, Button } from "antd";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import fetchWithAuth from "../../helps/fetchWithAuth";
import summaryApi from "../../common/index";

const ChatWidget = () => {
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [conversation, setConversation] = useState(null);
  const [message, setMessage] = useState("");
  const user = useSelector((state) => state?.user?.user);
  const stompClient = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user) {
      setIsChatOpen(false);
    };
  }, [user]);
  useEffect(() => {
    if (!user && isChatOpen) {
      navigate("/login");
    };
  });

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const response = await fetchWithAuth(
          summaryApi.getConversationOfUser.url + user?.id,
          {
            method: summaryApi.getConversationOfUser.method,
          }
        );
        const data = await response.json();
        if (data.respCode === "000") {
          const conversationData = data.data;
          if (!conversationData) {
            console.log(" error conversationData is null");
          }
          else {
            setConversation(conversationData);
          }
        }
        else {
          console.error("Error fetching conversation list:", data);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    }
    if (user && isChatOpen) fetchConversation();

  }, [user, isChatOpen]);

  useEffect(() => {
    if (isChatOpen) {
      const socketFactory = () => new SockJS("http://localhost:8080/ws");
      stompClient.current = Stomp.over(socketFactory);
      stompClient.current.connect(
        {},
        () => {
          console.log("Connected to WebSocket");
          stompClient.current.subscribe(`/topic/conversation/${conversation.id}`, (data) => {
            const response = JSON.parse(data.body);
            if (response.respCode === "000") {
              const conv = response.data;
              setConversation(conv);
            }
          });
        },
        (error) => console.error("WebSocket connection error:", error)
      );
    }
    return () => {
      if (stompClient.current) {
        stompClient.current.disconnect();
      }
    };
  }, [conversation, isChatOpen, user]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation]); // Mỗi khi conversation thay đổi (có tin nhắn mới)


  const handleSendMessage = () => {
    if (message.trim() && stompClient.current) {
      const chatMessage = {
        senderId: user.id,
        content: message,
        conversationId: conversation.id,
      };
      stompClient.current.send(`/app/chat/${conversation.id}`, {}, JSON.stringify(chatMessage));

      setMessage("");
    }
  };

  return (
    <div className="fixed bottom-10 right-4 sm:right-10 z-10">
      {!isChatOpen && (
        <div
          className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg"
          onClick={() => setIsChatOpen(true)}
        >
          <MessageOutlined style={{ fontSize: "24px" }} />
        </div>
      )}
      {isChatOpen && user && (
        <div className="bg-white shadow-lg rounded-lg p-4 w-72 sm:w-96 max-w-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Chat with Admin</h3>
            <CloseOutlined
              className="cursor-pointer"
              onClick={() => setIsChatOpen(false)}
            />
          </div>
          <div className="mb-4 h-60 bg-gray-100 rounded p-2 overflow-y-auto">
            {conversation?.messageList?.map((msg) => (
              <p key={msg?.id} className="text-sm">
                {msg.senderId === user.id ? (
                  <>
                    <strong className="text-blue-600">You:</strong> {msg.content}
                  </>
                ) : (
                  <>
                    <strong className="text-red-600">Admin:</strong> {msg.content}
                  </>
                )}
              </p>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <Input.TextArea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            placeholder="Enter your message"
            className="mb-2"
            style={{ maxHeight: "100px",  overflowY: "auto" }}
          />
          <Button type="primary" className="w-full" onClick={handleSendMessage}>
            Send
          </Button>
        </div>
      )}
    </div>

  );
};


export default ChatWidget;

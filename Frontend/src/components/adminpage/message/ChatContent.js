import React, { useState, useEffect, useRef } from "react";
import { List, Avatar, Input, Spin, Button, Typography, Pagination } from "antd";
import { LoadingOutlined, SendOutlined, UserOutlined } from "@ant-design/icons";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useSelector } from "react-redux";
import fetchWithAuth from "../../../helps/fetchWithAuth";
import summaryApi from "../../../common/index";

const { Text } = Typography;

const ChatContent = () => {
  const [loading, setLoading] = useState(true);
  const [selectedConversationId, setselectedConversationId] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [conversationList, setConversationList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); // Số mục hiển thị trên mỗi trang
  const stompClient = useRef(null);
  const messagesEndRef = useRef(null);

  const user = useSelector((state) => state?.user?.user);

  useEffect(() => {
    const fetchAllConversation = async () => {
      try {
        setLoading(true);
        const response = await fetchWithAuth(
          summaryApi.getAllConversation.url,
          {
            method: summaryApi.getAllConversation.method,
          }
        );
        const data = await response.json();
        if (data.respCode === "000") {
          setConversationList(data.data);
        } else {
          console.error("Error fetching conversation list:", data);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllConversation();
  }, []);

  useEffect(() => {
    setLoading(true);
    const socketFactory = () => new SockJS("http://localhost:8080/ws");
    stompClient.current = Stomp.over(socketFactory);
    stompClient.current.connect(
      {},
      () => {
        setLoading(false);
        stompClient.current.subscribe("/topic/admin", (data) => {
          const response = JSON.parse(data.body);
          if (response.respCode === "000") {
            const conv = response.data;
            setConversationList((prev) => {
              const index = prev.findIndex((c) => c.id === conv.id);
              if (index === -1) {
                return [...prev, conv];
              }
              return [
                ...prev.slice(0, index),
                conv,
                ...prev.slice(index + 1),
              ];
            });
          } else {
            console.error("Error fetching conversation list:", response);
          }
        });
      },
      (error) => console.error("WebSocket connection error:", error)
    );

    return () => {
      if (stompClient.current) {
        stompClient.current.disconnect();
      }
    };
  }, []);

  const handleSendMessage = (conversationId) => {
    if (newMessage.trim() && selectedConversationId && stompClient.current) {
      const chatMessage = {
        senderId: user.id,
        content: newMessage,
        conversationId: conversationId,
      };
      stompClient.current.send(
        `/app/chat/${conversationId}`,
        {},
        JSON.stringify(chatMessage)
      );
      setNewMessage("");
    }
  };

  // Hook để cuộn tới cuối mỗi khi tin nhắn mới được thêm vào
  useEffect(() => {
    if (messagesEndRef?.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversationList]);

  if (loading || !user) {
    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <Spin indicator={antIcon} />
      </div>
    );
  }


  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const paginatedData = conversationList
    .sort((a, b) => a.hostId - b.hostId)
    .slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );

  return (
    <div className="flex -mt-5 h-[calc(100vh-60px)]">
      {/* Sidebar */}
      <div className="w-1/4 border-r pt-4 pr-4">
        <Text className="text-xl font-semibold mb-4 block">Conversations</Text>
        <List
          itemLayout="horizontal"
          dataSource={paginatedData}
          renderItem={(conversation) => (
            <List.Item
              key={conversation.id}
              className={`cursor-pointer rounded-lg ${selectedConversationId === conversation.id
                ? "bg-blue-100"
                : "hover:bg-gray-50"
                }`}
              onClick={() => setselectedConversationId(conversation.id)}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    size={40}
                    src={conversation.hostAvatar || null}
                    icon={<UserOutlined />}
                    className="bg-transparent text-gray-500 ml-2"
                  />
                }
                title={<Text>{conversation.hostName}</Text>}
              />
            </List.Item>
          )}
        />
        <Pagination
          className="mt-4"
          current={currentPage}
          pageSize={pageSize}
          total={conversationList.length}
          onChange={handlePageChange}
        />
      </div>


      {/* Chat Area */}
      <div className="flex-1 max-h-full flex flex-col">
        {/* Khu vực hiển thị tin nhắn */}
        <div className="flex-1 overflow-y-auto p-4 bg-white">
          {selectedConversationId ? (
            (conversationList.find(
              (c) => c.id === selectedConversationId
            )?.messageList || []).map((msg) => (
              <div
                key={msg.id}
                className={`mb-3 ${msg.senderId === user.id ? "text-right" : "text-left"}`}
              >
                <div
                  className={`inline-block max-w-[75%] px-3 py-2 rounded-xl ${msg.senderId === user.id
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-200 text-black rounded-bl-none"
                    }`}
                >
                  {msg.content}
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-center mt-20">
              <p>No conversation selected</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Thanh nhập tin nhắn */}
        {selectedConversationId && (
          <div className="p-4 bg-gray-50 border-t flex items-center">
            <Input.TextArea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              rows={1}
              placeholder="Type your message..."
              className="flex-1 mr-2 p-2 resize-none"
              autoSize={{ minRows: 1, maxRows: 5 }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(selectedConversationId);
                }
              }}

            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={() => handleSendMessage(selectedConversationId)}
              className="pt-2 pb-2"
            >
              Send
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatContent;

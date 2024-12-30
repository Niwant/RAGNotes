import { useState } from "react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "./ui/drawer"; // Update path as per your structure
import { createChat } from "@/api/chatApi"; // Update path as per your structure

export default function ChatDrawer() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const handleSend = async() => {
    if (input.trim()) {
      setMessages([...messages, input]);
      setInput("");
      const response = await createChat({ title: "Chat", chatContent: input });
      setMessages([...messages ,input, response.message])
    }
  };

  return (
    <div>
      {/* Drawer Button */}
      <Drawer>
        <DrawerTrigger asChild>
          <button className="fixed bottom-4 right-4 p-3 bg-blue-500 text-white rounded-full shadow-lg">
            Chat
          </button>
        </DrawerTrigger>

        {/* Drawer Content */}
        <DrawerContent
          className="w-full h-[70vh] bg-white flex flex-col"
         >
          {/* Drawer Header */}
          <DrawerHeader className="p-4 border-b">
            <DrawerTitle className="text-lg font-bold">Chat</DrawerTitle>
          </DrawerHeader>

          {/* Chat Messages */}
          <div className="flex-1 p-4 space-y-3 overflow-y-auto">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-lg ${
                  idx % 2 === 0 ? "bg-gray-200" : "bg-blue-500 text-white"
                }`}
              >
                {msg}
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-2 border rounded-lg mr-2"
            />
            <button
              onClick={handleSend}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Send
            </button>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}


import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog.tsx";
import { useState } from "react";

export default function HomePage() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, input]);
      setInput("");
    }
  };

  return (
    <div className="relative">
      {/* Chat Button and Popup */}
      <Dialog>
        <DialogTrigger asChild>
          {/* Chat Button */}
          <button className="fixed bottom-4 right-4 p-3 bg-blue-500 text-white rounded-full shadow-lg">
            Chat
          </button>
        </DialogTrigger>

        {/* Chat Popup Content */}
        <DialogContent className="w-full">
          <DialogHeader>
            <DialogTitle>Chat</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col h-full">
            {/* Chat Messages */}
            <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-gray-100 rounded-md">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded-lg ${
                    idx % 2 === 0 ? "self-start bg-gray-200" : "self-end bg-blue-500 text-white"
                  }`}
                >
                  {msg}
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-4 flex items-center border-t">
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
          </div>
          <DialogFooter>
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded-lg"
              onClick={() => setMessages([])} // Optional: Clear chat messages
            >
              Clear
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


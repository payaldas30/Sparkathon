"use client";
import { useState, useEffect, useRef } from "react";
import { useSession, signOut, SessionProvider } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  MessageSquarePlus,
  LogOut,
  Bot,
  Trash2,
  Send,
  User,
  Loader2,
  Mic,
  MicOff,
} from "lucide-react";
import UserButton from "@/components/user-button";
import { Product } from "@/lib/walmart-scrapper";
import ProductCarousel from "@/components/ProductCarousel";

type Message = {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  products?: Product[]; // Add products to message type
};

type ChatHistoryItem = {
  id: string;
  title: string;
  timestamp: Date;
  messages: Message[];
};

function ChatbotContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [inputValue, setInputValue] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechSupported, setSpeechSupported] = useState<boolean>(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
      setSpeechSupported(true);
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();

      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };
    }
  }, []);

  // Initialize with welcome message (for both authenticated and unauthenticated users)
  useEffect(() => {
    if (status !== "loading") {
      const welcomeName = session?.user?.name || "there";
      setMessages([
        {
          id: generateId(),
          text: `Hello ${welcomeName}! I'm your AI assistant. How can I help you today? You can type your message or use the microphone to speak!`,
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    }
  }, [session, status]);

  const generateId = () => {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  };

  const toggleSidebar = () => {
    // Only allow sidebar toggle for authenticated users
    if (status === "authenticated") {
      setIsOpen(!isOpen);
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleNewChat = () => {
    // Only allow new chat for authenticated users
    if (status !== "authenticated") return;

    // Save current chat if it has messages
    if (messages.length > 1) {
      const firstUserMessage = messages.find((msg) => msg.sender === "user");
      const chatTitle = firstUserMessage
        ? firstUserMessage.text.slice(0, 40) +
          (firstUserMessage.text.length > 40 ? "..." : "")
        : "New Chat";

      const newChatItem: ChatHistoryItem = {
        id: generateId(),
        title: chatTitle,
        timestamp: new Date(),
        messages: [...messages],
      };

      setChatHistory((prev) => [newChatItem, ...prev]);
    }

    // Clear current chat
    setMessages([
      {
        id: generateId(),
        text: `Hello ${
          session?.user?.name || "there"
        }! I'm your AI assistant. How can I help you today? You can type your message or use the microphone to speak!`,
        sender: "bot",
        timestamp: new Date(),
      },
    ]);
    setInputValue("");
  };

  const loadChat = (chatId: string) => {
    if (status !== "authenticated") return;

    const chatToLoad = chatHistory.find((chat) => chat.id === chatId);
    if (chatToLoad) {
      setMessages(chatToLoad.messages);
      setIsOpen(false);
    }
  };

  const deleteChat = (chatId: string, e: React.MouseEvent) => {
    if (status !== "authenticated") return;

    e.stopPropagation();
    setChatHistory((prev) => prev.filter((chat) => chat.id !== chatId));
  };

  const clearAllChats = () => {
    if (status !== "authenticated") return;
    setChatHistory([]);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Voice recognition functions
  const startListening = () => {
    if (status === "unauthenticated") {
      router.push("/sign-up");
      return;
    }

    if (recognitionRef.current && speechSupported) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error("Error starting speech recognition:", error);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Simulate bot response
  const getBotResponse = (userMessage: string): string => {
    const responses = [
      "Here are some products that might interest you:",
      "I found these options for you:",
      "Based on your query, I recommend these:",
      "These products match what you're looking for:",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  // Handle input focus - redirect to sign-up if not authenticated
  const handleInputFocus = () => {
    if (status === "unauthenticated") {
      router.push("/sign-up");
    }
  };

  // Handle input change - redirect to sign-up if not authenticated
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (status === "unauthenticated") {
      router.push("/sign-up");
      return;
    }
    setInputValue(e.target.value);
  };

const handleSendMessage = async () => {
  if (!inputValue.trim() || isLoading) return;

  // Add user message
  const userMessage: Message = {
    id: generateId(),
    text: inputValue,
    sender: "user",
    timestamp: new Date(),
  };

  setMessages((prev) => [...prev, userMessage]);
  setInputValue("");
  setIsLoading(true);

  try {
    // First check if we should scrape
    const scrapingDecision = await checkScrapingNeeded(inputValue);
    
    // Call the appropriate API endpoint
    const response = await fetch('/api/aiover', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userInput: inputValue,
        // If we have image URL, include it here
        // imageUrl: imageUrl (if you have this variable)
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'API request failed');
    }

    // Create bot message
    const botMessage: Message = {
      id: generateId(),
      text: data.message,
      sender: "bot",
      timestamp: new Date(),
      // If the response contains products, include them
      products: scrapingDecision.shouldScrape ? await getScrapedProducts(scrapingDecision.productQuery) : undefined
    };

    setMessages((prev) => [...prev, botMessage]);
  } catch (error) {
    console.error("Failed to process message:", error);
    // Fallback response
    setMessages((prev) => [
      ...prev,
      {
        id: generateId(),
        text: "I encountered an error while processing your request. Please try again.",
        sender: "bot",
        timestamp: new Date(),
      },
    ]);
  } finally {
    setIsLoading(false);
  }
};

// Helper function to get scraped products if needed
const getScrapedProducts = async (query: string): Promise<Product[] | undefined> => {
  try {
    const response = await fetch(`/api/webscrap?query=${encodeURIComponent(query)}`);
    if (!response.ok) return undefined;
    const data = await response.json();
    return data.products || undefined;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return undefined;
  }
};

// Helper function to check if scraping is needed (unchanged)
const checkScrapingNeeded = async (userQuery: string) => {
  try {
    const response = await fetch("/api/shouldScrap", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userQuery: userQuery,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return {
      shouldScrape: data.shouldScrape || false,
      productQuery: data.productQuery || "",
      confidence: data.confidence || 0,
    };
  } catch (error) {
    console.error("Error checking scraping need:", error);
    return {
      shouldScrape: false,
      productQuery: "",
      confidence: 0,
    };
  }
};
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (status === "unauthenticated") {
      router.push("/sign-up");
      return;
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/sign-in" });
  };

  // Show loading spinner while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  const isAuthenticated = status === "authenticated";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col">
      {/* Only show UserButton for authenticated users */}

      {isAuthenticated && <UserButton />}

      {/* Sidebar toggle button - only show for authenticated users */}
      {isAuthenticated && (
        <button
          onClick={toggleSidebar}
          className={`fixed z-50 p-3 rounded-full transition-all shadow-lg ${
            isOpen
              ? "left-64 top-6 bg-gray-700 hover:bg-gray-600"
              : "left-6 top-6 bg-blue-600 hover:bg-blue-700"
          }`}
          aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isOpen ? (
            <X className="text-white w-5 h-5" />
          ) : (
            <Menu className="text-white w-5 h-5" />
          )}
        </button>
      )}

      {/* Sidebar - only show for authenticated users */}
      {isAuthenticated && (
        <div
          className={`fixed h-screen w-80 bg-gray-800/95 backdrop-blur-lg border-r border-gray-700 flex flex-col z-40 transition-all duration-300 ${
            isOpen ? "left-0" : "-left-full"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <div>
              <h1 className="font-bold text-xl text-white">ChatBot</h1>
              <p className="text-sm text-gray-400">
                Welcome, {session?.user?.name || session?.user?.email}
              </p>
            </div>
            {session?.user?.image && (
              <img
                src={session.user.image}
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-gray-600"
              />
            )}
          </div>

          {/* Chat Controls */}
          <div className="p-4 border-b border-gray-700">
            <button
              onClick={handleNewChat}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              <MessageSquarePlus className="w-5 h-5" />
              <span>New Chat</span>
            </button>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Chat History ({chatHistory.length})
              </h3>
              {chatHistory.length > 0 && (
                <button
                  onClick={clearAllChats}
                  className="text-xs text-red-400 hover:text-red-300 hover:underline"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="space-y-2">
              {chatHistory.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => loadChat(chat.id)}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-700/50 cursor-pointer group border border-gray-700/50"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate font-medium">
                      {chat.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDate(chat.timestamp)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {chat.messages.length} messages
                    </p>
                  </div>
                  <button
                    onClick={(e) => deleteChat(chat.id, e)}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 p-2 rounded-full hover:bg-gray-600 transition-all"
                    title="Delete chat"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {chatHistory.length === 0 && (
                <div className="text-center py-8">
                  <Bot className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No chat history yet</p>
                  <p className="text-xs text-gray-600 mt-1">
                    Start a conversation to see your chats here
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-gray-700 space-y-2">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}

      {/* Overlay - only show for authenticated users */}
      {isAuthenticated && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={toggleSidebar}
        />
      )}

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-4">
        {/* Messages */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto mb-6 px-4 max-h-[60vh] scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
        >
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex items-start gap-3 max-w-[80%] ${
                    message.sender === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      message.sender === "user" ? "bg-blue-600" : "bg-gray-700"
                    }`}
                  >
                    {/* Product Carousel - only for bot messages with products */}
                    {message.sender === "bot" &&
                      message.products &&
                      message.products.length > 0 && (
                        <ProductCarousel products={message.products} />
                      )}
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start gap-3 max-w-[80%]">
                  <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-700 rounded-2xl px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-300">
                        Searching for products...
                      </span>
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Type your message here..."
              className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none text-sm"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              disabled={isLoading}
            />

            {/* Microphone Button - Add this back */}
            {speechSupported && (
              <button
                onClick={toggleListening}
                disabled={isLoading}
                className={`p-3 rounded-full ${
                  isListening
                    ? "bg-red-600 hover:bg-red-700 text-white animate-pulse"
                    : "bg-gray-600 hover:bg-gray-500 text-gray-300"
                }`}
                title={isListening ? "Stop listening" : "Start voice input"}
              >
                {isListening ? (
                  <MicOff className="w-5 h-5" />
                ) : (
                  <Mic className="w-5 h-5" />
                )}
              </button>
            )}

            <button
              onClick={handleSendMessage || handleKeyPress}
              disabled={!inputValue.trim() || isLoading}
              className="p-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-600 disabled:text-gray-400"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function SimpleChatbot() {
  return (
    <SessionProvider>
      <ChatbotContent />
    </SessionProvider>
  );
}

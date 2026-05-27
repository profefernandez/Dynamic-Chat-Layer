import React, { createContext, useContext, useState, ReactNode, useRef, useEffect } from 'react';
import { useSendChat } from '@workspace/api-client-react';

export type Message = {
  role: 'user' | 'assistant';
  content: string;
  hidden?: boolean;
};

type ChatContextType = {
  messages: Message[];
  sendMessage: (content: string, hiddenPrompt?: boolean) => void;
  isSending: boolean;
  isOverlayOpen: boolean;
  setOverlayOpen: (open: boolean) => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Welcome to Launch Lemonade. How can I help you build today?' }
  ]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isOverlayOpen, setOverlayOpen] = useState(true);

  const { mutate: sendChat, isPending: isSending } = useSendChat();

  const sendMessage = (content: string, hiddenPrompt: boolean = false) => {
    // Add user message immediately if it's not hidden
    if (!hiddenPrompt) {
      setMessages((prev) => [...prev, { role: 'user', content }]);
    } else {
      setMessages((prev) => [...prev, { role: 'user', content, hidden: true }]);
    }

    sendChat(
      { data: { message: content, sessionId, hiddenPrompt } },
      {
        onSuccess: (data) => {
          setSessionId(data.sessionId);
          setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
          
          // Optionally slide up overlay on interaction
          if (hiddenPrompt) {
            setOverlayOpen(false);
          }
        },
      }
    );
  };

  return (
    <ChatContext.Provider value={{ messages, sendMessage, isSending, isOverlayOpen, setOverlayOpen }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}

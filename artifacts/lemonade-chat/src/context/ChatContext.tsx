import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useSendChat } from '@workspace/api-client-react';
import { useAdmin } from './AdminContext';

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
  const { editMode } = useAdmin();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: editMode
        ? "Admin mode preview: chat responses will be tagged with [ADMIN MODE] so your Lemonade can respond differently. Tiles and copy below are editable."
        : "Welcome to 60 Watts of Clarity. I'm your AI guide for literacy, consultation, and education. Click a service tile or ask me anything to get started.",
    },
  ]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isOverlayOpen, setOverlayOpen] = useState(true);

  const { mutate: sendChat, isPending: isSending } = useSendChat();

  const sendMessage = (content: string, hiddenPrompt: boolean = false) => {
    if (!hiddenPrompt) {
      setMessages((prev) => [...prev, { role: 'user', content }]);
    } else {
      setMessages((prev) => [...prev, { role: 'user', content, hidden: true }]);
    }

    sendChat(
      { data: { message: content, sessionId, hiddenPrompt, mode: editMode ? 'admin' : 'public' } },
      {
        onSuccess: (data) => {
          setSessionId(data.sessionId);
          setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
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

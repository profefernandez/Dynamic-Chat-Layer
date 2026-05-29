import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useSendChat, Element } from '@workspace/api-client-react';
import { useAdmin } from './AdminContext';

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  hidden?: boolean;
  element?: Element;
};

const makeId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

type ChatContextType = {
  messages: Message[];
  sendMessage: (content: string, hiddenPrompt?: boolean, elementId?: number | null) => void;
  sendElement: (element: Element) => void;
  isSending: boolean;
  isOverlayOpen: boolean;
  setOverlayOpen: (open: boolean) => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const { editMode } = useAdmin();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: makeId(),
      role: 'assistant',
      content: editMode
        ? "Admin mode preview: chat responses will be tagged with [ADMIN MODE] so your Lemonade can respond differently. Tiles and copy below are editable."
        : "Welcome to 60 Watts of Clarity. I'm your AI guide for literacy, consultation, and education. Click a service tile or ask me anything to get started.",
    },
  ]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isOverlayOpen, setOverlayOpen] = useState(true);

  const { mutate: sendChat, isPending: isSending } = useSendChat();

  const sendMessage = (
    content: string,
    hiddenPrompt: boolean = false,
    elementId: number | null = null,
  ) => {
    setMessages((prev) => [...prev, { id: makeId(), role: 'user', content, hidden: hiddenPrompt }]);

    sendChat(
      { data: { message: content, sessionId, hiddenPrompt, mode: editMode ? 'admin' : 'public', elementId } },
      {
        onSuccess: (data) => {
          setSessionId(data.sessionId);
          setMessages((prev) => [...prev, { id: makeId(), role: 'assistant', content: data.reply }]);
          if (hiddenPrompt) {
            setOverlayOpen(false);
          }
        },
      }
    );
  };

  const sendElement = (element: Element) => {
    const snapshot: Element = { ...element };
    setMessages((prev) => [...prev, { id: makeId(), role: 'user', content: snapshot.name, element: snapshot }]);

    sendChat(
      {
        data: {
          message: element.promptText,
          sessionId,
          hiddenPrompt: true,
          mode: editMode ? 'admin' : 'public',
          elementId: element.id,
        },
      },
      {
        onSuccess: (data) => {
          setSessionId(data.sessionId);
          setMessages((prev) => [...prev, { id: makeId(), role: 'assistant', content: data.reply }]);
          setOverlayOpen(false);
        },
      },
    );
  };

  return (
    <ChatContext.Provider value={{ messages, sendMessage, sendElement, isSending, isOverlayOpen, setOverlayOpen }}>
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

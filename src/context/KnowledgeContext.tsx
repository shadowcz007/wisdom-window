
import React, { createContext, useContext, useState, useEffect } from "react";

type KnowledgePoint = {
  id: string;
  title: string;
  content: string;
  description: string;
  selected: boolean;
  saved: boolean;
  timestamp?: string;
};

type ChatMessage = {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
};

interface KnowledgeContextType {
  inputText: string;
  setInputText: (text: string) => void;
  knowledgePoints: KnowledgePoint[];
  setKnowledgePoints: (points: KnowledgePoint[]) => void;
  selectedPoint: KnowledgePoint | null;
  setSelectedPoint: (point: KnowledgePoint | null) => void;
  savedPoints: KnowledgePoint[];
  savePoint: (point: KnowledgePoint) => void;
  chatMessages: ChatMessage[];
  addChatMessage: (content: string, isUser: boolean) => void;
  extractKnowledgePoints: () => void;
  isLoading: boolean;
  activeTab: 'input' | 'saved';
  setActiveTab: (tab: 'input' | 'saved') => void;
}

const initialKnowledgeContext: KnowledgeContextType = {
  inputText: '',
  setInputText: () => {},
  knowledgePoints: [],
  setKnowledgePoints: () => {},
  selectedPoint: null,
  setSelectedPoint: () => {},
  savedPoints: [],
  savePoint: () => {},
  chatMessages: [],
  addChatMessage: () => {},
  extractKnowledgePoints: () => {},
  isLoading: false,
  activeTab: 'input',
  setActiveTab: () => {}
};

const KnowledgeContext = createContext<KnowledgeContextType>(initialKnowledgeContext);

export const useKnowledge = () => useContext(KnowledgeContext);

export const KnowledgeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [inputText, setInputText] = useState<string>('');
  const [knowledgePoints, setKnowledgePoints] = useState<KnowledgePoint[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<KnowledgePoint | null>(null);
  const [savedPoints, setSavedPoints] = useState<KnowledgePoint[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'input' | 'saved'>('input');

  // Load saved points from localStorage
  useEffect(() => {
    const storedPoints = localStorage.getItem('savedKnowledgePoints');
    if (storedPoints) {
      setSavedPoints(JSON.parse(storedPoints));
    }
    
    const storedChat = localStorage.getItem('chatMessages');
    if (storedChat) {
      setChatMessages(JSON.parse(storedChat));
    }
  }, []);

  // Save points to localStorage whenever they change
  useEffect(() => {
    if (savedPoints.length > 0) {
      localStorage.setItem('savedKnowledgePoints', JSON.stringify(savedPoints));
    }
  }, [savedPoints]);
  
  useEffect(() => {
    if (chatMessages.length > 0) {
      localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
    }
  }, [chatMessages]);

  const savePoint = (point: KnowledgePoint) => {
    const pointToSave = { 
      ...point, 
      saved: true, 
      timestamp: new Date().toISOString() 
    };
    
    // Check if point already exists
    const exists = savedPoints.some(p => p.id === point.id);
    if (!exists) {
      setSavedPoints(prev => [...prev, pointToSave]);
    }
  };

  const addChatMessage = (content: string, isUser: boolean) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      isUser,
      timestamp: new Date().toISOString()
    };
    
    setChatMessages(prev => [...prev, newMessage]);
    
    if (isUser) {
      // Simulate assistant response
      setTimeout(() => {
        let response = "I'm searching through the knowledge base to find relevant information...";
        
        // Check if any saved points match the query
        const relevantPoints = savedPoints.filter(point => 
          point.title.toLowerCase().includes(content.toLowerCase()) ||
          point.content.toLowerCase().includes(content.toLowerCase())
        );
        
        if (relevantPoints.length > 0) {
          const point = relevantPoints[0]; // Use the first relevant point
          response = `Based on your knowledge base, I found this information about "${point.title}":\n\n${point.content}`;
        }
        
        const assistantMessage: ChatMessage = {
          id: Date.now().toString(),
          content: response,
          isUser: false,
          timestamp: new Date().toISOString()
        };
        
        setChatMessages(prev => [...prev, assistantMessage]);
      }, 1000);
    }
  };

  // Function to extract knowledge points from input text
  const extractKnowledgePoints = () => {
    if (!inputText.trim()) return;
    
    setIsLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Extract sentences and create knowledge points
      const sentences = inputText
        .split(/[.!?]/)
        .map(s => s.trim())
        .filter(s => s.length > 10);
      
      const extractedPoints: KnowledgePoint[] = sentences.map((sentence, index) => ({
        id: `kp-${Date.now()}-${index}`,
        title: sentence.substring(0, Math.min(40, sentence.length)) + (sentence.length > 40 ? '...' : ''),
        content: sentence,
        description: `This concept relates to ${sentence.split(' ').slice(0, 3).join(' ')}...`,
        selected: false,
        saved: false
      }));
      
      setKnowledgePoints(extractedPoints);
      setIsLoading(false);
    }, 1200);
  };

  return (
    <KnowledgeContext.Provider
      value={{
        inputText,
        setInputText,
        knowledgePoints,
        setKnowledgePoints,
        selectedPoint,
        setSelectedPoint,
        savedPoints,
        savePoint,
        chatMessages,
        addChatMessage,
        extractKnowledgePoints,
        isLoading,
        activeTab,
        setActiveTab
      }}
    >
      {children}
    </KnowledgeContext.Provider>
  );
};

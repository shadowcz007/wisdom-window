import React, { createContext, useContext, useState, useEffect } from "react";
import { experimental_createMCPClient as createMCPClient } from "ai";

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
  setInputText: () => { },
  knowledgePoints: [],
  setKnowledgePoints: () => { },
  selectedPoint: null,
  setSelectedPoint: () => { },
  savedPoints: [],
  savePoint: () => { },
  chatMessages: [],
  addChatMessage: () => { },
  extractKnowledgePoints: () => { },
  isLoading: false,
  activeTab: 'input',
  setActiveTab: () => { }
};

const KnowledgeContext = createContext<KnowledgeContextType>(initialKnowledgeContext);

export const useKnowledge = () => useContext(KnowledgeContext);

const SYSTEM_PROMPT = `你是一个专业的知识点提取助手。你的任务是从输入文本中提取或生成知识点。

请遵循以下要求：
1. 从输入文本中提取关键知识点
2. 如果文本中没有明显的知识点，则基于文本内容推荐相关的知识点
3. 返回格式必须是固定的JSON结构，格式如下：
{
  "knowledge_points": [
    {
      "title": "简短的知识点标题",
      "content": "详细的知识点内容",
      "description": "知识点的简要描述"
    }
  ]
}

注意事项：
- title: 应简明扼要，不超过40个字符
- content: 应详细完整地解释该知识点
- description: 应用简短的一句话描述该知识点的要点
- 每个字段都必须是字符串类型
- 至少返回1个知识点，最多返回5个知识点
- 确保返回的是合法的JSON格式`;

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

  const savePoint = async (point: KnowledgePoint) => {
    const pointToSave = {
      ...point,
      saved: true,
      timestamp: new Date().toISOString()
    };

    try {
      const sseMCPClient = await createMCPClient({
        transport: {
          type: "sse",
          url: "http://127.0.0.1:8090"
        }
      });

      // 获取远程工具
      const remoteTools: any = await sseMCPClient.tools();
      const tools = Object.entries(remoteTools).map(([name, tool]: any) => ({
        type: 'function',
        function: {
          name,
          description: tool.description,
          parameters: tool.parameters
        }
      }));

      // 准备消息时确保内容格式正确
      const messages = [
        { role: 'system', content: '你需要判断使用哪些记忆库的工具，帮我选择适合的，并生成对应的参数' },
        {
          role: 'user',
          content: JSON.stringify({
            text: `${pointToSave.content}\n\n${pointToSave.description}`
          })
        }
      ];

      // 调用 API
      const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer sk-hhnbgdfqdvuhmlamexjqegkvxldwsuzvuoggynitmujhmyco`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'deepseek-ai/DeepSeek-V3',
          tools,
          messages,
        })
      });

      const result = await response.json();
      const toolCall = result.choices[0].message.tool_calls?.[0];

      if (toolCall) {
        console.log('Knowledge point saved to MCP:', pointToSave, toolCall);


        let toolName = toolCall.function.name;
        let args;
        try {
          // 尝试解析JSON字符串
          args = JSON.parse(toolCall.function.arguments);
        } catch (error) {
          // 如果解析失败，尝试修复常见的JSON格式问题
          const cleanedJson = toolCall.function.arguments
            .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // 移除控制字符
            .replace(/\n/g, '\\n') // 处理换行符
            .replace(/,\s*([\]}])/g, '$1') // 移除尾随逗号
            .replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3'); // 为未加引号的键名添加引号

          try {
            args = JSON.parse(cleanedJson);
          } catch (secondError) {
            console.error('Failed to parse tool arguments:', secondError);
            throw new Error('无法解析工具参数');
          }
        }

        console.log('args:', args);
        let toolResult = await remoteTools[toolName].execute(args);
        console.log('#保存成功', toolResult);

      }

      // 检查是否已存在
      const exists = savedPoints.some(p => p.id === point.id);
      if (!exists) {
        setSavedPoints(prev => [...prev, pointToSave]);
      }

    } catch (error) {
      console.error('Error saving to MCP:', error);
      // 即使 MCP 保存失败，仍然保存到本地
      const exists = savedPoints.some(p => p.id === point.id);
      if (!exists) {
        setSavedPoints(prev => [...prev, pointToSave]);
      }
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

  const extractKnowledgePoints = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);

    try {
      const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer sk-hhnbgdfqdvuhmlamexjqegkvxldwsuzvuoggynitmujhmyco`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "THUDM/glm-4-9b-chat",
          messages: [
            {
              role: "system",
              content: SYSTEM_PROMPT
            },
            {
              role: "user",
              content: inputText
            }
          ],
          temperature: 0.7,
          max_tokens: 2000,
          response_format: { type: "json_object" }
        })
      });

      const data = await response.json();

      // 检查API响应格式
      if (!data.choices?.[0]?.message?.content) {
        throw new Error('Invalid API response format');
      }

      let llmResponse;
      try {
        // 尝试清理和解析JSON字符串
        const cleanContent = data.choices[0].message.content
          .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // 移除控制字符
          .replace(/\n/g, '\\n') // 处理换行符
          .trim();
        llmResponse = JSON.parse(cleanContent);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        // 如果JSON解析失败，尝试使用正则表达式提取知识点
        const contentStr = data.choices[0].message.content;
        const knowledgePointsMatch = contentStr.match(/"knowledge_points"\s*:\s*\[(.*?)\]/s);

        if (knowledgePointsMatch) {
          try {
            llmResponse = {
              knowledge_points: JSON.parse(`[${knowledgePointsMatch[1]}]`)
            };
          } catch {
            throw new Error('Failed to parse knowledge points');
          }
        } else {
          throw new Error('Could not extract knowledge points from response');
        }
      }

      // 验证并转换知识点
      if (!Array.isArray(llmResponse?.knowledge_points)) {
        throw new Error('Invalid knowledge points format');
      }

      const extractedPoints: KnowledgePoint[] = llmResponse.knowledge_points
        .filter((point: any) =>
          typeof point.title === 'string' &&
          typeof point.content === 'string' &&
          typeof point.description === 'string'
        )
        .map((point: any, index: number) => ({
          id: `kp-${Date.now()}-${index}`,
          title: point.title.substring(0, 40),
          content: point.content,
          description: point.description,
          selected: false,
          saved: false
        }));

      if (extractedPoints.length === 0) {
        throw new Error('No valid knowledge points found');
      }

      setKnowledgePoints(extractedPoints);
    } catch (error) {
      console.error('Error extracting knowledge points:', error);
      // 回退到基础的文本分割方法
      const sentences = inputText
        .split(/[.!?]/)
        .map(s => s.trim())
        .filter(s => s.length > 10);

      const fallbackPoints: KnowledgePoint[] = sentences.map((sentence, index) => ({
        id: `kp-${Date.now()}-${index}`,
        title: sentence.substring(0, Math.min(40, sentence.length)) + (sentence.length > 40 ? '...' : ''),
        content: sentence,
        description: `这个概念与 ${sentence.split(' ').slice(0, 3).join(' ')} 相关...`,
        selected: false,
        saved: false
      }));

      setKnowledgePoints(fallbackPoints);
    } finally {
      setIsLoading(false);
    }
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

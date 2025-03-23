
import React from "react";
import { KnowledgeProvider } from "@/context/KnowledgeContext";
import TextInput from "@/components/TextInput";
import KnowledgePointList from "@/components/KnowledgePointList";
import KnowledgePointDetail from "@/components/KnowledgePointDetail";
import KnowledgeBase from "@/components/KnowledgeBase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Book, BookOpen, Maximize2, Minimize2, X } from "lucide-react";
import { useKnowledge } from "@/context/KnowledgeContext";

const KnowledgeApp: React.FC = () => {
  const { activeTab, setActiveTab } = useKnowledge();

  return (
    <div className="desktop-app">
      {/* App window frame */}
      <div className="window-titlebar">
        <div className="window-title">
          <BookOpen className="h-5 w-5 text-blue-600 mr-2" />
          <span>Knowledge Point Tool</span>
        </div>
        <div className="window-controls">
          <button className="window-control-btn">
            <Minimize2 className="h-3.5 w-3.5" />
          </button>
          <button className="window-control-btn">
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
          <button className="window-control-btn window-close">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* App Menu bar */}
      <div className="window-menubar">
        <div className="menu-item">File</div>
        <div className="menu-item">Edit</div>
        <div className="menu-item">View</div>
        <div className="menu-item">Help</div>
      </div>
      
      <div className="window-content">
        <Tabs 
          defaultValue={activeTab} 
          onValueChange={(value) => setActiveTab(value as 'input' | 'saved')}
          className="w-full space-y-4"
        >
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 desktop-tabs">
            <TabsTrigger value="input" className="text-base py-2.5">
              <Book className="h-4 w-4 mr-2" />
              Create Points
            </TabsTrigger>
            <TabsTrigger value="saved" className="text-base py-2.5">
              <BookOpen className="h-4 w-4 mr-2" />
              Knowledge Base
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="input" className="space-y-5 fade-in">
            <Card className="desktop-card">
              <TextInput />
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <KnowledgePointList />
              <KnowledgePointDetail />
            </div>
          </TabsContent>
          
          <TabsContent value="saved" className="space-y-5 fade-in">
            <KnowledgeBase />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Status bar */}
      <div className="window-statusbar">
        <div className="status-item">Ready</div>
        <div className="status-item">
          <div className="h-2 w-2 rounded-full bg-green-500 mr-1.5"></div>
          Connected
        </div>
      </div>
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <div className="min-h-screen desktop-background p-6">
      <KnowledgeProvider>
        <KnowledgeApp />
      </KnowledgeProvider>
    </div>
  );
};

export default Index;

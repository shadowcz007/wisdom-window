import React, { useState } from "react";
import { KnowledgeProvider } from "@/context/KnowledgeContext";
import TextInput from "@/components/TextInput";
import KnowledgePointList from "@/components/KnowledgePointList";
import KnowledgePointDetail from "@/components/KnowledgePointDetail";
import KnowledgeBase from "@/components/KnowledgeBase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Book, BookOpen, Maximize2, Minimize2, X, Menu, Save, FileDown, FileUp, FilePlus, Settings } from "lucide-react";
import { useKnowledge } from "@/context/KnowledgeContext";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarTrigger } from "@/components/ui/menubar";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

const KnowledgeApp: React.FC = () => {
  const { activeTab, setActiveTab, inputText, setInputText, knowledgePoints, selectedPoints, saveKnowledgeBase } = useKnowledge();
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const { toast } = useToast();

  const handleOpenFile = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.txt,.md,.json';
    
    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          if (file.name.endsWith('.json')) {
            const content = JSON.parse(event.target?.result as string);
            if (content.text) {
              setInputText(content.text);
              toast({
                title: "File Loaded",
                description: `Loaded JSON file: ${file.name}`,
              });
            }
          } else {
            setInputText(event.target?.result as string);
            toast({
              title: "File Loaded",
              description: `Loaded text file: ${file.name}`,
            });
          }
          setActiveTab('input');
        } catch (error) {
          console.error('Error parsing file:', error);
          setInputText(event.target?.result as string);
          toast({
            title: "File Loaded",
            description: `Loaded as text: ${file.name}`,
            variant: "destructive",
          });
        }
      };
      
      if (file.name.endsWith('.json')) {
        reader.readAsText(file);
      } else {
        reader.readAsText(file);
      }
    };
    
    fileInput.click();
  };

  const handleSaveAs = () => {
    let content = '';
    let filename = '';
    let type = '';
    
    if (activeTab === 'input') {
      content = inputText;
      filename = 'knowledge-text.txt';
      type = 'text/plain';
    } else {
      content = JSON.stringify({
        savedPoints: selectedPoints.map(point => ({
          id: point.id,
          title: point.title,
          content: point.content,
          examples: point.examples,
          createdAt: point.createdAt
        }))
      }, null, 2);
      filename = 'knowledge-base.json';
      type = 'application/json';
    }
    
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "File Saved",
      description: `Saved as ${filename}`,
    });
  };

  const handleNewFile = () => {
    if (inputText && !window.confirm('Are you sure you want to create a new file? Any unsaved changes will be lost.')) {
      return;
    }
    
    setInputText('');
    setActiveTab('input');
    
    toast({
      title: "New File Created",
      description: "Started with a clean slate",
    });
  };

  const handleSaveToKnowledgeBase = () => {
    if (knowledgePoints.length === 0) {
      toast({
        title: "Nothing to Save",
        description: "Extract knowledge points first",
        variant: "destructive",
      });
      return;
    }
    
    saveKnowledgeBase();
    
    toast({
      title: "Saved to Knowledge Base",
      description: "Your knowledge points have been saved",
    });
  };

  const handleMinimize = () => {
    setIsMinimized(true);
    setTimeout(() => setIsMinimized(false), 300);
  };

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const handleClose = () => {
    if (window.confirm('Are you sure you want to close the application?')) {
      toast({
        title: "Application would close",
        description: "This is just a demonstration",
      });
    }
  };
  
  return (
    <div className={`desktop-app ${isMaximized ? 'maximized' : ''} ${isMinimized ? 'minimized' : ''}`}>
      <div className="window-titlebar">
        <div className="window-title">
          <BookOpen className="h-5 w-5 text-blue-600 mr-2" />
          <span>Knowledge Point Tool</span>
        </div>
        <div className="window-controls">
          <button className="window-control-btn" onClick={handleMinimize}>
            <Minimize2 className="h-3.5 w-3.5" />
          </button>
          <button className="window-control-btn" onClick={handleMaximize}>
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
          <button className="window-control-btn window-close" onClick={handleClose}>
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <Menubar className="window-menubar justify-start rounded-none border-0 p-0">
        <MenubarMenu>
          <MenubarTrigger className="menu-item flex items-center gap-1 data-[state=open]:bg-gray-200">
            <Menu className="h-3 w-3" />
            <span>File</span>
          </MenubarTrigger>
          <MenubarContent className="min-w-[180px]">
            <MenubarItem onClick={handleNewFile}>
              <FilePlus className="h-4 w-4 mr-2" />
              New
              <MenubarShortcut>⌘N</MenubarShortcut>
            </MenubarItem>
            <MenubarItem onClick={handleOpenFile}>
              <FileUp className="h-4 w-4 mr-2" />
              Open...
              <MenubarShortcut>⌘O</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem onClick={handleSaveToKnowledgeBase}>
              <Save className="h-4 w-4 mr-2" />
              Save to Knowledge Base
              <MenubarShortcut>⌘S</MenubarShortcut>
            </MenubarItem>
            <MenubarItem onClick={handleSaveAs}>
              <FileDown className="h-4 w-4 mr-2" />
              Save As...
              <MenubarShortcut>⇧⌘S</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem onClick={handleClose}>
              Exit
              <MenubarShortcut>Alt+F4</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        
        <MenubarMenu>
          <MenubarTrigger className="menu-item data-[state=open]:bg-gray-200">Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarItem disabled>
              Cut
              <MenubarShortcut>⌘X</MenubarShortcut>
            </MenubarItem>
            <MenubarItem disabled>
              Copy
              <MenubarShortcut>⌘C</MenubarShortcut>
            </MenubarItem>
            <MenubarItem disabled>
              Paste
              <MenubarShortcut>⌘V</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        
        <MenubarMenu>
          <MenubarTrigger className="menu-item data-[state=open]:bg-gray-200">View</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={() => setActiveTab('input')}>
              Input View
            </MenubarItem>
            <MenubarItem onClick={() => setActiveTab('saved')}>
              Knowledge Base
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        
        <MenubarMenu>
          <MenubarTrigger className="menu-item data-[state=open]:bg-gray-200">Help</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              About
            </MenubarItem>
            <MenubarItem>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
      
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

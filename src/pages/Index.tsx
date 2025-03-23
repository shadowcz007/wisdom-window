
import React, { useState } from "react";
import { KnowledgeProvider } from "@/context/KnowledgeContext";
import TextInput from "@/components/TextInput";
import KnowledgePointList from "@/components/KnowledgePointList";
import KnowledgePointDetail from "@/components/KnowledgePointDetail";
import KnowledgeBase from "@/components/KnowledgeBase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Book, BookOpen } from "lucide-react";
import { useKnowledge } from "@/context/KnowledgeContext";

const KnowledgeApp: React.FC = () => {
  const { activeTab, setActiveTab } = useKnowledge();

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="text-center mb-12 space-y-4">
        <div className="inline-block bg-blue-100 p-3 rounded-full">
          <BookOpen className="h-8 w-8 text-blue-700" />
        </div>
        <h1 className="text-4xl font-semibold tracking-tight">Knowledge Point Tool</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Extract, explore, and save knowledge points from any text
        </p>
      </div>
      
      <Tabs 
        defaultValue={activeTab} 
        onValueChange={(value) => setActiveTab(value as 'input' | 'saved')}
        className="w-full space-y-6"
      >
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
          <TabsTrigger value="input" className="text-base py-3">
            <Book className="h-4 w-4 mr-2" />
            Create Points
          </TabsTrigger>
          <TabsTrigger value="saved" className="text-base py-3">
            <BookOpen className="h-4 w-4 mr-2" />
            Knowledge Base
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="input" className="space-y-8 fade-in">
          <Card className="shadow-sm border-gray-200">
            <CardContent className="p-6">
              <TextInput />
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <KnowledgePointList />
            <KnowledgePointDetail />
          </div>
        </TabsContent>
        
        <TabsContent value="saved" className="space-y-8 fade-in">
          <KnowledgeBase />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      <KnowledgeProvider>
        <KnowledgeApp />
      </KnowledgeProvider>
    </div>
  );
};

export default Index;

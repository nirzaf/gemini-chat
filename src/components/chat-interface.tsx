import  { useState, useRef, useEffect } from 'react';
import { MessageList } from './message-list';
import { InputArea } from './input-area';
import { ApiKeyManager } from './api-key-manager';
import { geminiChat, type ChatMessage } from '@/lib/gemini';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ErrorBoundary } from './error-boundary';
import { Trash2, AlertCircle } from 'lucide-react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;
    setError(null);

    const newMessage: ChatMessage = {
      role: 'user',
      content,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, newMessage]);
    setIsLoading(true);

    try {
      const response = await geminiChat.sendMessage(content);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: response, timestamp: Date.now() },
      ]);
    } catch (error: any) {
      setError(error.message);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([]);
    setError(null);
    geminiChat.resetChat();
    toast({
      title: 'Chat Reset',
      description: 'The conversation has been cleared.',
    });
  };

  return (
    <ErrorBoundary>
      <div className="flex h-screen bg-background">
        <div className="w-80 p-4 border-r">
          <div className="space-y-4">
            <ApiKeyManager />
            <Button
              variant="outline"
              className="w-full"
              onClick={handleReset}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Reset Chat
            </Button>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <MessageList messages={messages} />
            <div ref={messagesEndRef} />
          </div>
          <div className="p-4 border-t">
            <InputArea onSendMessage={handleSendMessage} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
import { type ChatMessage } from '@/lib/gemini';
import { Card } from '@/components/ui/card';
import { CodeBlock } from './code-block';
import ReactMarkdown from 'react-markdown';
import { Bot, User } from 'lucide-react';

interface MessageListProps {
  messages: ChatMessage[];
}

export function MessageList({ messages }: MessageListProps) {
  return (
    <div className="flex flex-col space-y-6 pb-20">
      {messages.map((message, index) => (
        <Card
          key={`${message.timestamp}-${index}`}
          className={`
            transition-all duration-300 ease-in-out
            ${message.role === 'user' 
              ? 'bg-muted/50 border-muted/50' 
              : 'bg-background border-border hover:border-primary/20'
            }
            ${index === messages.length - 1 ? 'animate-slide-in-up' : ''}
          `}
        >
          <div className="flex items-start p-4 gap-4">
            <div className={`
              rounded-full p-2 
              ${message.role === 'user' 
                ? 'bg-primary/10' 
                : 'bg-primary/5'
              }
            `}>
              {message.role === 'user' ? (
                <User className="w-5 h-5 text-primary" />
              ) : (
                <Bot className="w-5 h-5 text-primary" />
              )}
            </div>
            
            <div className="flex-1 min-w-0 prose dark:prose-invert prose-pre:my-0 max-w-none">
              <ReactMarkdown
                components={{
                  code: ({ className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || '');
                    const codeContent = String(children).replace(/\n$/, '');
                    
                    return match ? (
                      <div className="my-4 first:mt-0 last:mb-0">
                        <CodeBlock
                          language={match[1]}
                          value={codeContent}
                        />
                      </div>
                    ) : (
                      <code className="px-1.5 py-0.5 rounded-md bg-muted" {...props}>
                        {children}
                      </code>
                    );
                  },
                  p: ({ children }) => (
                    <p className="mb-4 last:mb-0">{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className="my-4 list-disc list-inside">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="my-4 list-decimal list-inside">{children}</ol>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
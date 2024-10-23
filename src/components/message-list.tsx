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
    <div className="space-y-4">
      {messages.map((message, index) => (
        <Card
          key={index}
          className={`p-4 ${
            message.role === 'user' ? 'bg-muted' : 'bg-card'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="mt-1">
              {message.role === 'user' ? (
                <User className="w-6 h-6" />
              ) : (
                <Bot className="w-6 h-6" />
              )}
            </div>
            <div className="flex-1 prose dark:prose-invert max-w-none">
              <ReactMarkdown
                components={{
                  code: ({ node, className, children, ...props }: any) => {
                    const match = /language-(\w+)/.exec(className || '');
                    return !props.inline && match ? (
                      <CodeBlock
                        language={match[1]}
                        value={String(children).replace(/\n$/, '')}
                      />
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },                }}
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
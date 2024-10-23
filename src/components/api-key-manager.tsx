import  { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { geminiChat } from '@/lib/gemini';
import { useToast } from '@/hooks/use-toast';
import { KeyRound, AlertCircle } from 'lucide-react';
import {
  Alert,
  AlertDescription,
} from '@/components/ui/alert';

export function ApiKeyManager() {
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAddKey = () => {
    try {
      const keys = input.split(',').map(k => k.trim()).filter(Boolean);
      if (keys.length === 0) {
        throw new Error('Please enter at least one API key');
      }

      geminiChat.setApiKeys(keys);
      setInput('');
      setError(null);
      toast({
        title: 'API Keys Updated',
        description: `${keys.length} keys have been added successfully.`,
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <KeyRound className="w-5 h-5" />
          API Key Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Input
              placeholder="Enter API keys (comma-separated)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="font-mono"
            />
            <Button onClick={handleAddKey} className="w-full">
              Update Keys
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            Current Key: {geminiChat.getCurrentKeyIndex() + 1} of {geminiChat.getApiKeys().length}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
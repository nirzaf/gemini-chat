import { ChatInterface } from '@/components/chat-interface';
import { Toaster } from '@/components/ui/toaster';
import { ErrorBoundary } from '@/components/error-boundary';

function App() {
  return (
    <ErrorBoundary>
      <ChatInterface />
      <Toaster />
    </ErrorBoundary>
  );
}

export default App;
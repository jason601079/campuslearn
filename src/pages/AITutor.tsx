import { useEffect, useState } from 'react';
import { Bot, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

// Declare Botpress types
declare global {
  interface Window {
    botpressWebChat?: {
      sendPayload: (payload: { type: string; payload: any }) => void;
      onEvent: (callback: (event: any) => void, events: string[]) => void;
    };
  }
}

export default function AITutor() {
  const { user } = useAuth();
  const [botReady, setBotReady] = useState(false);
  const [userDataSent, setUserDataSent] = useState(false);

  useEffect(() => {
    // Load Botpress webchat scripts
    const script1 = document.createElement('script');
    script1.src = 'https://cdn.botpress.cloud/webchat/v3.3/inject.js';
    script1.async = true;
    
    const script2 = document.createElement('script');
    script2.src = 'https://files.bpcontent.cloud/2025/10/02/21/20251002214522-9HK61HZW.js';
    
    script1.onload = () => {
      document.body.appendChild(script2);
      
      // Wait for botpress to be available
      const checkBotpress = setInterval(() => {
        if (window.botpressWebChat) {
          clearInterval(checkBotpress);
          
          // Listen for bot ready event
          window.botpressWebChat.onEvent((event: any) => {
            console.log('Botpress event:', event);
            if (event.type === 'LIFECYCLE.READY') {
              setBotReady(true);
            }
          }, ['LIFECYCLE.READY']);
        }
      }, 100);
    };
    
    script1.onerror = (error) => {
      console.error('Failed to load Botpress inject script:', error);
    };
    
    script2.onerror = (error) => {
      console.error('Failed to load Botpress config script:', error);
    };
    
    document.body.appendChild(script1);

    return () => {
      if (document.body.contains(script1)) {
        document.body.removeChild(script1);
      }
      if (document.body.contains(script2)) {
        document.body.removeChild(script2);
      }
    };
  }, []);

  // Send user data when bot is ready
  useEffect(() => {
    if (botReady && user && !userDataSent && window.botpressWebChat) {
      console.log('Sending user data to Botpress:', user);
      
      window.botpressWebChat.sendPayload({
        type: 'trigger',
        payload: {
          name: user.name,
          email: user.email,
          userId: user.id,
          role: user.isTutor ? 'tutor' : 'student'
        }
      });
      
      setUserDataSent(true);
    }
  }, [botReady, user, userDataSent]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="text-center space-y-3 mb-8">
        <div className="flex items-center justify-center space-x-2">
          <Bot className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">AI Tutor</h1>
          <Sparkles className="h-6 w-6 text-yellow-500" />
        </div>
        <p className="text-muted-foreground">
          Get instant help with your studies. Ask questions about any topic!
        </p>
      </div>

      <div 
        id="bp-embedded-webchat" 
        className="w-full h-[700px] rounded-lg border border-border bg-card overflow-hidden"
        style={{ minHeight: '700px' }}
      ></div>
    </div>
  );
}
import { useEffect } from 'react';
import { Bot, Sparkles } from 'lucide-react';

declare global {
  interface Window {
    botpress: any;
  }
}

export default function AITutor() {
  useEffect(() => {
    // Initialize Botpress webchat
    const initializeBotpress = () => {
      if (window.botpress) {
        window.botpress.on("webchat:ready", () => {
          window.botpress.open();
        });
        
        window.botpress.init({
          "botId": "8e2e16bf-f7d3-424c-9154-49fc430b041e",
          "configuration": {
            "version": "v2",
            "composerPlaceholder": "",
            "botName": "CampusLearn AI",
            "botDescription": "",
            "website": {},
            "email": {},
            "phone": {},
            "termsOfService": {},
            "privacyPolicy": {},
            "color": "#6e31eb",
            "variant": "solid",
            "headerVariant": "solid",
            "themeMode": "light",
            "fontFamily": "inter",
            "radius": 2.5,
            "feedbackEnabled": true,
            "footer": "[⚡ by Botpress](https://botpress.com/?from=webchat)",
            "allowFileUpload": false,
            "soundEnabled": false,
            "embeddedChatId": "bp-embedded-webchat",
            "proactiveMessageEnabled": false,
            "proactiveBubbleMessage": "Hi! 👋 Need help?",
            "proactiveBubbleTriggerType": "afterDelay",
            "proactiveBubbleDelayTime": 10
          },
          "clientId": "adaf6d18-c72f-43f4-bd5b-72ac418f0df9",
          "selector": "#webchat"
        });
      }
    };

    // Wait for Botpress to load
    if (window.botpress) {
      initializeBotpress();
    } else {
      const checkBotpress = setInterval(() => {
        if (window.botpress) {
          clearInterval(checkBotpress);
          initializeBotpress();
        }
      }, 100);

      return () => clearInterval(checkBotpress);
    }
  }, []);

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
        id="webchat" 
        className="w-full h-[700px] rounded-lg border border-border bg-card overflow-hidden"
        style={{ minHeight: '700px' }}
      ></div>
    </div>
  );
}
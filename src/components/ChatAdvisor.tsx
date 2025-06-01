
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Send, 
  Mic, 
  MicOff, 
  Bot, 
  User, 
  Volume2,
  Languages
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  language?: string;
}

const ChatAdvisor = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { t, language } = useLanguage();

  // Mock AI responses in both languages
  const aiResponses = {
    en: [
      "Based on the current weather conditions, I recommend watering your crops early morning to minimize evaporation.",
      "For maize cultivation in this season, ensure proper spacing of 75cm between rows and 25cm between plants.",
      "The soil pH for optimal tomato growth should be between 6.0-6.8. Consider lime application if needed.",
      "Companion planting beans with maize can improve soil nitrogen levels naturally.",
      "Early detection of pests is crucial. Check your crops daily, especially the undersides of leaves."
    ],
    st: [
      "Ho latela maemo a leholimo hona joale, ke khothaletsa ho nosetsa lijalo tsa hao hoseng ho fokotsa mongobo.",
      "Bakeng sa temo ea poone selemong sena, netefatsa sebaka se nepahetseng sa li-cm tse 75 pakeng tsa mela le li-cm tse 25 pakeng tsa limela.",
      "pH ea mobu bakeng sa kholo e ntle ea tamati e lokela ho ba pakeng tsa 6.0-6.8. Nahana ka ho sebelisa lime haeba ho hlokahala.",
      "Ho jala linaoa hammoho le poone ho ka ntlafatsa maemo a nitrogen mebung ka tlhaho.",
      "Ho fumana likokoanyana ka nako ho bohlokoa. Hlahloba lijalo tsa hao letsatsi le leng le le leng, haholo-holo ka tlasa makhasi."
    ]
  };

  const initialBotMessage: Message = {
    id: '1',
    content: language === 'en' 
      ? "Hello! I'm your AgroSense AI advisor. I can help you with crop management, pest control, weather advice, and farming best practices. How can I assist you today?"
      : "Lumela! Ke motšoao oa AgroSense AI. Nka u thusa ka taolo ea lijalo, ho laola likokoanyana, keletso ea leholimo, le mekhoa e metle ea temo. Nka u thusa joang kajeno?",
    sender: 'bot',
    timestamp: new Date(),
    language
  };

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([initialBotMessage]);
    }
  }, [language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = (userMessage: string): string => {
    const responses = aiResponses[language as keyof typeof aiResponses] || aiResponses.en;
    
    // Simple keyword-based responses (in a real app, this would use NLP)
    const userMessageLower = userMessage.toLowerCase();
    
    if (userMessageLower.includes('water') || userMessageLower.includes('metsi')) {
      return responses[0];
    } else if (userMessageLower.includes('maize') || userMessageLower.includes('corn') || userMessageLower.includes('poone')) {
      return responses[1];
    } else if (userMessageLower.includes('tomato') || userMessageLower.includes('tamati')) {
      return responses[2];
    } else if (userMessageLower.includes('companion') || userMessageLower.includes('beans') || userMessageLower.includes('linaoa')) {
      return responses[3];
    } else if (userMessageLower.includes('pest') || userMessageLower.includes('kokoanyana')) {
      return responses[4];
    } else {
      return responses[Math.floor(Math.random() * responses.length)];
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      language
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI processing delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date(),
        language
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = language === 'en' ? 'en-US' : 'st-ZA';
      recognition.interimResults = false;
      recognition.continuous = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert(t('speechNotSupported'));
    }
  };

  const speakMessage = (message: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = language === 'en' ? 'en-US' : 'st-ZA';
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            {t('aiAdvisor')}
          </CardTitle>
          <CardDescription>
            {t('aiAdvisorDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Chat Messages */}
          <div className="h-96 overflow-y-auto border rounded-lg p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-green-500 text-white'
                      : 'bg-white border shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {message.sender === 'bot' && (
                      <Bot className="h-4 w-4 mt-1 text-gray-500 flex-shrink-0" />
                    )}
                    {message.sender === 'user' && (
                      <User className="h-4 w-4 mt-1 text-white flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm">{message.content}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className={`text-xs ${
                          message.sender === 'user' ? 'text-green-100' : 'text-gray-400'
                        }`}>
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                        {message.sender === 'bot' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => speakMessage(message.content)}
                            className="h-6 w-6 p-0"
                          >
                            <Volume2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-white border shadow-sm">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4 text-gray-500" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="flex gap-2">
            <Input
              placeholder={t('typeMessage')}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button
              onClick={handleVoiceInput}
              variant="outline"
              size="icon"
              className={isListening ? 'bg-red-100 border-red-300' : ''}
            >
              {isListening ? <MicOff className="h-4 w-4 text-red-500" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Button 
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {/* Language Indicator */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Languages className="h-4 w-4" />
              <span>{t('currentLanguage')}: {language === 'en' ? 'English' : 'Sesotho'}</span>
            </div>
            <Badge variant="outline">{t('aiPowered')}</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatAdvisor;

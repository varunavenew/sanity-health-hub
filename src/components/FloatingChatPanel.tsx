import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Mic, Settings, X, Droplet, Star, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatBubble } from "@/components/ChatBubble";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import miaProfile from "@/assets/mia-assistant-realistic.jpg";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Tag {
  label: string;
  path: string;
}

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  tags?: Tag[];
}

interface FloatingChatPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  onIntentDetected: (intent: string, query: string, recommendedProductId?: string) => void;
}

type Language = "nb-NO" | "en-US";
type RecordingMode = "push-to-talk" | "toggle";

interface Settings {
  language: Language;
  ttsEnabled: boolean;
  recordingMode: RecordingMode;
}

export const FloatingChatPanel = ({ isOpen, onToggle, onIntentDetected }: FloatingChatPanelProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hei! 👋 Jeg er Liv C, din helseassistent fra CMedical.\n\nJeg kan hjelpe deg med spørsmål om gynekologi, fertilitet, urologi og vise deg rundt på nettsiden. Hva kan jeg hjelpe deg med i dag? 💛",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [showWelcomeBubble, setShowWelcomeBubble] = useState(true);
  const [isWelcomeBubbleExiting, setIsWelcomeBubbleExiting] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [partialTranscript, setPartialTranscript] = useState("");
  const [currentSuggestions, setCurrentSuggestions] = useState<string[]>([]);
  const [settings, setSettings] = useState<Settings>({
    language: "nb-NO",
    ttsEnabled: false,
    recordingMode: "push-to-talk",
  });
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const isHoldingRef = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-dismiss welcome bubble after 5 seconds with exit animation
  useEffect(() => {
    if (showWelcomeBubble && !isOpen && !isWelcomeBubbleExiting) {
      const timer = setTimeout(() => {
        setIsWelcomeBubbleExiting(true);
        // Wait for animation to complete before hiding
        setTimeout(() => {
          setShowWelcomeBubble(false);
          setIsWelcomeBubbleExiting(false);
        }, 300);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showWelcomeBubble, isOpen, isWelcomeBubbleExiting]);

  useEffect(() => {
    // Initialize Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = settings.language;

      recognitionRef.current.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += transcript;
          } else {
            interim += transcript;
          }
        }

        if (interim) {
          setPartialTranscript(interim);
          logEvent('stt_partial', { transcript: interim });
        }

        if (final) {
          setInput(final);
          setPartialTranscript("");
          logEvent('stt_final', { transcript: final });
          if (settings.recordingMode === "toggle") {
            stopRecording();
          }
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        toast({
          title: "Talegjenkjenningsfeil",
          description: "Kunne ikke gjenkjenne tale. Prøv igjen.",
          variant: "destructive",
        });
        stopRecording();
      };

      recognitionRef.current.onend = () => {
        if (isHoldingRef.current && settings.recordingMode === "push-to-talk") {
          recognitionRef.current?.start();
        } else {
          setIsRecording(false);
        }
      };
    }

    // Initialize Speech Synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    // Keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isRecording) {
        stopRecording();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      recognitionRef.current?.stop();
      synthRef.current?.cancel();
    };
  }, [settings.language, settings.recordingMode, isRecording, isOpen]);

  const logEvent = (event: string, data?: any) => {
    console.log(`[AWC Event] ${event}`, data);
  };

  const sendMessageToAssistant = async (messageText?: string, imageDataUrl?: string) => {
    console.log('[FloatingChatPanel] sendMessageToAssistant called with:', { messageText, hasImage: !!imageDataUrl });
    setIsAnalyzing(true);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: imageDataUrl ? "📸 [Hudbilde lastet opp for analyse]" : messageText || "",
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    console.log('[FloatingChatPanel] User message added to chat');
    
    try {
      const conversationHistory = [...messages, userMessage].map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      }));

      console.log('[FloatingChatPanel] Invoking chat-assistant edge function...');
      const { data, error } = await supabase.functions.invoke('chat-assistant', {
        body: { 
          message: messageText || '',
          conversationHistory: conversationHistory
        }
      });
      
      console.log('[FloatingChatPanel] Edge function response:', { data, error });
      
      if (error) throw error;
      
      if (data.error) {
        console.error('[FloatingChatPanel] Error from edge function:', data.error);
        toast({
          title: "Feil",
          description: data.error,
          variant: "destructive",
        });
        return;
      }
      
      const assistantMessage = data.response;
      const tags = data.tags || [];
      console.log('[FloatingChatPanel] AI response:', assistantMessage, 'Tags:', tags);
      
      // Extract navigation command and clean message
      const navigationMatch = assistantMessage.match(/\[NAVIGATE:(\/[^\]]+)\]/);
      const cleanMessage = assistantMessage.replace(/\[NAVIGATE:[^\]]+\]/g, '').trim();
      
      console.log('[FloatingChatPanel] Navigation:', navigationMatch?.[1], 'Clean message:', cleanMessage);
      
      // Add assistant message
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: cleanMessage,
        sender: "ai",
        timestamp: new Date(),
        tags: tags.length > 0 ? tags : undefined,
      };
      
      setMessages((prev) => [...prev, aiMessage]);
      console.log('[FloatingChatPanel] AI message added to chat');
      speakText(cleanMessage);
      
      // Navigate if command exists
      if (navigationMatch) {
        const path = navigationMatch[1];
        console.log('[FloatingChatPanel] Navigating to:', path);
        setTimeout(() => {
          navigate(path);
        }, 800);
      }
      
    } catch (error) {
      console.error('[FloatingChatPanel] Error communicating with Liv C:', error);
      toast({
        title: "Feil ved kommunikasjon",
        description: "Kunne ikke sende melding. Vennligst prøv igjen.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
      console.log('[FloatingChatPanel] Message processing complete');
    }
  };
  
  const detectIntent = (text: string): { intent: string; query: string } => {
    const lowerText = text.toLowerCase();
    
    // Gynekologi
    if (lowerText.includes("gynekolog") || lowerText.includes("kvinne") || lowerText.includes("menstruasjon") || 
        lowerText.includes("livmor") || lowerText.includes("endometriose") || lowerText.includes("pcos") ||
        lowerText.includes("overgangsalder")) {
      return { intent: "gynekologi", query: "gynekologisk helsehjelp" };
    }
    
    // Fertilitet
    if (lowerText.includes("fertilitet") || lowerText.includes("ivf") || lowerText.includes("gravid") || 
        lowerText.includes("eggdonasjon") || lowerText.includes("inseminasjon") || lowerText.includes("barneløs")) {
      return { intent: "fertilitet", query: "fertilitetsbehandling" };
    }
    
    // Urologi
    if (lowerText.includes("urolog") || lowerText.includes("prostata") || lowerText.includes("urinvei") || 
        lowerText.includes("inkontinens") || lowerText.includes("erektil")) {
      return { intent: "urologi", query: "urologisk behandling" };
    }
    
    // Booking
    if (lowerText.includes("time") || lowerText.includes("bestill") || lowerText.includes("book") || 
        lowerText.includes("avtale") || lowerText.includes("konsultasjon")) {
      return { intent: "booking", query: "bestille time" };
    }

    // Klinikker
    if (lowerText.includes("klinikk") || lowerText.includes("hvor") || lowerText.includes("lokasjon") || 
        lowerText.includes("oslo") || lowerText.includes("bergen") || lowerText.includes("stavanger")) {
      return { intent: "klinikker", query: "våre klinikker" };
    }
    
    return { intent: "general", query: text };
  };

  const generateAIResponse = (intent: string, query: string): string => {
    const responses: Record<string, string> = {
      gynekologi: "Jeg kan hjelpe deg med spørsmål om gynekologi. 💛 Våre spesialister behandler alt fra menstruasjonsproblemer til endometriose og overgangsalder. Vil du vite mer om våre tjenester?",
      fertilitet: "Vi tilbyr Nordens mest omfattende private fertilitetsbehandling. ✨ Fra IVF til eggdonasjon - våre spesialister følger deg hele veien. Ønsker du mer informasjon om behandlingen?",
      urologi: "Våre ledende urologer kan hjelpe deg med urinveisplager, prostataproblemer og annen urologisk behandling. 🏥 Vi har kort ventetid og ingen henvisning er nødvendig.",
      booking: "Du kan enkelt bestille time hos oss! 📅 Ring oss på +47 XX XX XX XX eller se våre klinikker for kontaktinformasjon. Ønsker du å se våre klinikklokasjon er?",
      klinikker: "Vi har 14 klinikker i Norge og Sverige. 📍 Våre hovedklinikker er i Oslo (Majorstuen), Bergen, Stavanger og Stockholm. Vil du se alle våre lokasjoner?",
      general: "Hei! Jeg er her for å hjelpe deg med spørsmål om gynekologi, fertilitet og urologi. 💛 Hva kan jeg hjelpe deg med i dag?",
    };
    
    return responses[intent] || responses.general;
  };

  const startRecording = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Ikke støttet",
        description: "Talegjenkjenning er ikke tilgjengelig i denne nettleseren.",
        variant: "destructive",
      });
      return;
    }

    try {
      recognitionRef.current.lang = settings.language;
      recognitionRef.current.start();
      setIsRecording(true);
      setPartialTranscript("");
      logEvent('mic_start', { mode: settings.recordingMode });
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const stopRecording = () => {
    recognitionRef.current?.stop();
    setIsRecording(false);
    setPartialTranscript("");
    isHoldingRef.current = false;
    logEvent('mic_end');
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleMicMouseDown = () => {
    if (settings.recordingMode === "push-to-talk") {
      isHoldingRef.current = true;
      startRecording();
    }
  };

  const handleMicMouseUp = () => {
    if (settings.recordingMode === "push-to-talk") {
      isHoldingRef.current = false;
      stopRecording();
    }
  };

  const handleMicClick = () => {
    if (settings.recordingMode === "toggle") {
      toggleRecording();
    }
  };

  const speakText = (text: string) => {
    if (!settings.ttsEnabled || !synthRef.current) return;

    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = settings.language;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    const voices = synthRef.current.getVoices();
    const preferredVoice = voices.find(voice => voice.lang.startsWith(settings.language.split('-')[0]));
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => logEvent('tts_start', { text });
    utterance.onend = () => logEvent('tts_end');

    synthRef.current.speak(utterance);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    console.log('[FloatingChatPanel] Sending message:', input);

    const messageText = input;
    setInput("");
    
    await sendMessageToAssistant(messageText);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickSuggestions = [
    { Icon: Sparkles, text: "Gynekologi" },
    { Icon: Star, text: "Fertilitet" },
    { Icon: Award, text: "Urologi" },
    { Icon: Droplet, text: "Book time" },
  ];

  const handleQuickSuggestion = async (suggestion: string) => {
    await sendMessageToAssistant(suggestion);
  };

  return (
    <>
      {/* Floating Chat Toggle Button - only visible when closed */}
      {!isOpen && (
        <div className="fixed bottom-6 left-6 z-50">
          {/* Welcome bubble that auto-dismisses */}
          {showWelcomeBubble && (
            <div className={`absolute bottom-16 left-0 bg-card border border-border rounded-xl p-4 shadow-lg min-w-[280px] max-w-[320px] transition-all duration-300 ${
              isWelcomeBubbleExiting ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0 animate-fade-in'
            }`}>
              <p className="text-sm text-foreground leading-relaxed">
                Hei! Jeg er Liv C. Trenger du hjelp? 💛
              </p>
              <div className="absolute -bottom-2 left-6 w-3 h-3 bg-card border-r border-b border-border transform rotate-45" />
            </div>
          )}
          <Button
            onClick={() => {
              setIsWelcomeBubbleExiting(true);
              setTimeout(() => setShowWelcomeBubble(false), 300);
              onToggle();
            }}
            className="bg-[hsl(48,95%,60%)] hover:bg-[hsl(48,95%,55%)] transition-colors rounded-full w-14 h-14 shadow-2xl overflow-hidden p-0 border-2 border-[hsl(25,15%,15%)]"
            size="icon"
            aria-label="Open chat assistant"
          >
            <img 
              src={miaProfile} 
              alt="Liv C" 
              className="w-full h-full object-cover"
            />
          </Button>
        </div>
      )}

      {/* Chat Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-full md:w-[360px] z-40 transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full backdrop-blur-xl border-r flex flex-col bg-[hsl(var(--chat-background))] border-[hsl(var(--chat-border))]">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[hsl(var(--chat-border))]">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img 
                  src={miaProfile} 
                  alt="Liv C" 
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />
              </div>
              <div>
                <h3 className="font-normal text-base text-[hsl(var(--chat-foreground))]">Liv C</h3>
                <p className="text-xs text-[hsl(var(--chat-foreground))] opacity-60 font-light">Helseassistent</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Settings className="h-4 w-4" />
                    <span className="sr-only">Settings</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                    <DialogDescription>
                      Customize voice and language settings
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select 
                        value={settings.language} 
                        onValueChange={(value) => setSettings(prev => ({ ...prev, language: value as Language }))}
                      >
                        <SelectTrigger id="language">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="nb-NO">Norsk</SelectItem>
                          <SelectItem value="en-US">English</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="tts" className="flex flex-col gap-1">
                        <span>Text-to-Speech</span>
                        <span className="text-xs text-muted-foreground font-normal">Read AI responses aloud</span>
                      </Label>
                      <Switch
                        id="tts"
                        checked={settings.ttsEnabled}
                        onCheckedChange={(checked) => setSettings(prev => ({ ...prev, ttsEnabled: checked }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="recording-mode">Recording Mode</Label>
                      <Select 
                        value={settings.recordingMode} 
                        onValueChange={(value) => setSettings(prev => ({ ...prev, recordingMode: value as RecordingMode }))}
                      >
                        <SelectTrigger id="recording-mode">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="push-to-talk">Push to talk</SelectItem>
                          <SelectItem value="toggle">Click to start/stop</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <p className="text-xs text-muted-foreground">
                        <strong>Privacy:</strong> Audio is processed in your browser only and not stored.
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={onToggle}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[hsl(var(--chat-background))]" role="log" aria-live="polite" aria-atomic="false">
            <>
              {messages.map((message) => (
                <ChatBubble key={message.id} message={message} onTagClick={(path) => navigate(path)} />
              ))}
                
                {isTyping && (
                  <div className="flex gap-2 items-center text-muted-foreground">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                    <span className="text-sm">Thinking...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
            </>
          </div>

          {/* Quick Suggestions between messages and input */}
          {messages.length <= 1 && (
            <div className="px-4 py-3 border-t border-[hsl(var(--chat-border))] bg-[hsl(var(--chat-background))]">
              <div className="flex flex-wrap gap-2">
                {quickSuggestions.map((suggestion, index) => {
                  const IconComponent = suggestion.Icon;
                  return (
                    <button
                      key={index}
                      onClick={() => handleQuickSuggestion(suggestion.text)}
                      className="px-4 py-2 rounded-full border border-primary/20 bg-muted/30 hover:bg-primary/10 transition-all text-sm flex items-center gap-2"
                      disabled={isAnalyzing}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span>{suggestion.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t border-[hsl(var(--chat-border))] bg-[hsl(var(--chat-background))] space-y-3">
            {/* Dynamic Follow-up Suggestions - only if AI provides them */}
            {currentSuggestions.length > 0 && (
              <div className="flex flex-wrap gap-2 animate-fade-in">
                {currentSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickSuggestion(suggestion)}
                    className="px-3 py-1.5 rounded-full border border-primary/20 bg-muted/30 hover:bg-primary/10 transition-all text-xs"
                    disabled={isAnalyzing}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
            
            {partialTranscript && (
              <div className="text-xs text-muted-foreground px-3 py-2 bg-muted/30 rounded-lg">
                <span className="opacity-70">Listening: </span>
                <span className="animate-pulse">{partialTranscript}</span>
              </div>
            )}
            
            {isRecording && (
              <div className="text-xs text-primary px-3 py-2 bg-primary/10 rounded-lg flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                {settings.recordingMode === "push-to-talk" 
                  ? (settings.language === "nb-NO" ? "Hold for å snakke..." : "Hold to speak...")
                  : (settings.language === "nb-NO" ? "Snakker..." : "Speaking...")}
              </div>
            )}
            
            {/* Large Input Field */}
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Spør Liv C om gynekologi, fertilitet eller urologi..."
                className="w-full min-h-[80px] px-4 py-3 bg-muted/30 border border-primary/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none text-sm"
                disabled={isAnalyzing}
                aria-label="Chat input"
              />
            </div>
            
            {/* Action Buttons Row */}
            <div className="flex items-center justify-between gap-2">
              {/* Right side buttons */}
              <div className="flex items-center gap-2 ml-auto">
                <Button
                  onMouseDown={handleMicMouseDown}
                  onMouseUp={handleMicMouseUp}
                  onClick={handleMicClick}
                  variant="ghost"
                  size="icon"
                  className={`h-9 w-9 rounded-full transition-all ${
                    isRecording 
                      ? "bg-destructive hover:bg-destructive/90 text-white animate-pulse" 
                      : "hover:bg-primary/10"
                  }`}
                  disabled={isAnalyzing}
                  aria-label={isRecording ? "Stop recording" : "Start recording"}
                  aria-pressed={isRecording}
                >
                  {isRecording ? <X className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
                
                <Button
                  onClick={handleSend}
                  className="h-9 w-9 rounded-full bg-[hsl(48,95%,60%)] text-[hsl(25,15%,15%)] hover:opacity-90 transition-opacity shadow-md"
                  size="icon"
                  disabled={!input.trim() || isAnalyzing}
                  aria-label="Send message"
                >
                  {isAnalyzing ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}
    </>
  );
};

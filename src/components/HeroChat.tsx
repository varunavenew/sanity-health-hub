import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Mic, Settings, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatBubble } from "@/components/ChatBubble";
import { useToast } from "@/hooks/use-toast";
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

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface HeroChatProps {
  onIntentDetected: (intent: string, query: string) => void;
}

type Mode = "off" | "guide" | "auto";
type Language = "nb-NO" | "en-US";
type RecordingMode = "push-to-talk" | "toggle";

interface Settings {
  language: Language;
  ttsEnabled: boolean;
  recordingMode: RecordingMode;
}

export const HeroChat = ({ onIntentDetected }: HeroChatProps) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hei! 👋 Jeg er din adaptive nettassistent. Jeg kan hjelpe deg med å finne produkter, tjenester og informasjon. Hva leter du etter i dag?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [mode, setMode] = useState<Mode>("guide");
  const [isRecording, setIsRecording] = useState(false);
  const [partialTranscript, setPartialTranscript] = useState("");
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
      if (e.key === 'm' && !e.ctrlKey && !e.metaKey && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        toggleRecording();
      }
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
  }, [settings.language, settings.recordingMode, isRecording]);

  const logEvent = (event: string, data?: any) => {
    console.log(`[AWC Event] ${event}`, data);
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
      toast({
        title: "Mikrofonfeil",
        description: "Kunne ikke starte opptak. Sjekk mikrofoninnstillinger.",
        variant: "destructive",
      });
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

  const detectIntent = (text: string): { intent: string; query: string } => {
    const lowerText = text.toLowerCase();
    
    // Klær og vær
    if (lowerText.includes("kaldt vær") || lowerText.includes("varm") || lowerText.includes("klær")) {
      return { intent: "clothing", query: "kaldt vær" };
    }
    
    // Sko
    if (lowerText.includes("løpesko") || lowerText.includes("sko") || lowerText.includes("jobb")) {
      return { intent: "shoes", query: "løpesko" };
    }
    
    // Elektronikk
    if (lowerText.includes("elektronikk") || lowerText.includes("gadgets") || lowerText.includes("tech")) {
      return { intent: "electronics", query: "elektronikk" };
    }
    
    // Offentlige tjenester
    if (lowerText.includes("dagpenger") || lowerText.includes("nav")) {
      return { intent: "dagpenger", query: "dagpenger" };
    }
    
    if (lowerText.includes("sykepenger") || lowerText.includes("syk")) {
      return { intent: "sykepenger", query: "sykepenger" };
    }
    
    // Podcaster
    if (lowerText.includes("podcast") || lowerText.includes("lyd")) {
      return { intent: "podcasts", query: "teknologi" };
    }
    
    // Default
    return { intent: "general", query: text };
  };

  const generateAIResponse = (intent: string, query: string): string => {
    const responses: Record<string, string> = {
      clothing: "Perfekt! Jeg viser deg klær som holder deg varm i kaldt vær. 🧥 Sjekk ut vårt utvalg nedenfor!",
      shoes: "Flott valg! Her er løpesko som også ser profesjonelle ut på jobb. 👟 Se vår anbefaling under.",
      electronics: "Kult! Her er de nyeste teknologiske gadgetene. 📱 Bla nedover for å se mer.",
      dagpenger: "Jeg skal hjelpe deg med informasjon om dagpenger. 📋 Her er en steg-for-steg guide under.",
      sykepenger: "Her er alt du trenger å vite om å søke sykepenger. 🏥 Se informasjonen under for detaljer.",
      podcasts: "Jeg har funnet noen fantastiske teknologipodcaster for deg! 🎧 Sjekk ut spillelistene under.",
      general: "La meg finne den beste informasjonen for deg. Se resultatene nedenfor! ✨",
    };
    
    return responses[intent] || responses.general;
  };

  const handleSend = async () => {
    if (!input.trim() || mode === "off") return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking time
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const { intent, query } = detectIntent(input);
    const aiResponse = generateAIResponse(intent, query);

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: aiResponse,
      sender: "ai",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, aiMessage]);
    setIsTyping(false);

    // Speak AI response if TTS enabled
    speakText(aiResponse);

    // Notify parent component about detected intent
    if (mode === "guide" || mode === "auto") {
      onIntentDetected(intent, query);
      toast({
        title: mode === "guide" ? "Forslag" : "Handling utført",
        description: mode === "guide" 
          ? `Sjekk ut innholdet nedenfor relatert til "${query}"` 
          : `Navigerte til innhold om "${query}"`,
      });
      logEvent('action_plan_executed', { mode, intent, query });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="glass rounded-2xl p-6 md:p-8 glow-primary">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl gradient-primary">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold glow-text">Adaptive Web Companion</h2>
              <p className="text-sm text-muted-foreground">Din intelligente nettassistent</p>
            </div>
          </div>
          
          {/* Mode Selector & Settings */}
          <div className="flex items-center gap-2">
            <Select value={mode} onValueChange={(value) => {
              setMode(value as Mode);
              logEvent('mode_change', { mode: value });
            }}>
              <SelectTrigger className="w-24 h-9 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="off">Off</SelectItem>
                <SelectItem value="guide">Guide</SelectItem>
                <SelectItem value="auto">Auto</SelectItem>
              </SelectContent>
            </Select>
            
            <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Settings className="h-4 w-4" />
                  <span className="sr-only">Innstillinger</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Innstillinger</DialogTitle>
                  <DialogDescription>
                    Tilpass tale- og språkinnstillinger
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Språk</Label>
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
                      <span>Høytlesning</span>
                      <span className="text-xs text-muted-foreground font-normal">Les opp AI-svar</span>
                    </Label>
                    <Switch
                      id="tts"
                      checked={settings.ttsEnabled}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, ttsEnabled: checked }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="recording-mode">Opptaksmodus</Label>
                    <Select 
                      value={settings.recordingMode} 
                      onValueChange={(value) => setSettings(prev => ({ ...prev, recordingMode: value as RecordingMode }))}
                    >
                      <SelectTrigger id="recording-mode">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="push-to-talk">Hold for å snakke</SelectItem>
                        <SelectItem value="toggle">Trykk for å starte/stoppe</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <p className="text-xs text-muted-foreground">
                      <strong>Personvern:</strong> Lydopptak prosesseres kun i nettleseren din og lagres ikke.
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Messages */}
        <div className="h-[400px] overflow-y-auto mb-6 space-y-4 px-2" role="log" aria-live="polite" aria-atomic="false">
          {mode === "off" ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p className="text-center">Assistenten er av. Velg "Guide" eller "Auto" for å aktivere.</p>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <ChatBubble key={message.id} message={message} />
              ))}
              {isTyping && (
                <div className="flex gap-2 items-center text-muted-foreground">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                  <span className="text-sm">Tenker...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input */}
        <div className="space-y-2">
          {partialTranscript && (
            <div className="text-xs text-muted-foreground px-3 py-2 bg-muted/30 rounded-lg">
              <span className="opacity-70">Lytter: </span>
              <span className="animate-pulse">{partialTranscript}</span>
            </div>
          )}
          
          {isRecording && (
            <div className="text-xs text-primary px-3 py-2 bg-primary/10 rounded-lg flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              {settings.recordingMode === "push-to-talk" ? "Hold for å snakke..." : "Snakker..."}
            </div>
          )}
          
          <div className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={mode === "off" ? "Assistenten er av" : "Skriv ditt ønske her... (Trykk M for mikrofon)"}
              className="flex-1 bg-muted/50 border-primary/20 focus:border-primary"
              disabled={mode === "off"}
              aria-label="Chat input"
            />
            
            {mode !== "off" && (
              <Button
                onMouseDown={handleMicMouseDown}
                onMouseUp={handleMicMouseUp}
                onClick={handleMicClick}
                className={`transition-all ${
                  isRecording 
                    ? "bg-destructive hover:bg-destructive/90 animate-pulse" 
                    : "gradient-primary hover:opacity-90"
                }`}
                size="icon"
                aria-label={isRecording ? "Stop opptak" : "Start opptak"}
                aria-pressed={isRecording}
              >
                {isRecording ? <X className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </Button>
            )}
            
            <Button
              onClick={handleSend}
              className="gradient-primary hover:opacity-90 transition-opacity"
              size="icon"
              disabled={mode === "off" || !input.trim()}
              aria-label="Send melding"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground text-center">
            Snarvei: <kbd className="px-1 py-0.5 bg-muted rounded text-xs">M</kbd> for mikrofon, <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Esc</kbd> for å avbryte
          </p>
        </div>
      </div>
    </div>
  );
};

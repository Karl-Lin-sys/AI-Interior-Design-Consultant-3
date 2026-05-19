/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, RefreshCcw, ArrowRight, Home, Info } from "lucide-react";
import ImageUpload from "./components/ImageUpload";
import StyleCarousel, { INTERIOR_STYLES } from "./components/StyleCarousel";
import CompareSlider from "./components/CompareSlider";
import ChatInterface from "./components/ChatInterface";

interface Message {
  role: "user" | "ai";
  content: string;
}

export default function App() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [reimaginedImage, setReimaginedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState(INTERIOR_STYLES[0].id);
  const [isGenerating, setIsGenerating] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReimagine = async () => {
    if (!originalImage) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      // First ensure the user has accepted terms for paid models if needed
      // (This is a placeholder for the agent's logic to call the tool)
      
      const response = await fetch("/api/reimagine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: originalImage,
          style: selectedStyle
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setReimaginedImage(data.image);
      setMessages([
        { 
          role: "ai", 
          content: `Your room has been reimagined in **${selectedStyle.toUpperCase()}** style! \n\n${data.description || "I've updated the furniture, lighting, and textures to match the aesthetic. How do you like the new look? Feel free to ask me for specific refinements."}` 
        }
      ]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong during generation.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    const newMessages: Message[] = [...messages, { role: "user", content }];
    setMessages(newMessages);
    setIsChatLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          currentImage: reimaginedImage,
          style: selectedStyle
        }),
      });

      const data = await response.json();
      setMessages([...newMessages, { role: "ai", content: data.text }]);
    } catch (err) {
      console.error(err);
      setMessages([...newMessages, { role: "ai", content: "I'm sorry, I'm having trouble connecting right now. Please try again." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const reset = () => {
    setOriginalImage(null);
    setReimaginedImage(null);
    setMessages([]);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-neutral-900 selection:bg-neutral-900 selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 bg-white/80 backdrop-blur-md border-b border-neutral-100 z-[100] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center">
              <Home className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold tracking-tight text-xl">Lumina<span className="text-neutral-400 font-medium">Design</span></span>
          </div>
          <div className="flex items-center gap-6 text-sm font-medium text-neutral-500">
            <a href="#" className="hover:text-neutral-900 transition-colors">How it works</a>
            <a href="#" className="hover:text-neutral-900 transition-colors">Gallery</a>
            <button 
              onClick={reset}
              className="px-4 py-2 bg-neutral-900 text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-all"
            >
              Start Over
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* Left Column: Input & Controls */}
          <div className="lg:col-span-12 xl:col-span-5 space-y-10">
            <header className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-100 rounded-full text-[10px] font-bold tracking-tighter text-neutral-600 uppercase">
                <Sparkles className="w-3 h-3" />
                AI-Powered Transformation
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold tracking-tight leading-[0.95]">
                Reimagine your <br />
                living space in <br />
                <span className="italic font-serif text-neutral-400 underline decoration-neutral-200">seconds.</span>
              </h1>
              <p className="text-neutral-500 max-w-sm leading-relaxed">
                Upload a photo, pick a style, and let our AI consultant guide your room's evolution.
              </p>
            </header>

            {!reimaginedImage ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400">Step 1: Upload Photo</h3>
                  <ImageUpload onImageSelect={setOriginalImage} />
                </div>

                {originalImage && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-8"
                  >
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400">Step 2: Choose Style</h3>
                      <StyleCarousel selectedStyle={selectedStyle} onSelect={setSelectedStyle} disabled={isGenerating} />
                    </div>

                    <button
                      onClick={handleReimagine}
                      disabled={isGenerating}
                      className="w-full py-5 bg-neutral-900 text-white rounded-2xl font-bold text-lg hover:bg-neutral-800 transition-all shadow-xl shadow-neutral-900/10 flex items-center justify-center gap-3 disabled:bg-neutral-200"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCcw className="w-5 h-5 animate-spin" />
                          DESIGNING YOUR SPACE...
                        </>
                      ) : (
                        <>
                          REIMAGINE NOW
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                    
                    {error && (
                      <p className="text-red-500 text-sm text-center font-medium bg-red-50 p-4 rounded-xl border border-red-100 italic">
                        {error}
                      </p>
                    )}
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div className="p-6 bg-neutral-50 rounded-3xl border border-neutral-100 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-neutral-900">Current Style</h3>
                    <p className="text-xs text-neutral-500 uppercase tracking-widest mt-1">
                      {selectedStyle}
                    </p>
                  </div>
                  <button 
                    onClick={() => setReimaginedImage(null)}
                    className="p-3 bg-white rounded-full border border-neutral-200 hover:border-neutral-900 transition-all text-neutral-400 hover:text-neutral-900"
                  >
                    <RefreshCcw className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400">Step 3: Refine Design</h3>
                  <ChatInterface 
                    messages={messages} 
                    onSendMessage={handleSendMessage} 
                    isLoading={isChatLoading} 
                  />
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column: Visualization */}
          <div className="lg:col-span-12 xl:col-span-7 flex flex-col justify-start">
            <div className="sticky top-24">
              <AnimatePresence mode="wait">
                {reimaginedImage ? (
                  <motion.div
                    key="compared"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative"
                  >
                    <CompareSlider before={originalImage!} after={reimaginedImage} />
                    <div className="mt-6 flex items-center gap-4 text-neutral-400">
                      <div className="flex-1 h-[1px] bg-neutral-100" />
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                        <Info className="w-3 h-3" />
                        Drag slider to compare
                      </div>
                      <div className="flex-1 h-[1px] bg-neutral-100" />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full aspect-[4/3] bg-neutral-50 rounded-[40px] border-2 border-neutral-100 border-dashed flex items-center justify-center relative overflow-hidden group"
                  >
                    <div className="text-center z-10 p-12">
                      <div className="relative inline-block mb-8">
                        <div className="absolute inset-0 bg-neutral-900/5 blur-3xl rounded-full scale-150" />
                        <Sparkles className="w-16 h-16 text-neutral-200 group-hover:text-neutral-400 transition-all duration-700 relative scale-100 group-hover:scale-125" />
                      </div>
                      <h2 className="text-2xl font-serif italic text-neutral-300">Your vision will appear here</h2>
                    </div>
                    {/* Decorative abstract shapes */}
                    <div className="absolute top-10 left-10 w-24 h-24 bg-neutral-100 rounded-full blur-2xl opacity-50" />
                    <div className="absolute bottom-20 right-20 w-48 h-48 bg-neutral-100 rounded-full blur-3xl opacity-50" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </main>

      <footer className="px-6 py-12 border-t border-neutral-100 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-neutral-900 rounded flex items-center justify-center">
              <Home className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold tracking-tight text-lg">Lumina</span>
          </div>
          <p className="text-xs text-neutral-400 font-medium tracking-widest uppercase">
            &copy; 2026 Lumina Design AI • Built for Modern Living
          </p>
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full border border-neutral-100 hover:border-neutral-900 transition-colors cursor-pointer" />
            <div className="w-8 h-8 rounded-full border border-neutral-100 hover:border-neutral-900 transition-colors cursor-pointer" />
          </div>
        </div>
      </footer>
    </div>
  );
}

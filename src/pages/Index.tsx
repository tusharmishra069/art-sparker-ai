import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, Sparkles, Download, Image as ImageIcon } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const Index = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt required",
        description: "Please enter a description for your image",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedImage(null);

    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ inputs: prompt }),
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setGeneratedImage(imageUrl);
      
      toast({
        title: "Success!",
        description: "Your image has been generated",
      });
    } catch (error) {
      console.error("Error generating image:", error);
      toast({
        title: "Generation failed",
        description: "Please check your API key and try again",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = () => {
    if (generatedImage) {
      const a = document.createElement("a");
      a.href = generatedImage;
      a.download = `ai-generated-${Date.now()}.png`;
      a.click();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 pt-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI Image Generator</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Create Stunning Images
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-150">
            Transform your ideas into beautiful images using AI
          </p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-1000 delay-300">
          {/* Input Section */}
          <Card className="p-6 space-y-6 backdrop-blur-sm bg-card/50 border-2 border-border hover:border-primary/50 transition-all duration-300">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" />
                Describe your image
              </label>
              <Textarea
                placeholder="A serene landscape with mountains at sunset, highly detailed, 4k quality..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[200px] bg-background/50 resize-none"
              />
            </div>

            <Button
              onClick={generateImage}
              disabled={isGenerating}
              className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Image
                </>
              )}
            </Button>
          </Card>

          {/* Output Section */}
          <Card className="p-6 backdrop-blur-sm bg-card/50 border-2 border-border hover:border-primary/50 transition-all duration-300">
            <div className="space-y-4">
              <label className="text-sm font-medium flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-primary" />
                Generated Image
              </label>
              
              <div className="aspect-square rounded-lg border-2 border-dashed border-border bg-background/30 overflow-hidden">
                {isGenerating ? (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                    <Loader2 className="w-12 h-12 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Creating your image...</p>
                  </div>
                ) : generatedImage ? (
                  <img
                    src={generatedImage}
                    alt="Generated"
                    className="w-full h-full object-contain animate-in fade-in duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-muted-foreground">
                    <ImageIcon className="w-16 h-16 opacity-20" />
                    <p className="text-sm">Your image will appear here</p>
                  </div>
                )}
              </div>

              {generatedImage && !isGenerating && (
                <Button
                  onClick={downloadImage}
                  variant="outline"
                  className="w-full border-primary/50 hover:bg-primary/10"
                >
                  <Download className="w-4 h-4" />
                  Download Image
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;

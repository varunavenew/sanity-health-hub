import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UseGenerateImageProps {
  prompt: string;
  category: string;
  enabled?: boolean;
}

export const useGenerateImage = ({ prompt, category, enabled = true }: UseGenerateImageProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !prompt) return;

    const generateImage = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase.functions.invoke('generate-product-images', {
          body: { prompt, category }
        });

        if (error) throw error;

        if (data?.imageUrl) {
          setImageUrl(data.imageUrl);
        } else {
          throw new Error('Ingen bilde-URL mottatt');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Kunne ikke generere bilde';
        setError(errorMessage);
        console.error('Image generation error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    generateImage();
  }, [prompt, category, enabled]);

  return { imageUrl, isLoading, error };
};

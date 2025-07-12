import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Play, Tv } from 'lucide-react';
import { LiveVideo } from '@shared/schema';

const WatchLiveButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Fetch live videos
  const { data: liveVideos = [], isLoading } = useQuery<LiveVideo[]>({
    queryKey: ['/api/live-videos'],
  });

  // Get the first active live video
  const currentLiveVideo = liveVideos.find(video => video.isActive);

  // Function to convert YouTube URL to embed format
  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.includes('watch?v=') 
      ? url.split('watch?v=')[1].split('&')[0]
      : url.split('youtu.be/')[1]?.split('?')[0];
    
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
  };

  if (isLoading || !currentLiveVideo) {
    return null;
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-red-600 hover:bg-red-700 text-white rounded-full p-4 shadow-lg z-50 animate-pulse"
        size="lg"
      >
        <Tv className="w-6 h-6 mr-2" />
        Watch Live
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl w-full p-0 bg-black">
          <DialogHeader className="p-4 bg-black text-white">
            <DialogTitle className="flex items-center gap-2">
              <Play className="w-5 h-5 text-red-500" />
              {currentLiveVideo.title}
            </DialogTitle>
          </DialogHeader>
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src={getYouTubeEmbedUrl(currentLiveVideo.youtubeUrl)}
              className="absolute top-0 left-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={currentLiveVideo.title}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WatchLiveButton;
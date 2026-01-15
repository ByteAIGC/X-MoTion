import { useState, useRef } from 'react';

interface VideoComparisonProps {
  editedVideoSrc: string;
  originalVideoSrc?: string;
  base: string;
}

type OverlayState = 'small' | 'expanded' | 'hidden';

export function VideoComparison({ editedVideoSrc, originalVideoSrc, base }: VideoComparisonProps) {
  const [overlayState, setOverlayState] = useState<OverlayState>('small');
  const [hasBeenExpanded, setHasBeenExpanded] = useState(false);
  const originalVideoRef = useRef<HTMLVideoElement>(null);
  const editedVideoRef = useRef<HTMLVideoElement>(null);

  // Only show overlay if original video exists
  const showOriginal = originalVideoSrc !== undefined;

  // Sync video playback
  const syncVideos = () => {
    if (editedVideoRef.current && originalVideoRef.current) {
      const editedTime = editedVideoRef.current.currentTime;
      originalVideoRef.current.currentTime = editedTime;
    }
  };

  const handleClick = () => {
    if (!showOriginal) return;
    
    // Cycle: small -> expanded -> small -> hidden -> small
    if (overlayState === 'small') {
      if (hasBeenExpanded) {
        // We've been through expanded, so now go to hidden
        setOverlayState('hidden');
        setHasBeenExpanded(false); // Reset for next cycle
      } else {
        // First time, go to expanded
        setOverlayState('expanded');
        setHasBeenExpanded(true);
      }
      syncVideos();
    } else if (overlayState === 'expanded') {
      setOverlayState('small');
      syncVideos();
    } else if (overlayState === 'hidden') {
      setOverlayState('small');
      syncVideos();
    }
  };

  // Sync videos when edited video time updates
  const handleEditedVideoTimeUpdate = () => {
    if (originalVideoRef.current && editedVideoRef.current) {
      originalVideoRef.current.currentTime = editedVideoRef.current.currentTime;
    }
  };

  return (
    <div 
      className="video-comparison-container"
      onClick={handleClick}
    >
      {/* Main edited video */}
      <div className="video-main">
        <video 
          ref={editedVideoRef}
          muted 
          loop 
          autoPlay 
          playsInline
          onTimeUpdate={handleEditedVideoTimeUpdate}
        >
          <source src={`${base}${editedVideoSrc}`} type="video/mp4" />
        </video>
      </div>

      {/* Original video overlay - always render but hide visually to keep playing */}
      {showOriginal && (
        <div 
          className={`video-original-overlay ${overlayState === 'expanded' ? 'expanded' : ''} ${overlayState === 'hidden' ? 'hidden' : ''}`}
        >
          <video 
            ref={originalVideoRef}
            muted 
            loop 
            autoPlay 
            playsInline
          >
            <source src={`${base}${originalVideoSrc}`} type="video/mp4" />
          </video>
          <div className="video-label">Original</div>
        </div>
      )}
    </div>
  );
}


import { useState, useRef, useEffect, useCallback } from 'react';

interface VideoComparisonProps {
  editedVideoSrc: string;
  originalVideoSrc?: string;
  base: string;
}

type OverlayState = 'small' | 'expanded' | 'hidden';

export function VideoComparison({ editedVideoSrc, originalVideoSrc, base }: VideoComparisonProps) {
  const [overlayState, setOverlayState] = useState<OverlayState>('small');
  const [hasBeenExpanded, setHasBeenExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const originalVideoRef = useRef<HTMLVideoElement>(null);
  const editedVideoRef = useRef<HTMLVideoElement>(null);

  // Only show overlay if original video exists
  const showOriginal = originalVideoSrc !== undefined;

  // Throttled sync to avoid constant updates
  const syncVideos = useCallback(() => {
    if (editedVideoRef.current && originalVideoRef.current) {
      const editedTime = editedVideoRef.current.currentTime;
      // Only sync if difference is significant (>0.1s) to avoid micro-adjustments
      if (Math.abs(originalVideoRef.current.currentTime - editedTime) > 0.1) {
        originalVideoRef.current.currentTime = editedTime;
      }
    }
  }, []);

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

  // Throttled time update handler - only sync when original is visible
  const handleEditedVideoTimeUpdate = useCallback(() => {
    // Only sync if original video is visible (not hidden)
    if (overlayState !== 'hidden' && originalVideoRef.current && editedVideoRef.current) {
      const editedTime = editedVideoRef.current.currentTime;
      const originalTime = originalVideoRef.current.currentTime;
      // Only sync if difference is significant (>0.1s) to reduce updates
      if (Math.abs(originalTime - editedTime) > 0.1) {
        originalVideoRef.current.currentTime = editedTime;
      }
    }
  }, [overlayState]);

  // Intersection Observer for lazy loading - pause videos outside viewport
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const editedVideo = editedVideoRef.current;
          const originalVideo = originalVideoRef.current;
          
          if (entry.isIntersecting) {
            // Video is visible - ensure it's playing
            editedVideo?.play().catch(() => {});
            if (overlayState !== 'hidden') {
              originalVideo?.play().catch(() => {});
            }
          } else {
            // Video is not visible - pause to save resources
            editedVideo?.pause();
            originalVideo?.pause();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [overlayState]);

  return (
    <div 
      ref={containerRef}
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
          preload="metadata"
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
            preload="metadata"
          >
            <source src={`${base}${originalVideoSrc}`} type="video/mp4" />
          </video>
          <div className="video-label">Original</div>
        </div>
      )}
    </div>
  );
}


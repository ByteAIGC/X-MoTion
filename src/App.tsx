import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { FileText, Github, Play, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect } from 'react';
import GSBChart_Kling from './components/GSBChart_Kling';
import GSBChart_Runway from './components/GSBChart_Runway';
import { VideoComparison } from './components/VideoComparison';

export default function App() {
  const highResScrollRef = useRef<HTMLDivElement>(null);
  const diverseScrollRef = useRef<HTMLDivElement>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const base = import.meta.env.BASE_URL;

  // Helper function to get original video path from edited video filename
  const getOriginalVideoPath = (editedPath: string): string | undefined => {
    const filename = editedPath.split('/').pop() || '';
    return `assets_x/motion_driving/${filename}`;
  };

  // Diverse Generation videos
  const diverseVideos = [
    { src: "assets/multiscenes/0778.mp4", title: "Subject 2", description: "Multiple diverse scenarios" },
    { src: "assets/multiscenes/0828.mp4", title: "Subject 3", description: "Multiple diverse scenarios" },
    { src: "assets/multiscenes/0335.mp4", title: "Subject 4", description: "Multiple diverse scenarios" },
    { src: "assets/multiscenes/0086.mp4", title: "Subject 1", description: "Multiple diverse scenarios" },
  ];

  const scrollHighResLeft = () => {
    if (highResScrollRef.current) {
      highResScrollRef.current.scrollBy({ left: -500, behavior: 'smooth' });
    }
  };

  const scrollHighResRight = () => {
    if (highResScrollRef.current) {
      highResScrollRef.current.scrollBy({ left: 500, behavior: 'smooth' });
    }
  };

  const scrollDiverseLeft = () => {
    if (diverseScrollRef.current) {
      diverseScrollRef.current.scrollBy({ left: -diverseScrollRef.current.offsetWidth, behavior: 'smooth' });
      // State will be updated automatically by the scroll event listener
    }
  };

  const scrollDiverseRight = () => {
    if (diverseScrollRef.current) {
      diverseScrollRef.current.scrollBy({ left: diverseScrollRef.current.offsetWidth, behavior: 'smooth' });
      // State will be updated automatically by the scroll event listener
    }
  };

  const scrollToVideo = (index: number) => {
    if (diverseScrollRef.current) {
      const scrollAmount = index * diverseScrollRef.current.offsetWidth;
      diverseScrollRef.current.scrollTo({ left: scrollAmount, behavior: 'smooth' });
      setCurrentVideoIndex(index);
    }
  };

  // Auto-sync navigation with scroll position
  useEffect(() => {
    const scrollContainer = diverseScrollRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const scrollLeft = scrollContainer.scrollLeft;
      const containerWidth = scrollContainer.offsetWidth;
      const currentIndex = Math.round(scrollLeft / containerWidth);

      // Only update if the index has actually changed to avoid unnecessary re-renders
      if (currentIndex !== currentVideoIndex && currentIndex >= 0 && currentIndex < diverseVideos.length) {
        setCurrentVideoIndex(currentIndex);
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll);

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, [currentVideoIndex, diverseVideos.length]);


  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation Bar */}
      <nav className="navigation-bar">
        <div className="navigation-content">
          {/* <div className="navigation-title">
            <strong>X-MoTion:</strong> Re-Imagine Video via Re-Contextualized Semantics
          </div> */}
          <div className="navigation-buttons">
            <Button
              className="bg-transparent text-white hover:bg-white hover:text-black transition-colors px-4 py-2 h-auto border border-white/20"
              onClick={() => window.open('', '_blank')}
            >
              <FileText className="w-4 h-4 mr-2 text-white" />
              Technical Report (Coming Soon)
            </Button>

          </div>
          <div className="navigation-logo">
            <svg height="2194" viewBox="1.37 0 1198.25 1051.64" width="2500" xmlns="http://www.w3.org/2000/svg">
              <path d="m206.82 943.8-205.45 52.74v-941.44l205.45 53.14z" fill="#fff"/>
              <path d="m532.79 972.14-205.44 53.13v-554.55l205.44 53.13z" fill="#fff"/>
              <path d="m667.02 388.86 205.84-53.14v554.55l-205.84-53.13z" fill="#fff"/>
              <path d="m1199.62 998.9-205.84 52.74v-1051.64l205.84 53.13z" fill="#fff"/>
            </svg>
          </div>
        </div>
      </nav>

      {/* Teaser Description Section */}
      <section className="teaser-description-section">
        <div className="teaser-description-content">
          <h1 className="teaser-main-title">
            <strong>X-MoTion</strong>
          </h1>
          <h2 className="teaser-subtitle">
            In-Context Semantic Video Transformation
          </h2>
          <p className="teaser-description">
          We present X-MoTion, a self-supervised framework for in-context spatio-temporal video reimagination. Given a driving video, X-MoTion animates a reference image under joint guidance of text and rich video semantics, including motion, structure, camera movement, and visual effects. Unlike prior methods that rely on spatial alignment or domain-specific motion priors, X-MoTion transfers the semantic essence of unconstrained videos to novel images, even with large appearance and structural differences.
          Technically, we augment a pre-trained text-video diffusion transformer with an auxiliary branch that injects fine-grained spatio-temporal context from the driving video, operating alongside text and noise streams. Trained via self-supervision on unpaired, in-the-wild videos, our model learns transferable semantic conditioning without synthetic paired data. Experiments show X-MoTion supports high-fidelity motion transfer, multi-shot remixing, and text-guided spatio-temporal editing.
          </p>
        </div>
      </section>

      {/* Video Teaser Section */}
      <section className="section-fullwidth" style={{ marginTop: '20px', marginBottom: '80px' }}>
        <div className="video-container-large video-container-teaser">
          <video muted loop autoPlay playsInline>
            <source src={`${base}assets_x/teaser/all.mp4`} type="video/mp4" />
          </video>
        </div>
      </section>

      {/* Quantitative Evaluation */}
      <section className="max-w-[1920px] mx-auto px-4 md:px-[10%] mb-[100px]">
        <h3 className="text-xl font-semibold py-5 mb-5 text-left">
           Evaluation
        </h3>
        <p className="section-description text-left">
          GSB comparison demonstrates X-MoTion's superior performance across multiple evaluation metrics,
          achieving state-of-the-art results in semantics following, editing consistency, and perceptual fidelitys.
        </p>

        {/* GSB Comparison Chart */}
        <GSBChart_Kling />

        {/* GSB Comparison Chart */}
        <GSBChart_Runway />


      {/* Video Teaser Section */}
      <section className="section-fullwidth" style={{ marginBottom: '40px', marginTop: '80px' }}>

         <p className="section-description text-left">
          Visual comparison demonstrates X-MoTion's superior performance.
        </p>


        <div className="video-container-large video-container-comparison">
          <video muted loop autoPlay playsInline>
            <source src={`${base}assets_x/comparision/xmotion_basecomp1.mp4`} type="video/mp4" />
          </video>
        </div>

        <div className="video-container-large video-container-comparison">
          <video muted loop autoPlay playsInline>
            <source src={`${base}assets_x/comparision/xmotion_basecomp4.mp4`} type="video/mp4" />
          </video>
        </div>
        <div className="video-container-large video-container-comparison">
          <video muted loop autoPlay playsInline>
            <source src={`${base}assets_x/comparision/xmotion_basecomp7.mp4`} type="video/mp4" />
          </video>
        </div>
        <div className="video-container-large video-container-comparison">
          <video muted loop autoPlay playsInline>
            <source src={`${base}assets_x/comparision/xmotion_basecomp18.mp4`} type="video/mp4" />
          </video>
        </div>
        <div style={{ display: 'flex', gap: '16px', width: '100%', maxWidth: '1532px', margin: '0 auto' }}>
          <div className="video-container-large video-container-comparison" style={{ flex: '1', maxWidth: 'none', margin: '0' }}>
            <video muted loop autoPlay playsInline>
              <source src={`${base}assets_x/comparision/xmotion_basecomp2.mp4`} type="video/mp4" />
            </video>
          </div>
          <div className="video-container-large video-container-comparison" style={{ flex: '1', maxWidth: 'none', margin: '0' }}>
            <video muted loop autoPlay playsInline>
              <source src={`${base}assets_x/comparision/xmotion_basecomp8.mp4`} type="video/mp4" />
            </video>
          </div>
        </div>
      </section>

      </section>

      {/* Main Generation Examples - Masonry Grid */}
      <section className="section-fullwidth mb-[100px]">
        <div className="px-4 md:px-[10%]">
          <h3 className="text-xl font-semibold py-5 mb-5 text-left">
            Generic Motion Transfer
          </h3>
          <p className="section-description text-left">
          X-MoTion generates high-quality motion transfer and editing that support multi-form spatio-temporal semantic transfer, while preserving the identity characteristics.
          <br />
          <span style={{ fontSize: '0.9em', opacity: 0.8 }}>(Click the video to expand, shrink, or hide the original video overlay)</span>
          </p>
        </div>
        
        <div className="video-masonry-wrapper">
          <div className="video-masonry">
          <div className="video-masonry-item">
            <VideoComparison 
              editedVideoSrc="assets_x/motion_source/0_sora66_None_  &&  .mp4"
              originalVideoSrc={getOriginalVideoPath("assets_x/motion_source/0_sora66_None_  &&  .mp4")}
              base={base}
            />
          </div>
          <div className="video-masonry-item">
            <VideoComparison 
              editedVideoSrc="assets_x/motion_source/16_None_  &&  .mp4"
              originalVideoSrc={getOriginalVideoPath("assets_x/motion_source/16_None_  &&  .mp4")}
              base={base}
            />
          </div>
          <div className="video-masonry-item">
            <VideoComparison 
              editedVideoSrc="assets_x/motion_source/1_sora26_None_  && 在这段充满 (1).mp4"
              originalVideoSrc={getOriginalVideoPath("assets_x/motion_source/1_sora26_None_  && 在这段充满 (1).mp4")}
              base={base}
            />
          </div>
          <div className="video-masonry-item">
            <VideoComparison 
              editedVideoSrc="assets_x/motion_source/62_vfx_01_None_  &&  .mp4"
              originalVideoSrc={getOriginalVideoPath("assets_x/motion_source/62_vfx_01_None_  &&  .mp4")}
              base={base}
            />
          </div>
          <div className="video-masonry-item">
            <VideoComparison 
              editedVideoSrc="assets_x/motion_source/1_sora67_None_  &&  .mp4"
              originalVideoSrc={getOriginalVideoPath("assets_x/motion_source/1_sora67_None_  &&  .mp4")}
              base={base}
            />
          </div>
          <div className="video-masonry-item">
            <VideoComparison 
              editedVideoSrc="assets_x/motion_source/2_None_  &&  .mp4"
              originalVideoSrc={getOriginalVideoPath("assets_x/motion_source/2_None_  &&  .mp4")}
              base={base}
            />
          </div>

          <div className="video-masonry-item">
            <VideoComparison
              editedVideoSrc="assets_x/motion_source/0_牵引视频10_None_中景镜头，拍摄一个人 (5).mp4"
              originalVideoSrc={getOriginalVideoPath("assets_x/motion_source/0_牵引视频10_None_中景镜头，拍摄一个人 (5).mp4")}
              base={base}
            />
          </div>


          <div className="video-masonry-item">
            <VideoComparison
              editedVideoSrc="assets_x/motion_source/1_sora46_None_  &&  .mp4"
              originalVideoSrc={getOriginalVideoPath("assets_x/motion_source/1_sora46_None_  &&  .mp4")}
              base={base}
            />
          </div>

          <div className="video-masonry-item">
            <VideoComparison 
              editedVideoSrc="assets_x/motion_source/4_sora59_None_  &&  .mp4"
              originalVideoSrc={getOriginalVideoPath("assets_x/motion_source/4_sora59_None_  &&  .mp4")}
              base={base}
            />
          </div>
          <div className="video-masonry-item">
            <VideoComparison 
              editedVideoSrc="assets_x/motion_source/3_11_None_  &&  .mp4"
              originalVideoSrc={getOriginalVideoPath("assets_x/motion_source/3_11_None_  &&  .mp4")}
              base={base}
            />
          </div>
          <div className="video-masonry-item">
            <VideoComparison 
              editedVideoSrc="assets_x/motion_source/3_None_  &&  .mp4"
              originalVideoSrc={getOriginalVideoPath("assets_x/motion_source/3_None_  &&  .mp4")}
              base={base}
            />
          </div>
          <div className="video-masonry-item">
            <VideoComparison 
              editedVideoSrc="assets_x/motion_source/4_12_None_  &&  .mp4"
              originalVideoSrc={getOriginalVideoPath("assets_x/motion_source/4_12_None_  &&  .mp4")}
              base={base}
            />
          </div>
          <div className="video-masonry-item">
            <VideoComparison 
              editedVideoSrc="assets_x/motion_source/4_sora68_None_  &&   (1).mp4"
              originalVideoSrc={getOriginalVideoPath("assets_x/motion_source/4_sora68_None_  &&   (1).mp4")}
              base={base}
            />
          </div>
          <div className="video-masonry-item">
            <VideoComparison 
              editedVideoSrc="assets_x/motion_source/5_sora14_None_  && 门铃摄像头.mp4"
              originalVideoSrc={getOriginalVideoPath("assets_x/motion_source/5_sora14_None_  && 门铃摄像头.mp4")}
              base={base}
            />
          </div>
          <div className="video-masonry-item">
            <VideoComparison 
              editedVideoSrc="assets_x/motion_source/7_15_None_  &&  .mp4"
              originalVideoSrc={getOriginalVideoPath("assets_x/motion_source/7_15_None_  &&  .mp4")}
              base={base}
            />
          </div>
          <div className="video-masonry-item">
            <VideoComparison 
              editedVideoSrc="assets_x/motion_source/11_19_None_  &&  .mp4"
              originalVideoSrc={getOriginalVideoPath("assets_x/motion_source/11_19_None_  &&  .mp4")}
              base={base}
            />
          </div>
          <div className="video-masonry-item">
            <VideoComparison 
              editedVideoSrc="assets_x/motion_source/12_None_  &&  .mp4"
              originalVideoSrc={getOriginalVideoPath("assets_x/motion_source/12_None_  &&  .mp4")}
              base={base}
            />
          </div>
          <div className="video-masonry-item">
            <VideoComparison 
              editedVideoSrc="assets_x/motion_source/14_21_None_  &&  .mp4"
              originalVideoSrc={getOriginalVideoPath("assets_x/motion_source/14_21_None_  &&  .mp4")}
              base={base}
            />
          </div>
          <div className="video-masonry-item">
            <VideoComparison 
              editedVideoSrc="assets_x/motion_source/14_sora29_None_  &&  .mp4"
              originalVideoSrc={getOriginalVideoPath("assets_x/motion_source/14_sora29_None_  &&  .mp4")}
              base={base}
            />
          </div>
          <div className="video-masonry-item">
            <VideoComparison 
              editedVideoSrc="assets_x/motion_source/15_sora24_None_  && 从一个人的.mp4"
              originalVideoSrc={getOriginalVideoPath("assets_x/motion_source/15_sora24_None_  && 从一个人的.mp4")}
              base={base}
            />
          </div>
          <div className="video-masonry-item">
            <VideoComparison 
              editedVideoSrc="assets_x/motion_source/0_sora69_None_  &&  .mp4"
              originalVideoSrc={getOriginalVideoPath("assets_x/motion_source/0_sora69_None_  &&  .mp4")}
              base={base}
            />
          </div>
          <div className="video-masonry-item">
            <VideoComparison 
              editedVideoSrc="assets_x/motion_source/17_24_None_  &&  .mp4"
              originalVideoSrc={getOriginalVideoPath("assets_x/motion_source/17_24_None_  &&  .mp4")}
              base={base}
            />
          </div>
          <div className="video-masonry-item">
            <VideoComparison 
              editedVideoSrc="assets_x/motion_source/19_26_None_  &&  .mp4"
              originalVideoSrc={getOriginalVideoPath("assets_x/motion_source/19_26_None_  &&  .mp4")}
              base={base}
            />
          </div>
          <div className="video-masonry-item">
            <VideoComparison 
              editedVideoSrc="assets_x/motion_source/21_None_  &&  .mp4"
              originalVideoSrc={getOriginalVideoPath("assets_x/motion_source/21_None_  &&  .mp4")}
              base={base}
            />
          </div>
          <div className="video-masonry-item">
            <VideoComparison 
              editedVideoSrc="assets_x/motion_source/21_sora30_None_  &&  .mp4"
              originalVideoSrc={getOriginalVideoPath("assets_x/motion_source/21_sora30_None_  &&  .mp4")}
              base={base}
            />
          </div>
          <div className="video-masonry-item">
            <VideoComparison 
              editedVideoSrc="assets_x/motion_source/26_None_  &&  .mp4"
              originalVideoSrc={getOriginalVideoPath("assets_x/motion_source/26_None_  &&  .mp4")}
              base={base}
            />
          </div>
          <div className="video-masonry-item">
            <VideoComparison 
              editedVideoSrc="assets_x/motion_source/27_8_None_  &&  .mp4"
              originalVideoSrc={getOriginalVideoPath("assets_x/motion_source/27_8_None_  &&  .mp4")}
              base={base}
            />
          </div>
          <div className="video-masonry-item">
            <VideoComparison 
              editedVideoSrc="assets_x/motion_source/28_9_None_  &&  .mp4"
              originalVideoSrc={getOriginalVideoPath("assets_x/motion_source/28_9_None_  &&  .mp4")}
              base={base}
            />
          </div>
          <div className="video-masonry-item">
            <VideoComparison 
              editedVideoSrc="assets_x/motion_source/31_None_  &&  .mp4"
              originalVideoSrc={getOriginalVideoPath("assets_x/motion_source/31_None_  &&  .mp4")}
              base={base}
            />
          </div>
          <div className="video-masonry-item">
            <VideoComparison 
              editedVideoSrc="assets_x/motion_source/35_sora44_None_  &&  .mp4"
              originalVideoSrc={getOriginalVideoPath("assets_x/motion_source/35_sora44_None_  &&  .mp4")}
              base={base}
            />
          </div>
          <div className="video-masonry-item">
            <VideoComparison 
              editedVideoSrc="assets_x/motion_source/40_None_  &&  .mp4"
              originalVideoSrc={getOriginalVideoPath("assets_x/motion_source/40_None_  &&  .mp4")}
              base={base}
            />
          </div>
          <div className="video-masonry-item">
            <VideoComparison 
              editedVideoSrc="assets_x/motion_source/42_None_  &&  .mp4"
              originalVideoSrc={getOriginalVideoPath("assets_x/motion_source/42_None_  &&  .mp4")}
              base={base}
            />
          </div>
          <div className="video-masonry-item">
            <VideoComparison 
              editedVideoSrc="assets_x/motion_source/42_sora52_None_  &&  .mp4"
              originalVideoSrc={getOriginalVideoPath("assets_x/motion_source/42_sora52_None_  &&  .mp4")}
              base={base}
            />
          </div>
          <div className="video-masonry-item">
            <VideoComparison 
              editedVideoSrc="assets_x/motion_source/43_sora53_None_  &&  .mp4"
              originalVideoSrc={getOriginalVideoPath("assets_x/motion_source/43_sora53_None_  &&  .mp4")}
              base={base}
            />
          </div>
          <div className="video-masonry-item">
            <VideoComparison 
              editedVideoSrc="assets_x/motion_source/47_sora54_None_  &&  .mp4"
              originalVideoSrc={getOriginalVideoPath("assets_x/motion_source/47_sora54_None_  &&  .mp4")}
              base={base}
            />
          </div>
          <div className="video-masonry-item">
            <VideoComparison 
              editedVideoSrc="assets_x/motion_source/59_vfx_03_None_  &&  .mp4"
              originalVideoSrc={getOriginalVideoPath("assets_x/motion_source/59_vfx_03_None_  &&  .mp4")}
              base={base}
            />
          </div>
          </div>
        </div>
      </section>

      {/* Text Edit Examples - Masonry Grid */}
      <section className="section-fullwidth mb-[100px]" style={{ marginTop: '80px' }}>
        <div className="px-4 md:px-[10%]">
          <h3 className="text-xl font-semibold py-5 mb-5 text-left">
            Text-Instructed Spatio-Temporal Editing
          </h3>
          <p className="section-description text-left">
            X-MoTion enables text-guided editing capabilities, allowing precise control over spatio-temporal transformations through natural language instructions.
            (Edited video in left column.)
          </p>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {/* First row */}
          <div style={{ display: 'flex', flexDirection: 'row', gap: '4px', flexWrap: 'nowrap' }}>
            <div className="video-masonry-item prompt-wrap" style={{ flex: '1 1 0', minWidth: 0 }}>
              <video muted loop autoPlay playsInline style={{ width: '100%', height: 'auto' }}>
                <source src={`${base}assets_x/text_edit/38_sora48_None_  &&  .mp4`} type="video/mp4" />
              </video>
              <div className="prompt">A tiger walks out from inside a doorway</div>
            </div>
            <div className="video-masonry-item prompt-wrap" style={{ flex: '1 1 0', minWidth: 0 }}>
              <video muted loop autoPlay playsInline style={{ width: '100%', height: 'auto' }}>
                <source src={`${base}assets_x/text_edit/0_sora71_None_  &&  .mp4`} type="video/mp4" />
              </video>
              <div className="prompt">A girl refuses a marriage proposal and leaves disappointed</div>
            </div>
            <div className="video-masonry-item prompt-wrap" style={{ flex: '1 1 0', minWidth: 0 }}>
              <video muted loop autoPlay playsInline style={{ width: '100%', height: 'auto' }}>
                <source src={`${base}assets_x/text_edit/48_None_  &&  .mp4`} type="video/mp4" />
              </video>
              <div className="prompt">The man in the background is singing and dancing along to the music.</div>
            </div>
            <div className="video-masonry-item prompt-wrap" style={{ flex: '1 1 0', minWidth: 0 }}>
              <video muted loop autoPlay playsInline style={{ width: '100%', height: 'auto' }}>
                <source src={`${base}assets_x/text_edit/41_sora51_None_  &&  .mp4`} type="video/mp4" />
              </video>
              <div className="prompt">Colorful fireworks burst into the air</div>
            </div>
          </div>
          {/* Second row */}
          <div style={{ display: 'flex', flexDirection: 'row', gap: '4px', flexWrap: 'nowrap' }}>
            <div className="video-masonry-item prompt-wrap" style={{ flex: '1 1 0', minWidth: 0 }}>
              <video muted loop autoPlay playsInline style={{ width: '100%', height: 'auto' }}>
                <source src={`${base}assets_x/text_edit/0_sora70_None_ && .mp4`} type="video/mp4" />
              </video>
              <div className="prompt">Medieval European outdoors, heavy snow drifting in the sky</div>
            </div>
            <div className="video-masonry-item prompt-wrap" style={{ flex: '1 1 0', minWidth: 0 }}>
              <video muted loop autoPlay playsInline style={{ width: '100%', height: 'auto' }}>
                <source src={`${base}assets_x/text_edit/0_sora72_None_  &&  .mp4`} type="video/mp4" />
              </video>
              <div className="prompt">Ancient castle corridor, a black crow flies overhead</div>
            </div>
          </div>
        </div>
      </section>

     

 


      {/* Footer */}
      <section className="max-w-[1920px] mx-auto px-4 md:px-[10%] py-20 mt-20 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
        
        <div className="text-center space-y-8 relative z-10">
          <h4 className="text-xl font-medium">Research Team</h4>
          
          {/* <div className="space-y-2 text-base font-light">
            <div>
              <a
                href="https://ssangx.github.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#999999] hover:text-white transition-colors underline"
              >
                Shen Sang*
              </a>
            </div>
            <div>
              <a
                href="https://tiancheng-zhi.github.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#999999] hover:text-white transition-colors underline"
              >
                Tiancheng Zhi*
              </a>
            </div>
            <div>
              <a
                href="https://gutianpei.github.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#999999] hover:text-white transition-colors underline"
              >
                Tianpei Gu
              </a>
            </div>
            <div>
              <a
                href="https://www.jingliu.net/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#999999] hover:text-white transition-colors underline"
              >
                Jing Liu
              </a>
            </div>
            <div>
              <a
                href="https://linjieluo.github.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#999999] hover:text-white transition-colors underline"
              >
                Linjie Luo
              </a>
            </div>
          </div>
          
          <div className="text-xs font-light text-[#999999] -mt-4 mb-4">
            *Equal Contribution
          </div> */}

          <div className="text-base font-light text-[#999999]">
            Intelligent Creation, ByteDance
          </div>
          
          <div className="text-xs font-light text-[#666666] mt-8">
            Webpage design inspired by <a href="https://seaweed-apt.com/2" target="_blank" rel="noopener noreferrer" className="text-[#999999] hover:text-white transition-colors underline">Seaweed-APT2</a>
          </div>
        </div>
      </section>
    </div>
  );
}

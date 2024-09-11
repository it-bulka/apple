import { memo, useCallback, useEffect, useRef, useState } from "react";
import { hightlightsSlides } from "src/constants/index.js";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { playImg, pauseImg, replayImg } from "src/utils/index.js";
import { lgScreenSize } from "src/constants/index.js";

gsap.registerPlugin(ScrollTrigger)

const videoHandler = {
  RESET: 'video-reset',
  PLAY: 'play',
  PAUSE: 'pause',
  END: 'video-end',
  LAST: 'video-last'

}
export const VideoCarousel = memo(() => {
  const videoRef = useRef([]);
  const videoIndecatorWrapperRef = useRef([]);
  const videoIndecatorRef = useRef([]);

  const [video, setVideo] = useState({
    isEnd: false,
    startVideo: false,
    videoId: 0,
    isLastVideo: false,
    isPlaying: false,
  });
  const { isEnd, startPlay, videoId, isLastVideo, isPlaying} = video
  const [loadedData, setLoadedData] = useState([])
  const videoIdRef = useRef(0)

  const setVideoRef = useCallback((i) => (el) => {
    if(!el) return
    videoRef.current[i] = el
  }, [])

  const handleLoadedMetadata = (i) => (e) => {
    setLoadedData(pre => ([ ...pre, e]))
  }

  useEffect(() => {
    if(loadedData.length >= hightlightsSlides.length) {
      if(!isPlaying) {
        videoRef.current[videoId]?.pause()
      } else {
        startPlay && videoRef.current[videoId]?.play()
      }
    }

  }, [isEnd, startPlay, videoId, isLastVideo, isPlaying]);

  useEffect(() => {
    let currentProgress = 0
    const indecators = videoIndecatorRef.current
    const indecatorWrapers = videoIndecatorWrapperRef.current
    let anim = null

    if (indecators[videoId]) {
      // animate the progress of video
      anim = gsap.to(indecators[videoId], {
        onStart: () => {
          gsap.to(indecatorWrapers[videoId], {
            width: window.innerWidth < lgScreenSize ? '10vw' : '4vw'
          })
        },
        onUpdate: () => {
          const progress = Math.ceil(anim.progress() * 100)
          if(progress !== currentProgress) {
            currentProgress = progress
          }

          gsap.to(indecators[videoId], {
            width: `${currentProgress}%`,
            backgroundColor: 'white'
          })
        },
        onComplete: () => {
          if(isPlaying) {
            gsap.to(indecatorWrapers[videoId], {
              width: '12px'
            })
            gsap.to(indecators[videoId], {
              backgroundColor: '#afafaf'
            })
          }
        }
      })

      if(videoId === 0) {
        anim.restart()
      }

      // update the progress bar
      const animUpdate = () => {
        anim.progress(videoRef.current[videoId].currentTime / hightlightsSlides[videoId].videoDuration)
      }
      if(isPlaying) {
        gsap.ticker.add(animUpdate)
      } else {
        gsap.ticker.remove(animUpdate)
      }
    }
    // Clean up
    /*return () => {
      gsap.ticker.remove(animUpdate);
      anim?.kill();
    };*/
  }, [videoId, startPlay])

  useGSAP(() => {
    gsap.to('#slider', {
      transform: `translateX(${-100 * videoId}%)`,
      duration: 2,
      ease: 'power2.inOut',
    })

    gsap.to('#video', {
      scrollTrigger: {
        trigger: '#video',
        toggleActions: 'restart none none none'
      },
      onComplete: () => {
        setVideo(pre => ({ ...pre, startPlay: true, isPlaying: true }))
      }
    })
  }, [isEnd, videoId])

  const handleProcess = (type, i) => {
    switch (type) {
      case videoHandler.END:
        setVideo(prev => ({ ...prev, isEnd: false, videoId: i + 1 }))
        break;
      case videoHandler.LAST:
        setVideo(prev => ({ ...prev, isLastVideo: true }))
        break;
      case videoHandler.RESET:
        setVideo(prev => ({ ...prev, isLastVideo: false, videoId: 0 }))
        break;
      case videoHandler.PLAY:
        setVideo(prev => ({ ...prev, isPlaying: !prev.isPlaying }))
        break;
      default:
        break;
    }
  }


  return (
    <>
      <div className="flex items-center">
        {hightlightsSlides.map((list, i) => (
          <div key={list.id} id="slider" className="sm:pr-20 pr-10">
            <div className="video-carousel_container">
              <div className="w-full h-full flex-center rounded-3xl overflow-hidden bg-black">
                <video
                  id="video"
                  playsInline={true}
                  /*className={`${list.id === 2 && "translate-x-44"} pointer-events-none`}*/
                  preload="auto"
                  muted
                  ref={setVideoRef(i)}
                  onEnded={() =>
                    i !== (hightlightsSlides.length - 1)
                      ? handleProcess(videoHandler.END, i)
                      : handleProcess(videoHandler.LAST)
                  }
                  onPlay={() => (setVideo(prev => ({ ...prev, isPlaying: true })))}
                  onLoadedMetadata={handleLoadedMetadata(i)}
                >
                  <source src={list.video} type="video/mp4"/>
                </video>
              </div>

              <div className="absolute top-12 left-[5%] z-10">
                {list.textLists.map((text, i) => (
                  <p key={i} className="md:text-2xl text-xl font-medium">
                    {text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative flex-center mt-10">
        <div className="flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full">
          {videoRef.current.map((_, i) => (
            <span
              key={i}
              className="mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer"
              ref={(el) => (videoIndecatorWrapperRef.current[i] = el)}
            >
              <span
                className="absolute h-full w-full rounded-full"
                ref={(el) => (videoIndecatorRef.current[i] = el)}
              />
            </span>
          ))}
        </div>

        <button className="control-btn">
          <img
            src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
            alt={isLastVideo ? "replay" : !isPlaying ? "play" : "pause"}
            onClick={
              isLastVideo
                ? () => handleProcess(videoHandler.RESET)
                : !isPlaying
                  ? () => handleProcess(videoHandler.PLAY)
                  : () => handleProcess(videoHandler.PAUSE)
            }
          />
        </button>
      </div>
    </>
  );
})
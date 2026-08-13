
"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

const PLAYLIST_ID = "PLGeZBZvchIWA";
const BACKGROUND = "/background.png";
const COVER = "https://www.apnabihar.xyz/covers/GZKPkb5dUsI.jpg";

export default function Home() {
  const playerRef = useRef<any>(null);
  const hostRef = useRef<HTMLDivElement>(null);

  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [title, setTitle] = useState("Kaanch Hi Baans Ke Bahangiya");
  const [artist, setArtist] = useState("Kalpana Patowary");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    function updateInfo() {
      try {
        if (!playerRef.current) return;

        const data = playerRef.current.getVideoData();

        if (data && data.title) {
          setTitle(data.title);
        }

        if (data && data.author) {
          setArtist(data.author);
        }

        const total = playerRef.current.getDuration();

        if (total) {
          setDuration(total);
        }
      } catch {}
    }

    function createPlayer() {
      if (!hostRef.current) return;
      if (!window.YT) return;
      if (!window.YT.Player) return;
      if (playerRef.current) return;

      playerRef.current = new window.YT.Player(
        hostRef.current,
        {
          width: "1",
          height: "1",

          playerVars: {
            listType: "playlist",
            list: PLAYLIST_ID,
            autoplay: 0,
            controls: 0,
            playsinline: 1
          },

          events: {
            onReady: function () {
              setReady(true);
              updateInfo();
            },

            onStateChange: function (event: any) {
              if (!window.YT) return;

              if (
                event.data ===
                window.YT.PlayerState.PLAYING
              ) {
                setPlaying(true);
              } else {
                setPlaying(false);
              }

              updateInfo();
            },

            onError: function (event: any) {
              console.log(
                "YouTube error:",
                event.data
              );
            }
          }
        }
      );
    }

    if (window.YT && window.YT.Player) {
      createPlayer();
    } else {
      window.onYouTubeIframeAPIReady = createPlayer;

      const existing = document.querySelector(
        'script[src="https://www.youtube.com/iframe_api"]'
      );

      if (!existing) {
        const script = document.createElement("script");

        script.src =
          "https://www.youtube.com/iframe_api";

        script.async = true;

        document.body.appendChild(script);
      }
    }

    const timer = window.setInterval(function () {
      try {
        if (!playerRef.current) return;

        const time =
          playerRef.current.getCurrentTime();

        const total =
          playerRef.current.getDuration();

        setCurrentTime(time || 0);

        if (total) {
          setDuration(total);
        }
      } catch {}
    }, 500);

    return function () {
      window.clearInterval(timer);

      try {
        if (playerRef.current) {
          playerRef.current.destroy();
        }
      } catch {}

      playerRef.current = null;
    };
  }, []);

  function playPause() {
    if (!playerRef.current) return;
    if (!ready) return;

    if (playing) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  }

  function previousSong() {
    if (!playerRef.current) return;
    if (!ready) return;

    playerRef.current.previousVideo();
  }

  function nextSong() {
    if (!playerRef.current) return;
    if (!ready) return;

    playerRef.current.nextVideo();
  }

  function seek(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    if (!playerRef.current) return;
    if (!duration) return;

    const rect =
      event.currentTarget.getBoundingClientRect();

    const percentage =
      (event.clientX - rect.left) /
      rect.width;

    const newTime =
      Math.max(
        0,
        Math.min(1, percentage)
      ) * duration;

    playerRef.current.seekTo(
      newTime,
      true
    );
  }

  function formatTime(seconds: number) {
    if (!seconds) {
      return "0:00";
    }

    const minutes =
      Math.floor(seconds / 60);

    const secondsPart =
      Math.floor(seconds % 60)
        .toString()
        .padStart(2, "0");

    return (
      minutes +
      ":" +
      secondsPart
    );
  }

  const progress =
    duration > 0
      ? Math.min(
          100,
          (currentTime / duration) * 100
        )
      : 0;

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundImage:
          "linear-gradient(rgba(0,0,0,.38),rgba(0,0,0,.38)),url(" +
          BACKGROUND +
          ")",
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "white",
        position: "relative",
        fontFamily: "Arial, sans-serif"
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "18px",
          left: "18px",
          fontSize: "18px",
          fontWeight: 800,
          zIndex: 2
        }}
      >
        Aapan Bihar
      </div>

      <a
        href={
          "https://music.youtube.com/playlist?list=" +
          PLAYLIST_ID
        }
        target="_blank"
        rel="noreferrer"
        style={{
          position: "absolute",
          top: "20px",
          right: "24px",
          color: "white",
          textDecoration: "none",
          zIndex: 2
        }}
      >
        ▶ YT Music
      </a>

      <h1
        style={{
          position: "absolute",
          top: "55px",
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: "clamp(55px,10vw,150px)",
          margin: 0,
          fontWeight: 900,
          zIndex: 2
        }}
      >
        Chhath Ghat
      </h1>

      <section
        style={{
          position: "absolute",
          left: "50%",
          bottom: "30px",
          transform: "translateX(-50%)",
          width: "min(590px,92vw)",
          minHeight: "108px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "10px",
          borderRadius: "60px",
          background: "rgba(45,24,17,.78)",
          border: "1px solid rgba(255,255,255,.22)",
          zIndex: 2
        }}
      >
        <div
          style={{
            width: "72px",
            height: "72px",
            minWidth: "72px",
            borderRadius: "50%",
            overflow: "hidden"
          }}
        >
          <img
            src={COVER}
            alt="Cover"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover"
            }}
          />
        </div>

        <div
          style={{
            flex: 1,
            minWidth: 0
          }}
        >
          <div
            style={{
              fontSize: "16px",
              fontWeight: 700,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis"
            }}
          >
            {title}
          </div>

          <div
            style={{
              marginTop: "4px",
              fontSize: "13px",
              opacity: 0.7
            }}
          >
            {artist}
          </div>

          <button
            onClick={seek}
            style={{
              width: "100%",
              height: "15px",
              padding: 0,
              marginTop: "8px",
              border: 0,
              background: "transparent"
            }}
          >
            <span
              style={{
                display: "block",
                width: "100%",
                height: "3px",
                background: "rgba(255,255,255,.3)"
              }}
            >
              <span
                style={{
                  display: "block",
                  height: "100%",
                  width: progress + "%",
                  background: "white"
                }}
              />
            </span>
          </button>

          <div
            style={{
              fontSize: "11px",
              opacity: 0.7
            }}
          >
            {formatTime(currentTime)}
            {" / "}
            {formatTime(duration)}
          </div>
        </div>

        <button
          onClick={previousSong}
          style={buttonStyle}
        >
          ◀
        </button>

        <button
          onClick={playPause}
          style={{
            ...buttonStyle,
            width: "54px",
            height: "54px",
            borderRadius: "50%",
            background: "white",
            color: "#241a15",
            fontSize: "20px"
          }}
        >
          {playing ? "Ⅱ" : "▶"}
        </button>

        <button
          onClick={nextSong}
          style={buttonStyle}
        >
          ▶
        </button>
      </section>

      <a
        href="https://www.instagram.com/nomadevishal/"
        target="_blank"
        rel="noreferrer"
        style={{
          position: "absolute",
          right: "20px",
          bottom: "18px",
          color: "white",
          textDecoration: "none",
          zIndex: 2
        }}
      >
        Add Suggestions
      </a>
<div
  style={{
    position: "absolute",
    left: "18px",
    bottom: "20px",
    color: "rgba(255,255,255,.8)",
    fontSize: "13px",
    zIndex: 2
  }}
>
  Made by{" "}
  <a
    href="https://www.instagram.com/nomadevishal/"
    target="_blank"
    rel="noreferrer"
    style={{
      color: "white",
      fontWeight: 700,
      textDecoration: "none"
    }}
  >
    @nomadevishal
  </a>
</div>
      <div
        ref={hostRef}
        style={{
          position: "fixed",
          width: "1px",
          height: "1px",
          left: "-10px",
          bottom: "-10px",
          opacity: 0,
          pointerEvents: "none"
        }}
      />
    </main>
  );
}

const buttonStyle = {
  width: "38px",
  height: "42px",
  border: 0,
  background: "transparent",
  color: "white",
  cursor: "pointer",
  fontSize: "18px"
};


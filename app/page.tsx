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

const COVER =
  "https://www.apnabihar.xyz/covers/GZKPkb5dUsI.jpg";

// =========================
// CHHATH 2026
// =========================

const CHHATH_START = new Date(
  "2026-11-13T00:00:00+05:30"
).getTime();

const CHHATH_DAYS = [
  {
    date: "13 नवंबर 2026",
    day: "शुक्रवार",
    title: "नहाय-खाय",
    icon: "🪔",
  },
  {
    date: "14 नवंबर 2026",
    day: "शनिवार",
    title: "खरना",
    icon: "🌾",
  },
  {
    date: "15 नवंबर 2026",
    day: "रविवार",
    title: "संध्या अर्घ्य",
    icon: "🌅",
  },
  {
    date: "16 नवंबर 2026",
    day: "सोमवार",
    title: "उषा अर्घ्य",
    icon: "☀️",
  },
];

export default function Home() {
  const playerRef = useRef<any>(null);
  const hostRef = useRef<HTMLDivElement>(null);

  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const [title, setTitle] = useState(
    "Kaanch Hi Baans Ke Bahangiya"
  );

  const [artist, setArtist] = useState(
    "Kalpana Patowary"
  );

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [isMobile, setIsMobile] = useState(false);

  // =========================
  // SCREEN SIZE
  // =========================

  useEffect(() => {
    function checkScreen() {
      setIsMobile(window.innerWidth <= 700);
    }

    checkScreen();

    window.addEventListener("resize", checkScreen);

    return () => {
      window.removeEventListener("resize", checkScreen);
    };
  }, []);

  // =========================
  // PAGE LOAD ANIMATION
  // =========================

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLoaded(true);
    }, 120);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  // =========================
  // COUNTDOWN
  // =========================

  useEffect(() => {
    function updateCountdown() {
      const difference = CHHATH_START - Date.now();

      if (difference <= 0) {
        setCountdown({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });

        return;
      }

      const totalSeconds = Math.floor(
        difference / 1000
      );

      const days = Math.floor(
        totalSeconds / 86400
      );

      const hours = Math.floor(
        (totalSeconds % 86400) / 3600
      );

      const minutes = Math.floor(
        (totalSeconds % 3600) / 60
      );

      const seconds = totalSeconds % 60;

      setCountdown({
        days,
        hours,
        minutes,
        seconds,
      });
    }

    updateCountdown();

    const timer = window.setInterval(
      updateCountdown,
      1000
    );

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  // =========================
  // YOUTUBE PLAYER
  // =========================

  useEffect(() => {
    function updateInfo() {
      try {
        if (!playerRef.current) return;

        const data =
          playerRef.current.getVideoData();

        if (data?.title) {
          setTitle(data.title);
        }

        if (data?.author) {
          setArtist(data.author);
        }

        const total =
          playerRef.current.getDuration();

        if (total) {
          setDuration(total);
        }
      } catch {}
    }

    function createPlayer() {
      if (!hostRef.current) return;
      if (!window.YT?.Player) return;
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
            playsinline: 1,
          },

          events: {
            onReady() {
              setReady(true);
              updateInfo();
            },

            onStateChange(event: any) {
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

            onError(event: any) {
              console.log(
                "YouTube error:",
                event.data
              );
            },
          },
        }
      );
    }

    if (window.YT?.Player) {
      createPlayer();
    } else {
      window.onYouTubeIframeAPIReady =
        createPlayer;

      const existing =
        document.querySelector(
          'script[src="https://www.youtube.com/iframe_api"]'
        );

      if (!existing) {
        const script =
          document.createElement("script");

        script.src =
          "https://www.youtube.com/iframe_api";

        script.async = true;

        document.body.appendChild(script);
      }
    }

    const timer = window.setInterval(() => {
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

    return () => {
      window.clearInterval(timer);

      try {
        playerRef.current?.destroy();
      } catch {}

      playerRef.current = null;
    };
  }, []);

  // =========================
  // PLAYER CONTROLS
  // =========================

  function playPause() {
    if (!playerRef.current || !ready) return;

    if (playing) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  }

  function previousSong() {
    if (!playerRef.current || !ready) return;

    playerRef.current.previousVideo();
  }

  function nextSong() {
    if (!playerRef.current || !ready) return;

    playerRef.current.nextVideo();
  }

  function seek(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    if (!playerRef.current || !duration) {
      return;
    }

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

  // =========================
  // FORMAT TIME
  // =========================

  function formatTime(seconds: number) {
    if (!seconds) {
      return "0:00";
    }

    const minutes = Math.floor(
      seconds / 60
    );

    const secondsPart = Math.floor(
      seconds % 60
    )
      .toString()
      .padStart(2, "0");

    return minutes + ":" + secondsPart;
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
      className={loaded ? "page-loaded" : ""}
      style={{
        minHeight: "100dvh",

        backgroundImage:
          "linear-gradient(rgba(0,0,0,.30),rgba(0,0,0,.30)),url(" +
          BACKGROUND +
          ")",

        /*
         * Mobile:
         * पूरा background दिखाई देगा।
         * Crop कम से कम रखा गया है।
         */
        backgroundSize: isMobile
          ? "100% 100%"
          : "cover",

        backgroundPosition:
          "center center",

        backgroundRepeat: "no-repeat",

        backgroundAttachment: isMobile
          ? "scroll"
          : "fixed",

        color: "white",

        position: "relative",

        fontFamily:
          "Arial, sans-serif",

        overflowX: "hidden",

        paddingBottom: isMobile
          ? "145px"
          : "120px",

        boxSizing: "border-box",

        minWidth: 0,
      }}
    >
      {/* =========================
          SUBTLE CHHATH GLOW
      ========================= */}

      <div className="ambient-glow glow-one" />
      <div className="ambient-glow glow-two" />

      {/* =========================
          SUBTLE PARTICLES
      ========================= */}

      <div className="particles">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>

      {/* =========================
          BRAND
      ========================= */}

      <div
        className="fade-item brand"
        style={{
          position: "absolute",

          top: isMobile
            ? "10px"
            : "18px",

          left: isMobile
            ? "10px"
            : "18px",

          fontSize: isMobile
            ? "14px"
            : "18px",

          fontWeight: 800,

          zIndex: 20,

          textShadow:
            "0 2px 10px rgba(0,0,0,.5)",
        }}
      >
        Aapan Bihar
      </div>

      {/* =========================
          YOUTUBE MUSIC
      ========================= */}

      <a
        className="fade-item yt-music"
        href={
          "https://music.youtube.com/playlist?list=" +
          PLAYLIST_ID
        }
        target="_blank"
        rel="noreferrer"
        style={{
          position: "absolute",

          top: isMobile
            ? "10px"
            : "20px",

          right: isMobile
            ? "10px"
            : "24px",

          color: "white",

          textDecoration: "none",

          zIndex: 20,

          fontSize: isMobile
            ? "10px"
            : "14px",

          padding: isMobile
            ? "6px 8px"
            : "8px 12px",

          borderRadius: "18px",

          background:
            "rgba(30,20,16,.45)",

          border:
            "1px solid rgba(255,255,255,.15)",

          backdropFilter:
            "blur(8px)",

          WebkitBackdropFilter:
            "blur(8px)",

          whiteSpace: "nowrap",
        }}
      >
        ▶ YT Music
      </a>

      {/* =========================
          MAIN TITLE
      ========================= */}

      <h1
        className="main-title"
        style={{
          margin: 0,

          paddingTop: isMobile
            ? "70px"
            : "65px",

          paddingLeft: "10px",
          paddingRight: "10px",

          textAlign: "center",

          fontSize: isMobile
            ? "clamp(34px, 11vw, 50px)"
            : "clamp(58px, 8vw, 115px)",

          lineHeight: "1",

          fontWeight: 900,

          letterSpacing: isMobile
            ? "-1px"
            : "-2px",

          whiteSpace: "nowrap",

          textShadow:
            "0 5px 25px rgba(0,0,0,.45)",

          position: "relative",

          zIndex: 2,
        }}
      >
        Chhath Ghat
      </h1>

      {/* =========================
          CHHATH CARD
      ========================= */}

      <div
        className="chhath-card"
        style={{
          position: isMobile
            ? "relative"
            : "absolute",

          top: isMobile
            ? "auto"
            : "175px",

          right: isMobile
            ? "6px"
            : "20px",

          width: isMobile
            ? "min(215px, calc(100vw - 12px))"
            : "275px",

          maxWidth: "275px",

          margin: isMobile
            ? "16px 6px 0 auto"
            : "0",

          zIndex: 5,

          boxSizing: "border-box",

          transformOrigin:
            "top right",
        }}
      >
        {/* =========================
            COUNTDOWN
        ========================= */}

        <section
          className="glass-panel countdown-panel"
          style={{
            padding: isMobile
              ? "8px"
              : "12px",

            borderRadius: isMobile
              ? "15px"
              : "19px",
          }}
        >
          <div
            style={{
              textAlign: "center",

              fontSize: isMobile
                ? "9px"
                : "12px",

              fontWeight: 800,

              opacity: 0.95,

              letterSpacing: ".2px",
            }}
          >
            🪔 छठ पूजा 2026
          </div>

          {/* IMPORTANT:
              "नहाय-खाय शुरू होने में"
              वाला text हटाया गया है.
          */}

          <div
            className="countdown-boxes"
            style={{
              display: "grid",

              gridTemplateColumns:
                "repeat(4,1fr)",

              gap: isMobile
                ? "3px"
                : "5px",

              marginTop: isMobile
                ? "7px"
                : "9px",
            }}
          >
            <CountdownBox
              value={countdown.days}
              label="दिन"
              small={isMobile}
            />

            <CountdownBox
              value={countdown.hours}
              label="घंटे"
              small={isMobile}
            />

            <CountdownBox
              value={countdown.minutes}
              label="मिनट"
              small={isMobile}
            />

            <CountdownBox
              value={countdown.seconds}
              label="सेकंड"
              small={isMobile}
            />
          </div>

          <div
            style={{
              textAlign: "center",

              marginTop: isMobile
                ? "5px"
                : "7px",

              fontSize: isMobile
                ? "6px"
                : "8px",

              opacity: 0.65,
            }}
          >
            13 नवंबर 2026
          </div>
        </section>

        {/* =========================
            CALENDAR
        ========================= */}

        <section
          className="glass-panel calendar-panel"
          style={{
            marginTop: isMobile
              ? "5px"
              : "8px",

            padding: isMobile
              ? "7px"
              : "10px",

            borderRadius: isMobile
              ? "15px"
              : "19px",
          }}
        >
          <div
            style={{
              textAlign: "center",

              fontSize: isMobile
                ? "10px"
                : "13px",

              fontWeight: 800,

              marginBottom: isMobile
                ? "5px"
                : "7px",
            }}
          >
            📅 छठ पूजा 2026
          </div>

          <div
            style={{
              display: "grid",

              gap: isMobile
                ? "3px"
                : "5px",
            }}
          >
            {CHHATH_DAYS.map(
              (item) => (
                <div
                  key={item.date}
                  className="calendar-row"
                  style={{
                    display: "flex",

                    alignItems:
                      "center",

                    gap: isMobile
                      ? "4px"
                      : "7px",

                    padding: isMobile
                      ? "4px"
                      : "6px 7px",

                    borderRadius:
                      isMobile
                        ? "7px"
                        : "10px",

                    minWidth: 0,
                  }}
                >
                  <div
                    style={{
                      width: isMobile
                        ? "19px"
                        : "23px",

                      minWidth:
                        isMobile
                          ? "19px"
                          : "23px",

                      fontSize:
                        isMobile
                          ? "12px"
                          : "16px",

                      textAlign:
                        "center",
                    }}
                  >
                    {item.icon}
                  </div>

                  <div
                    style={{
                      flex: 1,

                      minWidth: 0,
                    }}
                  >
                    <div
                      style={{
                        fontSize:
                          isMobile
                            ? "8px"
                            : "10px",

                        fontWeight: 800,

                        whiteSpace:
                          "nowrap",

                        overflow:
                          "hidden",

                        textOverflow:
                          "ellipsis",
                      }}
                    >
                      {item.title}
                    </div>

                    <div
                      style={{
                        fontSize:
                          isMobile
                            ? "5px"
                            : "7px",

                        opacity: 0.62,

                        marginTop: "1px",

                        whiteSpace:
                          "nowrap",

                        overflow:
                          "hidden",

                        textOverflow:
                          "ellipsis",
                      }}
                    >
                      {item.date} •{" "}
                      {item.day}
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </section>
      </div>

      {/* =========================
          ADD SUGGESTIONS
      ========================= */}

      <a
        href="https://www.instagram.com/nomadevishal/"
        target="_blank"
        rel="noreferrer"
        className="suggestions-button"
        style={{
          position: "fixed",

          right: isMobile
            ? "8px"
            : "20px",

          bottom: isMobile
            ? "8px"
            : "18px",

          color: "white",

          textDecoration: "none",

          zIndex: 60,

          fontSize: isMobile
            ? "8px"
            : "13px",

          padding: isMobile
            ? "7px 10px"
            : "10px 15px",

          borderRadius: "22px",

          whiteSpace: "nowrap",
        }}
      >
        ✨ Add Suggestions
      </a>

      {/* =========================
          MUSIC PLAYER
      ========================= */}

      <section
        className={
          playing
            ? "music-player is-playing"
            : "music-player"
        }
        style={{
          position: "fixed",

          left: "50%",

          bottom: isMobile
            ? "43px"
            : "30px",

          transform:
            "translateX(-50%)",

          width: isMobile
            ? "calc(100vw - 12px)"
            : "min(590px,92vw)",

          maxWidth: "590px",

          display: "flex",

          alignItems: "center",

          gap: isMobile
            ? "3px"
            : "12px",

          padding: isMobile
            ? "5px"
            : "10px",

          borderRadius: isMobile
            ? "23px"
            : "60px",

          zIndex: 50,

          boxSizing: "border-box",
        }}
      >
        {/* =========================
            COVER
        ========================= */}

        <div
          className={
            playing
              ? "cover-wrap playing"
              : "cover-wrap"
          }
          style={{
            width: isMobile
              ? "40px"
              : "72px",

            height: isMobile
              ? "40px"
              : "72px",

            minWidth: isMobile
              ? "40px"
              : "72px",

            borderRadius: "50%",

            overflow: "hidden",
          }}
        >
          <img
            src={COVER}
            alt="Cover"
            style={{
              width: "100%",

              height: "100%",

              objectFit: "cover",

              display: "block",
            }}
          />
        </div>

        {/* =========================
            SONG INFO
        ========================= */}

        <div
          style={{
            flex: 1,

            minWidth: 0,

            overflow: "hidden",
          }}
        >
          <div
            style={{
              fontSize: isMobile
                ? "9px"
                : "16px",

              fontWeight: 700,

              whiteSpace: "nowrap",

              overflow: "hidden",

              textOverflow:
                "ellipsis",
            }}
          >
            {title}
          </div>

          <div
            style={{
              marginTop: "2px",

              fontSize: isMobile
                ? "6px"
                : "13px",

              opacity: 0.7,

              whiteSpace: "nowrap",

              overflow: "hidden",

              textOverflow:
                "ellipsis",
            }}
          >
            {artist}
          </div>

          {/* PROGRESS */}

          <button
            onClick={seek}
            aria-label="Seek song"
            style={{
              width: "100%",

              height: "12px",

              padding: 0,

              marginTop: "2px",

              border: 0,

              background:
                "transparent",

              cursor: "pointer",
            }}
          >
            <span
              style={{
                display: "block",

                width: "100%",

                height: "3px",

                borderRadius: "5px",

                background:
                  "rgba(255,255,255,.28)",

                overflow: "hidden",
              }}
            >
              <span
                style={{
                  display: "block",

                  height: "100%",

                  width:
                    progress + "%",

                  borderRadius: "5px",

                  background:
                    "white",

                  transition:
                    "width .25s linear",
                }}
              />
            </span>
          </button>

          <div
            style={{
              fontSize: isMobile
                ? "5px"
                : "11px",

              opacity: 0.7,
            }}
          >
            {formatTime(
              currentTime
            )}{" "}
            /{" "}
            {formatTime(
              duration
            )}
          </div>
        </div>

        {/* =========================
            PREVIOUS
        ========================= */}

        <button
          onClick={previousSong}
          aria-label="Previous song"
          className="player-button"
          style={{
            ...buttonStyle,

            width: isMobile
              ? "21px"
              : "38px",

            height: isMobile
              ? "32px"
              : "42px",

            fontSize: isMobile
              ? "8px"
              : "18px",
          }}
        >
          ◀
        </button>

        {/* =========================
            PLAY
        ========================= */}

        <button
          onClick={playPause}
          aria-label={
            playing
              ? "Pause"
              : "Play"
          }
          className={
            playing
              ? "play-button active"
              : "play-button"
          }
          style={{
            ...buttonStyle,

            width: isMobile
              ? "35px"
              : "54px",

            height: isMobile
              ? "35px"
              : "54px",

            borderRadius: "50%",

            background: "white",

            color: "#241a15",

            fontSize: isMobile
              ? "12px"
              : "20px",
          }}
        >
          {playing ? "Ⅱ" : "▶"}
        </button>

        {/* =========================
            NEXT
        ========================= */}

        <button
          onClick={nextSong}
          aria-label="Next song"
          className="player-button"
          style={{
            ...buttonStyle,

            width: isMobile
              ? "21px"
              : "38px",

            height: isMobile
              ? "32px"
              : "42px",

            fontSize: isMobile
              ? "8px"
              : "18px",
          }}
        >
          ▶
        </button>
      </section>

      {/* =========================
          CREDIT
      ========================= */}

      <div
        className="made-by"
        style={{
          position: "fixed",

          left: isMobile
            ? "8px"
            : "18px",

          bottom: isMobile
            ? "10px"
            : "20px",

          color:
            "rgba(255,255,255,.78)",

          fontSize: isMobile
            ? "7px"
            : "13px",

          zIndex: 40,

          whiteSpace: "nowrap",

          textShadow:
            "0 2px 8px rgba(0,0,0,.5)",
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

            textDecoration: "none",
          }}
        >
          @nomadevishal
        </a>
      </div>

      {/* =========================
          HIDDEN YOUTUBE PLAYER
      ========================= */}

      <div
        ref={hostRef}
        style={{
          position: "fixed",

          width: "1px",

          height: "1px",

          left: "-10px",

          bottom: "-10px",

          opacity: 0,

          pointerEvents: "none",
        }}
      />

      {/* =========================
          GLOBAL CSS
      ========================= */}

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          padding: 0;
          width: 100%;
          min-height: 100%;
          overflow-x: hidden;
        }

        body {
          background: #1d130f;
        }

        button,
        a {
          -webkit-tap-highlight-color: transparent;
        }

        /* =========================
           PAGE ANIMATION
        ========================= */

        .fade-item,
        .main-title,
        .chhath-card,
        .music-player,
        .made-by,
        .suggestions-button {
          opacity: 0;
        }

        .page-loaded .fade-item {
          animation:
            fadeDown
            0.7s
            ease-out
            forwards;
        }

        .page-loaded .main-title {
          animation:
            titleAppear
            0.9s
            cubic-bezier(.2,.8,.2,1)
            forwards;
        }

        .page-loaded .chhath-card {
          animation:
            cardAppear
            0.8s
            cubic-bezier(.2,.8,.2,1)
            .15s
            forwards;
        }

        .page-loaded .music-player {
          animation:
            playerAppear
            0.8s
            cubic-bezier(.2,.8,.2,1)
            .3s
            forwards;
        }

        .page-loaded .made-by {
          animation:
            fadeUp
            0.7s
            ease-out
            .45s
            forwards;
        }

        .page-loaded .suggestions-button {
          animation:
            fadeUp
            0.7s
            ease-out
            .5s
            forwards;
        }

        @keyframes fadeDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes titleAppear {
          from {
            opacity: 0;
            transform:
              translateY(16px)
              scale(.97);
          }

          to {
            opacity: 1;
            transform:
              translateY(0)
              scale(1);
          }
        }

        @keyframes cardAppear {
          from {
            opacity: 0;
            transform:
              translateY(18px)
              scale(.96);
          }

          to {
            opacity: 1;
            transform:
              translateY(0)
              scale(1);
          }
        }

        @keyframes playerAppear {
          from {
            opacity: 0;
            transform:
              translateX(-50%)
              translateY(18px);
          }

          to {
            opacity: 1;
            transform:
              translateX(-50%)
              translateY(0);
          }
        }

        /* =========================
           PREMIUM GLASS
        ========================= */

        .glass-panel {
          background:
            linear-gradient(
              145deg,
              rgba(55,32,22,.72),
              rgba(20,13,10,.55)
            );

          border:
            1px solid
            rgba(255,225,190,.20);

          box-shadow:
            0 14px 35px
            rgba(0,0,0,.30),
            inset 0 1px 0
            rgba(255,255,255,.08);

          backdrop-filter:
            blur(16px)
            saturate(120%);

          -webkit-backdrop-filter:
            blur(16px)
            saturate(120%);
        }

        .glass-panel::after {
          content: "";

          display: block;

          position: absolute;
        }

        .calendar-row {
          background:
            rgba(255,255,255,.075);

          border:
            1px solid
            rgba(255,255,255,.055);

          transition:
            background
            .2s
            ease,
            transform
            .2s
            ease;
        }

        .calendar-row:hover {
          background:
            rgba(255,255,255,.11);

          transform:
            translateX(-2px);
        }

        /* =========================
           COUNTDOWN
        ========================= */

        .countdown-panel {
          position: relative;

          overflow: hidden;
        }

        .countdown-panel::before {
          content: "";

          position: absolute;

          top: -45px;

          right: -40px;

          width: 110px;

          height: 110px;

          border-radius: 50%;

          background:
            rgba(255,185,90,.08);

          filter: blur(20px);

          pointer-events: none;
        }

        /* =========================
           MUSIC PLAYER
        ========================= */

        .music-player {
          background:
            linear-gradient(
              135deg,
              rgba(48,26,19,.96),
              rgba(25,15,11,.94)
            );

          border:
            1px solid
            rgba(255,255,255,.20);

          box-shadow:
            0 16px 45px
            rgba(0,0,0,.42),
            inset 0 1px 0
            rgba(255,255,255,.08);

          backdrop-filter:
            blur(18px)
            saturate(120%);

          -webkit-backdrop-filter:
            blur(18px)
            saturate(120%);
        }

        /* =========================
           COVER
        ========================= */

        .cover-wrap {
          border:
            2px solid
            rgba(255,255,255,.72);

          box-shadow:
            0 4px 18px
            rgba(0,0,0,.32);

          transition:
            transform
            .3s
            ease,
            box-shadow
            .3s
            ease;
        }

        .cover-wrap.playing {
          animation:
            coverRotate
            8s
            linear
            infinite;

          box-shadow:
            0 0 0 3px
              rgba(255,255,255,.07),
            0 5px 25px
              rgba(0,0,0,.38);
        }

        @keyframes coverRotate {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        /* =========================
           PLAY BUTTON
        ========================= */

        .play-button {
          transition:
            transform
            .18s
            ease,
            box-shadow
            .18s
            ease;
        }

        .play-button:hover {
          transform:
            scale(1.06);
        }

        .play-button:active {
          transform:
            scale(.91);
        }

        .play-button.active {
          box-shadow:
            0 0 0 4px
              rgba(255,255,255,.08);
        }

        .player-button {
          transition:
            transform
            .18s
            ease,
            opacity
            .18s
            ease;
        }

        .player-button:hover {
          transform:
            scale(1.1);

          opacity: .9;
        }

        .player-button:active {
          transform:
            scale(.88);
        }

        /* =========================
           SUGGESTIONS
        ========================= */

        .suggestions-button {
          background:
            rgba(40,25,20,.70);

          border:
            1px solid
            rgba(255,255,255,.18);

          box-shadow:
            0 7px 22px
            rgba(0,0,0,.26);

          backdrop-filter:
            blur(10px);

          -webkit-backdrop-filter:
            blur(10px);

          transition:
            transform
            .2s
            ease,
            background
            .2s
            ease;
        }

        .suggestions-button:hover {
          transform:
            translateY(-2px);

          background:
            rgba(50,30,23,.82);
        }

        /* =========================
           AMBIENT GLOW
        ========================= */

        .ambient-glow {
          position: fixed;

          width: 170px;

          height: 170px;

          border-radius: 50%;

          pointer-events: none;

          z-index: 1;

          opacity: .12;

          filter: blur(55px);

          background:
            rgba(255,190,100,.45);
        }

        .glow-one {
          top: 28%;

          left: 12%;
        }

        .glow-two {
          bottom: 25%;

          right: 10%;

          opacity: .09;
        }

        /* =========================
           PARTICLES
        ========================= */

        .particles {
          position: fixed;

          inset: 0;

          pointer-events: none;

          overflow: hidden;

          z-index: 1;
        }

        .particles span {
          position: absolute;

          width: 3px;

          height: 3px;

          border-radius: 50%;

          background:
            rgba(255,220,160,.5);

          opacity: 0;

          animation:
            floatParticle
            8s
            linear
            infinite;
        }

        .particles span:nth-child(1) {
          left: 12%;
          top: 72%;
          animation-delay: 0s;
        }

        .particles span:nth-child(2) {
          left: 28%;
          top: 60%;
          animation-delay: 2s;
        }

        .particles span:nth-child(3) {
          left: 52%;
          top: 78%;
          animation-delay: 4s;
        }

        .particles span:nth-child(4) {
          left: 68%;
          top: 48%;
          animation-delay: 1s;
        }

        .particles span:nth-child(5) {
          left: 82%;
          top: 68%;
          animation-delay: 5s;
        }

        .particles span:nth-child(6) {
          left: 42%;
          top: 35%;
          animation-delay: 3s;
        }

        @keyframes floatParticle {
          0% {
            opacity: 0;
            transform:
              translateY(15px)
              scale(.7);
          }

          25% {
            opacity: .5;
          }

          75% {
            opacity: .3;
          }

          100% {
            opacity: 0;
            transform:
              translateY(-55px)
              scale(1);
          }
        }

        /* =========================
           MOBILE
        ========================= */

        @media (max-width: 700px) {
          html,
          body {
            width: 100%;
            min-height: 100%;
            overflow-x: hidden;
          }

          body {
            margin: 0;
            padding: 0;
          }

          main {
            width: 100%;
            min-height: 100dvh;

            /*
             * Mobile background stays fully visible
             * without normal cover cropping.
             */
            background-size: 100% 100% !important;

            background-position:
              center center !important;

            background-repeat:
              no-repeat !important;
          }

          .ambient-glow {
            width: 110px;
            height: 110px;
            filter: blur(40px);
            opacity: .08;
          }

          .particles span {
            width: 2px;
            height: 2px;
          }

          .glass-panel {
            backdrop-filter:
              blur(12px);

            -webkit-backdrop-filter:
              blur(12px);
          }

          .music-player {
            gap: 3px;

            /*
             * Player stays above bottom controls.
             */
            bottom: 43px !important;
          }

          .made-by {
            bottom: 9px !important;
          }

          .suggestions-button {
            bottom: 8px !important;
          }
        }

        /* =========================
           VERY SMALL PHONES
        ========================= */

        @media (max-width: 380px) {
          h1 {
            padding-top:
              65px !important;
          }

          .chhath-card {
            width:
              min(
                205px,
                calc(100vw - 10px)
              ) !important;

            margin-right: 5px !important;
          }

          .music-player {
            width:
              calc(100vw - 8px) !important;

            padding: 4px !important;
          }

          .music-player .cover-wrap {
            width: 37px !important;
            height: 37px !important;
            min-width: 37px !important;
          }

          .suggestions-button {
            font-size: 7px !important;
            padding:
              6px 8px !important;
          }

          .made-by {
            font-size: 6.5px !important;
          }
        }

        /* =========================
           REDUCE MOTION
        ========================= */

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration:
              .01ms !important;

            animation-iteration-count:
              1 !important;

            transition-duration:
              .01ms !important;
          }
        }
      `}</style>
    </main>
  );
}

/* =========================
   COUNTDOWN BOX
========================= */

function CountdownBox({
  value,
  label,
  small = false,
}: {
  value: number;
  label: string;
  small?: boolean;
}) {
  return (
    <div
      style={{
        textAlign: "center",

        padding: small
          ? "5px 2px"
          : "8px 3px",

        borderRadius: small
          ? "8px"
          : "11px",

        background:
          "linear-gradient(145deg, rgba(255,255,255,.12), rgba(255,255,255,.055))",

        border:
          "1px solid rgba(255,255,255,.11)",

        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,.07)",

        minWidth: 0,

        overflow: "hidden",
      }}
    >
      <div
        style={{
          fontSize: small
            ? "13px"
            : "21px",

          lineHeight: 1,

          fontWeight: 900,

          whiteSpace: "nowrap",

          textShadow:
            "0 2px 10px rgba(0,0,0,.25)",
        }}
      >
        {String(value).padStart(
          2,
          "0"
        )}
      </div>

      <div
        style={{
          marginTop: "4px",

          fontSize: small
            ? "4.8px"
            : "8px",

          opacity: 0.72,

          whiteSpace: "nowrap",
        }}
      >
        {label}
      </div>
    </div>
  );
}

/* =========================
   BUTTON STYLE
========================= */

const buttonStyle = {
  width: "38px",

  height: "42px",

  border: 0,

  background: "transparent",

  color: "white",

  cursor: "pointer",

  fontSize: "18px",

  flexShrink: 0,

  padding: 0,

  display: "flex",

  alignItems: "center",

  justifyContent: "center",

  WebkitTapHighlightColor:
    "transparent",
};

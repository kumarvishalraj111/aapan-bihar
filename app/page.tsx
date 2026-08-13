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

// Chhath 2026
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

  /* =========================
     SCREEN SIZE
  ========================= */

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

  /* =========================
     COUNTDOWN
  ========================= */

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

  /* =========================
     YOUTUBE PLAYER
  ========================= */

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

  /* =========================
     PLAYER CONTROLS
  ========================= */

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

  /* =========================
     FORMAT TIME
  ========================= */

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
      style={{
        minHeight: "100dvh",

        backgroundImage:
          "linear-gradient(rgba(0,0,0,.38),rgba(0,0,0,.38)),url(" +
          BACKGROUND +
          ")",

        /*
         * Desktop untouched.
         * Mobile: पूरा background दिखेगा.
         */
        backgroundSize: isMobile
          ? "100% 100%"
          : "cover",

        backgroundPosition:
          "center center",

        backgroundAttachment: isMobile
          ? "scroll"
          : "fixed",

        color: "white",

        position: "relative",

        fontFamily:
          "Arial, sans-serif",

        overflowX: "hidden",

        paddingBottom: isMobile
          ? "155px"
          : "120px",

        boxSizing: "border-box",
      }}
    >
      {/* =========================
          BRAND
      ========================= */}

      <div
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
            ? "min(210px, calc(100vw - 12px))"
            : "265px",

          maxWidth: "265px",

          margin: isMobile
            ? "14px 6px 0 auto"
            : "0",

          zIndex: 5,

          boxSizing: "border-box",

          transform: isMobile
            ? "scale(.96)"
            : "none",

          transformOrigin:
            "top right",
        }}
      >
        {/* COUNTDOWN */}

        <section
          style={{
            padding: isMobile
              ? "6px"
              : "10px",

            borderRadius: isMobile
              ? "13px"
              : "17px",

            background:
              "linear-gradient(145deg, rgba(48,28,20,.70), rgba(25,16,12,.54))",

            border:
              "1px solid rgba(255,220,170,.20)",

            boxShadow:
              "0 10px 30px rgba(0,0,0,.28)",

            backdropFilter:
              "blur(14px)",

            WebkitBackdropFilter:
              "blur(14px)",
          }}
        >
          <div
            style={{
              textAlign: "center",

              fontSize: isMobile
                ? "8px"
                : "11px",

              fontWeight: 700,

              opacity: 0.9,
            }}
          >
            🪔 छठ पूजा 2026
          </div>

          <div
            style={{
              textAlign: "center",

              fontSize: isMobile
                ? "9px"
                : "13px",

              fontWeight: 800,

              marginTop: "2px",

              marginBottom: isMobile
                ? "4px"
                : "7px",
            }}
          >
            नहाय-खाय शुरू होने में
          </div>

          <div
            style={{
              display: "grid",

              gridTemplateColumns:
                "repeat(4,1fr)",

              gap: isMobile
                ? "2px"
                : "4px",
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
                ? "3px"
                : "6px",

              fontSize: isMobile
                ? "5px"
                : "8px",

              opacity: 0.65,
            }}
          >
            13 नवंबर 2026 • नहाय-खाय
          </div>
        </section>

        {/* CALENDAR */}

        <section
          style={{
            marginTop: isMobile
              ? "4px"
              : "7px",

            padding: isMobile
              ? "5px"
              : "9px",

            borderRadius: isMobile
              ? "13px"
              : "17px",

            background:
              "linear-gradient(145deg, rgba(48,28,20,.66), rgba(25,16,12,.50))",

            border:
              "1px solid rgba(255,220,170,.17)",

            boxShadow:
              "0 8px 25px rgba(0,0,0,.23)",

            backdropFilter:
              "blur(14px)",

            WebkitBackdropFilter:
              "blur(14px)",
          }}
        >
          <div
            style={{
              textAlign: "center",

              fontSize: isMobile
                ? "9px"
                : "13px",

              fontWeight: 800,

              marginBottom: isMobile
                ? "3px"
                : "6px",
            }}
          >
            📅 छठ पूजा 2026
          </div>

          <div
            style={{
              display: "grid",

              gap: isMobile
                ? "2px"
                : "4px",
            }}
          >
            {CHHATH_DAYS.map(
              (item) => (
                <div
                  key={item.date}
                  style={{
                    display: "flex",

                    alignItems:
                      "center",

                    gap: isMobile
                      ? "3px"
                      : "6px",

                    padding: isMobile
                      ? "3px"
                      : "5px 6px",

                    borderRadius:
                      isMobile
                        ? "6px"
                        : "9px",

                    background:
                      "rgba(255,255,255,.08)",

                    minWidth: 0,
                  }}
                >
                  <div
                    style={{
                      width: isMobile
                        ? "17px"
                        : "21px",

                      minWidth:
                        isMobile
                          ? "17px"
                          : "21px",

                      fontSize:
                        isMobile
                          ? "11px"
                          : "15px",

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
                            ? "7px"
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
                            ? "4.5px"
                            : "7px",

                        opacity: 0.6,

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
          MOBILE BOTTOM RIGHT
      ========================= */}

      <a
        href="https://www.instagram.com/nomadevishal/"
        target="_blank"
        rel="noreferrer"
        style={{
          position: "fixed",

          right: isMobile
            ? "7px"
            : "20px",

          bottom: isMobile
            ? "10px"
            : "18px",

          color: "white",

          textDecoration: "none",

          zIndex: 60,

          fontSize: isMobile
            ? "8px"
            : "13px",

          padding: isMobile
            ? "6px 9px"
            : "10px 15px",

          borderRadius: "22px",

          background:
            "rgba(40,25,20,.68)",

          border:
            "1px solid rgba(255,255,255,.18)",

          backdropFilter:
            "blur(10px)",

          WebkitBackdropFilter:
            "blur(10px)",

          whiteSpace: "nowrap",

          boxShadow:
            "0 6px 20px rgba(0,0,0,.25)",
        }}
      >
        ✨ Add Suggestions
      </a>

      {/* =========================
          MUSIC PLAYER
      ========================= */}

      <section
        style={{
          position: "fixed",

          left: "50%",

          bottom: isMobile
            ? "45px"
            : "30px",

          transform:
            "translateX(-50%)",

          width: isMobile
            ? "calc(100vw - 10px)"
            : "min(590px,92vw)",

          maxWidth: "590px",

          display: "flex",

          alignItems: "center",

          gap: isMobile
            ? "2px"
            : "12px",

          padding: isMobile
            ? "5px"
            : "10px",

          borderRadius: isMobile
            ? "22px"
            : "60px",

          background:
            "rgba(45,24,17,.94)",

          border:
            "1px solid rgba(255,255,255,.22)",

          boxShadow:
            "0 15px 45px rgba(0,0,0,.40)",

          backdropFilter:
            "blur(15px)",

          WebkitBackdropFilter:
            "blur(15px)",

          zIndex: 50,

          boxSizing: "border-box",
        }}
      >
        {/* COVER */}

        <div
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

            border:
              "2px solid rgba(255,255,255,.7)",
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

        {/* SONG INFO */}

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

          <button
            onClick={seek}
            aria-label="Seek song"
            style={{
              width: "100%",

              height: "10px",

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
                  "rgba(255,255,255,.3)",
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

        {/* PREVIOUS */}

        <button
          onClick={previousSong}
          aria-label="Previous song"
          style={{
            ...buttonStyle,

            width: isMobile
              ? "20px"
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

        {/* PLAY */}

        <button
          onClick={playPause}
          aria-label={
            playing
              ? "Pause"
              : "Play"
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

        {/* NEXT */}

        <button
          onClick={nextSong}
          aria-label="Next song"
          style={{
            ...buttonStyle,

            width: isMobile
              ? "20px"
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
          MOBILE BOTTOM LEFT
      ========================= */}

      <div
        style={{
          position: "fixed",

          left: isMobile
            ? "7px"
            : "18px",

          bottom: isMobile
            ? "10px"
            : "20px",

          color:
            "rgba(255,255,255,.75)",

          fontSize: isMobile
            ? "6.5px"
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
          }
        }

        @media (max-width: 380px) {
          /* Very small phones */

          h1 {
            padding-top: 65px !important;
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
          ? "3px 1px"
          : "7px 3px",

        borderRadius: small
          ? "6px"
          : "10px",

        background:
          "rgba(255,255,255,.10)",

        border:
          "1px solid rgba(255,255,255,.10)",

        minWidth: 0,

        overflow: "hidden",
      }}
    >
      <div
        style={{
          fontSize: small
            ? "12px"
            : "20px",

          lineHeight: 1,

          fontWeight: 900,

          whiteSpace: "nowrap",
        }}
      >
        {String(value).padStart(
          2,
          "0"
        )}
      </div>

      <div
        style={{
          marginTop: "3px",

          fontSize: small
            ? "4.5px"
            : "8px",

          opacity: 0.7,

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
};

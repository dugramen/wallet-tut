"use client";

import { useEffect, useRef, useState } from "react";
import { FaCopy, FaSmile } from "react-icons/fa";
import { FaRegCopy } from "react-icons/fa6";
import {
  Transition,
  TransitionGroup,
  TransitionStatus,
} from "react-transition-group";
import { twMerge } from "tailwind-merge";
import { Popup } from "./_2_Popup";

export default function Creating({
  state = "unmounted" as TransitionStatus,
  onEnd = () => {},
}) {
  const nodeRef = useRef(null);
  const [cardRef, setCardRef] = useState<HTMLDivElement>();
  console.log(cardRef?.getClientRects(), cardRef?.getBoundingClientRect());
  const [cardLoaded, setCardLoaded] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [backupPhase, setBackupPhase] = useState(false);

  const [circleSpawnsPos, setCircleSpawnsPos] = useState([[0.5, 0.5]]);

  useEffect(() => {
    setTimeout(() => {
      setCardLoaded(true);
    }, 3000);
    const interval = setInterval(() => {
      if (!cardLoaded) {
        setCircleSpawnsPos((old) => [...old, [Math.random(), Math.random()]]);
      }
    }, 75);
    setTimeout(() => {
      clearInterval(interval);
    }, 1200);

    return () => {
      clearInterval(interval);
    };
  }, [cardLoaded]);

  const gridColor = "#ffffff";

  const cardRect = cardRef?.getBoundingClientRect()

  return (
    <div
      ref={nodeRef}
      className={twMerge(
        "flex flex-col items-center gap-5 opacity-0 transition-all duration-500 ease-out",
        state === "entered" && "opacity-100"
      )}
    >
      <div className="text-lg">Creating Your Wallet</div>

      <div
        className={twMerge(
          "transition-all duration-700 relative opacity-0",
          state === "entering"
            ? "h-0 w-0"
            : state === "entered"
            ? "h-[176px] w-[288px] opacity-100"
            : "",
          cardLoaded ? "scale-110" : "",
          popupOpen && "opacity-0"
        )}
        style={{
          transition: ` 
            all .7s,
            transform .5s,
            ${popupOpen ? "opacity 0s 0s" : ""}
          `,
        }}
      >
        <div // Border
          className={twMerge(
            "absolute inset-0 rounded-3xl border-gray-300/50 border-2 border-solid duration-700 ease-out delay-500",
            cardLoaded
              ? "opacity-0 translate-y-1 ease-linear delay-0"
              : "opacity-100"
          )}
          style={{
            clipPath: state === "entered" ? "circle(75%)" : "circle(0%)",
          }}
        />
        <div // Grid Mask
          className="absolute inset-0 rounded-3xl"
          style={{
            maskImage: `
              repeating-linear-gradient(${gridColor}, ${gridColor} 2px, transparent 2px, transparent 16px),
              repeating-linear-gradient(0.25turn, ${gridColor}, ${gridColor} 2px, transparent 2px, transparent 16px)
            `,
            // maskPosition: "-2px -2px",
            // maskSize: "128px 256px",
            transition: `
              all 500ms,
              opacity 500ms 500ms
            `,
          }}
        >
          <div // Gray Grid Bg
            className={twMerge(
              "absolute inset-0 transition-all bg-gray-300/50 duration-700 ease-out delay-500",
              cardLoaded
                ? "opacity-0 translate-y-1 ease-linear delay-0"
                : "opacity-100"
            )}
            style={{
              clipPath: state === "entered" ? "circle(75%)" : "circle(0%)",
            }}
          />

          <TransitionGroup // Ripples spawning
          >
            {circleSpawnsPos.map((pos, i) => (
              <Transition
                timeout={300}
                onExited={() => {
                  setCircleSpawnsPos(([first, ...rest]) => rest);
                }}
                mountOnEnter
                unmountOnExit
              >
                {(circleState) => (
                  <CircleSpawn key={i} pos={pos} state={circleState} />
                )}
              </Transition>
            ))}
          </TransitionGroup>
        </div>

        <div // Card
          ref={(ref) => setCardRef(ref ?? undefined)}
          className={twMerge(
            "CardCyan",
            "absolute inset-0 rounded-3xl transition-all duration-500",
            `after:absolute after:inset-0 after:rounded-3xl after:transition-all after:duration-[.5s] after:delay-500  after:opacity-0`,
            cardLoaded ? "translate-y-1  after:opacity-100" : "-translate-y-0"
          )}
          style={{
            background: `
              radial-gradient(ellipse at top, #e66465, transparent),
              radial-gradient(ellipse at bottom, #266465, transparent),
              radial-gradient(ellipse at right, #ed9f0c, transparent),
              radial-gradient(ellipse at left, #4d9f0c, transparent)
            `,
            clipPath: cardLoaded
              ? `circle(100% at bottom)`
              : "circle(0% at bottom)",
            transition: `
              all .5s 0s,
              transform .5s .5s
            `,
          }}
        >
          <CardContent onClick={() => setPopupOpen(true)} />
        </div>
      </div>

      <div>Doing some cryptographic magic...</div>

      <Transition in={backupPhase} timeout={500} mountOnEnter unmountOnExit>
        {(bupState) => (
          <div
            className="CardCyanBg fixed transition-all duration-500 rounded-3xl"
            style={{
              transform: bupState === "entered" ? "rotateY(.5turn)" : "",
              opacity: bupState === "entered" ? 100 : 0,
              top: cardRect?.top,
              bottom: cardRect?.bottom,
              left: cardRect?.left,
              right: cardRect?.right,
              width: cardRect?.width,
              height: cardRect?.height,
              transition: `
                all .5s,
                opaacity .2s .3s
              `
            }}
          >
            <CardContent/>
          </div>
        )}
      </Transition>

      <Transition
        in={popupOpen && !backupPhase}
        timeout={popupOpen && !backupPhase ? 0 : 500}
        mountOnEnter
        unmountOnExit
      >
        {(cardState) => (
          <Popup
            state={cardState}
            top={cardRef?.getBoundingClientRect().top}
            left={cardRef?.getBoundingClientRect().left}
            right={cardRef?.getBoundingClientRect().right}
            bottom={cardRef?.getBoundingClientRect().bottom}
            // onClose={() => {
            //   setBackupPhase(true);
            // }}
          />
        )}
      </Transition>
    </div>
  );
}

function CircleSpawn(props: { state: TransitionStatus; pos: number[] }) {
  return (
    <div
      className={twMerge(
        "absolute inset-0 transition-all duration-[1s] ease-out delay-1000 bg-cyan-800"
      )}
      style={{
        clipPath:
          props.state === "entered"
            ? `circle(50px at ${props.pos[0] * 100}% ${props.pos[1] * 100}%)`
            : `circle(0 at ${props.pos[0] * 100}% ${props.pos[1] * 100}%)`,
        opacity: props.state === "entered" ? "0%" : "100%",
      }}
    />
  );
}

export function CardContent({ onClick = () => {}, className = "" }) {
  return (
    <div
      className={twMerge(
        "absolute flex flex-col p-4 w-full h-full z-10 justify-between text-sm text-gray-200 font-medium",
        className
      )}
    >
      <div className="flex flex-row w-full items-center gap-2">
        <FaSmile className="text-amber-300 text-4xl" />
        <div className="ml-auto">0x6aeb****4a40</div>
        <FaRegCopy />
      </div>
      <div className="flex flex-row w-full items-end justify-between">
        <div className="flex flex-col gap-1">
          <div>New Wallet</div>
          <div className="font-light">0 ETH</div>
        </div>
        <button
          className="rounded-full px-3 py-1 bg-gray-200 text-cyan-600"
          onClick={onClick}
        >
          Back Up Now
        </button>
      </div>
    </div>
  );
}

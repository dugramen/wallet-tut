"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FaCopy, FaSmile } from "react-icons/fa";
import { FaRegCopy } from "react-icons/fa6";
import {
  Transition,
  TransitionGroup,
  TransitionStatus,
} from "react-transition-group";
import { twMerge } from "tailwind-merge";
import { Popup } from "./_2_Popup";

const width = 304;
const height = 192;
const wcell = Math.floor(width / 16) - 1;
const hcell = Math.floor(height / 16) - 1;

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

  type Point = { x: number; y: number };
  const randomPoints = useMemo(
    () =>
      Array(wcell * hcell)
        .fill(0)
        .map((_, i) => ({
          x: (i % wcell) * 16 + 16 - 3,
          y: Math.floor(i / wcell) * 16 + 16 - 3,
        }))
        .sort(() => Math.random() - 0.5)
        .filter((_, i, arr) => i < arr.length / 3)
        .map(({ x, y }) => {
          const possibles: Point[] = Array(3)
            .fill(0)
            .reduce(
              (acc, val, i) => [
                ...acc,
                ...[
                  { x: x - 16 * (i + 2), y },
                  { y: y - 16 * (i + 2), x },
                  { x: x + 16 * (i + 2), y },
                  { y: y + 16 * (i + 2), x },
                ],
              ],
              []
            )
            .filter(
              (point) =>
                point.x > 0 &&
                point.x < width - 16 &&
                point.y > 0 &&
                point.y < height - 16
            );

          const start = { x, y };
          const end = possibles[Math.floor(Math.random() * possibles.length)];
          return { start, end };
        }),
    []
  );

  // const [circleSpawnsPos, setCircleSpawnsPos] = useState([[0.5, 0.5]]);

  useEffect(() => {
    setTimeout(() => {
      // setCircleSpawnsPos([])
      setCardLoaded(true);
    }, 2300);
    // const interval = setInterval(() => {
    //   if (!cardLoaded) {
    //     setCircleSpawnsPos((old) => [...old, [Math.random(), Math.random()]]);
    //     setCircleSpawnsPos((old) => [...old, [Math.random(), Math.random()]]);
    //     // setCircleSpawnsPos((old) => [...old, [Math.random(), Math.random()]]);
    //   }
    // }, 5);
    // setTimeout(() => {
    //   clearInterval(interval);
    // }, 100);

    // return () => {
    //   clearInterval(interval);
    // };
  }, []);

  const gridColor = "rgb(209 213 219 / 0.5)";

  const cardRect = cardRef?.getBoundingClientRect();

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
          "transition-all duration-700 relative opacity-0 rounded-3xl",
          state === "entering"
            ? "h-0 w-0"
            : state === "entered"
            ? "h-[192px] w-[304px] opacity-100"
            : "",
          cardLoaded ? "scale-110" : "",
          popupOpen && "opacity-0"
          // state === "entered" && "CardBorderAnimate",
        )}
        style={{
          transition:
            // all .7s,
            ` 
            all .7s,
            transform .5s,
            ${popupOpen ? "opacity 0s 0s" : ""}
          `,
          // border: `conic-gradient(from -.15turn, rgb(209 213 219 / 0.5), rgb(209 213 219 / 0.5) 100%, transparent 105%)`
          // borderImage: `conic-gradient(from -.95turn, black var(--card-border-p), transparent var(--card-border-p)) 1`,
          // borderWidth: 8,
        }}
      >
        <div
          className={twMerge(
            "w-full h-full rounded-3xl CardBorder",
            state === "entered" ? "Active" : "Inactive",
            cardLoaded && 'opacity-0'
          )}
        ></div>

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

          {/* <TransitionGroup // Ripples spawning
          >
            {circleSpawnsPos.map((pos, i) => (
              <Transition
                timeout={0}
                // onExited={() => {
                //   setCircleSpawnsPos(([first, ...rest]) => rest);
                // }}
                mountOnEnter
                unmountOnExit
              >
                {(circleState) => (
                  <CircleSpawn key={i} pos={pos} state={circleState} />
                )}
              </Transition>
            ))}
          </TransitionGroup> */}
        </div>

        {
          // Lines
          randomPoints.map((a, i) => {
            const delay = i * 0.005 + 1;
            let absx = Math.abs(a.end.x - a.start.x)
            let absy = Math.abs(a.end.y - a.start.y)
            absx = a.end.x > a.start.x ? absx : absx
            absy = a.end.y > a.start.y ? absy : absy
            return (
              <div
                className="absolute inset-0 transition-all duration-300"
                style={{
                  opacity: state === "entered" ? 0.25 : 0,
                  transitionDelay: `${delay}s`,
                  animation: "fade-out",
                  animationDuration: "700ms",
                  animationDelay: `${delay + .5}s`,
                  animationFillMode: "forwards",
                }}
                key={i}
              >
                <div
                  key={i}
                  className="absolute transition-transform duration-[.5s] bg-cyan-800"
                  style={{
                    left: 4,
                    top: 4,
                    transform:
                      state === "entered"
                        ? `
                          translate(
                            ${a.start.x + (a.end.x - a.start.x) / 2}px,
                            ${a.start.y + (a.end.y - a.start.y) / 2}px
                          )
                          scale(
                            ${Math.max(absx, 4)},
                            ${Math.max(absy, 4)}
                          )
                        `
                        : `
                          translate(
                            ${a.start.x}px,
                            ${a.start.y}px
                          )
                          scale(
                            ${4},
                            ${4}
                          )
                        `,
                    width: 1,
                    height: 1,
                    background: `linear-gradient(to ${
                      a.end.x - a.start.x > 0
                        ? "left"
                        : a.end.x - a.start.x < 0
                        ? "right"
                        : a.end.y - a.start.y > 0
                        ? "top"
                        : a.end.y - a.start.y < 0
                        ? "bottom"
                        : "right"
                    }, rgb(21 94 117), rgb(21 94 117), transparent)`,
                    opacity: state === "entered" ? 1 : 0,
                    transitionDelay: `${delay}s`,
                  }}
                ></div>
                <div
                  className="absolute h-[4px] w-[4px] bg-cyan-800 transition-transform duration-[.5s]"
                  style={{
                    transform:
                      state === "entered"
                        ? `translate(${a.end.x + 2}px, ${a.end.y + 2}px)`
                        : `translate(${a.start.x + 2}px, ${a.start.y + 2}px)`,
                    transitionDelay: `${delay}s`,
                    borderRadius: "50%",
                  }}
                />
              </div>
            );
          })
        }

        <div // Card
          ref={(ref) => setCardRef(ref ?? undefined)}
          className={twMerge(
            "CardCyan",
            "absolute inset-0 rounded-3xl transition-all duration-500",
            `after:absolute after:inset-0 after:rounded-3xl after:transition-all after:duration-[2s] after:delay-0  after:opacity-0`,
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

      <Transition
        in={popupOpen}
        timeout={popupOpen ? 0 : 500}
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
        "absolute inset-0 transition-all duration-[1s] delay-[1.3s] ease-out bg-cyan-800"
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

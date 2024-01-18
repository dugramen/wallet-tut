"use client";

import { HTMLAttributes, useEffect, useMemo, useRef, useState } from "react";
import { FaCopy, FaInfoCircle, FaSmile } from "react-icons/fa";
import {
  FaCloud,
  FaEllipsisVertical,
  FaInfo,
  FaPen,
  FaRegCopy,
} from "react-icons/fa6";
import {
  Transition,
  TransitionGroup,
  TransitionStatus,
} from "react-transition-group";
import { twMerge } from "tailwind-merge";
import { Popup } from "./_2_Popup";
import { BiInfoCircle } from "react-icons/bi";

const width = 320;
const height = 192;
const wcell = Math.floor(width / 16) - 1;
const hcell = Math.floor(height / 16) - 1;

export default function Creating({
  state = "unmounted" as TransitionStatus,
  onEnd = () => {},
}) {
  const nodeRef = useRef(null);
  const finalRef = useRef(null);
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
    <>
      <div // Before Popup
        ref={nodeRef}
        className={twMerge(
          "absolute inset-0 flex flex-col items-center justify-center gap-5 opacity-0 transition-all duration-500 ease-out",
          state === "entered" && "opacity-100"
        )}
      >
        <div className="relative w-full grid grid-cols-1 grid-rows-1 place-items-center">
          <div
            className={twMerge(
              "transition-all duration-500 text-lg col-start-1 row-start-1",
              cardLoaded && "-translate-x-10 opacity-0"
            )}
          >
            Creating Your Wallet
          </div>

          <div
            className={twMerge(
              `transition-all duration-700 text-lg translate-x-0 PanelHeader col-start-1 row-start-1 PanelContent`,
              !cardLoaded && "translate-x-10 opacity-0"
            )}
          >
            Your wallet is <span>ready</span>.
          </div>
        </div>

        <div
          className={twMerge(
            "transition-all duration-700 relative opacity-0 rounded-3xl",
            state === "entering"
              ? "h-0 w-0"
              : state === "entered"
              ? "opacity-100"
              : "",
            cardLoaded ? "scale-100" : "",
            popupOpen && "opacity-0"
            // state === "entered" && "CardBorderAnimate",
          )}
          style={{
            transition:` 
              all .7s,
              transform .5s,
              ${popupOpen ? "opacity 0s 0s" : ""}
            `,
            ...(state === "entered" ? { height, width } : {}),
          }}
        >
          <div
            className={twMerge(
              "w-full h-full rounded-3xl CardBorder",
              state === "entered" ? "Active" : "Inactive",
              cardLoaded && "opacity-0"
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
              let absx = Math.abs(a.end.x - a.start.x);
              let absy = Math.abs(a.end.y - a.start.y);
              absx = a.end.x > a.start.x ? absx : absx;
              absy = a.end.y > a.start.y ? absy : absy;
              return (
                <div
                  className="absolute inset-0 transition-all duration-300"
                  style={{
                    opacity: state === "entered" ? 0.25 : 0,
                    transitionDelay: `${delay}s`,
                    animation: "fade-out",
                    animationDuration: "700ms",
                    animationDelay: `${delay + 0.5}s`,
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

        <div
          className={twMerge(
            "transition-all duration-500",
            cardLoaded && "-translate-x-10 opacity-0"
          )}
        >
          Doing some cryptographic magic...
        </div>
      </div>

      <Transition // Finale After Popup
        timeout={300}
        in={backupPhase}
        mountOnEnter
        unmountOnExit
      >
        {(finalState) => (
          <div
            className={twMerge(
              "absolute flex flex-col items-center h-full justify-evenly text-sm transition-all duration-500",
              finalState !== "entered" && "opacity-0"
            )}
            style={{
              width,
            }}
          >
            <div className="text-xl font-bold">Your Secret Recovery Phrase</div>
            <div className="text-xs flex flex-row items-center gap-1">
              For your eyes only. Do not share.{" "}
              <BiInfoCircle className="text-gray-500" />
            </div>
            <div
              style={{ width, height }}
              ref={(ref) => setCardRef(ref ?? cardRef)}
            />

            <div className="text-center text-balance">
              To start using your wallet, please first choose a secure recovery
              method.
            </div>

            <div className="flex flex-col gap-3 w-full">
              <div
                className="
                  rounded-3xl bg-gray-300 relative
                  flex flex-row gap-4 items-center p-4
                "
              >
                <RoundedGradientBorder
                  className="absolute -inset-[6px]"
                  style={{
                    border: "4px solid transparent",
                    borderRadius: 30,
                    backgroundImage:
                      "conic-gradient(from var(--icloud-r), rgb(21 94 117), #67e8f9, rgb(21 94 117))",
                    animation: "icloud-spin",
                    animationDuration: "2s",
                    animationFillMode: "both",
                    animationIterationCount: "infinite",
                    animationTimingFunction: "linear",
                  }}
                />

                <div className="bg-cyan-700 text-gray-200 text-lg rounded-full p-2">
                  <FaCloud />
                </div>
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                  <div className="text-base font-bold flex flex-row items-center gap-2">
                    iCloud Backup{" "}
                    <span className="font-normal text-xs rounded-full bg-gray-500 text-gray-200 px-2 py-[2px]">
                      Popular
                    </span>
                  </div>
                  <div>Encypt your Secret Recovery Phrase with a password.</div>
                </div>
                <FaEllipsisVertical />
              </div>

              <div
                className="
                  rounded-3xl bg-gray-300 
                  flex flex-row gap-4 items-center p-4
                "
              >
                <div className="bg-gray-700 text-gray-200 text-lg rounded-full p-2">
                  <FaPen />
                </div>
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                  <div className="text-base font-bold flex flex-row items-center gap-2">
                    Manual Backup{" "}
                    <span className="font-normal text-xs text-gray-600 px-1 py-1">
                      Advanced
                    </span>
                  </div>
                  <div>
                    Save your Secret Recovery Phrase in a safe location.
                  </div>
                </div>
                <FaEllipsisVertical />
              </div>
            </div>

            <div className="text-xs">
              You must choose at least one recovery method.
            </div>
          </div>
        )}
      </Transition>

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
            onClose={() => {
              setBackupPhase(true);
              // finalRef.current && setCardRef(finalRef.current)
            }}
          />
        )}
      </Transition>
    </>
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

export function RoundedGradientBorder({
  className = "",
  children = undefined as any,
  style = {} as HTMLAttributes<HTMLDivElement>["style"],
}) {
  return (
    <div
      className={className}
      style={{
        ...style,
        borderColor: "transparent",
        backgroundOrigin: "border-box",
        mask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
        WebkitMask:
          "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
        maskComposite: "exclude",
        WebkitMaskComposite: "xor",
      }}
    >
      {children}
    </div>
  );
}

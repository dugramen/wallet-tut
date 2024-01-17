"use client";

import { TransitionGroup, TransitionStatus } from "react-transition-group";
import { twMerge } from "tailwind-merge";
import { CardContent } from "./_1_Creating";
import { Fragment, ReactElement, useCallback, useRef, useState } from "react";
import { useMeasure } from "@uidotdev/usehooks";
import Measure, { ContentRect } from "react-measure";
import {
  FaCircleDollarToSlot,
  FaCloud,
  FaEye,
  FaKey,
  FaLock,
  FaPen,
  FaPencil,
  FaSailboat,
} from "react-icons/fa6";
import { IoPrism } from "react-icons/io5";
import { FaDollarSign } from "react-icons/fa";
// import { Card } from "./_1_Creating";

export function Popup(p: {
  state: TransitionStatus;
  bottom;
  right;
  top;
  left;
  // onClose: () => any;
}) {
  const [page, setPage] = useState(0);
  const [measures, setMeasures] = useState(Array(6).fill(0));
  const [state, setState] = useState(0);

  // console.log(measures);

  const width = (p.right ?? 0) - (p.left ?? 0);
  const height = (p.bottom ?? 0) - (p.top ?? 0);

  const handlePanelContentResize = (i) => (r: ContentRect) =>
    setMeasures((old) => {
      const next = [...old];
      next[i] = r.bounds?.height;
      return next;
    });

  const isFirstState = p.state === "entered" && state === 0;

  return (
    <div
      className={twMerge(
        "fixed flex flex-col inset-0 p-4 transition-colors duration-500",
        isFirstState && "bg-black/60"
      )}
      style={{
        perspective: 500,
      }}
    >
      <div
        className="fixed flex-shrink flex flex-col transition-all duration-[.5s]"
        style={{
          minHeight: height,
          left: p.left,
          bottom: `calc(100% - ${p.bottom}px)`,
          // window.innerHeight - p.bottom
          height: "auto",
          // perspective: 8000,
          width: width,
          transformStyle: "preserve-3d",
          ...(isFirstState
            ? {
                bottom: 8 * 4,
                width: width + 8,
                left: p.left - 4,
                height: "auto",
                top: "auto",
              }
            : {}),
          ...(state === 1
            ? {
                transform: "rotateY(180deg) translate3d(0, 0, -400px)",
                transformOrigin: "center center -200px",
                // perspective: 500,
                transition: `all 1s 0s, transform 1s 1s`,
              }
            : {}),
        }}
      >
        <div // Front
          className="absolute left-0 right-0 bottom-0 flex flex-col rounded-3xl bg-gray-300 overflow-clip"
          style={{
            // transform: `rotateY(0turn)`,
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
          }}
        >
          <div // Card Background
            className="CardCyanBg absolute inset-0 p-[2px]"
          >
            <CardContent
              className={twMerge(
                "transition-all duration-500",
                isFirstState ? "opacity-0 scale-125" : "opacity-100"
              )}
              onClick={() => setPage(4)}
            />
          </div>

          <div // Top half of panel
            className="relative z-20 overflow-clip"
            style={{
              height: height,
              mask: "linear-gradient(to bottom, white, white 75%, transparent)",
            }}
          >
            <div // Phone
              className={twMerge(
                `
                absolute inset-0 transition-all duration-500 bg-cyan-800 border-[10px] border-cyan-700
                rounded-[32px] w-[200px] h-[600px] left-[50%] -translate-x-[50%] translate-y-[200px]
                flex flex-col p-4
              `,
                isFirstState && 'translate-y-[30px]',
                page >= 1 && page < 4 && "translate-y-[-50px] scale-125",
                page === 5 && "translate-y-[-50px]",
                page >= 6 && "translate-y-[200px] opacity-0 duration-700"
              )}
            >
              <div // Notch
                className="absolute top-3 left-[50%] translate-x-[-50%] w-20 h-5 bg-cyan-700 rounded-full"
              />

              <div // Icon row
                className={twMerge(
                  "absolute top-32 self-center flex flex-row items-center transition-all duration-500",
                  page !== 2 && "opacity-0 translate-y-6"
                )}
              >
                <div className="p-3 rounded-full aspect-square -mr-4 scale-75 text-2xl text-cyan-100 bg-cyan-700">
                  <FaSailboat />
                </div>
                <div
                  className="p-3 rounded-full aspect-square -mr-4 scale-90 text-2xl z-10 text-cyan-100 bg-cyan-700"
                  style={{
                    boxShadow: "0 0 10px 5px rgba(21, 94, 117, 1)",
                  }}
                >
                  <FaCircleDollarToSlot />
                </div>

                <div
                  className="p-3 rounded-full aspect-square text-2xl z-20 bg-cyan-100 text-cyan-700 relative"
                  style={{
                    boxShadow: "0 0 10px 5px rgba(21, 94, 117, 1)",
                  }}
                >
                  <FaKey />
                  <div
                    className="absolute inset-0 animate-ping rounded-full border-2 border-cyan-200/20"
                    style={{ animationDuration: "1s" }}
                  />
                </div>

                <div
                  className="p-3 rounded-full aspect-square -ml-4 scale-90 text-2xl z-10 text-cyan-100 bg-cyan-700"
                  style={{
                    boxShadow: "0 0 10px 5px rgba(21, 94, 117, 1)",
                  }}
                >
                  <IoPrism />
                </div>
                <div className="p-3 rounded-full aspect-square -ml-4 scale-75 text-2xl text-cyan-100 bg-cyan-700">
                  <FaDollarSign />
                </div>
              </div>

              <div // Center Lock Icon
                className={twMerge(
                  "absolute top-36 self-center p-3 rounded-full aspect-square text-2xl z-20 bg-cyan-100 text-cyan-700",
                  "transition-all duration-500",
                  page !== 3 && "opacity-0 -translate-y-2"
                )}
                style={{
                  boxShadow: "0 0 10px 5px rgba(21, 94, 117, 1)",
                  animationName: page === 3 ? "squish" : "",
                  animationDelay: ".7s",
                  animationDuration: ".7s",
                }}
              >
                <FaLock className="opacity-0"></FaLock>
                <div className="absolute left-3 right-3 top-3 bottom-3 w-full h-full">
                  <FaLock
                    className="absolute inset-0"
                    style={{
                      clipPath: `inset(0 0 15.1px 0)`,
                    }}
                  />
                  <FaLock
                    className="absolute inset-0 transition-all duration-500 delay-500"
                    style={{
                      clipPath: `inset(8.99px 0 0 0)`,
                      transformOrigin: "16px 14px",
                      transform: page < 3 ? "rotate(-45deg)" : "",
                    }}
                  />
                </div>
              </div>

              <div // Eye Icon
                className={twMerge(
                  "absolute top-12 self-center p-3 rounded-full aspect-square text-2xl z-20 bg-cyan-100 text-cyan-700",
                  "transition-all duration-300",
                  page !== 4 && "opacity-0 -translate-y-2"
                )}
              >
                <FaEye />
                <div
                  className="
                    absolute left-[10px] top-[10px]
                    rotate-45 h-2 
                    rounded-full border-cyan-100 bg-cyan-700 border-2
                    transition-all duration-700 delay-500
                  "
                  style={{
                    transformOrigin: "4px 4px",
                    width: page === 4 ? `calc(141.42% - 32px)` : "0px",
                  }}
                />
              </div>

              <div // Card
                className={twMerge(
                  "h-24 mt-16 transition-all duration-500 relative"
                )}
                style={{
                  transformStyle: "preserve-3d",
                  ...(page !== 0 || !isFirstState
                    ? { transform: `translateY(100px)` }
                    : {}),
                  ...(page === 1
                    ? {
                        transform: `rotateY(.5turn) translateY(40px)`,
                        transitionDuration: ".5s",
                      }
                    : {}),
                  ...(page === 2
                    ? {
                        transform: `rotateY(.5turn) translateY(120px)`,
                      }
                    : {}),
                  ...(page === 3
                    ? {
                        transform: `rotateY(.5turn) translateY(40px)`,
                      }
                    : {}),
                  ...(page === 4
                    ? {
                        transform: "rotateY(.5turn)",
                      }
                    : {}),
                  ...(page === 5
                    ? {
                        transform: "rotateY(.5turn) translateY(-110px)",
                      }
                    : {}),
                }}
              >
                <div // Front
                  className="p-3 absolute bg-cyan-700 rounded-xl h-full w-full grid grid-cols-2 justify-between transform backface-hidden"
                >
                  <div className="w-6 h-6 rounded-full bg-cyan-600" />

                  <div className="ml-auto w-[80%] h-2 rounded-full bg-cyan-600" />

                  <div className="flex flex-col gap-2 w-full h-full">
                    <div className="mr-auto w-[80%] h-2 rounded-full bg-cyan-600 mt-auto" />
                    <div className="mr-auto w-[50%] h-2 rounded-full bg-cyan-600" />
                  </div>
                </div>

                <div // Back
                  className="
                    backface-hidden absolute transform rotate-y-180 bg-cyan-700 rounded-xl w-full h-full
                    p-3 px-4 grid justify-between items-center gap-x-2 gap-y-1 text-cyan-200/50 font-extralight
                  "
                  style={{
                    gridTemplateColumns: "auto 1fr auto 1fr",
                    fontSize: "7px",
                    lineHeight: "7px",
                    // ...(page >= 3 ? {} : {})
                  }}
                >
                  {Array(12)
                    .fill(0)
                    .map((_, i) => (
                      <Fragment key={i}>
                        <div className="text-cyan-200/25 justify-self-end">
                          {i + 1}
                        </div>
                        <div className="relative justify-self-start">
                          {`word ${i + 1}`}
                          <div
                            className="absolute left-0 top-0 bottom-0 rounded-lg bg-cyan-600 transition-all duration-300"
                            style={{
                              right: page >= 3 ? '-10px' : '100%',
                              transitionDelay: `${300 + (i * 50)}ms`
                            }}
                          />
                        </div>
                      </Fragment>
                    ))}
                </div>
              </div>

              <div // Cloud cards
                className="flex flex-col gap-3 transition-all duration-500 opacity-0"
                style={{
                  ...(page === 5
                    ? {
                        transform: "translateY(-80px)",
                        opacity: "100%",
                      }
                    : {}),
                }}
              >
                <TutorialCard>
                  <FaCloud />
                </TutorialCard>

                <TutorialCard>
                  <FaPen />
                </TutorialCard>

                {/* <div className="h-12 rounded-lg bg-cyan-700"></div> */}
              </div>
            </div>
          </div>

          <div // Bottom half with text
            className="grid transition-all duration-[.5s] overflow-clip z-20 bg-gray-300"
            style={{
              gridTemplateRows: isFirstState ? "1fr" : "0fr",
              // transform: state === 1 ? 'rotateY(.5turn)' : 'rotate'
              // gridTemplateRows: "1fr",
            }}
          >
            <div className="overflow-hidden ">
              <div className="flex flex-col gap-4 p-8">
                <div
                  className="transition-all duration-500"
                  style={{
                    height: isFirstState ? measures[page] ?? 0 : 0,
                  }}
                >
                  {[
                    [
                      "Before you continue, there's a few things you should know...",
                      <>
                        Backing up your wallet means saving your{" "}
                        <span>Secret Recovery Phrase</span> in a safe place you
                        can control, so you can recover your wallet in the
                        future if you ever need to. It's an essential security
                        step.
                      </>,
                    ],
                    [
                      "Ok, but what is a 'Secret Recovery Phrase'?",
                      <>
                        Your Secret Recovery Phrase is a series of 12 random
                        words in a specific order. Think of it as the main{" "}
                        <span>password to your wallet</span>, which can't be
                        changed or chosen.
                      </>,
                    ],
                    [
                      <>
                        Your Secret Recovery Phrase controlls your wallet{" "}
                        <span>crypto</span>graphically.
                      </>,
                      <>
                        Your Secret Recovery Phrase controls your entire wallet.
                        This makes it very important to keep it safe, and
                        equally importantly, to keep it to yourself.
                      </>,
                    ],
                    [
                      <>
                        So yeah, <span>don't share</span> your Secret Recovery
                        Phrase.
                      </>,
                      <>
                        Anyone with your Secret Recovery Phrase can access,
                        control and empty your entire wallet, so you should
                        never share it. It's a secret for a good reason.
                      </>,
                    ],
                    [
                      <>One last important thing...</>,
                      <>
                        We do not know your Secret Recovery Phrase and will
                        never ask for it. If you lose it, no one, including us,
                        can help you restore your wallet. So it's essential you{" "}
                        <span>save it securely</span>.
                      </>,
                    ],
                    [
                      <>
                        You're <span>ready to backup</span>.
                      </>,
                      <>
                        When you press Continue you'll see your Secret Recovery
                        Phrase and be given some backup options to choose from.
                        After backing up, you can then start using your wallet
                        with peace of mind, knowing you've saved it safely.
                      </>,
                    ],
                  ].map(
                    ([header, body], i) =>
                      page === i && (
                        <PanelContent
                          header={header}
                          onResize={handlePanelContentResize(i)}
                          // setPage={setPage}
                          key={i}
                        >
                          {body}
                        </PanelContent>
                      )
                  )}

                  {/* {page === 4 ? (
                    <PanelContent
                      header={<>One last important thing...</>}
                      onResize={handlePanelContentResize(4)}
                      setPage={setPage}
                    >
                      We do not know your Secret Recovery Phrase and will never
                      ask for it. If you lose it, no one, including us, can help
                      you restore your wallet. So it's essential you{" "}
                      <span>save it securely</span>.
                    </PanelContent>
                  ) : (
                    <></>
                  )} */}
                </div>

                <button
                  className="mt-auto bg-gray-950 text-gray-300 text-base rounded-full py-2 w-full px-4 transition-all duration-300 active:scale-90"
                  onClick={() =>
                    setPage((old) => {
                      const val = old + 1;
                      if (val >= 6) {
                        setState(1);
                      }
                      return val;
                    })
                  }
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>

        <div // Back
          className="absolute inset-0 bg-red-700 rounded-3xl overflow-clip py-6 px-10"
          style={{
            transform: `rotateY(.5turn)`,
            // transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
            height: height,
          }}
        >
          <div className="CardCyanBg inset-0 absolute z-0" />

          <div
            className="relative grid gap-x-3 items-center w-full h-full"
            style={{
              gridTemplateColumns: "auto 1fr auto 1fr",
            }}
          >
            {[
              "word",
              "nuclear",
              "water",
              "choose",
              "remember",
              "whisper",
              "wait",
              "market",
              "suffer",
              "bind",
              "dove",
              "miracle",
            ].map((word, i) => (
              <Fragment key={i}>
                <div
                  className="text-cyan-200/50 whitespace-pre justify-self-end"
                  style={
                    {
                      // gridColumn: (i % 6),
                      // gridRow: Math.floor(i / 6) * 2,
                    }
                  }
                >
                  {i + 1}
                  {/* {i + 1 < 10 ? " " : ""} */}
                </div>
                <div
                  className="text-gray-200"
                  style={
                    {
                      // gridColumn: (i % 6),
                      // gridRow: Math.floor(i / 6) * 2 + 1,
                    }
                  }
                >
                  {word}
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PanelContent({
  header = "" as any,
  children,
  onResize = (cr: ContentRect) => {},
  // setPage,
}) {
  return (
    <Measure bounds onResize={onResize}>
      {({ measureRef }) => (
        <div className="flex flex-col gap-4" ref={measureRef}>
          <div className="font-bold text-xl text-gray-800">{header}</div>
          <div className="font-light">{children}</div>
        </div>
      )}
    </Measure>
  );
}

function TutorialCard({ children }) {
  return (
    <div
      className="
        rounded-lg bg-cyan-700 
      text-cyan-100 text-xl 
        flex flex-row gap-2 items-center px-2 py-2
      "
    >
      <div className="bg-cyan-600 rounded-full p-2">
        {children}
        {/* <FaCloud /> */}
      </div>
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        <div className="h-2 bg-cyan-600 rounded-full w-[50%]"></div>
        <div className="h-[6px] bg-cyan-600 rounded-full w-[90%]"></div>
        <div className="h-[6px] bg-cyan-600 rounded-full w-[80%]"></div>
      </div>
    </div>
  );
}

// const useCardContent = () => {
//   const [ref, size] = useMeasure();

//   const component = useCallback(({ header, children }) => (
//     <div className="flex flex-col gap-4" ref={ref}>
//       <div className="font-bold text-2xl text-gray-800">{header}</div>
//       <div className="font-light">{children}</div>
//     </div>
//   ), [])

//   return { ref, size, component };
// };

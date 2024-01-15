"use client";

import { TransitionGroup, TransitionStatus } from "react-transition-group";
import { twMerge } from "tailwind-merge";
import { CardContent } from "./_1_Creating";
import { ReactElement, useCallback, useRef, useState } from "react";
import { useMeasure } from "@uidotdev/usehooks";
import Measure, { ContentRect } from "react-measure";
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

  const isFirstState = p.state === "entered" && state !== 1;

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
        className="fixed flex-shrink flex flex-col  min-h-[176px] transition-all duration-[.5s]"
        style={{
          left: p.left,
          bottom: `calc(100% - ${p.bottom}px)`,
          // window.innerHeight - p.bottom
          height: "auto",
          // perspective: 8000,
          width: width,
          transformStyle: 'preserve-3d',
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
                transformOrigin: 'center center -200px',
                // perspective: 500,
                transition: `all 1s 0s, transform 1s 1s`,
              }
            : {}),
        }}
      >
        <div
          className="absolute left-0 right-0 bottom-0 flex flex-col rounded-3xl bg-gray-300 overflow-clip"
          style={{
            // transform: `rotateY(0turn)`,
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
          }}
        >
          <div // Card Background
            className="CardCyanBg absolute inset-0"
          >
            <CardContent
              className={twMerge(
                // "transition-all duration-500",
                isFirstState ? "opacity-0" : "opacity-100"
              )}
              onClick={() => setPage(4)}
            />
          </div>

          <div // Top half of panel
            className="relative z-20"
            style={{ height: height }}
          >
            <div
              className={twMerge(
                "absolute inset-0 transition-all duration-500"
              )}
            ></div>
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

        <div
          className="absolute inset-0 bg-red-700 rounded-3xl overflow-clip"
          style={{
            transform: `rotateY(.5turn)`,
            // transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
          }}
        >
          <div className="CardCyanBg inset-0 absolute"/>

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

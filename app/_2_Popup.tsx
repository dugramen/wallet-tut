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
}) {
  const [page, setPage] = useState(0);
  const [measures, setMeasures] = useState(Array(7).fill(0));

  console.log(measures);

  const width = (p.right ?? 0) - (p.left ?? 0);
  const height = (p.bottom ?? 0) - (p.top ?? 0);

  const handlePanelContentResize = (i) => (r: ContentRect) =>
    setMeasures((old) => {
      const next = [...old];
      next[i] = r.bounds?.height;
      return next;
    });

  return (
    <div
      className={twMerge(
        "fixed flex flex-col inset-0 p-4 transition-colors duration-500",
        p.state === "entered" && "bg-black/60"
      )}
    >
      <div
        className="fixed bg-gray-300 flex-shrink flex flex-col rounded-3xl min-h-[176px] transition-all duration-[.5s] delay-0 overflow-clip"
        style={{
          left: p.left,
          bottom: `calc(100% - ${p.bottom}px)`,
          // window.innerHeight - p.bottom
          height: height,
          width: width,
          ...(p.state === "entered"
            ? {
                bottom: 8 * 4,
                width: width + 8,
                left: p.left - 4,
                height: "auto",
                top: "auto",
              }
            : {}),
        }}
      >
        <div className="CardCyanBg absolute inset-0">
          <CardContent
            className={twMerge(
              // "transition-all duration-500",
              p.state === "entered" ? "opacity-0" : "opacity-100"
            )}
          />
        </div>
        <div className="relative z-20" style={{ height }}>
          <div
            className={twMerge("absolute inset-0 transition-all duration-500")}
          ></div>
        </div>
        <div
          className="grid transition-all duration-[.5s] delay-0 overflow-clip z-20 bg-gray-300"
          style={{
            gridTemplateRows: p.state === "entered" ? "1fr" : "0fr",
            // gridTemplateRows: "1fr",
          }}
        >
          <div className="overflow-hidden ">
            <div className="flex flex-col gap-4 p-8">
              <div
                className="transition-all duration-500"
                style={{
                  height: p.state === "entered" ? measures[page] ?? 0 : 0,
                }}
              >
                {[
                  [
                    "Before you continue, there's a few things you should know...",
                    <>
                      Backing up your wallet means saving your{" "}
                      <span>Secret Recovery Phrase</span> in a safe place you
                      can control, so you can recover your wallet in the future
                      if you ever need to. It's an essential security step.
                    </>,
                  ],
                  [
                    "Ok, but what is a 'Secret Recovery Phrase'?",
                    <>
                      Your Secret Recovery Phrase is a series of 12 random words
                      in a specific order. Think of it as the main{" "}
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
                      This makes it very important to keep it safe, and equally
                      importantly, to keep it to yourself.
                    </>,
                  ],
                  [
                    <>
                      So yeah, <span>don't share</span> your Secret Recovery
                      Phrase.
                    </>,
                    <>
                      Anyone with your Secret Recovery Phrase can access,
                      control and empty your entire wallet, so you should never
                      share it. It's a secret for a good reason.
                    </>,
                  ],
                  [
                    <>One last important thing...</>,
                    <>
                      We do not know your Secret Recovery Phrase and will never
                      ask for it. If you lose it, no one, including us, can help
                      you restore your wallet. So it's essential you{" "}
                      <span>save it securely</span>.
                    </>,
                  ],
                ].map(([header, body], i) => (
                  page === i && <PanelContent
                    header={header}
                    onResize={handlePanelContentResize(i)}
                    setPage={setPage}
                    key={i}
                  >
                    {body}
                  </PanelContent>
                ))}

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
                onClick={() => setPage((old) => old + 1)}
              >
                Continue
              </button>
            </div>
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
  setPage,
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

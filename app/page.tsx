"use client";
import Image from "next/image";
import { useCallback, useState } from "react";
import { FaAngleLeft, FaCheck, FaRegQuestionCircle } from "react-icons/fa";
import { twMerge } from "tailwind-merge";
import Terms from "./_0_Terms";
import Creating from "./_1_Creating";
import {
  CSSTransition,
  SwitchTransition,
  Transition,
  TransitionGroup,
} from "react-transition-group";

export default function Home() {
  const [page, setPage] = useState(
    "terms" as ["terms", "creating", "tutorial"][number]
  );

  return (
    <main className="flex h-full w-full flex-col items-center justify-center text-gray-800 p-8 text-sm relative">
      {/* <SwitchTransition mode="out-in">
        <Transition key={page} timeout={300}>
          {(state) =>
            page === "terms" ? (
              <Terms onAccept={() => setPage("creating")} state={state} />
            ) : (
              <Creating onEnd={() => setPage("tutorial")} state={state} />
            )
          }
        </Transition>
      </SwitchTransition> */}

      <TransitionGroup>
        <Transition key={page} timeout={500}>
          {(state) =>
            <div className="absolute left-0 top-0 w-full h-full flex flex-col items-center justify-center p-8">
              {

                page === "terms" ? (
                  <Terms onAccept={() => setPage("creating")} state={state} />
                ) : (
                  <Creating onEnd={() => setPage("tutorial")} state={state} />
                )
              }
            </div>
          }
        </Transition>
      </TransitionGroup>

      {/* <Transition
        key={page}
        timeout={500}
        in={page === "terms"}
        unmountOnExit
        mountOnEnter
      >
        {(state) => (
          <Terms onAccept={() => setPage("creating")} state={state} />
        )}
      </Transition>
      <Transition
        key={page}
        timeout={500}
        in={page === "creating"}
        unmountOnExit
        mountOnEnter
      >
        {(state) => (
          <Creating onEnd={() => setPage("tutorial")} state={state} />
        )}
      </Transition> */}
    </main>
  );
}

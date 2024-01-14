"use client";

import { useRef, useState } from "react";
import { FaAngleLeft, FaRegQuestionCircle, FaCheck } from "react-icons/fa";
import { twMerge } from "tailwind-merge";
import { Transition, TransitionStatus } from "react-transition-group";

export default function Terms({ onAccept = () => {}, state = "unmounted" as TransitionStatus }) {
  const [page, setPage] = useState(0);
  const CheckBoxes = [
    "I understand that i am solely responsible for the security and backup of my wallets, not Family.",
    "I understand that using Family for any illegal purposes is strictly prohibited and against our terms.",
    "I understand that Family is still in private beta and I may encounter occasional bugs.",
    "I understand that if I ever lose access to my wallets, Family is not liable and cannot help in any way.",
  ].map((text, i) => useCheckBox(text));

  const checkCount = CheckBoxes.reduce(
    (acc, cb) => (cb.checked ? acc + 1 : acc),
    0
  );

  const nodeRef = useRef(null);

  return (
    <div
      ref={nodeRef}
      className={twMerge(
        "max-w-80 h-full flex flex-col gap-16 items-stretch justify-between transition-all duration-300",
        state === "exiting" ? `opacity-0 -translate-x-full` : "",
        state === "exited" ? 'hidden' : ''
      )}
    >
      <div className="flex flex-row items-center">
        <FaAngleLeft />

        <div className="flex flex-row items-center gap-2 ml-auto mr-auto">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className={twMerge(
                  "h-2 w-4 cursor-pointer bg-gray-800 rounded-full transition-all duration-300",
                  page === i && "w-8 bg-cyan-800"
                )}
                onClick={() => setPage(i)}
              />
            ))}
        </div>

        <FaRegQuestionCircle />
      </div>

      <div className="flex flex-col self-start gap-2">
        <h1 className="text-2xl font-bold text-gray-900">Accept Terms</h1>

        <div className="text-sm">
          Please read and agree to the following terms before you continue.
        </div>
      </div>

      <div className="flex flex-col gap-4 mb-auto text-xs">
        {CheckBoxes.map((cb) => cb.component)}
      </div>

      <div className="flex flex-col items-stretch w-full gap-4">
        <div className="text-xs self-center">
          By clicking the boxes, you agree to these terms.
        </div>

        <button
          className={twMerge(`
              bg-cyan-800 text-cyan-200 text-xl disabled:opacity-50
              transition-all duration-300
              px-8 py-2 rounded-full
              active:scale-95
            `)}
          disabled={checkCount < CheckBoxes.length}
          onClick={() => onAccept()}
        >
          I Understand, Continue
        </button>
      </div>
    </div>
    // <Transition ref={nodeRef}  timeout={500} unmountOnExit mountOnEnter>
    //   {(state) => (
    //   )}
    // </Transition>
  );
}

function useCheckBox(text: string) {
  const [checked, setChecked] = useState(false);

  const component = (
    <label
      className="flex flex-row items-start gap-4"
      onClick={() => setChecked((old) => !old)}
    >
      <div
        className={twMerge(`
          min-w-6 min-h-6 mt-1 rounded-lg relative
          border-2 border-solid border-gray-400
        `)}
      >
        <div
          className="absolute -inset-[2px] bg-cyan-800 rounded-lg transition-all duration-500 ease-out text-cyan-200 grid place-content-center"
          style={{
            clipPath: checked ? "circle(110%)" : "circle(0%)",
          }}
        >
          <FaCheck />
        </div>
      </div>

      <div>{text}</div>
    </label>
  );

  return {
    checked,
    setChecked,
    component,
  };
}

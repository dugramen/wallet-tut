import { htmlNoJsx as h } from "./jsx-alernative";

const {div, a, button, input} = h

export function Sample() {
  return (
    div({ className: "flex flex-col items-center gap-2" }, [
      div({ className: "h-10 w-5 bg-slate-700" }),
      button({ onClick: () => console.log("i  pressed") }),
      Array(20)
        .fill(0)
        .map((_, i) => a({ href: "/home" })),
    ])
  );
}

function original() {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="h-10 w-5 bg-slate-700" />
      <button onClick={() => console.log("i  pressed")} />
      {Array(20)
        .fill(0)
        .map((_, i) => (
          <a href="/home" />
        ))}
    </div>
  );
}

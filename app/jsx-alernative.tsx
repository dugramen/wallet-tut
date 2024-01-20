import {
  Attributes,
  ClassAttributes,
  FC,
  FunctionComponent,
  HTMLAttributes,
  ReactHTML,
  ReactNode,
  createElement,
} from "react";

const nojsx =
  <
    V,
    T = V extends FunctionComponent<infer Q>
      ? FunctionComponent<Q>
      : keyof ReactHTML
  >(
    component: V
  ) =>
  (
    props?: T extends keyof ReactHTML
      ? (ClassAttributes<HTMLElement> & HTMLAttributes<HTMLElement>) | null
      : T extends FunctionComponent<infer P>
      ? (Attributes & P) | null
      : null,
    ...children: Array<any>
  ): ReactNode => {
    return createElement(
      component as FunctionComponent,
      props,
      ...(Array.isArray(children) &&
      typeof children[0] === "object" &&
      !Array.isArray(children[0]) &&
      Object.keys(children[0]).length === 0
        ? []
        : children)
    );
  };

const zoop = nojsx(
  ({ yo = "0", zoop = "1", smell = "2" as "2" | "3", foots = "3" }) => <></>
);
const div = nojsx("div");
div({});

zoop({ smell: "2" });
zoop({ foots: "", smell: "3" });

const Mamoswine = nojsx(function ({
  hello = "there" as "there" | "world",
  nooms = null as null | 1 | "2" | "3",
  children = undefined as any,
}) {
  return <></>;
});

let n = (
  Mamoswine({ hello: "there" }, [
    Mamoswine({ nooms: "2" }, "joop")
  ])
);
let m = (
  <Mamoswine hello="there">
    <Mamoswine nooms={"2"}>joop</Mamoswine>
  </Mamoswine>
);

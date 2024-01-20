import {
  Attributes,
  ClassAttributes,
  FC,
  FunctionComponent,
  HTMLAttributes,
  HTMLProps,
  ReactHTML,
  ReactNode,
  createElement,
} from "react";
import { htmlTagNames } from "react-tag-names";

// const getHTMLProps = <T extends keyof JSX.IntrinsicElements>(elementName: T): React.HTMLProps<JSX.IntrinsicElements[T]> => {
//   return {} as React.HTMLProps<JSX.IntrinsicElements[T]>;
// };

// // Example usage
// const inputProps = getHTMLProps('input');
// const divProps = getHTMLProps('div');
// const aProps = getHTMLProps('a');


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
      ? (ClassAttributes<HTMLElement> & HTMLProps<JSX.IntrinsicElements[T]>) | null
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
// const atag = nojsx("a")
// atag({href})

zoop({ smell: "2" });
zoop({ foots: "", smell: "3" });

const Mamoswine = nojsx(function ({
  hello = "there" as "there" | "world",
  nooms = null as null | 1 | "2" | "3",
  children = undefined as any,
}) {
  return <>
    <a href=""></a>
  </>;
});

let n = Mamoswine({ hello: "there" }, [Mamoswine({ nooms: "2" }, "joop")]);
let m = (
  <Mamoswine hello="there">
    <Mamoswine nooms={"2"}>joop</Mamoswine>
  </Mamoswine>
);

type HtmlNojsxMap<T extends keyof ReactHTML> = { [Key in T]: ReturnType<typeof nojsx<Key>> }
// const els = (htmlTagNames as (keyof ReactHTML)[]).reduce((acc, val) => ({...acc, [val]: nojsx(val)}), {})

export const htmlNoJsx = (htmlTagNames as (keyof ReactHTML)[]).reduce(
  (acc, val) => ({ ...acc, [val]: nojsx(val) }),
  {}
) as HtmlNojsxMap<keyof ReactHTML> ;

// module.exports = {...b}
// b.div({className: ""})

  


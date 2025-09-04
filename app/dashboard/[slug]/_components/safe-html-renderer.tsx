"use client";

import parse, { Element, domToReact } from "html-react-parser";
import sanitizeHtml from "sanitize-html";
import Image from "next/image";

type Props = {
  html: string;
};

export function SafeHtmlRenderer({ html }: Props) {
  const clean = sanitizeHtml(html, {
    allowedTags: [
      "b",
      "i",
      "em",
      "strong",
      "a",
      "p",
      "ul",
      "ol",
      "li",
      "blockquote",
      "code",
      "pre",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "img",
      "input",
      "span",
      "hr",
      "br",
    ],
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "title", "width", "height"],
      input: ["type", "checked", "disabled"],
      code: ["class"],
      span: ["class"],
    },
    allowedSchemes: ["http", "https", "data"],
  });

  return (
    <div className="prose max-w-none [&>*]:inline [&>input[type=checkbox]]:m-0 [&>input[type=checkbox]]:inline-block [&>input[type=checkbox]]:align-middle [&>ol>li]:inline [&>ul>li]:inline">
      {parse(clean, {
        replace: (domNode) => {
          if (!(domNode instanceof Element)) return;

          if (domNode.name === "li") {
            const children = domNode.children.map((child) =>
              domToReact([child as import("html-react-parser").DOMNode]),
            );
            return (
              <span className="inline-flex items-center space-x-2">
                {children}
              </span>
            );
          }

          if (domNode.name === "p") {
            const children = domNode.children.map((child) =>
              domToReact([child as import("html-react-parser").DOMNode]),
            );
            return <span className="inline">{children}</span>;
          }

          if (domNode.name === "input" && domNode.attribs.type === "checkbox") {
            return (
              <input
                type="checkbox"
                {...domNode.attribs}
                disabled={true}
                className="m-0 inline-block align-middle"
              />
            );
          }

          if (domNode.name === "img") {
            const { src, alt, width, height } = domNode.attribs;
            return (
              <Image
                src={src}
                alt={alt || ""}
                width={width ? parseInt(width) : 600}
                height={height ? parseInt(height) : 400}
                style={{ width: "100%", height: "auto" }}
              />
            );
          }
        },
      })}
    </div>
  );
}

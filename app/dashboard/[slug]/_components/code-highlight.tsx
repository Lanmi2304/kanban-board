import { ReactNode } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
export const CodeHighlight = ({ children }: { children: ReactNode }) => {
  return (
    <SyntaxHighlighter
      language="javascript"
      style={atomOneDark}
      className="pointer-events-auto rounded-md"
    >
      {children as string}
    </SyntaxHighlighter>
  );
};

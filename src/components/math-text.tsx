import katex from "katex";

// Matn ichidagi $...$ (inline) va $$...$$ (blok) LaTeX qismlarini KaTeX bilan
// render qiladi, qolgan qismini oddiy matn sifatida ko'rsatadi.
function render(tex: string, display: boolean): string {
  try {
    return katex.renderToString(tex, { displayMode: display, throwOnError: false, output: "html" });
  } catch {
    return tex;
  }
}

export function MathText({ children, className }: { children: string; className?: string }) {
  const parts: React.ReactNode[] = [];
  const re = /\$\$([^$]+)\$\$|\$([^$]+)\$/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;

  while ((m = re.exec(children)) !== null) {
    if (m.index > last) parts.push(children.slice(last, m.index));
    const display = m[1] != null;
    const tex = (m[1] ?? m[2]) as string;
    parts.push(
      <span
        key={i++}
        className={display ? "block my-2" : "inline"}
        dangerouslySetInnerHTML={{ __html: render(tex, display) }}
      />
    );
    last = re.lastIndex;
  }
  if (last < children.length) parts.push(children.slice(last));

  return <span className={className}>{parts}</span>;
}

import { useState } from 'react';

interface Props {
  prompt: string;
}

export default function CopyPromptButton({ prompt }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button
      type="button"
      className="inline-flex items-center justify-center rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:-translate-y-0.5"
      onClick={() => void handleCopy()}
    >
      {copied ? '已複製 Prompt' : '複製 Prompt'}
    </button>
  );
}

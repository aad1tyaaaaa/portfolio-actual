'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button type="button" aria-label="Copy code"
      onClick={() => navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500) })}
      className="flex items-center gap-1.5 rounded-full border border-[#d7e2ea33] px-3 py-1 text-xs hover:bg-[#d7e2ea14] transition-colors">
      {copied ? <Check size={14} /> : <Copy size={14} />}{copied ? 'copied' : 'copy'}
    </button>
  )
}

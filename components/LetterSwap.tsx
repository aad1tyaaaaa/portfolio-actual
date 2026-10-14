import type { CSSProperties } from 'react'

// Each letter is a two-face 3D box; hovering the text rolls every box upward so its bottom face comes forward,
// staggered left to right. Words stay unbroken so the text still wraps normally.
export default function LetterSwap({ text, className = '' }: { text: string; className?: string }) {
  let i = 0
  return (
    <span className={`letter-swap ${className}`}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.split(' ').map((word, w) => (
          <span key={w}>
            {w > 0 && ' '}
            <span className="ls-word">
              {[...word].map(ch => (
                <span key={i} className="ls-char" style={{ '--i': i++ } as CSSProperties}>
                  <span className="ls-face">{ch}</span>
                  <span className="ls-face ls-bottom">{ch}</span>
                </span>
              ))}
            </span>
          </span>
        ))}
      </span>
    </span>
  )
}

type LottoBallProps = {
  number: number
  size?: 'sm' | 'md' | 'lg'
  dimmed?: boolean
}

export function getBallColors(number: number) {
  if (number <= 10) return { bg: '#FBC400', text: '#1a1200', shadow: 'rgba(251,196,0,0.5)' }
  if (number <= 20) return { bg: '#69C8F2', text: '#012840', shadow: 'rgba(105,200,242,0.5)' }
  if (number <= 30) return { bg: '#FF7272', text: '#ffffff', shadow: 'rgba(255,114,114,0.5)' }
  if (number <= 40) return { bg: '#AAB8CC', text: '#1a2030', shadow: 'rgba(170,184,204,0.45)' }
  return { bg: '#58D68D', text: '#01301d', shadow: 'rgba(88,214,141,0.5)' }
}

export function LottoBall({ number, size = 'md', dimmed = false }: LottoBallProps) {
  const colors = getBallColors(number)
  const sizes = {
    sm: 'h-[34px] w-[34px] text-[13px]',
    md: 'h-11 w-11 text-[14px]',
    lg: 'h-[52px] w-[52px] text-[17px]',
  }

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-lotto-mono font-bold ${sizes[size]}`}
      style={{
        background: colors.bg,
        color: colors.text,
        boxShadow: size === 'lg' ? `0 4px 18px ${colors.shadow}` : size === 'sm' ? `0 3px 10px ${colors.shadow}` : undefined,
        opacity: dimmed ? 0.5 : 1,
      }}
    >
      {number}
    </span>
  )
}

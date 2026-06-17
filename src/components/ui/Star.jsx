export default function Star({ value }) {
  return (
    <span className="text-xs text-amber font-mono" aria-label={`${value} out of 5`}>
      {'★'.repeat(Math.floor(value))}{'☆'.repeat(5 - Math.floor(value))}
      <span className="text-muted font-sans ml-1">{value.toFixed(1)}</span>
    </span>
  )
}

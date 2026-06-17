export default function LiveDot() {
  return (
    <span className="relative inline-flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sage opacity-60"></span>
      <span className="relative inline-flex rounded-full h-2 w-2 bg-sage"></span>
    </span>
  )
}

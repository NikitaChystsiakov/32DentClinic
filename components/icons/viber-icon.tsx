// Viber-логотип как currentColor-иконка (через CSS mask), чтобы он вёл себя
// как обычная lucide-иконка — наследовал цвет текста и был виден в тёмной теме.
// Файл /images/viber.svg сам по себе — это картинка с зашитым фиксированным
// fill="#404040", поэтому как <img> он не реагирует на цвет/тему.
export function ViberIcon({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={className}
      style={{
        display: 'inline-block',
        backgroundColor: 'currentColor',
        WebkitMaskImage: 'url(/images/viber.svg)',
        maskImage: 'url(/images/viber.svg)',
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
      }}
    />
  )
}

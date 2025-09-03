interface ScanSource {
  base: string
  pattern: string
}

interface ScannerOptions {
  sources?: ScanSource[]
}

export class Scanner {
  public files: string[] = []
  public globs: ScanSource[] = []
  private sources: ScanSource[]

  constructor(options: ScannerOptions = {}) {
    this.sources = options.sources || []
    this.globs = [...this.sources]
  }

  scan(): string[] {
    // For tests, just return empty since we'll scan specific files
    return []
  }

  scanFiles(files: Array<{ content: string; file?: string; extension: string }>): string[] {
    const candidates = new Set<string>()
    const classPattern = /[a-zA-Z][\w-]*(?::[a-zA-Z][\w-]*)*(?:\/[a-zA-Z][\w-]*)?/g
    
    for (const { content } of files) {
      const matches = content.match(classPattern) || []
      
      for (const match of matches) {
        if (this.isPotentialTailwindClass(match)) {
          candidates.add(match)
        }
      }
    }
    
    return Array.from(candidates)
  }

  private isPotentialTailwindClass(className: string): boolean {
    // Basic heuristics to identify potential Tailwind classes
    const tailwindPrefixes = [
      'bg-', 'text-', 'border-', 'p-', 'm-', 'w-', 'h-', 'flex', 'grid',
      'absolute', 'relative', 'fixed', 'sticky', 'block', 'inline', 'hidden',
      'rounded', 'shadow', 'opacity-', 'space-', 'divide-', 'z-', 'top-',
      'right-', 'bottom-', 'left-', 'hover:', 'focus:', 'active:', 'disabled:',
      'sm:', 'md:', 'lg:', 'xl:', '2xl:', 'dark:', 'group-hover:', 'peer-',
      'after:', 'before:', 'first-letter:', 'backdrop:', 'file:', 'inset-',
      'ring', 'outline-', 'scale-', 'transition-', 'ease-', 'duration-',
      'leading-', 'tracking-', 'font-', 'touch-', 'from-', 'via-', 'to-',
      'conic', 'radial', 'linear'
    ]
    
    // Check if it starts with common Tailwind prefixes
    const hasCommonPrefix = tailwindPrefixes.some(prefix => className.startsWith(prefix))
    
    // Check if it matches common Tailwind patterns
    const hasCommonPattern = /^(text|bg|border)-(xs|sm|base|lg|xl|\d+xl|\d+)$/.test(className) ||
                             /^(w|h|p|m|space|gap)-(\d+|px|auto|full|screen)$/.test(className) ||
                             /^(rounded|shadow)(-\w+)?$/.test(className) ||
                             /^size-\d+$/.test(className)
    
    return hasCommonPrefix || hasCommonPattern || className.length <= 30
  }
}

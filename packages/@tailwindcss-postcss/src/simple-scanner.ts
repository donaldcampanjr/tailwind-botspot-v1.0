import fs from 'node:fs'
import path from 'node:path'
import { glob } from 'glob'

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
    const candidates = new Set<string>()
    
    // Class name pattern - matches potential CSS class names
    const classPattern = /[a-zA-Z][\w-]*(?::[a-zA-Z][\w-]*)*(?:\/[a-zA-Z][\w-]*)?/g
    
    for (const source of this.sources) {
      try {
        const pattern = path.join(source.base, source.pattern)
        const files = glob.sync(pattern, {
          ignore: ['**/node_modules/**', '**/.*/**', '**/*.min.*'],
          nodir: true
        })
        
        this.files.push(...files)
        
        for (const file of files) {
          try {
            const content = fs.readFileSync(file, 'utf8')
            const matches = content.match(classPattern) || []
            
            for (const match of matches) {
              // Simple heuristic: if it looks like a Tailwind class, include it
              if (this.isPotentialTailwindClass(match)) {
                candidates.add(match)
              }
            }
          } catch (err) {
            // Skip files that can't be read
            continue
          }
        }
      } catch (err) {
        // Skip invalid patterns
        continue
      }
    }
    
    return Array.from(candidates)
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
      'sm:', 'md:', 'lg:', 'xl:', '2xl:', 'dark:', 'group-hover:', 'peer-'
    ]
    
    // Check if it starts with common Tailwind prefixes
    const hasCommonPrefix = tailwindPrefixes.some(prefix => className.startsWith(prefix))
    
    // Check if it matches common Tailwind patterns
    const hasCommonPattern = /^(text|bg|border)-(xs|sm|base|lg|xl|\d+xl|\d+)$/.test(className) ||
                             /^(w|h|p|m|space|gap)-(\d+|px|auto|full|screen)$/.test(className) ||
                             /^(rounded|shadow)(-\w+)?$/.test(className)
    
    return hasCommonPrefix || hasCommonPattern || className.length <= 20
  }
}

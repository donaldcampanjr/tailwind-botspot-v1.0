const QUOTES = ['"', "'", '`']
const LOGICAL_OPERATORS = ['&&', '||', '?', '===', '==', '!=', '!==', '>', '>=', '<', '<=']
const CONDITIONAL_TEMPLATE_SYNTAX = [
  // Vue
  /v-else-if=['"]$/,
  /v-if=['"]$/,
  /v-show=['"]$/,

  // Alpine
  /x-if=['"]$/,
  /x-show=['"]$/,
]

export function isSafeMigration(location: { contents: string; start: number; end: number }) {
  let currentLineBeforeCandidate = ''
  for (let i = location.start - 1; i >= 0; i--) {
    let char = location.contents.at(i)!
    if (char === '\n') {
      break
    }
    currentLineBeforeCandidate = char + currentLineBeforeCandidate
  }
  let currentLineAfterCandidate = ''
  for (let i = location.end; i < location.contents.length; i++) {
    let char = location.contents.at(i)!
    if (char === '\n') {
      break
    }
    currentLineAfterCandidate += char
  }

  // Heuristic 1: Require the candidate to be inside quotes
  let isQuoteBeforeCandidate = QUOTES.some((quote) => currentLineBeforeCandidate.includes(quote))
  let isQuoteAfterCandidate = QUOTES.some((quote) => currentLineAfterCandidate.includes(quote))
  if (!isQuoteBeforeCandidate || !isQuoteAfterCandidate) {
    return false
  }

  // Heuristic 2: Disallow object access immediately following the candidate
  if (currentLineAfterCandidate[0] === '.') {
    return false
  }

  // Heuristic 3: Disallow logical operators preceding or following the candidate
  for (let operator of LOGICAL_OPERATORS) {
    if (
      currentLineAfterCandidate.trim().startsWith(operator) ||
      currentLineBeforeCandidate.trim().endsWith(operator)
    ) {
      return false
    }
  }

  // Heuristic 4: Disallow conditional template syntax
  for (let rule of CONDITIONAL_TEMPLATE_SYNTAX) {
    if (rule.test(currentLineBeforeCandidate)) {
      return false
    }
  }

  return true
}

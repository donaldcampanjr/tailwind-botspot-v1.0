#[macro_use]
extern crate napi_derive;

#[derive(Debug, Clone)]
#[napi(object)]
pub struct ChangedContent {
  /// File path to the changed file
  pub file: Option<String>,

  /// Contents of the changed file
  pub content: Option<String>,

  /// File extension
  pub extension: String,
}

#[derive(Debug, Clone)]
#[napi(object)]
pub struct DetectSources {
  /// Base path to start scanning from
  pub base: String,
}

#[derive(Debug, Clone)]
#[napi(object)]
pub struct GlobEntry {
  /// Base path of the glob
  pub base: String,

  /// Glob pattern
  pub pattern: String,
}

impl From<ChangedContent> for tailwindcss_oxide::ChangedContent {
  fn from(changed_content: ChangedContent) -> Self {
    Self {
      file: changed_content.file.map(Into::into),
      content: changed_content.content,
    }
  }
}

impl From<GlobEntry> for tailwindcss_oxide::GlobEntry {
  fn from(glob: GlobEntry) -> Self {
    Self {
      base: glob.base,
      pattern: glob.pattern,
    }
  }
}

impl From<tailwindcss_oxide::GlobEntry> for GlobEntry {
  fn from(glob: tailwindcss_oxide::GlobEntry) -> Self {
    Self {
      base: glob.base,
      pattern: glob.pattern,
    }
  }
}

impl From<DetectSources> for tailwindcss_oxide::scanner::detect_sources::DetectSources {
  fn from(detect_sources: DetectSources) -> Self {
    Self::new(detect_sources.base.into())
  }
}

// ---

#[derive(Debug, Clone)]
#[napi(object)]
pub struct ScannerOptions {
  /// Automatically detect sources in the base path
  pub detect_sources: Option<DetectSources>,

  /// Glob sources
  pub sources: Option<Vec<GlobEntry>>,
}

#[derive(Debug, Clone)]
#[napi]
pub struct Scanner {
  scanner: tailwindcss_oxide::Scanner,
}

#[napi]
impl Scanner {
  #[napi(constructor)]
  pub fn new(opts: ScannerOptions) -> Self {
    Self {
      scanner: tailwindcss_oxide::Scanner::new(
        opts.detect_sources.map(Into::into),
        opts
          .sources
          .map(|x| x.into_iter().map(Into::into).collect()),
      ),
    }
  }

  #[napi]
  pub fn scan(&mut self) -> Vec<String> {
    self.scanner.scan()
  }

  #[napi]
  pub fn scan_files(&mut self, input: Vec<ChangedContent>) -> Vec<String> {
    self
      .scanner
      .scan_content(input.into_iter().map(Into::into).collect())
  }

  #[napi(getter)]
  pub fn files(&mut self) -> Vec<String> {
    self.scanner.get_files()
  }

  #[napi(getter)]
  pub fn globs(&mut self) -> Vec<GlobEntry> {
    self
      .scanner
      .get_globs()
      .into_iter()
      .map(Into::into)
      .collect()
  }
}

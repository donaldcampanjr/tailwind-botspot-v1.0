use crate::cursor;
use crate::extractor::machine::{Machine, MachineState};

/// Extracts a string (including the quotes) from the input.
///
/// Rules:
///
/// - The string must start and end with the same quote character.
/// - The string cannot contain any whitespace characters.
/// - The string can contain any other character except for the quote character (unless it's escaped).
/// - Balancing of brackets is not required.
///
///
/// E.g.:
///
/// ```text
/// 'hello_world'
/// ^^^^^^^^^^^^^
///
/// content-['hello_world']
///          ^^^^^^^^^^^^^
/// ```
#[derive(Debug, Default)]
pub struct StringMachine;

impl Machine for StringMachine {
    #[inline(always)]
    fn reset(&mut self) {}

    #[inline]
    fn next(&mut self, cursor: &mut cursor::Cursor<'_>) -> MachineState {
        if CLASS_TABLE[cursor.curr as usize] != Class::Quote {
            return MachineState::Idle;
        }

        // Start of a string
        let len = cursor.input.len();
        let start_pos = cursor.pos;
        let end_char = cursor.curr;

        cursor.advance();

        while cursor.pos < len {
            match CLASS_TABLE[cursor.curr as usize] {
                Class::Escape => match CLASS_TABLE[cursor.next as usize] {
                    // An escaped whitespace character is not allowed
                    Class::Whitespace => return MachineState::Idle,

                    // An escaped character, skip ahead to the next character
                    _ => cursor.advance(),
                },

                // End of the string
                Class::Quote if cursor.curr == end_char => return self.done(start_pos, cursor),

                // Any kind of whitespace is not allowed
                Class::Whitespace => return MachineState::Idle,

                // Everything else is valid
                _ => {}
            };

            cursor.advance()
        }

        MachineState::Idle
    }
}

#[derive(Debug, Clone, Copy, PartialEq)]
enum Class {
    /// ', ", or `
    Quote,

    /// \
    Escape,

    /// Whitespace characters
    Whitespace,

    Other,
}

const CLASS_TABLE: [Class; 256] = {
    let mut table = [Class::Other; 256];

    macro_rules! set {
        ($class:expr, $($byte:expr),+ $(,)?) => {
            $(table[$byte as usize] = $class;)+
        };
    }

    set!(Class::Quote, b'"', b'\'', b'`');
    set!(Class::Escape, b'\\');
    set!(Class::Whitespace, b' ', b'\t', b'\n', b'\r', b'\x0C');

    table
};

#[cfg(test)]
mod tests {
    use super::StringMachine;
    use crate::extractor::machine::Machine;

    #[test]
    #[ignore]
    fn test_string_machine_performance() {
        let input = r#"There will be a 'string' in this input, even "strings_with_other_quotes_and_\#escaped_characters"  "#.repeat(100);

        StringMachine::test_throughput(100_000, &input);
        StringMachine::test_duration_once(&input);

        todo!()
    }

    #[test]
    fn test_string_machine_extraction() {
        for (input, expected) in [
            // Simple string
            ("'foo'", vec!["'foo'"]),
            // String as part of a candidate
            ("content-['hello_world']", vec!["'hello_world'"]),
            // With nested quotes
            (r#"'"`hello`"'"#, vec![r#"'"`hello`"'"#]),
            // With escaped opening quote
            (r#"'Tailwind\'s_parser'"#, vec![r#"'Tailwind\'s_parser'"#]),
            (
                r#"'Tailwind\'\'s_parser'"#,
                vec![r#"'Tailwind\'\'s_parser'"#],
            ),
            (
                r#"'Tailwind\'\'\'s_parser'"#,
                vec![r#"'Tailwind\'\'\'s_parser'"#],
            ),
            (
                r#"'Tailwind\'\'\'\'s_parser'"#,
                vec![r#"'Tailwind\'\'\'\'s_parser'"#],
            ),
            // Spaces are not allowed
            ("' hello world '", vec![]),
            // With unfinished quote
            ("'unfinished_quote", vec![]),
            // An escape at the end will never be valid, because it _must_ be followed by the
            // ending quote.
            (r#"'escaped_ending_quote\'"#, vec![]),
            (r#"'escaped_end\"#, vec![]),
        ] {
            assert_eq!(StringMachine::test_extract_all(input), expected);
        }
    }
}

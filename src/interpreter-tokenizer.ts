// tom-weatherhead/thaw-lexical-analyzer/src/interpreter-tokenizer.ts

// The lexical analyzer (tokenizer) implementation corresponding to LexicalAnalyzerSelector.MidnightHack

// The original C# version was a product of the Midnight Coding Club,
// early one morning in August 2012 - July 2014.

import { LanguageSelector } from './language-selectors';
import { LexicalState } from './lexical-states';
import { Token } from './token';
import { TokenizerBase } from './tokenizer-base';
import { TokenizerException } from './tokenizer-exception';

export class InterpreterTokenizer extends TokenizerBase {
	private str = ''; // The string to be tokenized.
	private sbToken = '';
	private lineNum = 1; // Current line number
	private colNum = 1; // Current column number
	private charNum = 0; // Current index into this.str
	private readonly dictCharToTokenType = new Map<string, number>();
	private markQuotedTokens = false; // For use in LISP and Scheme (and SASL?) macro support.
	private lastTokenWasASingleQuote = false;
	private quotedBracketDepth = 0;
	private readonly dictQuoteDelimiterToTokenType = new Map<string, number>();
	private commentDelimiter = ';';

	constructor(gs: number) {
		super();

		// This dictionary is used to recognize single-character tokens.
		this.dictCharToTokenType.set('(', LexicalState.tokenLeftBracket);
		this.dictCharToTokenType.set(')', LexicalState.tokenRightBracket);

		if (gs === LanguageSelector.LISP || gs === LanguageSelector.Scheme || gs === LanguageSelector.SASL) {
			this.dictCharToTokenType.set("'", LexicalState.tokenApostrophe);
			this.dictCharToTokenType.set('"', LexicalState.tokenStrLit);
			this.markQuotedTokens = true;
		}

		if (gs === LanguageSelector.APL) {
			this.dictCharToTokenType.set("'", LexicalState.tokenApostrophe);
		}

		if (gs === LanguageSelector.CLU) {
			this.dictCharToTokenType.set('$', LexicalState.tokenDollar);
		}

		if (gs === LanguageSelector.Smalltalk) {
			this.dictCharToTokenType.set('#', LexicalState.tokenOctothorpe);
			// ThAW 2014/02/03 : We want to recognize $; a sample Smalltalk character literal is $a (see page 319).
			this.dictCharToTokenType.set('$', LexicalState.tokenDollar);
			// Use single quotes, not double quotes, as the string delimiter.  See the example string literal on page 319 of Kamin.
			this.dictCharToTokenType.set("'", LexicalState.tokenStrLit);
		}

		if (gs === LanguageSelector.Prolog2) {
			this.dictCharToTokenType.set(',', LexicalState.tokenComma);
			this.dictCharToTokenType.set('.', LexicalState.tokenDot);
			this.dictCharToTokenType.set('[', LexicalState.tokenLeftSquareBracket);
			this.dictCharToTokenType.set(']', LexicalState.tokenRightSquareBracket);
			this.dictCharToTokenType.set('|', LexicalState.tokenOrBar);
			this.dictCharToTokenType.set(';', LexicalState.tokenSemicolon);
			this.dictCharToTokenType.set('{', LexicalState.tokenLeftCurlyBrace);
			this.dictCharToTokenType.set('}', LexicalState.tokenRightCurlyBrace);
			this.dictQuoteDelimiterToTokenType.set("'", LexicalState.tokenIdent); // For constructing identifiers that contain spaces or special characters.
			this.dictQuoteDelimiterToTokenType.set('"', LexicalState.tokenStrLit);
			this.commentDelimiter = '%'; // See http://users.cs.cf.ac.uk/O.F.Rana/prolog/lectureP2/node10.html
		}

		if (gs === LanguageSelector.JSON) {
			this.dictCharToTokenType.clear();
			this.dictCharToTokenType.set(',', LexicalState.tokenComma);
			this.dictCharToTokenType.set(':', LexicalState.tokenColon);
			this.dictCharToTokenType.set('[', LexicalState.tokenLeftSquareBracket);
			this.dictCharToTokenType.set(']', LexicalState.tokenRightSquareBracket);
			this.dictCharToTokenType.set('{', LexicalState.tokenLeftCurlyBrace);
			this.dictCharToTokenType.set('}', LexicalState.tokenRightCurlyBrace);
			this.dictQuoteDelimiterToTokenType.set('"', LexicalState.tokenStrLit);
			// Is it possible to place a comment in a real JSON expression?  What is the delimiter?
		}

		// markQuotedTokens = gs == LanguageSelector.LISP || gs == LanguageSelector.Scheme;

		if (gs === LanguageSelector.APL) {
			this.commentDelimiter = '#'; // We cannot use ';', since [;] is an APL operator.
		}
	}

	protected setInputString(str: string): void {
		this.str = str;
		this.lineNum = 1;
		this.colNum = 1;
		this.charNum = 0;
		this.lastTokenWasASingleQuote = false;
		this.quotedBracketDepth = 0;
	}

	protected getToken(): Token {
		let result: Token;
		let startColNum = this.colNum;
		const localLastTokenWasASingleQuote = this.lastTokenWasASingleQuote;

		this.lastTokenWasASingleQuote = false;
		this.sbToken = '';

		for (;;) {
			if (this.charNum >= this.str.length) {
				return new Token(LexicalState.tokenEOF, 'EOF', this.lineNum, startColNum, false);
			}

			// let cAsStr = this.str.Substring(this.charNum, 1);
			let c = this.str[this.charNum++];
			const cAsStr = c;

			++this.colNum;

			if (c === this.commentDelimiter) {
				// A comment.

				for (;;) {
					if (this.charNum >= this.str.length) {
						break;
					}

					c = this.str[this.charNum++];
					++this.colNum;

					if (c === '\n') {
						++this.lineNum;
						this.colNum = 1;
						break;
					}
				}

				startColNum = this.colNum;
				continue;
			}

			if (c === '\n') {
				++this.lineNum;
				this.colNum = 1;
				startColNum = 1;
				continue;
			}

			// if (char.IsWhiteSpace(c))
			if (c.match(/\s/)) {
				startColNum = this.colNum;
				continue;
			}

			if (this.dictQuoteDelimiterToTokenType.get(c) !== undefined) {
				const tokenType = this.dictQuoteDelimiterToTokenType.get(c) as number;
				const delimiter = c;

				for (;;) {
					if (this.charNum >= this.str.length) {
						throw new TokenizerException(
							'Quoted literal is not terminated before the end of the input.',
							this.lineNum,
							startColNum
						);
					}

					c = this.str[this.charNum++];
					++this.colNum;

					if (c === '\n') {
						throw new TokenizerException(
							'Quoted literal is not terminated before the end of the line.',
							this.lineNum,
							startColNum
						);
					} else if (c === delimiter) {
						return new Token(tokenType, this.sbToken, this.lineNum, startColNum, false);
					} else {
						this.sbToken = this.sbToken + c;
					}
				}
			}

			if (this.dictCharToTokenType.get(c) !== undefined) {
				const tokenType = this.dictCharToTokenType.get(c) as number;

				if (this.markQuotedTokens) {
					this.lastTokenWasASingleQuote = c === "'";

					if (c === '(' && (localLastTokenWasASingleQuote || this.quotedBracketDepth > 0)) {
						++this.quotedBracketDepth;
					} else if (c === ')' && this.quotedBracketDepth > 0) {
						--this.quotedBracketDepth;
					}
				}

				return new Token(tokenType, cAsStr, this.lineNum, startColNum, false);
			}

			// Else: Find the next ( ) ; whitespace \n or EOF, and interpret what's in between as a name.

			for (;;) {
				this.sbToken = this.sbToken + c;

				if (this.charNum >= this.str.length) {
					break;
				}

				c = this.str[this.charNum];

				// TODO 2014/04/03?  Should we also check dictQuoteDelimiterToTokenType.ContainsKey(c) ?
				if (
					this.dictCharToTokenType.get(c) !== undefined ||
					c === this.commentDelimiter ||
					c === '\n' ||
					c.match(/\s/)
				) {
					break;
				}

				++this.charNum;
				++this.colNum;
			}

			const tokenAsString = this.sbToken;

			const regexInteger = /^(0|-?[1-9][0-9]*)$/;
			const regexFloatingPointNumber =
				/^((0\.0)|(-?(0|[1-9][0-9]*)\.[0-9]*[1-9])|(-?[1-9][0-9]*\.[0-9]+))$/;

			const tokenAsInteger = parseInt(tokenAsString, 10);
			const tokenIsInteger = tokenAsInteger === tokenAsInteger && tokenAsString.match(regexInteger);

			const tokenAsFloat = parseFloat(tokenAsString);
			const tokenIsFloat =
				tokenAsFloat === tokenAsFloat && tokenAsString.match(regexFloatingPointNumber);

			// The following allows for user-defined function names such as +1 (but not -1).

			// if (IsIntegerLiteral(tokenAsString) && int.TryParse(tokenAsString, out tokenAsInt)) {
			// 	result = new Token(LexicalState.tokenIntLit, tokenAsInt, this.lineNum, startColNum, false);
			// }
			if (tokenIsInteger) {
				result = new Token(
					LexicalState.tokenIntLit,
					tokenAsInteger,
					this.lineNum,
					startColNum,
					false
				);
			}
			// else if (IsDoubleLiteral(tokenAsString) && double.TryParse(tokenAsString, out tokenAsDouble))
			// Let "+1", etc. be recognized as identifiers, not floats.
			// else if (tokenAsString[0] != '+' && double.TryParse(tokenAsString, out tokenAsDouble)) {
			// 	result = new Token(LexicalState.tokenFltLit, tokenAsDouble, this.lineNum, startColNum, false);
			else if (tokenIsFloat && !tokenAsString.match(/^\+/)) {
				result = new Token(LexicalState.tokenFltLit, tokenAsFloat, this.lineNum, startColNum, false);
			} else if (tokenAsString === 'quote' && this.markQuotedTokens && !localLastTokenWasASingleQuote) {
				// For all cases except the ones such as the expression "'quote", as in the unit test EvalInLISP().
				result = new Token(
					LexicalState.tokenQuoteKeyword,
					tokenAsString,
					this.lineNum,
					startColNum,
					false
				);
			} else {
				result = new Token(
					LexicalState.tokenIdent,
					tokenAsString,
					this.lineNum,
					startColNum,
					this.markQuotedTokens && (localLastTokenWasASingleQuote || this.quotedBracketDepth > 0)
				);
			}

			// if (result.tokenType === LexicalState.tokenIdent && result.tokenValue === '+') {
			// 	result.tokenType = LexicalState.tokenPlus;
			// }

			if (result.tokenType === LexicalState.tokenIdent) {
				const dictCharToTokenTypeX = new Map<string, number>();

				dictCharToTokenTypeX.set('*', LexicalState.tokenMult);
				dictCharToTokenTypeX.set('/', LexicalState.tokenDiv);
				dictCharToTokenTypeX.set('+', LexicalState.tokenPlus);
				dictCharToTokenTypeX.set('-', LexicalState.tokenMinus);
				dictCharToTokenTypeX.set('=', LexicalState.tokenEqual);
				dictCharToTokenTypeX.set('/=', LexicalState.tokenNotEqual);
				dictCharToTokenTypeX.set('<', LexicalState.tokenLess);
				dictCharToTokenTypeX.set('<=', LexicalState.tokenLessEqual);
				dictCharToTokenTypeX.set('>', LexicalState.tokenGreater);
				dictCharToTokenTypeX.set('>=', LexicalState.tokenGreaterEqual);
				dictCharToTokenTypeX.set(';', LexicalState.tokenSemicolon);
				dictCharToTokenTypeX.set(',', LexicalState.tokenComma);
				dictCharToTokenTypeX.set('||', LexicalState.token2OrBar);
				dictCharToTokenTypeX.set('&&', LexicalState.token2Ampersand);
				dictCharToTokenTypeX.set('(', LexicalState.tokenLeftBracket);
				dictCharToTokenTypeX.set(')', LexicalState.tokenRightBracket);
				dictCharToTokenTypeX.set(':=', LexicalState.tokenAssign);
				dictCharToTokenTypeX.set('->', LexicalState.tokenArrow);
				dictCharToTokenTypeX.set('!', LexicalState.tokenExclamation);
				dictCharToTokenTypeX.set("'", LexicalState.tokenApostrophe);
				dictCharToTokenTypeX.set('#', LexicalState.tokenOctothorpe);
				dictCharToTokenTypeX.set('$', LexicalState.tokenDollar);
				dictCharToTokenTypeX.set('.', LexicalState.tokenDot);
				dictCharToTokenTypeX.set('[', LexicalState.tokenLeftSquareBracket);
				dictCharToTokenTypeX.set(']', LexicalState.tokenRightSquareBracket);
				dictCharToTokenTypeX.set('|', LexicalState.tokenOrBar);
				dictCharToTokenTypeX.set(':', LexicalState.tokenColon);
				dictCharToTokenTypeX.set('{', LexicalState.tokenLeftCurlyBrace);
				dictCharToTokenTypeX.set('}', LexicalState.tokenRightCurlyBrace);

				const possibleTokenType = dictCharToTokenTypeX.get(tokenAsString);

				if (possibleTokenType !== undefined) {
					result.tokenType = possibleTokenType as number;
				}
			}

			break;
		}

		return result;
	}

	// export const regexInteger = /^(0|-?[1-9][0-9]*)$/;

	// Allow 0.5 and 1.0 and 0.0, but not 00.5 or 01.0 or 0.50 or -0.0
	// Note: We never allow a plus sign to be part of the number.
	// Case 1: 0.0 : Zero. No minus sign is allowed.
	// Case 2: -?(0|[1-9][0-9]*)\.[0-9]*[1-9] : The number can start with a zero, but it cannot end with a zero.
	// Case 3: -?[1-9][0-9]*\.[0-9]+ : The number cannot start with a zero, but it can end with a zero.
	// // export const regexFloatingPointNumber = /^-?(0|[1-9][0-9]*)\.[0-9]+$/;
	// export const regexFloatingPointNumber = /^((0\.0)|(-?(0|[1-9][0-9]*)\.[0-9]*[1-9])|(-?[1-9][0-9]*\.[0-9]+))$/;

	// private IsIntegerLiteral(str: string): boolean {
	// 	const i = str.StartsWith("-") ? 1 : 0;

	// 	// str.Length > i : Do not accept "" or "-" as possible integers.
	// 	return str.Length > i && str.Skip(i).All(c => char.IsNumber(c));
	// }
}

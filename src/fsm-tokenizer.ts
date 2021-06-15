// tom-weatherhead/thaw-lexical-analyzer/src/fsm-tokenizer.ts

'use strict';

import { LexicalState } from './lexical-states';
import { Token } from './token';
import { TokenizerBase } from './tokenizer-base';
import { TokenizerException } from './tokenizer-exception';

function makeTokenizerTableKey(stateParam: number, cParam: string): string {
	return `[${stateParam},${cParam}]`;
}

// A tokenizer based on a finite state machine.

export class FSMTokenizer extends TokenizerBase {
	protected readonly ls: number; // LanguageSelector; was  GrammarSelector
	protected readonly acceptableTokens = [
		LexicalState.tokenIntLit,
		LexicalState.tokenFltLit,
		LexicalState.tokenStrLit,
		LexicalState.tokenIdent,
		LexicalState.tokenMult,
		LexicalState.tokenDiv,
		LexicalState.tokenPlus,
		LexicalState.tokenMinus,
		LexicalState.tokenEqual,
		LexicalState.tokenNotEqual,
		LexicalState.tokenLess,
		// LexicalState.tokenLessEqual, // In Prolog, it's =<, not <=
		LexicalState.tokenGreater,
		LexicalState.tokenGreaterEqual,
		LexicalState.tokenSemicolon,
		LexicalState.tokenComma,
		LexicalState.tokenLeftBracket,
		LexicalState.tokenRightBracket,
		LexicalState.tokenArrow,
		LexicalState.tokenEOF
	];
	protected cStringDelimiter = '"'; // This must be the delimiter for tokenStrLit
	protected readonly dictInternalStringStateToDelimiter = new Map<
		number,
		string
	>();
	protected readonly dictInternalStringStateToCompletedState = new Map<
		number,
		number
	>();
	protected removeComments = false;
	protected cCommentDelimiter = '#';
	private readonly table = new Map<string, number>();
	private str = ''; // The string to be tokenized.
	private sbToken = '';
	private lineNum = 1; // Current line number
	private colNum = 1; // Current column number
	private charNum = 0; // Current index into str
	// private bool wasErr = false;   // Set to true if lexical error occurs

	constructor(ls: number) {
		super();

		this.ls = ls;

		this.dictInternalStringStateToDelimiter.set(
			LexicalState.stateStrLitOpen,
			this.cStringDelimiter
		);
		this.dictInternalStringStateToCompletedState.set(
			LexicalState.stateStrLitOpen,
			LexicalState.tokenStrLit
		);

		this.addTransition(
			LexicalState.stateStart,
			'A',
			LexicalState.tokenIdent
		);
		this.addTransition(
			LexicalState.stateStart,
			'0',
			LexicalState.tokenIntLit
		);
		this.addTransition(
			LexicalState.stateStart,
			this.cStringDelimiter,
			LexicalState.stateStrLitOpen
		);
		this.addTransition(
			LexicalState.stateStart,
			'*',
			LexicalState.tokenMult
		);
		this.addTransition(LexicalState.stateStart, '/', LexicalState.tokenDiv);
		this.addTransition(
			LexicalState.stateStart,
			'+',
			LexicalState.tokenPlus
		);
		this.addTransition(
			LexicalState.stateStart,
			'-',
			LexicalState.tokenMinus
		);
		this.addTransition(
			LexicalState.stateStart,
			'=',
			LexicalState.tokenEqual
		);
		this.addTransition(
			LexicalState.stateStart,
			'<',
			LexicalState.tokenLess
		);
		this.addTransition(
			LexicalState.stateStart,
			'>',
			LexicalState.tokenGreater
		);
		this.addTransition(
			LexicalState.stateStart,
			':',
			LexicalState.tokenColon
		);
		this.addTransition(
			LexicalState.stateStart,
			';',
			LexicalState.tokenSemicolon
		);
		this.addTransition(
			LexicalState.stateStart,
			',',
			LexicalState.tokenComma
		);
		this.addTransition(
			LexicalState.stateStart,
			'|',
			LexicalState.tokenOrBar
		);
		this.addTransition(
			LexicalState.stateStart,
			'(',
			LexicalState.tokenLeftBracket
		);
		this.addTransition(
			LexicalState.stateStart,
			')',
			LexicalState.tokenRightBracket
		);
		this.addTransition(
			LexicalState.tokenIdent,
			'A',
			LexicalState.tokenIdent
		);
		this.addTransition(
			LexicalState.tokenIdent,
			'0',
			LexicalState.tokenIdent
		);
		this.addTransition(
			LexicalState.tokenIdent,
			'_',
			LexicalState.tokenIdent
		);
		this.addTransition(
			LexicalState.tokenIntLit,
			'0',
			LexicalState.tokenIntLit
		);
		this.addTransition(
			LexicalState.tokenIntLit,
			'.',
			LexicalState.stateIntLitDot
		);
		this.addTransition(
			LexicalState.stateIntLitDot,
			'0',
			LexicalState.tokenFltLit
		);
		this.addTransition(
			LexicalState.tokenFltLit,
			'0',
			LexicalState.tokenFltLit
		);
		this.addTransition(
			LexicalState.stateStrLitOpen,
			this.cStringDelimiter,
			LexicalState.tokenStrLit
		);
		this.addTransition(
			LexicalState.tokenStrLit,
			this.cStringDelimiter,
			LexicalState.stateStrLitOpen
		);
		this.addTransition(
			LexicalState.tokenMinus,
			'0',
			LexicalState.tokenIntLit
		);
		this.addTransition(
			LexicalState.tokenMinus,
			'>',
			LexicalState.tokenArrow
		);
		this.addTransition(
			LexicalState.tokenGreater,
			'=',
			LexicalState.tokenGreaterEqual
		);
	}

	protected setInputString(str: string) {
		this.str = str;
		this.lineNum = 1;
		this.colNum = 1;
		this.charNum = 0;
	}

	protected addTransition(oldState: number, char: string, newState: number) {
		const tableKey = makeTokenizerTableKey(oldState, char);

		// if (Object.keys(this.table).includes(tableKey)) {
		if (Object.keys(this.table).indexOf(tableKey) >= 0) {
			throw new TokenizerException(
				`Tokenizer.addTransition() : The key '${tableKey}' ([${oldState}, ${char}]) already exists in the transition table`,
				this.lineNum,
				this.colNum
			);
		}

		this.table.set(tableKey, newState);
	}

	protected getStrLitFromTokenStr(cDelimiter: string): string {
		const tokenStr2 = this.sbToken;

		// if (string.IsNullOrEmpty(tokenStr) || tokenStr[0] != cDelimiter) {
		if (!tokenStr2 || tokenStr2[0] !== cDelimiter) {
			throw new TokenizerException(
				'Tokenizer.getStrLitFromTokenStr() : Token string error',
				this.lineNum,
				this.colNum
			);
		}

		let insideQuotes = true;
		let sb = '';

		for (let i = 1; i < tokenStr2.length; ++i) {
			const c = tokenStr2[i];

			// This logic allows two consecutive string delimiters within the string to be interpreted as a single literal string delimiter.
			if (c !== cDelimiter || !insideQuotes) {
				sb = sb + c;
				insideQuotes = true;
			} else {
				insideQuotes = false;
			}
		}

		return sb;
	}

	// protected ExtendedGetTokenValue(ref TokenType s, tokenStr: string): object {
	// 	return null;
	// }

	// Return the next valid token read from the specified file stream.
	// Read buffered characters before reading new characters from fp.

	protected getToken(): Token {
		let c = ''; // A character read from getChar()
		let startCol = this.colNum; // The column of the first char in a token
		let s: number = LexicalState.stateStart; // Current state
		const stateList = [s]; // List of states corresponding to not-yet-accepted characters

		this.sbToken = '';

		for (;;) {
			// Loop until valid token read
			let cSimplified = '';

			c = this.getChar();

			// if (char.IsLetter(c)) { // /A-Za-z/.match(c) ?
			// if (/A-Za-z/.match(c)) {
			if (c.match(/[A-Za-z]/)) {
				cSimplified = 'A';
				// } else if (char.IsDigit(c)) { // /0-9/.match(c) ?
			} else if (c.match(/[0-9]/)) {
				cSimplified = '0';
			} else {
				cSimplified = c;
			}

			const possibleCompletedState =
				this.dictInternalStringStateToCompletedState.get(s);
			const possibleCompletedStateIsAState =
				possibleCompletedState !== undefined;
			const possibleCompletedStateAsAState =
				possibleCompletedState as number;

			if (
				s !== LexicalState.stateStart &&
				(c === '\0' ||
					c === '\n' ||
					// (char.IsWhiteSpace(c) && !this.dictInternalStringStateToCompletedState.ContainsKey(s))))
					// (c.match(/\s/) && Object.keys(this.dictInternalStringStateToCompletedState).indexOf(s) < 0)))
					(c.match(/\s/) && !possibleCompletedStateIsAState))
			) {
				if (
					possibleCompletedStateIsAState &&
					(c === '\0' || c === '\n')
				) {
					// Newline or EOF delimits string literal
					s = possibleCompletedStateAsAState;
				}

				if (c === '\n') {
					++this.charNum;
				}

				if (this.acceptableTokens.indexOf(s) >= 0) {
					// Valid token has been delimited by white space
					break;
				} else {
					// Error - try to recover
					s = LexicalState.stateError;
				}
			}

			let newState = s;

			if (s === LexicalState.stateStart && c === '\0') {
				newState = LexicalState.tokenEOF;
			} else if (s === LexicalState.stateStart && c === '\n') {
				++this.lineNum;
				this.colNum = 1;
				startCol = 1; // Don't buffer white space
				newState = s; // tokenStart;
			} else if (s === LexicalState.stateStart && c.match(/\s/)) {
				++startCol; // Don't buffer white space
				newState = s; // tokenStart;
			} else if (
				s === LexicalState.stateStart &&
				this.removeComments &&
				c === this.cCommentDelimiter
			) {
				for (;;) {
					++this.charNum;
					c = this.getChar();

					if (c === '\0') {
						newState = LexicalState.tokenEOF;
						break;
					} else if (c === '\n') {
						++this.lineNum;
						this.colNum = 1;
						startCol = 1; // Don't buffer white space
						newState = s; // tokenStart;
						break;
					}
				}
			}
			// #if DEAD_CODE
			// else if (s == stateStrLitOpen && c != this.cStringDelimiter) {
			// 	newState = s;
			// }
			// #else
			// else if (this.dictInternalStringStateToDelimiter.ContainsKey(s) && c !== this.dictInternalStringStateToDelimiter[s])
			else if (c !== this.dictInternalStringStateToDelimiter.get(s)) {
				newState = s;
			}
			// #endif
			else {
				const key = makeTokenizerTableKey(s, cSimplified);
				const possibleNewState = this.table.get(key);

				if (possibleNewState !== undefined) {
					newState = possibleNewState as number;
				} else {
					newState = LexicalState.stateError;
				}
			}

			s = newState;

			if (s === LexicalState.tokenEOF) {
				break;
			} else if (s === LexicalState.stateError) {
				s = this.recoverToken(stateList);

				if (s !== LexicalState.stateError) {
					const rewindAmount =
						this.colNum - (startCol + this.sbToken.length);

					this.charNum -= rewindAmount;
					this.colNum = startCol + this.sbToken.length;
					break; // Valid token recovered
				}

				throw new TokenizerException(
					`Lexical error at line ${this.lineNum}, column ${startCol}`,
					this.lineNum,
					startCol
				);
				/*
				Console.WriteLine("Discarding unmatched '{0}' at column {1}", str[startCol], startCol);
				wasErr = true;
				strlit.Clear();
				++startCol;
				colNum = startCol;
				tokenStr.Clear();
				s = LexicalState.stateStart;		// Start over at next unmatched char
				stateList = [s];
				 */
			} else {
				++this.charNum;

				if (c !== '\n') {
					++this.colNum;
				}

				if (s !== LexicalState.stateStart) {
					this.sbToken = this.sbToken + c;
					stateList.push(s);
				}
			}
		}

		if (this.acceptableTokens.indexOf(s) < 0) {
			throw new TokenizerException(
				`Internal error at line ${this.lineNum}, column ${startCol}: Non-token ${s} accepted`,
				this.lineNum,
				startCol
			);
		}

		// Console.WriteLine("Token: {0} ; Line {1}; Column: {2}", sbToken.ToString(), this.lineNum, startCol);

		const tokenStr = this.sbToken;
		let tokenValue: any = null;

		switch (s) {
			case LexicalState.tokenIntLit:
				tokenValue = parseInt(tokenStr, 10);
				break;

			case LexicalState.tokenFltLit:
				tokenValue = parseFloat(tokenStr);
				break;

			case LexicalState.tokenStrLit:
				tokenValue = this.getStrLitFromTokenStr(this.cStringDelimiter);
				break;

			case LexicalState.tokenEOF:
				tokenValue = 'EOF';
				break;

			default:
				// tokenValue = ExtendedGetTokenValue(ref s, tokenStr); // TODO: Pass s by reference so that the Prolog interpreter can change it in the case of single-quoted strings -> identifiers.

				// if (tokenValue == null)
				// {
				// 	tokenValue = tokenStr.ToString();
				// }

				break;
		}

		const token = new Token(s, tokenValue, this.lineNum, startCol, false);

		if (c === '\n') {
			++this.lineNum;
			this.colNum = 1;
		}

		return token;
	}

	private getChar(): string {
		if (!this.str) {
			throw new TokenizerException(
				'Tokenizer.getChar() : The input string is null.  setInputString() must be called first.'
			);
		}

		if (this.charNum >= 0 && this.charNum < this.str.length) {
			return this.str[this.charNum];
		}

		return '\0';
	}

	private recoverToken(stateList: number[]): number {
		for (let i = stateList.length - 1; i > 0; i--) {
			// if (this.acceptableTokens.Contains(stateList[i])) {
			if (this.acceptableTokens.indexOf(stateList[i]) >= 0) {
				// Keep only the first i characters of tokenStr.
				// const newTokenStr = sbToken.ToString().Substring(0, i);

				// sbToken.Clear();
				// sbToken.Append(newTokenStr);
				this.sbToken = this.sbToken.substr(0, i); // substr() or substring() ?

				// We do not need to trim the end of the stateList.
				return stateList[i];
			}
		}

		return LexicalState.stateError;
	}
}

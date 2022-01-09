// tom-weatherhead/thaw-lexical-analyzer/src/fsm-tokenizer.ts

// Started on April 8, 2014 (?)

import { IToken, LexicalState, TokenValueType } from 'thaw-interpreter-types';

import { createToken } from './token';
import { TokenizerBase } from './tokenizer-base';
import { TokenizerException } from './tokenizer-exception';

function makeTokenizerTableKey(stateParam: LexicalState, cParam: string): string {
	return `[${stateParam},${cParam}]`;
}

// A tokenizer based on a finite state machine.

export class FSMTokenizer extends TokenizerBase {
	private readonly acceptableTokens: LexicalState[] = [];
	// protected cStringDelimiter = '"'; // This must be the delimiter for tokenStrLit
	// protected readonly dictInternalStringStateToDelimiter = new Map<LexicalState, string>();
	// protected readonly dictInternalStringStateToCompletedState = new Map<
	// 	LexicalState,
	// 	LexicalState
	// >();
	// protected removeComments = false;
	private readonly commentDelimiter: string | undefined;
	private readonly table = new Map<string, LexicalState>();
	// private sbToken = '';

	private str = ''; // The string to be tokenized.
	private lineNum = 1; // Current line number; one-based
	private colNum = 1; // Current column number; one-based
	private charNum = 0; // Current index into str; zero-based

	// // private bool wasErr = false;   // Set to true if lexical error occurs

	constructor(
		options: {
			singleCharTokens?: [string, LexicalState][];
			transitions?: [LexicalState, string, LexicalState][];
			acceptStates?: LexicalState[];
			commentDelimiter?: string;
		} = {}
	) {
		super();

		if (typeof options.acceptStates !== 'undefined') {
			this.acceptableTokens = options.acceptStates;
		}

		if (typeof options.singleCharTokens !== 'undefined') {
			for (const [c, s] of options.singleCharTokens) {
				this.addTransition(LexicalState.stateStart, c, s);
				this.acceptableTokens.push(s);
			}
		}

		if (typeof options.transitions !== 'undefined') {
			for (const [s0, c, s1] of options.transitions) {
				this.addTransition(s0, c, s1);
			}
		}

		if (
			typeof options.commentDelimiter !== 'undefined' &&
			options.commentDelimiter.length === 1
		) {
			this.commentDelimiter = options.commentDelimiter;
		}

		// if (this.ls !== LanguageSelector.Protos) {
		// 	throw new TokenizerException(
		// 		'FSMTokenizer constructor: Protos is the only language currently supported by this tokenizer'
		// 	);
		// }

		// this.dictInternalStringStateToDelimiter.set(
		// 	LexicalState.stateStrLitOpen,
		// 	this.cStringDelimiter
		// );
		// this.dictInternalStringStateToCompletedState.set(
		// 	LexicalState.stateStrLitOpen,
		// 	LexicalState.tokenStrLit
		// );

		// this.addTransition(
		// 	LexicalState.stateStart,
		// 	this.cStringDelimiter,
		// 	LexicalState.stateStrLitOpen
		// );

		// this.addTransition(LexicalState.tokenIntLit, '.', LexicalState.stateIntLitDot);
		// this.addTransition(LexicalState.stateIntLitDot, '0', LexicalState.tokenFltLit);
		// this.addTransition(LexicalState.tokenFltLit, '0', LexicalState.tokenFltLit);
		// this.addTransition(
		// 	LexicalState.stateStrLitOpen,
		// 	this.cStringDelimiter,
		// 	LexicalState.tokenStrLit
		// );
		// this.addTransition(
		// 	LexicalState.tokenStrLit,
		// 	this.cStringDelimiter,
		// 	LexicalState.stateStrLitOpen
		// );
		// this.addTransition(LexicalState.tokenMinus, '>', LexicalState.tokenArrow);
		// this.addTransition(LexicalState.tokenGreater, '=', LexicalState.tokenGreaterEqual);
		//
		// 	this.acceptableTokens.push(LexicalState.token2OrBar);
		// 	this.acceptableTokens.push(LexicalState.token2Ampersand);
		// 	this.acceptableTokens.push(LexicalState.tokenLessEqual);
		//
		// 	this.addTransition(LexicalState.stateStart, '&', LexicalState.stateAmpersand);
		// 	this.addTransition(LexicalState.stateStart, '?', LexicalState.stateQuestion);
		// 	this.addTransition(LexicalState.stateStart, '!', LexicalState.tokenExclamation);
		// 	this.addTransition(LexicalState.stateStart, '$', LexicalState.stateDollar);
		// 	this.addTransition(LexicalState.stateDollar, 'A', LexicalState.tokenSkolemIdent);
		// 	this.addTransition(LexicalState.tokenSkolemIdent, 'A', LexicalState.tokenSkolemIdent);
		// 	this.addTransition(LexicalState.tokenSkolemIdent, '0', LexicalState.tokenSkolemIdent);
		// 	this.addTransition(LexicalState.tokenSkolemIdent, '_', LexicalState.tokenSkolemIdent);
		// 	this.addTransition(LexicalState.tokenLess, '=', LexicalState.tokenLessEqual);
		// 	this.addTransition(LexicalState.stateQuestion, 'A', LexicalState.tokenVariable);
		// 	this.addTransition(LexicalState.tokenVariable, 'A', LexicalState.tokenVariable);
		// 	this.addTransition(LexicalState.tokenVariable, '0', LexicalState.tokenVariable);
		// 	this.addTransition(LexicalState.tokenVariable, '_', LexicalState.tokenVariable);
		// 	this.addTransition(LexicalState.tokenOrBar, '|', LexicalState.token2OrBar);
		// 	this.addTransition(LexicalState.stateAmpersand, '&', LexicalState.token2Ampersand);
		// 	this.addTransition(LexicalState.stateStart, '@', LexicalState.stateAt);
		// 	this.addTransition(LexicalState.stateAt, 'A', LexicalState.tokenBoolIdent);
		// 	this.addTransition(LexicalState.tokenBoolIdent, 'A', LexicalState.tokenBoolIdent);
		// 	this.addTransition(LexicalState.tokenBoolIdent, '0', LexicalState.tokenBoolIdent);
		// 	this.addTransition(LexicalState.tokenBoolIdent, '_', LexicalState.tokenBoolIdent);
	}

	protected setInputString(str: string): void {
		this.str = str;
		this.lineNum = 1;
		this.colNum = 1;
		this.charNum = 0;
	}

	private addTransition(oldState: LexicalState, char: string, newState: LexicalState): void {
		const tableKey = makeTokenizerTableKey(oldState, char);

		if (this.table.has(tableKey)) {
			throw new TokenizerException(
				`Tokenizer.addTransition() : The key '${tableKey}' ([${oldState} (${LexicalState[oldState]}), '${char}']) already exists in the transition table`
			);
		}

		this.table.set(tableKey, newState);
	}

	// protected getStrLitFromTokenStr(cDelimiter: string): string {
	// 	const tokenStr2 = this.sbToken;
	//
	// 	if (!tokenStr2 || tokenStr2[0] !== cDelimiter) {
	// 		throw new TokenizerException(
	// 			'Tokenizer.getStrLitFromTokenStr() : Token string error',
	// 			this.lineNum,
	// 			this.colNum
	// 		);
	// 	}
	//
	// 	let insideQuotes = true;
	// 	let sb = '';
	//
	// 	for (let i = 1; i < tokenStr2.length; ++i) {
	// 		const c = tokenStr2[i];
	//
	// 		// This logic allows two consecutive string delimiters within the string to be interpreted as a single literal string delimiter.
	// 		if (c !== cDelimiter || !insideQuotes) {
	// 			sb = sb + c;
	// 			insideQuotes = true;
	// 		} else {
	// 			insideQuotes = false;
	// 		}
	// 	}
	//
	// 	return sb;
	// }

	// Return the next valid token read from the specified file stream.
	// Read buffered characters before reading new characters from fp.

	protected getToken(): IToken {
		// let c = ''; // A character read from getChar()
		let firstValidCharNum = NaN; // this.charNum; // The column of the first char in a token
		let s: LexicalState = LexicalState.stateStart; // Current state
		// const stateList: LexicalState[] = [s]; // List of states corresponding to not-yet-accepted characters
		let lastValidCharNum = NaN;
		let lastValidState: LexicalState | undefined;

		for (;;) {
			if (this.charNum >= this.str.length) {
				break;
			}

			let c = this.str[this.charNum];

			if (typeof this.commentDelimiter !== 'undefined' && c === this.commentDelimiter) {
				// Skip the rest of the line, up to and including the next \n
				const eol = this.str.indexOf('\n', this.charNum + 1);

				if (eol < 0) {
					// No newline found; the comment extends to the end of the string
					break;
				}

				if (!Number.isNaN(firstValidCharNum)) {
					break; // The whitespace delimits the end of the current token
				}

				this.charNum = eol + 1;
				continue; // No token has started yet, so just skip the whitespace
			}

			if (c.match(/\s/)) {
				// c is whitespace

				if (!Number.isNaN(firstValidCharNum)) {
					break; // The whitespace delimits the end of the current token
				}

				this.charNum++;

				if (c === '\n') {
					this.lineNum++;
					this.colNum = 1;
				}

				continue; // No token has started yet, so just skip the whitespace
			}

			if (Number.isNaN(firstValidCharNum)) {
				firstValidCharNum = this.charNum;
			}

			if (c.match(/[A-Za-z]/)) {
				c = 'A';
			} else if (c.match(/[0-9]/)) {
				c = '0';
			}

			const newState = this.table.get(makeTokenizerTableKey(s, c));

			if (typeof newState === 'undefined') {
				break;
			}

			s = newState;

			if (this.acceptableTokens.indexOf(s) >= 0) {
				lastValidCharNum = this.charNum;
				lastValidState = s;
			}

			this.charNum++;

			if (c === '\n') {
				this.lineNum++;
				this.colNum = 1;
			}
		}

		if (typeof lastValidState === 'undefined') {
			// No token was finished
			if (Number.isNaN(firstValidCharNum)) {
				// No token was even started
				return createToken(
					LexicalState.tokenEOF,
					'EOF',
					this.lineNum,
					this.str.length + 1,
					false
				);
			} else {
				throw new TokenizerException(
					`TokenizerException in fsm.getToken() at char ${this.charNum} ('${
						this.str[this.charNum]
					}') of '${this.str}'`,
					this.lineNum,
					this.colNum
				);
			}
		}

		// Rewind charNum (the index into this.str)
		this.charNum = lastValidCharNum + 1;
		// TODO: Rewind lineNum and colNum too

		// let tokenValue: TokenValueType = this.str.substring(firstValidCharNum, lastValidCharNum + 1);
		let tokenValue: TokenValueType = this.str.substring(firstValidCharNum, this.charNum);

		if (lastValidState === LexicalState.tokenIntLit) {
			const n = Number.parseInt(tokenValue);

			if (Number.isNaN(tokenValue)) {
				throw new TokenizerException(
					`fsm.getToken() : Number.parseInt() failed to parse '${n}'`,
					this.lineNum,
					this.colNum
				);
			}

			tokenValue = n;
		}

		return createToken(lastValidState, tokenValue, this.lineNum, firstValidCharNum + 1, false);

		// this.sbToken = '';
		//
		// for (;;) {
		// 	// Loop until valid token read
		// 	let cSimplified = '';
		//
		// 	c = this.getChar();
		//
		// 	if (c.match(/[A-Za-z]/)) {
		// 		cSimplified = 'A';
		// 	} else if (c.match(/[0-9]/)) {
		// 		cSimplified = '0';
		// 	} else {
		// 		cSimplified = c;
		// 	}
		//
		// 	const possibleCompletedState = this.dictInternalStringStateToCompletedState.get(s);
		// 	// const possibleCompletedStateIsAState = possibleCompletedState !== undefined;
		// 	const possibleCompletedStateAsAState = possibleCompletedState as LexicalState;
		//
		// 	if (
		// 		s !== LexicalState.stateStart &&
		// 		(c === '\0' ||
		// 			c === '\n' ||
		// 			(c.match(/\s/) && typeof possibleCompletedState === 'undefined'))
		// 	) {
		// 		if (typeof possibleCompletedState !== 'undefined' && (c === '\0' || c === '\n')) {
		// 			// Newline or EOF delimits string literal
		// 			s = possibleCompletedStateAsAState;
		// 		}
		//
		// 		if (c === '\n') {
		// 			++this.charNum;
		// 		}
		//
		// 		if (this.acceptableTokens.indexOf(s) >= 0) {
		// 			// Valid token has been delimited by white space
		// 			break;
		// 		} else {
		// 			// Error - try to recover
		// 			s = LexicalState.stateError;
		// 		}
		// 	}
		//
		// 	let newState: LexicalState = s;
		//
		// 	if (s === LexicalState.stateStart && c === '\0') {
		// 		newState = LexicalState.tokenEOF;
		// 	} else if (s === LexicalState.stateStart && c === '\n') {
		// 		++this.lineNum;
		// 		this.colNum = 1;
		// 		startCol = 1; // Don't buffer white space
		// 		newState = s; // tokenStart;
		// 	} else if (s === LexicalState.stateStart && c.match(/\s/)) {
		// 		++startCol; // Don't buffer white space
		// 		newState = s; // tokenStart;
		// 	} else if (
		// 		s === LexicalState.stateStart &&
		// 		this.removeComments &&
		// 		c === this.cCommentDelimiter
		// 	) {
		// 		for (;;) {
		// 			++this.charNum;
		// 			c = this.getChar();
		//
		// 			if (c === '\0') {
		// 				newState = LexicalState.tokenEOF;
		// 				break;
		// 			} else if (c === '\n') {
		// 				++this.lineNum;
		// 				this.colNum = 1;
		// 				startCol = 1; // Don't buffer white space
		// 				newState = s; // tokenStart;
		// 				break;
		// 			}
		// 		}
		// 	} else if (c !== this.dictInternalStringStateToDelimiter.get(s)) {
		// 		newState = s;
		// 	} else {
		// 		const key = makeTokenizerTableKey(s, cSimplified);
		// 		const possibleNewState = this.table.get(key);
		//
		// 		if (typeof possibleNewState !== 'undefined') {
		// 			newState = possibleNewState;
		// 		} else {
		// 			newState = LexicalState.stateError;
		// 		}
		// 	}
		//
		// 	s = newState;
		//
		// 	if (s === LexicalState.tokenEOF) {
		// 		break;
		// 	} else if (s === LexicalState.stateError) {
		// 		s = this.recoverToken(stateList);
		//
		// 		if (s !== LexicalState.stateError) {
		// 			const rewindAmount = this.colNum - (startCol + this.sbToken.length);
		//
		// 			this.charNum -= rewindAmount;
		// 			this.colNum = startCol + this.sbToken.length;
		// 			break; // Valid token recovered
		// 		}
		//
		// 		throw new TokenizerException(
		// 			`Lexical error at line ${this.lineNum}, column ${startCol}`,
		// 			this.lineNum,
		// 			startCol
		// 		);
		// 	} else {
		// 		++this.charNum;
		//
		// 		if (c !== '\n') {
		// 			++this.colNum;
		// 		}
		//
		// 		if (s !== LexicalState.stateStart) {
		// 			this.sbToken = this.sbToken + c;
		// 			stateList.push(s);
		// 		}
		// 	}
		// }
		//
		// const tokenStr = this.sbToken;
		// let tokenValue: TokenValueType;
		//
		// switch (s) {
		// 	case LexicalState.tokenIntLit:
		// 		tokenValue = parseInt(tokenStr, 10);
		// 		break;
		//
		// 	case LexicalState.tokenFltLit:
		// 		tokenValue = parseFloat(tokenStr);
		// 		break;
		//
		// 	case LexicalState.tokenStrLit:
		// 		tokenValue = this.getStrLitFromTokenStr(this.cStringDelimiter);
		// 		break;
		//
		// 	case LexicalState.tokenEOF:
		// 		tokenValue = 'EOF';
		// 		break;
		//
		// 	default:
		// 		// tokenValue = ExtendedGetTokenValue(ref s, tokenStr); // TODO: Pass s by reference so that the Prolog interpreter can change it in the case of single-quoted strings -> identifiers.
		//
		// 		// if (tokenValue == null)
		// 		// {
		// 		// 	tokenValue = tokenStr.ToString();
		// 		// }
		//
		// 		break;
		// }
		//
		// const token = createToken(s, tokenValue, this.lineNum, startCol, false);
		//
		// if (c === '\n') {
		// 	++this.lineNum;
		// 	this.colNum = 1;
		// }
		//
		// return token;
	}
}

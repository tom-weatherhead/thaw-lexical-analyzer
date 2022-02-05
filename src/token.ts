// tom-weatherhead/thaw-lexical-analyzer/src/token.ts

import { IToken, LexicalState, TokenValueType } from 'thaw-interpreter-types';

import { TokenizerException } from './tokenizer-exception';

// export type TokenValueType = number | string | undefined;

class Token implements IToken {
	constructor(
		public tokenType: LexicalState,
		public readonly tokenValue: TokenValueType,
		public readonly line: number,
		public readonly column: number,
		public readonly isQuoted: boolean /* = false */
	) {}

	public cloneWithNewLineNumber(line: number): IToken {
		return new Token(this.tokenType, this.tokenValue, line, this.column, this.isQuoted);
	}

	public getValueAsNumber(): number {
		if (typeof this.tokenValue !== 'number') {
			throw new TokenizerException(
				`Token value '${this.tokenValue}' (type ${typeof this
					.tokenValue}) is not a number.`,
				this.line,
				this.column
			);
		}

		return this.tokenValue as number;
	}
}

export function createToken(
	tokenType: LexicalState,
	tokenValue: TokenValueType,
	line: number,
	column: number,
	isQuoted = false
): IToken {
	return new Token(tokenType, tokenValue, line, column, isQuoted);
}

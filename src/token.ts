// tom-weatherhead/thaw-lexical-analyzer/src/token.ts

import { TokenizerException } from './tokenizer-exception';

export type TokenValueType = number | string | undefined;

export class Token {
	public tokenType: number;
	public readonly tokenValue: TokenValueType;
	public readonly line: number;
	public readonly column: number;
	public readonly isQuoted: boolean;

	constructor(
		tt: number,
		tv: TokenValueType,
		line: number,
		col: number,
		isQuoted: boolean /* = false */
	) {
		this.tokenType = tt;
		this.tokenValue = tv;
		this.line = line;
		this.column = col;
		this.isQuoted = isQuoted;
	}

	public cloneWithNewLineNumber(line: number): Token {
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

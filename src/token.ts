// tom-weatherhead/thaw-lexical-analyzer/src/token.ts

'use strict';

export class Token {
	public tokenType: number;
	public readonly tokenValue: any;
	public readonly line: number;
	public readonly column: number;
	public readonly isQuoted: boolean;

	constructor(
		tt: number,
		tv: any,
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
		return new Token(
			this.tokenType,
			this.tokenValue,
			line,
			this.column,
			this.isQuoted
		);
	}
}

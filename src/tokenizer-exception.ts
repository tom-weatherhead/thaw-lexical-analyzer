// tom-weatherhead/thaw-lexical-analyzer/src/tokenizer-exception.ts

export class TokenizerException {
	public readonly message: string;
	public readonly line: number;
	public readonly column: number;

	constructor(message: string, line = 0, col = 0) {
		this.message = message;
		this.line = line;
		this.column = col;
	}
}

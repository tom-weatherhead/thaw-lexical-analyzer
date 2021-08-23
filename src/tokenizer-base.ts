// tom-weatherhead/thaw-lexical-analyzer/src/tokenizer-base.ts

import { IToken, ITokenizer, LexicalState } from 'thaw-interpreter-types';

// import { ITokenizer } from './itokenizer';
// import { LexicalState } from './lexical-states';
// import { Token } from './token';

export abstract class TokenizerBase implements ITokenizer {
	public tokenize(str: string): IToken[] {
		const tokenList: IToken[] = [];
		let token: IToken;

		this.setInputString(str);

		do {
			token = this.getToken();
			tokenList.push(token);
		} while (token.tokenType !== LexicalState.tokenEOF);

		return tokenList;
	}

	protected abstract setInputString(str: string): void;

	protected abstract getToken(): IToken;
}

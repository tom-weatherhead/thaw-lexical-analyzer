// tom-weatherhead/thaw-lexical-analyzer/src/itokenizer.ts

import { Token } from './token';

export interface ITokenizer {
	tokenize(str: string): Token[];
}

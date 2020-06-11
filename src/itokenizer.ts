// tom-weatherhead/thaw-lexical-analyzer/src/itokenizer.ts

'use strict';

import { Token } from './token';

export interface ITokenizer {
	tokenize(str: string): Token[];
}

// tom-weatherhead/thaw-lexical-analyzer/test/fsm-tokenizer/protos.test.ts

'use strict';

import { LanguageSelector, LexicalAnalyzerSelector } from 'thaw-interpreter-types';

import { createTokenizer } from '../..';

test('Create Protos tokenizer', () => {
	// Arrange
	// Act
	const actualValue = createTokenizer(
		LexicalAnalyzerSelector.FiniteStateMachine,
		LanguageSelector.Protos
	);

	// Assert
	expect(actualValue).toBeTruthy();
});

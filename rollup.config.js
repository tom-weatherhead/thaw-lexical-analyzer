// rollup.config.js

/**
 * Copyright (c) Tom Weatherhead. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

import { terser } from 'rollup-plugin-terser';

export default {
	input: './dist/lib/main.js',
	output: [
		{
			file: 'dist/thaw-lexical-analyzer.cjs.js',
			format: 'cjs',
			exports: 'named'
		},
		{
			file: 'dist/thaw-lexical-analyzer.esm.js',
			format: 'es',
			esModule: true,
			compact: true,
			plugins: [terser()]
		},
		{
			file: 'dist/thaw-lexical-analyzer.js',
			name: 'thaw-lexical-analyzer',
			format: 'umd',
			compact: true,
			plugins: [terser()]
		}
	],
	context: 'this'
};

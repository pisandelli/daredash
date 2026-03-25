import { resolve } from 'path';
import { mergeTokenSource } from './src/utils/token-merger';

async function test() {
  const dir = resolve('./runtime/assets/styles/tokens/default-theme');
  try {
    const tokens = await mergeTokenSource(dir);
    console.log(JSON.stringify(tokens, null, 2));
  } catch (e) {
    console.error(e);
  }
}

test();

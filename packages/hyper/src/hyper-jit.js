
import { createBlock } from './block/block.js'
import { tokenize } from './compiler/tokenizer.js'
import { parse } from './compiler/ast.js'

export function createApp(template, data, opts={}) {
  const lib = parse(tokenize(template))
  const more = opts.lib || []
  const { update, mount } = createBlock(lib[0], data, { lib: [...lib, ...more] })
  return { update, mount }
}

import { parseInline, ESCAPED } from './parse-inline.js'
import { renderTag } from './render-tag.js'
import { elem } from './document.js'

export function renderToken(token, opts={}) {
  const { data={} } = opts
  const { text } = token

  return text ? text :
    token.is_format ? formatText(token, opts) :
    token.is_var ? (data[token.name] || '') :
    token.is_image ? renderImage(token) :
    token.is_tag ? renderTag(token, opts) :
    token.href ? renderLink(token, opts) :
    ''
}

function formatText({tag, body }, opts) {
  const html = tag == 'code' ? renderCode(body) : renderInline(body, opts)
  return tag == 'EM' ? elem('em', elem('strong', html)) : elem(tag, html)
}

function renderCode(code) {
  return code.replace(/[<>]/g, char => ESCAPED[char])
}

function renderImage(img) {
  const { title } = img
  return elem('img', { src: img.href, alt: img.label, title, loading: 'lazy' })
}

function renderLink(link, opts) {
  const { href, title, is_footnote } = link
  const { reflinks={}, footnotes=[] } = opts
  const url = reflinks[href] || { href }

  let label = renderInline(link.label, opts)

  // footnotes
  if (is_footnote) {
    const index = footnotes.findIndex(el => el == href)
    if (index >= 0) label += elem('sup', { role: 'doc-noteref' }, index + 1)
  }

  return elem('a', { title, ...url, rel: is_footnote ? 'footnote' : null }, label)
}

export function renderTokens(tokens, opts) {
  return tokens.map(token => renderToken(token, opts)).join('').trim()
}

export function renderInline(str, opts) {
  return str ? renderTokens(parseInline(str), opts) : ''
}




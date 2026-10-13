import assert from 'node:assert/strict'
import {describe, it} from 'node:test'
import {
  URL_SLUG_PATTERN_MESSAGE,
  isValidUrlSlug,
  slugifyForUrl,
  validateNoEnUrlSlug,
} from './urlSlug'

const slugValue = (no?: string, en?: string) =>
  [
    no !== undefined && {_key: 'no', language: 'no', value: {_type: 'slug', current: no}},
    en !== undefined && {_key: 'en', language: 'en', value: {_type: 'slug', current: en}},
  ].filter(Boolean)

describe('isValidUrlSlug', () => {
  it('accepts lowercase a–z, digits and hyphens', () => {
    assert.equal(isValidUrlSlug('hor-vare-spesialister-i-podcaster'), true)
    assert.equal(isValidUrlSlug('hear-our-specialists-on-podcasts'), true)
    assert.equal(isValidUrlSlug('top-10-tips-2026'), true)
  })

  it('rejects spaces, uppercase, æøå and other characters', () => {
    assert.equal(isValidUrlSlug('Hør våre spesialister i podcast'), false)
    assert.equal(isValidUrlSlug('hor vare'), false)
    assert.equal(isValidUrlSlug('Hor-vare'), false)
    assert.equal(isValidUrlSlug('hør-våre'), false)
    assert.equal(isValidUrlSlug('ærlig'), false)
    assert.equal(isValidUrlSlug('a_b'), false)
    assert.equal(isValidUrlSlug('a/b'), false)
    assert.equal(isValidUrlSlug(''), false)
  })
})

describe('validateNoEnUrlSlug', () => {
  it('keeps the existing required NO + EN checks', () => {
    assert.equal(validateNoEnUrlSlug(undefined), 'URL slug (Norwegian) is required')
    assert.equal(validateNoEnUrlSlug(slugValue(undefined, 'x')), 'URL slug (Norwegian) is required')
    assert.equal(validateNoEnUrlSlug(slugValue('x')), 'URL slug (English) is required')
  })

  it('passes valid NO + EN slugs', () => {
    assert.equal(
      validateNoEnUrlSlug(
        slugValue('hor-vare-spesialister-i-podcaster', 'hear-our-specialists-on-podcasts'),
      ),
      true,
    )
  })

  it('fails with the Norwegian message for an invalid NO slug', () => {
    const result = validateNoEnUrlSlug(
      slugValue('Hør våre spesialister i podcast', 'hear-our-specialists-on-podcasts'),
    )
    assert.equal(typeof result, 'string')
    assert.ok((result as string).startsWith(URL_SLUG_PATTERN_MESSAGE))
    assert.ok((result as string).includes('(no:'))
  })

  it('fails for an invalid EN slug too', () => {
    const result = validateNoEnUrlSlug(slugValue('hor-vare', 'Hear Our Specialists'))
    assert.equal(typeof result, 'string')
    assert.ok((result as string).includes('(en:'))
  })

  it('fails on a single space, uppercase letter or ø', () => {
    for (const bad of ['hor vare', 'Hor-vare', 'hør-vare']) {
      assert.notEqual(validateNoEnUrlSlug(slugValue(bad, 'ok')), true, bad)
    }
  })
})

describe('slugifyForUrl (Studio Generate)', () => {
  it('produces compliant slugs and transliterates æ/ø/å', () => {
    assert.equal(slugifyForUrl('Hør våre spesialister i podcaster'), 'hor-vare-spesialister-i-podcaster')
    assert.equal(slugifyForUrl('Ærlig talt – Ål og Øl'), 'aerlig-talt-al-og-ol')
    assert.equal(slugifyForUrl('Hear our specialists on podcasts'), 'hear-our-specialists-on-podcasts')
    for (const input of ['Kne & Hofte', "Women's Health", '  Ünïcödé  Tëst!! ', 'ÆØÅ æøå']) {
      assert.equal(isValidUrlSlug(slugifyForUrl(input)), true, input)
    }
  })
})

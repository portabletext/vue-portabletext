import { h } from 'vue';
import { describe, expect, test } from 'vitest';
import { mount } from '@vue/test-utils';
import { PortableText, PortableTextProps } from '../src';

const render = (props: PortableTextProps) => mount(PortableText, { props }).html({ raw: true });

test('can override unknown mark component', () => {
  const result = render({
    value: {
      _type: 'block',
      markDefs: [{ _key: 'unknown-mark', _type: 'unknown-mark' }],
      children: [
        { _type: 'span', marks: ['unknown-deco'], text: 'simple' },
        { _type: 'span', marks: ['unknown-mark'], text: 'advanced' },
      ],
    },
    components: {
      unknownMark: ({ markType }, { slots }) => {
        return h('span', { class: 'unknown' }, [`Unknown (${markType}): `, slots.default?.()]);
      },
    },
  });
  expect(result).toBe(
    '<p><span class="unknown">Unknown (unknown-deco): simple</span><span class="unknown">Unknown (unknown-mark): advanced</span></p>',
  );
});

describe('default link mark', () => {
  const renderLink = (href: string) =>
    render({
      value: {
        _type: 'block',
        markDefs: [{ _key: 'l', _type: 'link', href }],
        children: [{ _type: 'span', marks: ['l'], text: 'click' }],
      },
    });

  test.each([
    'https://example.com/',
    'http://example.com/',
    'mailto:me@example.com',
    'tel:+4712345678',
    '#section',
    '/some/path',
    'relative/path',
    '//example.com/protocol-relative',
    'search?query=author:espen',
  ])('links safe href %s', (href) => {
    expect(renderLink(href)).toBe(`<p><a href="${href}">click</a></p>`);
  });

  test.each([
    'javascript:alert(1)',
    ' JavaScript:alert(1)',
    'data:text/html,<script>alert(1)</script>',
    'vbscript:msgbox(1)',
  ])('renders unsafe href %s as plain text', (href) => {
    expect(renderLink(href)).toBe('<p>click</p>');
  });
});

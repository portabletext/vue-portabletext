import type { PortableTextBlock } from '@portabletext/types';

const input: PortableTextBlock[] = [
  {
    _type: 'block',
    _key: 'level-3-item-1',
    style: 'normal',
    level: 3,
    listItem: 'number',
    markDefs: [],
    children: [
      {
        _type: 'span',
        text: 'Level 3, item 1',
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'level-1-item-2',
    style: 'normal',
    level: 1,
    listItem: 'number',
    markDefs: [],
    children: [
      {
        _type: 'span',
        text: 'Level 1, item 2',
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'level-1-bullet',
    style: 'normal',
    level: 1,
    listItem: 'bullet',
    markDefs: [],
    children: [
      {
        _type: 'span',
        text: 'Level 1 bullet',
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'level-4-bullet',
    style: 'normal',
    level: 4,
    listItem: 'bullet',
    markDefs: [],
    children: [
      {
        _type: 'span',
        text: 'Level 4 bullet',
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'level-1-bullet-again',
    style: 'normal',
    level: 1,
    listItem: 'bullet',
    markDefs: [],
    children: [
      {
        _type: 'span',
        text: 'Level 1 bullet again',
        marks: [],
      },
    ],
  },
];

export default {
  input,
  output: [
    // Starts at level 3: two generated ancestor lists, each in an empty list item
    '<ol>',
    '<li>',
    '<ol>',
    '<li>',
    '<ol>',
    '<li>Level 3, item 1</li>',
    '</ol>',
    '</li>',
    '</ol>',
    '</li>',
    '<li>Level 1, item 2</li>',
    '</ol>',

    // Level 1 -> 4: levels 2 and 3 are generated as empty list items
    '<ul>',
    '<li>',
    'Level 1 bullet',
    '<ul>',
    '<li>',
    '<ul>',
    '<li>',
    '<ul>',
    '<li>Level 4 bullet</li>',
    '</ul>',
    '</li>',
    '</ul>',
    '</li>',
    '</ul>',
    '</li>',
    '<li>Level 1 bullet again</li>',
    '</ul>',
  ].join(''),
};

import type { Component as VueComponent, VNode } from 'vue';
import type {
  ToolkitListNestMode,
  ToolkitPortableTextList,
  ToolkitPortableTextListItem,
} from '@portabletext/toolkit';
import type {
  ArbitraryTypedObject,
  PortableTextBlock,
  PortableTextBlockStyle,
  PortableTextListItemBlock,
  PortableTextListItemType,
  TypedObject,
} from '@portabletext/types';

export type VueNode = undefined | VNode | string | Array<undefined | VNode | string>;

/**
 * Properties for the Portable Text Vue component
 *
 * @template B Types that can appear in the array of blocks
 */
export interface PortableTextProps<
  B extends TypedObject = PortableTextBlock | ArbitraryTypedObject,
> {
  /**
   * One or more blocks to render
   */
  value: B | B[];

  /**
   * Vue components to use for rendering
   */
  components?: Partial<PortableTextVueComponents>;

  /**
   * Function to call when encountering unknown unknown types, eg blocks, marks,
   * block style, list styles without an associated Vue component.
   *
   * Will print a warning message to the console by default.
   * Pass `false` to disable.
   */
  onMissingComponent?: MissingComponentHandler | false;

  /**
   * Determines whether or not lists are nested inside of list items (`html`)
   * or as a direct child of another list (`direct` - for Vue Native)
   *
   * You rarely (if ever) need/want to customize this
   */
  listNestingMode?: ToolkitListNestMode;
}

/**
 * Generic type for portable text rendering components that takes blocks/inline blocks
 *
 * @template N Node types we expect to be rendering (`PortableTextBlock` should usually be part of this)
 */
export type PortableTextComponent<N> = VueComponent<PortableTextComponentProps<N>>;

/**
 * Vue component type for rendering portable text blocks (paragraphs, headings, blockquotes etc)
 */
export type PortableTextBlockComponent = PortableTextComponent<PortableTextBlock>;

/**
 * Vue component type for rendering (virtual, not part of the spec) portable text lists
 */
export type PortableTextListComponent = PortableTextComponent<VuePortableTextList>;

/**
 * Vue component type for rendering portable text list items
 */
export type PortableTextListItemComponent = PortableTextComponent<PortableTextListItemBlock>;

/**
 * Vue component type for rendering portable text marks and/or decorators
 *
 * @template M The mark type we expect
 */
export type PortableTextMarkComponent<M extends TypedObject = any> = VueComponent<
  PortableTextMarkComponentProps<M>
>;

export type PortableTextTypeComponent<V extends TypedObject = any> = VueComponent<
  PortableTextComponentProps<V>
>;

/**
 * Object defining the different Vue components to use for rendering various aspects
 * of Portable Text and user-provided types, where only the overrides needs to be provided.
 */
export type PortableTextComponents = Partial<PortableTextVueComponents>;

/**
 * Object definining the different Vue components to use for rendering various aspects
 * of Portable Text and user-provided types.
 */
export interface PortableTextVueComponents {
  /**
   * Object of Vue components that renders different types of objects that might appear
   * both as part of the blocks array, or as inline objects _inside_ of a block,
   * alongside text spans.
   *
   * Use the `isInline` property to check whether or not this is an inline object or a block
   *
   * The object has the shape `{typeName: VueComponent}`, where `typeName` is the value set
   * in individual `_type` attributes.
   */
  types: Record<string, PortableTextTypeComponent | undefined>;

  /**
   * Object of Vue components that renders different types of marks that might appear in spans.
   *
   * The object has the shape `{markName: VueComponent}`, where `markName` is the value set
   * in individual `_type` attributes, values being stored in the parent blocks `markDefs`.
   */
  marks: Record<string, PortableTextMarkComponent | undefined>;

  /**
   * Object of Vue components that renders blocks with different `style` properties.
   *
   * The object has the shape `{styleName: VueComponent}`, where `styleName` is the value set
   * in individual `style` attributes on blocks.
   *
   * Can also be set to a single Vue component, which would handle block styles of _any_ type.
   */
  block:
    | Record<PortableTextBlockStyle, PortableTextBlockComponent | undefined>
    | PortableTextBlockComponent;

  /**
   * Object of Vue components used to render lists of different types (bulleted vs numbered,
   * for instance, which by default is `<ul>` and `<ol>`, respectively)
   *
   * There is no actual "list" node type in the Portable Text specification, but a series of
   * list item blocks with the same `level` and `listItem` properties will be grouped into a
   * virtual one inside of this library.
   *
   * Can also be set to a single Vue component, which would handle lists of _any_ type.
   */
  list:
    | Record<PortableTextListItemType, PortableTextListComponent | undefined>
    | PortableTextListComponent;

  /**
   * Object of Vue components used to render different list item styles.
   *
   * The object has the shape `{listItemType: VueComponent}`, where `listItemType` is the value
   * set in individual `listItem` attributes on blocks.
   *
   * Can also be set to a single Vue component, which would handle list items of _any_ type.
   */
  listItem:
    | Record<PortableTextListItemType, PortableTextListItemComponent | undefined>
    | PortableTextListItemComponent;

  /**
   * Component to use for rendering "hard breaks", eg `\n` inside of text spans
   * Will by default render a `<br />`. Pass `false` to render as-is (`\n`)
   */
  hardBreak: VueComponent<{ key: any }> | false;

  /**
   * Vue component used when encountering a mark type there is no registered component for
   * in the `components.marks` prop.
   */
  unknownMark: PortableTextMarkComponent;

  /**
   * Vue component used when encountering an object type there is no registered component for
   * in the `components.types` prop.
   */
  unknownType: PortableTextComponent<UnknownNodeType>;

  /**
   * Vue component used when encountering a block style there is no registered component for
   * in the `components.block` prop. Only used if `components.block` is an object.
   */
  unknownBlockStyle: PortableTextComponent<PortableTextBlock>;

  /**
   * Vue component used when encountering a list style there is no registered component for
   * in the `components.list` prop. Only used if `components.list` is an object.
   */
  unknownList: PortableTextComponent<VuePortableTextList>;

  /**
   * Vue component used when encountering a list item style there is no registered component for
   * in the `components.listItem` prop. Only used if `components.listItem` is an object.
   */
  unknownListItem: PortableTextComponent<PortableTextListItemBlock>;
}

/**
 * Props received by most Portable Text components
 *
 * @template T Type of data this component will receive in its `value` property
 */
export interface PortableTextComponentProps<T> {
  /**
   * Data associated with this portable text node, eg the raw JSON value of a block/type
   */
  value: T;

  /**
   * Index within its parent
   */
  index: number;

  /**
   * Whether or not this node is "inline" - ie as a child of a text block,
   * alongside text spans, or a block in and of itself.
   */
  isInline: boolean;

  /**
   * Function used to render any node that might appear in a portable text array or block,
   * including virtual "toolkit"-nodes like lists and nested spans. You will rarely need
   * to use this.
   */
  renderNode: NodeRenderer;
}

/**
 * Props received by “flattened” Portable Text Components
 *
 * @template T Type of data this component will receive in its `value` property
 */
export type PortableTextComponentFlattenedProps<T extends Record<string, any>> = Omit<
  PortableTextComponentProps<T>,
  'value'
> &
  T;

/**
 * Props received by Portable Text mark rendering components
 *
 * @template M Shape describing the data associated with this mark, if it is an annotation
 */
export interface PortableTextMarkComponentProps<M extends TypedObject = ArbitraryTypedObject> {
  /**
   * Mark definition, eg the actual data of the annotation. If the mark is a simple decorator, this will be `undefined`
   */
  value?: M;

  /**
   * Text content of this mark
   */
  text: string;

  /**
   * Key for this mark. The same key can be used amongst multiple text spans within the same block, so don't rely on this for Vue keys.
   */
  markKey?: string;

  /**
   * Type of mark - ie value of `_type` in the case of annotations, or the name of the decorator otherwise - eg `em`, `italic`.
   */
  markType: string;

  /**
   * Function used to render any node that might appear in a portable text array or block,
   * including virtual "toolkit"-nodes like lists and nested spans. You will rarely need
   * to use this.
   */
  renderNode: NodeRenderer;
}

/**
 * Any node type that we can't identify - eg it has an `_type`,
 * but we don't know anything about its other properties
 */
export type UnknownNodeType = { [key: string]: unknown; _type: string } | TypedObject;

/**
 * Function that renders any node that might appear in a portable text array or block,
 * including virtual "toolkit"-nodes like lists and nested spans
 */
export type NodeRenderer = <T extends TypedObject>(options: Serializable<T>) => VueNode;

export type NodeType = 'block' | 'mark' | 'blockStyle' | 'listStyle' | 'listItemStyle';

export type MissingComponentHandler = (
  message: string,
  options: { type: string; nodeType: NodeType },
) => void;

export interface Serializable<T> {
  node: T;
  index: number;
  isInline: boolean;
  renderNode: NodeRenderer;
}

export interface SerializedBlock {
  _key: string;
  children: VueNode;
  index: number;
  isInline: boolean;
  node: PortableTextBlock | PortableTextListItemBlock;
}

// Re-exporting these as we don't want to refer to "toolkit" outside of this module

/**
 * A virtual "list" node for Portable Text - not strictly part of Portable Text,
 * but generated by this library to ease the rendering of lists in HTML etc
 */
export type VuePortableTextList = ToolkitPortableTextList;

/**
 * A virtual "list item" node for Portable Text - not strictly any different from a
 * regular Portable Text Block, but we can guarantee that it has a `listItem` property.
 */
export type VuePortableTextListItem = ToolkitPortableTextListItem;

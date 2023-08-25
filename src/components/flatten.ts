import { h, type Component } from 'vue';
import type { PortableTextComponentProps } from '../types';

/**
 * Component wrapper function to flatten props
 * @experimental
 * @todo inherit component props using generics
 */
export const flattenProps =
  <T>(component: Component, includeInternalProps = false) =>
  (props: PortableTextComponentProps<T>) => {
    if (includeInternalProps) {
      const { value, ...rest } = props;
      return h(component, { ...rest, ...value });
    }
    return h(component, { ...props.value });
  };

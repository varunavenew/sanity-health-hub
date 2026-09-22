import {type BooleanInputProps} from "sanity";

/**
 * Studio switch that treats an unset value as on (same as the website).
 * New specialists still get initialValue: true.
 */
export function DefaultOnBooleanInput(props: BooleanInputProps) {
  return props.renderDefault({
    ...props,
    value: props.value !== false,
  });
}

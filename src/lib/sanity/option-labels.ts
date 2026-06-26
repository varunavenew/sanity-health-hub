export type OptionLabelRow = {
  value?: string;
  label?: string;
};

export function optionLabelMap(options?: OptionLabelRow[] | null): Record<string, string> {
  if (!options?.length) return {};
  return Object.fromEntries(
    options
      .filter((row) => row.value && row.label)
      .map((row) => [row.value!, row.label!]),
  );
}

export function optionLabel(
  map: Record<string, string>,
  value: string | undefined,
): string {
  if (!value) return "";
  return map[value] ?? "";
}

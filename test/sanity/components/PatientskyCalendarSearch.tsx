import { FC, useCallback, useEffect, useState } from "react";
import { PatchEvent, TextInputProps, set, useFormValue, unset } from "sanity";
import { Stack, Text, Autocomplete, BaseAutocompleteOption } from "@sanity/ui";
import { throwOnNotOk } from "../../../../src/lib/throwOnNotOk";

interface PatientskyCalendar {
  id: string;
  containsSelectedTimeslotTypes: boolean;
  name: string;
  sortingPosition: number;
  ownedByDepartment: null | string;
}

export const PatientskyCalendarSearch: FC<TextInputProps> = (props) => {
  const [options, setOptions] =
    useState<(BaseAutocompleteOption & { payload: PatientskyCalendar })[]>();
  const docId = String(useFormValue(["_id"]));

  useEffect(() => {
    if (!docId) {
      setOptions(undefined);
      return;
    }
    const url = new URL("/api/booking/no/external", location.origin);
    url.searchParams.set("id", docId);
    fetch(url)
      .then(throwOnNotOk<{ calendars?: PatientskyCalendar[] }>)
      .then((data) => data?.calendars)
      .then((calendars) => {
        if (calendars) {
          setOptions(calendars.map((payload) => ({ value: payload.name, payload })));
        } else {
          setOptions(undefined);
        }
      })
      .catch((e) => {
        console.warn(e);
        setOptions(undefined);
      });
  }, [docId]);

  const handleSelectCalendar = useCallback(
    (value: string) => {
      const selectedOption = options?.find((opt) => opt.value === value);
      if (selectedOption) {
        props.onChange(PatchEvent.from(set(selectedOption.payload.id)));
      } else {
        props.onChange(PatchEvent.from(unset()));
      }
    },
    [options, props],
  );

  return (
    <Stack space={2}>
      {props.renderDefault(props)}
      {options ? (
        <Autocomplete
          openButton
          placeholder="Type to search for specialist in Patientsky"
          id={`${props.id}-search-input`}
          options={options}
          onSelect={handleSelectCalendar}
        />
      ) : (
        <Text muted size={1}>
          Select a clinic with a serviceProviderID to search for specialists
        </Text>
      )}
    </Stack>
  );
};

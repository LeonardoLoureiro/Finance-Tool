"use client";

import { useMemo } from "react";
import { SingleValue } from "react-select";
import CreateableSelect from "react-select/creatable";

type Props = {
  onChange: (value?: string) => void;
  onCreate?: (value: string) => void;
  options?: { label: string; value: string }[];
  value?: string | null | undefined;
  disabled?: boolean;
  placeholder?: string;
}

export const Select = ({
  value,
  onChange,
  disabled,
  onCreate,
  options = [],
  placeholder
}: Props) => {

  // only ever select one
  const onSelect = (
    option: SingleValue<{ label: string; value: string }>
  ) => {
    onChange(option?.value);
  }

  // find the selected value from the options, so that it can be displayed in the select input
  const formattedValue = useMemo(() => {
    return options.find((option) => option.value === value);
  }, [options, value]);


  return (
    <CreateableSelect
      placeholder={placeholder}
      className="text-sm h-8"
      styles={{
        control: (base) => ({
          ...base,
          borderColor: "#e2eaf0",
          ":hover": {
            borderColor: "#e2eaf0",
          }
        })
      }}
      value={formattedValue}
      onChange={onSelect}
      options={options}
      onCreateOption={onCreate}
      isDisabled={disabled}
    />
  )
}
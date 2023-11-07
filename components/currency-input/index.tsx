import React, { useState, useEffect, InputHTMLAttributes } from "react";
import { Input } from "../ui/input";

type PriceInputProps = {
  value?: number;
  onValueChange: (newValue: number | null | undefined | string) => void;
  allowNegativeValue?: boolean;
} & InputHTMLAttributes<HTMLInputElement>;

export const CurrencyInput: React.FC<PriceInputProps> = ({
  value,
  onValueChange,
  allowNegativeValue = false,
}) => {
  const [inputValue, setInputValue] = useState<string>(
    formatValue(Number(value) ?? "")
  );

  useEffect(() => {
    setInputValue(formatValue(Number(value) ?? ""));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskRegex = allowNegativeValue ? /[^-?\d]/g : /\D/g;

    const newValue = e.target.value?.replace(maskRegex, "");
    setInputValue(newValue ? formatValue(parseFloat(newValue) / 100) : "");

    const newValueIs = allowNegativeValue ? null : undefined;
    onValueChange(
      String(newValue ? parseFloat(String(newValue)) / 100 : newValueIs)
    );
  };

  function formatValue(value: number): string {
    const numberValue = parseFloat(String(value));
    if (isNaN(numberValue)) {
      return "";
    }
    const formattedValue = allowNegativeValue
      ? Math.abs(numberValue).toFixed(2).replace(".", ",")
      : typeof value === "number"
      ? value.toFixed(2).replace(".", ",")
      : "";

    const [integerPart, decimalPart] = formattedValue.split(",");

    const formattedIntegerPart = integerPart.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      "."
    );

    return allowNegativeValue
      ? `${numberValue < 0 ? "-" : ""}${formattedIntegerPart},${decimalPart}`
      : `${formattedIntegerPart},${decimalPart}`;
  }

  console.log(value);
  return (
    <Input
      type="text"
      value={inputValue ?? ""}
      onChange={handleChange}
      placeholder="R$ 0,00"
    />
  );
};

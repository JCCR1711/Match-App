export interface PhoneCountryFormat {
  callingCode: string;
  nationalLength: number;
  groups: readonly number[];
}

export const PERU_PHONE_FORMAT: PhoneCountryFormat = {
  callingCode: "+51",
  nationalLength: 9,
  groups: [3, 3, 3],
};

const phoneDigits = (value: string) => value.replace(/\D/g, "");

const nationalDigits = (value: string, country: PhoneCountryFormat) => {
  const digits = phoneDigits(value);
  const callingCode = phoneDigits(country.callingCode);
  const withoutCallingCode = digits.length > country.nationalLength && digits.startsWith(callingCode)
    ? digits.slice(callingCode.length)
    : digits;

  return withoutCallingCode.slice(0, country.nationalLength);
};

export const formatNationalPhone = (value: string, country: PhoneCountryFormat) => {
  const digits = nationalDigits(value, country);
  const groups: string[] = [];
  let offset = 0;

  for (const size of country.groups) {
    const group = digits.slice(offset, offset + size);
    if (!group) break;
    groups.push(group);
    offset += size;
  }

  return groups.join(" ");
};

export const isValidNationalPhone = (value: string, country: PhoneCountryFormat) => (
  nationalDigits(value, country).length === country.nationalLength
);

export const toInternationalPhone = (value: string, country: PhoneCountryFormat) => (
  `${country.callingCode}${nationalDigits(value, country)}`
);

import type { AsYouType, CountryCode, PhoneNumber } from 'libphonenumber-js';
import { useEffect, useState } from 'react';

type ParsePhoneNumber = (text: string, defaultCountry?: CountryCode | undefined) => PhoneNumber;

const loadModule = async () => {
  const { AsYouType, parsePhoneNumber } = await import('libphonenumber-js');

  return { AsYouType, parsePhoneNumber };
};

export const useFormattedPhoneNumber = () => {
  const [formatNumber, setFormatNumber] = useState<AsYouType>();
  const [parsePhoneNumber, setParsePhoneNumber] = useState<ParsePhoneNumber>();

  useEffect(() => {
    loadModule().then(({ AsYouType, parsePhoneNumber }) => {
      const asYouType = new AsYouType('US');

      setFormatNumber(asYouType);
      setParsePhoneNumber(() => parsePhoneNumber);
    });
  }, []);

  return { formatNumber, parsePhoneNumber };
};

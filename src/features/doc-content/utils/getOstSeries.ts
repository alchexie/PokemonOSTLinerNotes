const SERIES_TO_OST: Record<string, string> = {
  PT: 'B2W2',
  DPPT: 'DP',
  E: 'B2W2',
  RSE: 'RS',
  GSC: 'HGSS',
  Y: 'LPLE',
  RGBY: 'RG',
};

export const getOstSeries = (input: string): string => {
  input = input.toLocaleUpperCase();
  return (SERIES_TO_OST[input] ?? input).toLocaleLowerCase();
};

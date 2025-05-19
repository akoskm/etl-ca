export const FIELD_NAMES = [
  'Name',
  'Address',
  'Postcode',
  'Phone',
  'Credit Limit',
  'Birthday',
];

export type Row = {
  // K in typeof FIELD_NAMES[number] will ensure keys are from FIELD_NAMES
  [K in (typeof FIELD_NAMES)[number]]: string;
};

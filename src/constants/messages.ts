export const COMMON_MESSAGES = {
  LOADING: 'Loading...',
  CHECKING_SESSION: 'Checking session...',
  ALL_STATUSES: 'All statuses',
  EMPTY: 'Nothing found',
  NO_ACCESS: 'You do not have permission to open this page.',
  NOT_FOUND: 'Page not found',
  UNKNOWN_ERROR: 'Something went wrong. Try again.',
  REQUEST_FAILED: 'Request failed',
  NETWORK_ERROR: 'Cannot reach the server.',
} as const;

export const AUTH_MESSAGES = {
  LOGIN: {
    USERNAME_REQUIRED: 'Enter your username.',
    PASSWORD_REQUIRED: 'Enter your password.',
  },
  VERIFY: {
    CODE_REQUIRED: 'Enter the code.',
    CODE_FORMAT: 'The code must be 6 digits.',
  },
} as const;

export const FORM_MESSAGES = {
  REQUIRED: 'This field is required.',
  NUMBER: 'Enter a number.',
  INTEGER: 'Enter a whole number.',
  POSITIVE: 'Must be greater than 0.',
  NOT_NEGATIVE: 'Cannot be negative.',
  EMAIL: 'Enter a valid email.',
  HEX_COLOR: 'Enter a colour like #1a2b3c.',
  IPV4: 'Enter a valid IPv4 address.',
  COUNTRY_CODE: 'Enter a 2-letter country code.',
  PASSWORD_TOO_SHORT: 'Password is too short.',
  LATITUDE: 'Latitude must be between -90 and 90.',
  LONGITUDE: 'Longitude must be between -180 and 180.',
  SPLIT_PARTS_RANGE: 'Enter a number of parts within the allowed range.',
} as const;

export const FINE_MESSAGES = {
  RENTAL_REQUIRED: 'Select the rental this fine belongs to',
} as const;

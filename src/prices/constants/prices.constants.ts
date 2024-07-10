export const PRICES_API: { [key: string]: any } = {
  PRICES_DEFAULT: 'https://api.raporty.pse.pl/api/',
  REPORTS: {
    CURRENT_PRICES: (date: string) => `rce-pln?$filter=doba eq '${date}'`,
    FORECASTED_PRICES: (date: string) => `crb-prog?$filter=doba eq '${date}'`,
  },
};

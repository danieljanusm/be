export interface Prices {
  doba: string;
  cen_prog: number;
  ckoeb_prog: number;
  ceb_pp_prog: number;
  ceb_sr_prog: number;
  udtczas_oreb: string;
  business_date: string;
  source_datetime: string;
}

export interface PricesResponse {
  value: Prices[];
}

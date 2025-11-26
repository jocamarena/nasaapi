export interface ApodResponse {
  copyright?: string | null;
  date: string;
  explanation: string;
  hdurl: string;
  media_type: string;
  service_version: string;
  title: string;
  url: string;
}

export interface ApodQueryParams {
  date?: string;
  start_date?: string;
  end_date?: string;
}

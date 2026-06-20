export interface Client {
  id: string;
  slug: string;
  active: boolean | null;
  firstParty: boolean | null;
  logo: string;
  redirectUri: string[];
  scopes: string[];
  secret: string;
  i18n: object | null;
}

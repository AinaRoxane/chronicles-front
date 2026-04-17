import CrudBaseHttpClient from "@/services/crud.service";

export interface Country {
    id: number;
    isoCode: string;
    name: string;
    phoneCode: string;
}

class CountryService extends CrudBaseHttpClient<Country> {
    constructor() {
        super("public/countries");
    }
}

export const countryService = new CountryService();

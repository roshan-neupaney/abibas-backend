import { Type } from "class-transformer";

export class QueryTypes {
    categories: string;
    price_min: string;
    price_max: string;
    colors: string;
    brands: string;
    sortBy: string;

    @Type(() => Number)
    page: number;

    @Type(() => Number)
    pageSize: number;

    search: string;
}
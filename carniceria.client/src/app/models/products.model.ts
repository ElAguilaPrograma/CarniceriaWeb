export interface IProduct {
    productId?: number;
    code: string;
    name: string;
    price: number;
    categoryId?: number;
    branchId?: number;
    unitId?: number;
    stock: number;
    registrationDate?: Date;
    active: boolean;
}
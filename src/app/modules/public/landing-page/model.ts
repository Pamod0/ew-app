export interface Contributor {
    name: string;
    imageUrl: string;
}

export interface Product {
    id: string;
    code: string;
    name: string;
    description: string;
    image: string;
    price: number;
    category: string;
    quantity: number;
    inventoryStatus: string;
    rating: number;
}

export interface Cleanup {
    name: string;
    imgUrl: string;
}

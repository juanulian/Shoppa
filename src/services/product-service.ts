/**
 * @fileOverview A simulated product service that provides a catalog of products
 * and a function to search them.
 */

export interface Product {
    productName: string;
    productDescription: string;
    price: number;
    qualityScore: number;
    availability: string;
    category: string;
    imageUrl: string;
}

const productCatalog: Product[] = [
    // Laptops
    {
        productName: 'DevBook Pro 16',
        productDescription: 'El portátil definitivo para desarrolladores profesionales. Potente y elegante.',
        price: 2499.99,
        qualityScore: 95,
        availability: 'En Stock',
        category: 'Electrónica',
        imageUrl: 'https://placehold.co/600x400.png'
    },
    {
        productName: 'CodeSlim 14',
        productDescription: 'Un portátil ligero y asequible para programar sobre la marcha.',
        price: 1199.00,
        qualityScore: 88,
        availability: 'En Stock',
        category: 'Electrónica',
        imageUrl: 'https://placehold.co/600x400.png'
    },
    {
        productName: 'GamerMax Fury',
        productDescription: 'Domina el juego con este potente portátil para gaming.',
        price: 1899.50,
        qualityScore: 92,
        availability: 'Pocas unidades',
        category: 'Electrónica',
        imageUrl: 'https://placehold.co/600x400.png'
    },

    // Teclados
    {
        productName: 'MechaniKey TKL',
        productDescription: 'Teclado mecánico Tenkeyless para una experiencia de escritura superior.',
        price: 139.99,
        qualityScore: 94,
        availability: 'En Stock',
        category: 'Accesorios',
        imageUrl: 'https://placehold.co/600x400.png'
    },
    {
        productName: 'ErgoType Split',
        productDescription: 'Teclado dividido ergonómico para reducir la tensión en la muñeca.',
        price: 175.00,
        qualityScore: 90,
        availability: 'En Stock',
        category: 'Accesorios',
        imageUrl: 'https://placehold.co/600x400.png'
    },

    // Monitores
    {
        productName: 'UltraSharp 4K 27"',
        productDescription: 'Monitor 4K de 27 pulgadas con colores increíblemente precisos.',
        price: 699.99,
        qualityScore: 96,
        availability: 'En Stock',
        category: 'Electrónica',
        imageUrl: 'https://placehold.co/600x400.png'
    },
    {
        productName: 'FastFrame 144Hz 24"',
        productDescription: 'Monitor para gaming de 24 pulgadas y 144Hz para un juego fluido.',
        price: 299.00,
        qualityScore: 89,
        availability: 'Agotado',
        category: 'Electrónica',
        imageUrl: 'https://placehold.co/600x400.png'
    },
    
    // Regalos
    {
        productName: 'Taza de Café para Programador',
        productDescription: 'Una taza divertida para el café de la mañana de cualquier desarrollador.',
        price: 15.99,
        qualityScore: 85,
        availability: 'En Stock',
        category: 'Regalos',
        imageUrl: 'https://placehold.co/600x400.png'
    },
    {
        productName: 'Póster de "Hola Mundo"',
        productDescription: 'Decoración elegante para la oficina o el espacio de codificación de un geek.',
        price: 25.00,
        qualityScore: 88,
        availability: 'En Stock',
        category: 'Regalos',
        imageUrl: 'https://placehold.co/600x400.png'
    },
];

/**
 * Searches the product catalog for products matching a query.
 * The search is a simple, case-insensitive match on the product name,
 * description, and category.
 * @param query The search query string.
 * @returns A promise that resolves to an array of matching products.
 */
export async function searchProducts(query: string): Promise<Product[]> {
    const lowerCaseQuery = query.toLowerCase();
    
    // Simulate async operation
    return new Promise(resolve => {
        setTimeout(() => {
            const results = productCatalog.filter(product => 
                product.productName.toLowerCase().includes(lowerCaseQuery) ||
                product.productDescription.toLowerCase().includes(lowerCaseQuery) ||
                product.category.toLowerCase().includes(lowerCaseQuery)
            );
            resolve(results);
        }, 500);
    });
}

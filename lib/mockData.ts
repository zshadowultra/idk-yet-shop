import { Product } from '@/types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Ethnic Printed Kurta',
    description: 'Cotton Blue Printed Straight Kurta',
    price: 799,
    original_price: 1999,
    category_id: '1',
    image_url: 'https://placehold.co/300x400/282c3f/fff?text=Kurta',
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 10
  },
  {
    id: '2',
    title: 'Slim Fit Chinos',
    description: 'Beige Solid Slim Fit Chinos',
    price: 999,
    original_price: 1499,
    category_id: '1',
    image_url: 'https://placehold.co/300x400/d6335b/fff?text=Chinos',
    sizes: ['30', '32', '34'],
    stock: 20
  },
  {
    id: '3',
    title: 'Floral Maxi Dress',
    description: 'Pink Floral Print Maxi Dress',
    price: 1299,
    original_price: 2499,
    category_id: '2',
    image_url: 'https://placehold.co/300x400/ff3f6c/fff?text=Dress',
    sizes: ['XS', 'S', 'M'],
    stock: 5
  },
  {
    id: '4',
    title: 'Running Shoes',
    description: 'Grey Running Shoes',
    price: 2499,
    original_price: 4999,
    category_id: '6',
    image_url: 'https://placehold.co/300x400/333/fff?text=Shoes',
    sizes: ['7', '8', '9', '10'],
    stock: 15
  },
  {
    id: '5',
    title: 'Silk Saree',
    description: 'Traditional Red Silk Saree with Gold Border',
    price: 3499,
    original_price: 6999,
    category_id: '2',
    image_url: 'https://placehold.co/300x400/800000/fff?text=Saree',
    sizes: ['Free Size'],
    stock: 8
  },
  {
    id: '6',
    title: 'Leather Wallet',
    description: 'Genuine Leather Brown Wallet',
    price: 499,
    original_price: 999,
    category_id: '1',
    image_url: 'https://placehold.co/300x400/5C4033/fff?text=Wallet',
    sizes: ['One Size'],
    stock: 50
  }
];

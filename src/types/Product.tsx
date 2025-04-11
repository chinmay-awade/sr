export interface Product {
  id: string;
  name: string;
  mainTitle: string;
  subTitle: string;
  price: number;
  mrp: number;
  imageUrl: string;  // This will now be a direct URL instead of an uploaded file
  rating: number;
  reviews: number;
  weight: string;
  category: 'vegetable-powder' | 'fruit-powder' | 'pickles' | 'papad';
}

export type ProductFormData = Omit<Product, 'id' | 'imageUrl'> & {
  image: File | null;
};
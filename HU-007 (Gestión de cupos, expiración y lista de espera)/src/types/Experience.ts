export interface Experience {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  location: string;
  date: string;
  maxCapacity: number;
  currentCapacity: number; // Campo crítico para HU-007
  images: string[];
  status: 'active' | 'inactive' | 'draft';
  providerId: string;
  createdAt: string;
  updatedAt: string;
}
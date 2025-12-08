export interface Experience {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  location: string;
  date: string;
  maxCapacity: number;
  currentCapacity: number;
  images: string[];
  status: 'active' | 'inactive' | 'draft';
  providerId: string;
}

export interface CreateExperienceData {
  name: string;
  description: string;
  category: string;
  price: number;
  location: string;
  date: string;
  maxCapacity: number;
  images: string[];
}
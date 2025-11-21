import { Experience, CreateExperienceData } from '../types/Experience';

const mockExperiences: Experience[] = [
  {
    id: '1',
    name: 'Tour de Senderismo en Montaña',
    description: 'Disfruta de una caminata guiada por senderos naturales con vistas espectaculares',
    category: 'Aventura',
    price: 45.00,
    location: 'Parque Nacional El Cielo',
    date: '2025-11-15T08:00:00',
    maxCapacity: 20,
    currentCapacity: 8,
    images: ['hiking.jpg'],
    status: 'active',
    providerId: 'user-123',
    createdAt: '2025-10-12T10:00:00',
    updatedAt: '2025-10-12T10:00:00'
  }
];

export const experienceService = {
  getMyExperiences: async (): Promise<Experience[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockExperiences), 1000);
    });
  },

  createExperience: async (data: CreateExperienceData): Promise<Experience> => {
    const newExperience: Experience = {
      ...data,
      id: Date.now().toString(),
      currentCapacity: 0,
      providerId: 'user-123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockExperiences.push(newExperience);
    return newExperience;
  },

  updateExperience: async (id: string, data: Partial<CreateExperienceData>): Promise<Experience> => {
    const index = mockExperiences.findIndex(exp => exp.id === id);
    if (index === -1) throw new Error('Experience not found');
    
    mockExperiences[index] = {
      ...mockExperiences[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    return mockExperiences[index];
  },

  deleteExperience: async (id: string): Promise<void> => {
    const index = mockExperiences.findIndex(exp => exp.id === id);
    if (index === -1) throw new Error('Experience not found');
    mockExperiences.splice(index, 1);
  }
};
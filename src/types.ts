export interface Website {
  id: string;
  name: string;
  description: string;
  url: string;
  imageUrl: string;
  tags: string[];
  ageRange: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
}

export interface User {
  id: string;
  name: string;
  isParent: boolean;
  timeLimit?: number; // in minutes
  allowedWebsites: string[]; // website ids
}

export interface BrowsingSession {
  startTime: Date;
  websiteId: string;
  duration: number; // in minutes
}
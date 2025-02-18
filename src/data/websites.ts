import { Website } from '../types';
import { BookOpen, Calculator, FlaskRound as Flask, Globe2, History } from 'lucide-react';

export const websites: Website[] = [
  {
    id: '1',
    name: 'Math Adventure',
    description: 'Learn math through fun games and interactive puzzles. Perfect for building strong number skills!',
    url: 'https://www.coolmath4kids.com',
    imageUrl: 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    tags: ['Math', 'Games', 'Interactive'],
    ageRange: '7-12',
    difficulty: 'Beginner',
    category: 'math'
  },
  {
    id: '2',
    name: 'Science Lab',
    description: 'Explore amazing science experiments and discover how the world works through interactive lessons.',
    url: 'https://www.sciencekids.co.nz',
    imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    tags: ['Science', 'Experiments', 'Nature'],
    ageRange: '8-14',
    difficulty: 'Intermediate',
    category: 'science'
  },
  {
    id: '3',
    name: 'Reading Quest',
    description: 'Embark on exciting reading adventures with interactive stories and comprehension activities.',
    url: 'https://www.storylineonline.net',
    imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    tags: ['Reading', 'Stories', 'Literature'],
    ageRange: '5-11',
    difficulty: 'Beginner',
    category: 'reading'
  },
  {
    id: '4',
    name: 'History Time Machine',
    description: 'Travel through time and explore fascinating historical events and civilizations.',
    url: 'https://www.historyforkids.net',
    imageUrl: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    tags: ['History', 'Civilizations', 'Interactive'],
    ageRange: '9-15',
    difficulty: 'Intermediate',
    category: 'history'
  },
  {
    id: '5',
    name: 'Art Studio',
    description: 'Express your creativity with digital art tools and learn about famous artists and art styles.',
    url: 'https://www.artforkidshub.com',
    imageUrl: 'https://images.unsplash.com/photo-1499892477393-f675706cbe6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    tags: ['Art', 'Creativity', 'Drawing'],
    ageRange: '6-13',
    difficulty: 'Beginner',
    category: 'art'
  },
  {
    id: '6',
    name: 'Code Academy Jr',
    description: 'Start your coding journey with fun programming games and visual block-based coding.',
    url: 'https://www.code.org',
    imageUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    tags: ['Coding', 'Programming', 'Logic'],
    ageRange: '8-16',
    difficulty: 'Advanced',
    category: 'coding'
  }
];
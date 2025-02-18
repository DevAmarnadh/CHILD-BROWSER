import React from 'react';
import { Website } from '../types';
import { ExternalLink, Clock, Users } from 'lucide-react';

interface WebsiteCardProps {
  website: Website;
  onSelect: (website: Website) => void;
}

export function WebsiteCard({ website, onSelect }: WebsiteCardProps) {
  return (
    <div 
      className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
      role="button"
      onClick={() => onSelect(website)}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(website)}
      tabIndex={0}
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={website.imageUrl}
          alt={`${website.name} preview`}
          className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-200"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-lg font-semibold text-white mb-1">
            {website.name}
          </h3>
          <div className="flex items-center space-x-4 text-sm text-gray-200">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{website.ageRange} years</span>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              <span>{website.difficulty}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
          {website.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {website.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            {website.category}
          </span>
          <div className="flex items-center text-indigo-600 dark:text-indigo-400 font-medium group-hover:underline">
            Visit Site
            <ExternalLink className="w-4 h-4 ml-1" />
          </div>
        </div>
      </div>
    </div>
  );
}
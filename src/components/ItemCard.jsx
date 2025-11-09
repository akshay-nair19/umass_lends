/**
 * Item Card Component
 * Displays a single item in a card format
 */

import React from 'react';
import { Link } from 'react-router-dom';

const ItemCard = ({ item, compact = false, noBorder = false }) => {
  const imageHeight = compact ? 'h-32' : 'h-48';
  const padding = noBorder ? '' : (compact ? 'p-3' : 'p-4');
  const titleSize = compact ? 'text-lg' : 'text-xl';
  const borderClass = noBorder ? '' : 'border rounded-lg';
  const hoverEffect = noBorder ? '' : 'hover:shadow-lg transition-shadow';
  
  return (
    <Link to={`/items/${item.id}`} className="block">
      <div className={`${borderClass} ${padding} ${hoverEffect} cursor-pointer`}>
        {/* Item Image */}
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.title}
            className={`w-full ${imageHeight} object-cover rounded mb-3`}
          />
        ) : (
          <div className={`w-full ${imageHeight} bg-gray-200 rounded mb-3 flex items-center justify-center`}>
            <span className="text-gray-400 text-sm">No image</span>
          </div>
        )}

        {/* Item Info */}
        <h3 className={`${titleSize} font-bold mb-2`}>{item.title}</h3>
        <p className="text-gray-600 mb-2 line-clamp-2 text-sm">{item.description}</p>
        
        {/* Location */}
        {item.location && (
          <div className="mb-2">
            <span className="text-xs text-gray-500">📍 {item.location}</span>
          </div>
        )}
        
        <div className="flex justify-between items-center mt-3 flex-wrap gap-2">
          <div className="flex gap-2 flex-wrap">
            {item.category && (
              <span className="px-2 py-1 bg-umass-maroon text-umass-cream text-xs rounded font-medium">
                {item.category}
              </span>
            )}
            {item.condition && (
              <span className="px-2 py-1 bg-umass-lightGray text-umass-gray text-xs rounded">
                {item.condition}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {item.available ? (
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded font-semibold">
                Available
              </span>
            ) : (
              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded font-semibold">
                Unavailable
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ItemCard;


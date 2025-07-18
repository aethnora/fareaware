import React from 'react';

const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded-md ${className}`} />
);

export default Skeleton;

const SkeletonLoader = ({ children, className = '' }) => {
  return (
    <div className={`animate-pulse space-y-6 ${className}`}>
      {children}
    </div>
  );
};

export default SkeletonLoader;
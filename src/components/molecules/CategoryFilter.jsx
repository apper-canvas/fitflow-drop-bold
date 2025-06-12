import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
      {categories.map((category) => (
        <Button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
            selectedCategory === category.id
              ? 'gradient-primary text-white'
              : 'bg-surface text-surface400 hover:text-white'
          }`}
        >
          {category.icon && <ApperIcon name={category.icon} size={16} />}
          {category.label}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;
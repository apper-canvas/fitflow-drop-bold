import Input from '@/components/atoms/Input';
import Text from '@/components/atoms/Text';

const FormField = ({ label, id, type = 'text', value, onChange, placeholder, className = '', ...props }) => {
  return (
    <div className={className}>
      {label && (
        <Text as="label" htmlFor={id} className="block text-sm font-medium text-surface400 mb-2">
          {label}
        </Text>
      )}
      <Input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...props}
      />
    </div>
  );
};

export default FormField;
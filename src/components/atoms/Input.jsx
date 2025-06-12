const Input = ({ type = 'text', value, onChange, placeholder, className = '', ...props }) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full bg-surface600 border border-surface500 rounded-lg px-4 py-2 text-white placeholder-surface400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${className}`}
      {...props}
    />
  );
};

export default Input;
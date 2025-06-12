const Text = ({ as = 'p', className = '', children, ...props }) => {
  const Component = as;
  return (
    <Component className={className} {...props}>
      {children}
    </Component>
  );
};

export default Text;
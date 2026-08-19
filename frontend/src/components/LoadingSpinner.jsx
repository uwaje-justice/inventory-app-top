const LoadingSpinner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-transparent border-b-primary border-t-primary" />
    </div>
  );
};

export default LoadingSpinner;

// frontend/src/components/LoadingSpinner.jsx
const LoadingSpinner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-500/20 rounded-full animate-spin border-t-blue-500"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
        </div>
        <p className="mt-4 text-white/60 text-sm font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
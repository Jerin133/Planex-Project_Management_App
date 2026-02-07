export const InputField = ({ icon: Icon, type, placeholder, value, onChange }) => (
  <div className="relative mb-4">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
      <Icon size={20} />
    </div>
    <input
      type={type}
      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ease-in-out placeholder-gray-400 text-gray-700"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required
    />
  </div>
);

export const Button = ({ children, loading, onClick }) => (
  <button
    onClick={onClick}
    disabled={loading}
    className="w-full bg-indigo-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
  >
    {loading ? (
      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
    ) : (
      children
    )}
  </button>
);

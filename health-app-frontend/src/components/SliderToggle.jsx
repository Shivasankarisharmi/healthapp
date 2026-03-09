export default function SliderToggle({ leftLabel, rightLabel, isRight, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`text-sm font-medium transition-colors whitespace-nowrap ${
          !isRight ? "text-indigo-600" : "text-gray-400"
        }`}
      >
        {leftLabel}
      </span>

    
      <button
        type="button"
        onClick={() => onChange(!isRight)}
        className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none ${
          isRight ? "bg-indigo-600" : "bg-gray-300"
        }`}
        aria-label="Toggle mode"
      >
        <span
          className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${
            isRight ? "translate-x-6" : "translate-x-0.5"
          }`}
        />
      </button>

      
      <span
        className={`text-sm font-medium transition-colors whitespace-nowrap ${
          isRight ? "text-indigo-600" : "text-gray-400"
        }`}
      >
        {rightLabel}
      </span>
    </div>
  );
}

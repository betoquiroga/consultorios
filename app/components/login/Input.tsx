type InputProps = {
  id: string;
  name: string;
  type: "text" | "password" | "email";
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
};

export function Input({
  id,
  name,
  type,
  label,
  value,
  onChange,
  placeholder,
  required = false,
}: InputProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-gray-200"
      >
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-gray-100 placeholder:text-gray-400 transition-colors duration-200 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
        placeholder={placeholder}
      />
    </div>
  );
}


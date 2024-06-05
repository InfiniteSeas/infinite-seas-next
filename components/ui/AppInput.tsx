"use client";

export default function AppInput({
  label,
  disabled,
  value,
  handleChange,
}: {
  label: string;
  disabled?: boolean;
  value: string;
  handleChange?: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="">{label}</label>

      <input
        className="border-[1px] text-center rounded-md"
        type="text"
        value={value}
        disabled={disabled}
        onChange={(e) => handleChange?.(e.target.value)}
      />
    </div>
  );
}

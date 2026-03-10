interface Props {
  value: string;
  options: string[];
  onChange: (styleName: string) => void;
}

export default function StyleFilter({ value, options, onChange }: Props) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-700">
      用風格篩選
      <select
        aria-label="用風格篩選"
        className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="all">全部風格</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

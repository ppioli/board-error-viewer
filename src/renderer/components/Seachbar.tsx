export interface SearchBarProps {
  onChange: ( val: string ) => void;
}
export function SearchBar({onChange}:SearchBarProps) {
  return (
      <input
        className="form-control"
        type="text"
        placeholder="Search..."
        onChange={(evt) => onChange(evt.target.value)}
      />
  );
}

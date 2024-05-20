import "./FormRow.scss";

export default function FormRow({
  type,
  value,
  name,
  handleChange,
  labelText,
  placeholder,
}) {
  return (
    <div className="form_row">
      <label htmlFor={name} className="form_label">
        {labelText || name}
      </label>

      <input
        id={name}
        type={type}
        value={value}
        name={name}
        placeholder={placeholder}
        onChange={handleChange}
        className="form_input"
      />
    </div>
  );
}

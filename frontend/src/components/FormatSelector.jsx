import React from "react";

export default function FormatSelector({ formats, selected, onChange }) {
  return (
    <div className="type-selector">
      <label>Format docelowy</label>
      <select value={selected} onChange={(e) => onChange(e.target.value)}>
        {formats.map((fmt) => (
          <option key={fmt} value={fmt}>
            {fmt.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
}

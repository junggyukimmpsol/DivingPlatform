import React from 'react'

type FormFieldProps = {
  label: string
  name: string
  type?: string
  required?: boolean
  placeholder?: string
  defaultValue?: string | number
  min?: string | number
  max?: string | number
  step?: string | number
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  required,
  placeholder,
  defaultValue,
  min,
  max,
  step,
}) => (
  <label className="block">
    <span className="mb-2 block text-sm font-bold text-slate-200">{label}</span>
    <input
      name={name}
      type={type}
      required={required}
      placeholder={placeholder}
      defaultValue={defaultValue}
      min={min}
      max={max}
      step={step}
      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-parks-gold/70 focus:bg-white/10"
    />
  </label>
)

export default FormField

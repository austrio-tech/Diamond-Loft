"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import styles from "./PasswordInput.module.css";

interface Props {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  inputClassName?: string;
}

export default function PasswordInput({
  id,
  value,
  onChange,
  placeholder,
  required,
  autoComplete,
  inputClassName,
}: Props) {
  const [show, setShow] = useState(false);

  return (
    <div className={styles.wrap}>
      <input
        id={id}
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        className={`${inputClassName ?? ""} ${styles.input}`}
      />
      <button
        type="button"
        className={styles.toggle}
        onClick={() => setShow((s) => !s)}
        aria-label={show ? "Hide password" : "Show password"}
        title={show ? "Hide password" : "Show password"}
        tabIndex={-1}
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}

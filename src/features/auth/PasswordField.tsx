"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export const inputClass = "mt-2 min-h-12 w-full rounded-xl border border-line bg-header px-4 text-content focus:border-accent";
export const primaryClass = "min-h-12 w-full rounded-xl bg-accent px-4 font-bold text-on-accent disabled:opacity-50";

export default function PasswordField({label, name, fresh = false}: {label:string;name:string;fresh?:boolean}) {
  const [visible,setVisible] = useState(false);
  return <div>
    <label htmlFor={name}>{label}</label>
    <div className="relative">
      <input id={name} name={name} required minLength={fresh ? 8 : undefined} dir="ltr"
        type={visible ? "text" : "password"} autoComplete={fresh ? "new-password" : "current-password"} className={inputClass+" pr-12"}/>
      <button type="button" onClick={()=>setVisible(!visible)} aria-pressed={visible} aria-label={visible ? "پنهان کردن رمز" : "نمایش رمز"}
        className="absolute bottom-0 start-0 grid size-12 place-items-center text-muted">{visible ? <EyeOff size={18}/> : <Eye size={18}/>}</button>
    </div>
  </div>;
}

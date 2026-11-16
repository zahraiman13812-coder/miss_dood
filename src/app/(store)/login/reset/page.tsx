"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { getAuthClient } from "@/features/auth/emailAuth";
import PasswordField, {primaryClass} from "@/features/auth/PasswordField";

export default function ResetPage() {
  const [message,setMessage] = useState("");
  const [busy,setBusy] = useState(false);
  const [done,setDone] = useState(false);
  async function submit(e:FormEvent<HTMLFormElement>) {
    e.preventDefault(); if (busy) return;
    const data = new FormData(e.currentTarget);
    const password = String(data.get("password"));
    if (password!==data.get("confirm")) {setMessage("رمز عبور و تکرار آن یکسان نیست.");return;}
    setBusy(true);
    try {
      const auth = getAuthClient()?.auth;
      if (!auth || !(await auth.getSession()).data.session) throw Error();
      const {error}=await auth.updateUser({password});
      if (error) throw error;
      setDone(true);setMessage("رمز عبور جدید ذخیره شد.");
    } catch {setMessage("امکان تغییر رمز نیست. لینک بازیابی جدید درخواست کنید.");}
    finally {setBusy(false);}
  }
  return <main className="mx-auto w-full max-w-md space-y-5 px-4 py-12">
    <h1 className="text-2xl font-bold">تنظیم رمز عبور جدید</h1>
    {!done && <form className="space-y-4 rounded-2xl border border-line bg-panel p-5" onSubmit={submit}>
      <PasswordField name="password" label="رمز جدید (حداقل ۸ نویسه)" fresh/><PasswordField name="confirm" label="تکرار رمز جدید" fresh/>
      <button disabled={busy} className={primaryClass}>ذخیره رمز جدید</button>
    </form>}
    <p role="status">{message}</p><Link href={done?"/account":"/login"} className="text-accent">{done?"مشاهده حساب":"بازگشت به ورود"}</Link>
  </main>;
}

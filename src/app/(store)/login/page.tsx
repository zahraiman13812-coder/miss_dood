"use client";
import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAuthClient, useSignedInEmail } from "@/features/auth/emailAuth";
import PasswordField, {inputClass, primaryClass} from "@/features/auth/PasswordField";

type Mode = "login" | "signup" | "forgot";
export default function LoginPage() {
  const router = useRouter();
  const signedIn = useSignedInEmail();
  const [mode,setMode] = useState<Mode>("login");
  const [busy,setBusy] = useState(false);
  const [message,setMessage] = useState("");
  function switchMode(value: Mode) { setMode(value); setMessage(""); }
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    const fields = new FormData(e.currentTarget);
    const read = (key:string) => String(fields.get(key) ?? "");
    const email = read("email").trim(), password = read("password");
    const fullName = read("name").trim();
    if (mode === "signup" && (!fullName || password !== read("confirm"))) {
      setMessage(!fullName ? "نام و نام خانوادگی را وارد کنید." : "تکرار رمز با رمز عبور یکسان نیست."); return;
    }
    const auth = getAuthClient()?.auth;
    if (!auth) {
      setMessage("این نسخه در حالت نمایش است. برای دیدن محیط کاربر، پیش‌نمایش پنل را باز کنید."); return;
    }
    setBusy(true); setMessage("");
    try {
      if (mode === "forgot") {
        const {error} = await auth.resetPasswordForEmail(email,{redirectTo:location.origin+"/login/reset"});
        if (error) throw error;
        setMessage("اگر حسابی با این ایمیل وجود داشته باشد، لینک بازیابی را دریافت می‌کنید.");
      } else if (mode === "signup") {
        const {data,error} = await auth.signUp({email,password,options:{data:{full_name:fullName},emailRedirectTo:location.origin+"/account"}});
        if (error) throw error;
        if (data.session) router.replace("/account");
        else setMessage("برای ادامهٔ ثبت‌نام، ایمیل خود را بررسی کنید.");
      } else {
        const {error} = await auth.signInWithPassword({email,password});
        if (error) throw error;
        router.replace("/account");
      }
    } catch {setMessage(mode === "login" ? "ورود انجام نشد. ایمیل، رمز عبور و اتصال را بررسی کنید." : "درخواست انجام نشد. دوباره تلاش کنید.");}
    finally {setBusy(false);}
  }

  return <main className="mx-auto grid w-full max-w-4xl flex-1 place-content-center px-4 py-10">
    <section className="grid w-full overflow-hidden rounded-3xl border border-line bg-panel md:grid-cols-[14rem_minmax(22rem,1fr)]">
      <div className="grid place-items-center bg-radial from-panel to-header p-4 md:p-8">
        <Image src="/brand/miss-dood-logo.jpg" width={208} height={208} alt="MISS DOOD" className="size-20 rounded-full object-contain md:size-40"/>
      </div>
      <div className="min-w-0 space-y-5 p-5 sm:p-8">
        <h1 className="text-2xl font-bold">{mode === "forgot" ? "بازیابی رمز عبور" : "حساب کاربری میس دود"}</h1>
        {signedIn ? <Link className="block text-accent" href="/account">ورود به پنل کاربری</Link> : <>
          <div className="grid grid-cols-2 gap-1 rounded-xl border border-line bg-header p-1">
            {(["login","signup"] as const).map(m=><button key={m} type="button" disabled={busy} aria-pressed={mode===m}
              className="rounded-lg py-2.5 text-muted aria-pressed:bg-accent aria-pressed:text-on-accent" onClick={()=>switchMode(m)}>{m==="login" ? "ورود" : "ثبت‌نام"}</button>)}
          </div>
          <form key={mode} onSubmit={submit} className="space-y-4">
            {mode==="signup" && <label className="block">نام و نام خانوادگی<input required name="name" autoComplete="name" maxLength={120} className={inputClass}/></label>}
            <label className="block">ایمیل<input required name="email" type="email" dir="ltr" autoComplete="email" className={inputClass}/></label>
            {mode!=="forgot" && <PasswordField label={mode==="signup" ? "رمز عبور (حداقل ۸ نویسه)" : "رمز عبور"} name="password" fresh={mode==="signup"}/>}
            {mode==="signup" && <PasswordField label="تکرار رمز عبور" name="confirm" fresh/>}
            {mode==="login" && <button type="button" className="text-sm text-accent" disabled={busy} onClick={()=>switchMode("forgot")}>رمز عبورم را فراموش کرده‌ام</button>}
            <button disabled={busy} className={primaryClass}>{busy ? "در حال بررسی…" : mode==="login" ? "ورود به حساب" : mode==="signup" ? "ساخت حساب" : "ارسال لینک بازیابی"}</button>
          </form>
          {!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ? <Link href="/account?preview=1" className="block text-center text-sm text-accent">مشاهدهٔ پیش‌نمایش پنل</Link> : null}
        </>}
        <p role="status" className="text-sm text-muted empty:hidden">{message}</p>
      </div>
    </section>
  </main>;
}

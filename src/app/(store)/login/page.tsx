"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail } from "lucide-react";
import { getAuthClient, useSignedInEmail } from "@/features/auth/emailAuth";

const field = "mt-2 min-h-12 w-full rounded-xl border border-line bg-header px-4 text-content focus:border-accent";
const primary = "min-h-12 w-full rounded-xl bg-accent px-4 font-bold text-on-accent disabled:opacity-50";

export default function LoginPage() {
  const router = useRouter();
  const signedIn = useSignedInEmail();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [demoCode,setDemoCode] = useState("");
  const [demoDone,setDemoDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [wait, setWait] = useState(0);
  useEffect(() => {
    if (wait <= 0) return;
    const timer = setTimeout(() => setWait(wait - 1), 1000);
    return () => clearTimeout(timer);
  }, [wait]);

  async function run(action: "send" | "verify" | "logout") {
    if (busy) return;
    const auth = getAuthClient()?.auth;
    if (!auth) {
      if (action === "send") {
        const number = crypto.getRandomValues(new Uint32Array(1))[0] % 1000000;
        setDemoCode(String(number).padStart(6,"0")); setCode(""); setMessage(""); setStep("code"); setWait(60);
      } else if (action === "verify") {
        if (code !== demoCode) { setMessage("کد با نمونهٔ نمایش‌داده‌شده مطابقت ندارد."); return; }
        setDemoDone(true); setDemoCode(""); setMessage("");
      }
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      const address = email.trim();
      const result = action === "send"
        ? await auth.signInWithOtp({ email: address })
        : action === "verify"
          ? await auth.verifyOtp({ email: address, token: code, type: "email" })
          : await auth.signOut({scope:"local"});
      if (result.error) {
        setMessage(result.error.status === 429 ? "درخواست‌ها زیاد است. کمی بعد دوباره تلاش کنید." :
          action === "verify" ? "کد اشتباه است یا اعتبار آن تمام شده است." : "درخواست انجام نشد. دوباره تلاش کنید.");
        return;
      }
      if (action === "send") {
        setStep("code"); setCode(""); setWait(60);
        setMessage("ایمیل خود را برای دریافت کد بررسی کنید.");
      } else {
        setStep("email"); setCode(""); setEmail(""); setWait(0);
        if (action === "verify") {
          const target = new URLSearchParams(window.location.search).get("next");
          if (target && ["checkout","orders","contact"].includes(target)) router.replace("/" + target);
        }
      }
    } catch {
      setMessage("ارتباط با سرویس ورود برقرار نشد.");
    } finally {
      setBusy(false);
    }
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    void run(step === "email" ? "send" : "verify");
  }

  if (demoDone) return <main className="mx-auto w-full max-w-lg space-y-5 px-5 py-12">
    <h1 className="text-2xl font-bold">پیش‌نمایش ورود تکمیل شد</h1>
    <p className="text-muted">این مرحله فقط نمایش رابط کاربری بود.</p>
    <Link href="/shop" className="text-accent">مشاهده فروشگاه</Link>
  </main>;
  return (
    <main className="mx-auto grid w-full max-w-lg flex-1 content-center px-4 py-10">
      <section className="space-y-6 rounded-3xl border border-line bg-panel p-6 sm:p-9">
        <Mail aria-hidden="true" className="size-8 text-accent"/>
        <h1 className="text-2xl font-bold">{signedIn ? "حساب کاربری" : step === "email" ? "ورود با ایمیل" : "تأیید ایمیل"}</h1>
        {signedIn ? <>
          <p dir="ltr" className="break-all text-right text-muted">{signedIn}</p>
          <Link className="block text-accent" href="/orders">پیش‌نمایش سفارش‌ها</Link>
          <Link className="block text-accent" href="/shop">ورود به فروشگاه</Link>
          <button disabled={busy} onClick={() => run("logout")} className="text-sm underline">خروج از حساب</button>
        </> : <form onSubmit={submit} className="space-y-5">
          {step === "email" ? <label className="block">آدرس ایمیل
            <input required type="email" dir="ltr" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} className={field} placeholder="name@example.com"/>
          </label> : <>
            {demoCode ? <p className="text-sm text-muted">حالت نمایشی · کد نمونه: <bdi>{demoCode}</bdi></p> : <p className="text-sm text-muted">کد شش‌رقمی ارسال‌شده به <bdi>{email}</bdi> را وارد کنید.</p>}
            <label className="block">کد ورود
              <input autoFocus required type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} dir="ltr" value={code}
                onChange={e => setCode(e.target.value.replace(/[۰-۹]/g, d => String(d.charCodeAt(0)-1776)).replace(/[٠-٩]/g, d => String(d.charCodeAt(0)-1632)).replace(/\D/g, ""))}
                className={field+" text-center text-xl tracking-[0.4em]"} />
            </label>
          </>}
          <button disabled={busy || (step === "code" && code.length !== 6)} className={primary}>{busy ? "در حال بررسی…" : step === "email" ? "ارسال کد ورود" : "تأیید و ورود"}</button>
          {step === "code" && <div className="flex justify-between gap-3 text-sm text-accent">
            <button type="button" disabled={busy || wait > 0} onClick={() => run("send")}>{wait ? `ارسال مجدد پس از ${wait.toLocaleString("fa-IR")} ثانیه` : "ارسال مجدد کد"}</button>
            <button type="button" disabled={busy} onClick={() => {setStep("email");setCode("");setMessage("");}}>ویرایش ایمیل</button>
          </div>}
        </form>}
        <p role="status" className="empty:hidden text-sm text-muted">{message}</p>
      </section>
    </main>
  );
}

"use client";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PackageSearch, ShoppingBag, UserRound } from "lucide-react";
import { getAuthClient } from "@/features/auth/emailAuth";
import { primaryClass, inputClass } from "@/features/auth/PasswordField";

export default function AccountPage() {
  const router = useRouter();
  const [email,setEmail] = useState("");
  const [name,setName] = useState("");
  const [demo,setDemo] = useState(false);
  const [ready,setReady] = useState(false);
  const [status,setStatus] = useState("");
  const [busy,setBusy] = useState(false);
  useEffect(()=>{
    const auth=getAuthClient()?.auth;
    if (!auth) {
      const preview=new URLSearchParams(location.search).get("preview")==="1";
      setDemo(preview);setName(preview?"کاربر نمونه":"");setReady(true);return;
    }
    const {data}=auth.onAuthStateChange((_event,session)=>{
      setEmail(session?.user.email ?? "");setName(session?.user.user_metadata.full_name ?? "");setReady(true);
    });
    return ()=>data.subscription.unsubscribe();
  },[]);
  async function save(e:FormEvent) {
    e.preventDefault();
    if (!name.trim()) {setStatus("نام را وارد کنید.");return;}
    if(demo){setStatus("نام در پیش‌نمایش به‌روز شد.");return;}
    setBusy(true);
    try {
      const result=await getAuthClient()!.auth.updateUser({data:{full_name:name.trim()}});
      setStatus(result.error?"ذخیره انجام نشد.":"نام ذخیره شد.");
    } catch {setStatus("اتصال برقرار نشد.");} finally {setBusy(false);}
  }
  async function logout() {
    setBusy(true);
    try {
      if(!demo && (await getAuthClient()!.auth.signOut({scope:"local"})).error) throw Error();
      router.replace("/login");
    } catch {setStatus("خروج انجام نشد.");} finally {setBusy(false);}
  }
  if (!ready || (!demo && !email)) return <main className="mx-auto p-10">{ready?<Link href="/login" className="text-accent">برای مشاهدهٔ پنل وارد شوید</Link>:"در حال آماده‌سازی حساب…"}</main>;
  return <main className="mx-auto w-full max-w-4xl space-y-5 px-4 py-10">
    <header className="flex items-center gap-4 rounded-2xl border border-line bg-panel p-5">
      <UserRound className="size-10 text-accent"/><div><h1 className="text-2xl font-bold">{demo?"پیش‌نمایش پنل کاربری":"پنل کاربری"}</h1><bdi className="text-sm text-muted">{demo?"demo@example.com":email}</bdi></div>
    </header>
    <nav className="grid grid-cols-2 gap-3">
      <Link href="/orders" className="flex items-center gap-2 rounded-xl border border-line p-4 text-accent"><PackageSearch size={20}/>پیگیری سفارش</Link>
      <Link href="/cart" className="flex items-center gap-2 rounded-xl border border-line p-4 text-accent"><ShoppingBag size={20}/>سبد خرید</Link>
    </nav>
    <form onSubmit={save} className="space-y-4 rounded-2xl border border-line bg-panel p-5">
      <h2 className="font-bold">مشخصات من</h2>
      <label className="block">نام و نام خانوادگی<input required maxLength={120} autoComplete="name" value={name} onChange={e=>setName(e.target.value)} className={inputClass}/></label>
      <button disabled={busy} className={primaryClass}>ذخیره تغییرات</button>
    </form>
    <p role="status" className="text-muted">{status}</p><button disabled={busy} onClick={logout} className="text-sm text-accent">خروج از {demo?"پیش‌نمایش":"حساب"}</button>
  </main>;
}

"use client";
import {useEffect,useState} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
type User={id:string;email:string;full_name:string;role:string};
export default function AccountPage(){const[user,setUser]=useState<User|null>(null),[loading,setLoading]=useState(true);const router=useRouter();
 useEffect(()=>{fetch("/api/auth",{cache:"no-store"}).then(r=>r.json()).then(d=>setUser(d.user??null)).finally(()=>setLoading(false));},[]);
 async function logout(){await fetch("/api/auth",{method:"DELETE"});router.replace("/login");router.refresh();}
 return <main className="mx-auto max-w-xl space-y-5 p-8"><h1 className="text-2xl font-bold">حساب کاربری</h1>{loading?<p>در حال بارگذاری...</p>:!user?<Link className="text-accent" href="/login">برای مشاهده حساب وارد شوید</Link>:<section className="space-y-5 rounded-2xl border border-line bg-panel p-5"><h2 className="font-bold">{user.full_name}</h2><p dir="ltr">{user.email}</p><Link className="block text-accent" href="/orders">پیگیری سفارش‌ها</Link><Link className="block text-accent" href="/favorites">علاقه‌مندی‌ها در این مرورگر</Link>{user.role==="admin"&&<Link className="block text-accent" href="/admin">مدیریت فروشگاه</Link>}<button onClick={logout} className="rounded-xl border border-line px-4 py-2">خروج امن</button></section>}</main>;
}

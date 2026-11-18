"use client";
import {useEffect,useState,type FormEvent} from "react";
import {MessageSquare} from "lucide-react";
import {card,input,primary} from "@/features/dashboard/Panel";
type Ticket={id:string;subject:string;status:'open'|'answered'|'closed';messages:{from:'customer'|'admin';text:string;date:string}[]};
export default function SupportDesk({admin=false}:{admin?:boolean}) {
 const [tickets,setTickets]=useState<Ticket[]>([]),[active,setActive]=useState(''),[notice,setNotice]=useState(''),[busy,setBusy]=useState(false),[loading,setLoading]=useState(true);
 const ticket=tickets.find(t=>t.id===active);
 async function refresh(){const r=await fetch('/api/support',{cache:'no-store'});const d=await r.json();if(!r.ok)throw Error(r.status===401?'برای پشتیبانی ابتدا وارد حساب شوید.':d.error||'خطا در دریافت پیام‌ها');setTickets(d.tickets);}
 useEffect(()=>{refresh().catch(e=>setNotice(e.message)).finally(()=>setLoading(false));},[]);
 async function request(method:'POST'|'PATCH',payload:object){setBusy(true);setNotice('');try{const r=await fetch('/api/support',{method,headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});const d=await r.json();if(!r.ok)throw Error(d.error||'ثبت پیام ناموفق بود');await refresh();if(d.id)setActive(d.id);setNotice('درخواست شما ثبت شد.');return true;}catch(e){setNotice(e instanceof Error?e.message:'ارتباط با سرور برقرار نشد.');return false;}finally{setBusy(false);}}
 async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();const form=e.currentTarget;const fields=new FormData(form);const message=String(fields.get('message')||'');const ok=await request('POST',ticket?{action:'reply',id:ticket.id,message}:{action:'create',subject:String(fields.get('subject')||''),message});if(ok)form.reset();}
 return <section className={card+' space-y-4'} aria-label="پشتیبانی"><h2 className="flex items-center gap-2 text-lg font-bold"><MessageSquare size={19} className="text-accent"/>{admin?'صندوق پشتیبانی':'درخواست پشتیبانی'}</h2>
 <p className="text-sm text-muted">پیام‌ها با حساب کاربری شما در دیتابیس ذخیره می‌شوند و از دستگاه‌های مختلف در دسترس‌اند.</p>
 {loading?<p>در حال بارگذاری…</p>:<><label className="block text-sm">درخواست‌ها<select className={input} value={active} onChange={e=>setActive(e.target.value)}><option value="">{admin?'انتخاب درخواست':'درخواست جدید'}</option>{tickets.map(t=><option key={t.id} value={t.id}>{t.subject} · {t.status==='closed'?'بسته':t.status==='answered'?'پاسخ داده شده':'باز'}</option>)}</select></label>
 {ticket&&<div className="space-y-3 border-t border-line pt-4"><h3 className="font-bold">{ticket.subject}</h3><ol className="space-y-3">{ticket.messages.map((m,i)=><li key={i} className="rounded-xl border border-line p-3"><strong>{m.from==='admin'?'پشتیبانی':'مشتری'}</strong><time className="mx-2 text-xs" dateTime={m.date}>{new Date(m.date).toLocaleString('fa-IR')}</time><p className="whitespace-pre-wrap">{m.text}</p></li>)}</ol>{admin&&<button type="button" disabled={busy} className="rounded-xl border border-line px-4 py-2" onClick={()=>request('PATCH',{id:ticket.id,status:ticket.status==='closed'?'open':'closed'})}>{ticket.status==='closed'?'بازگشایی':'بستن درخواست'}</button>}</div>}
 {(!admin&&!ticket||ticket&&ticket.status!=='closed')&&<form key={active} onSubmit={submit} className="space-y-3">{!ticket&&<label className="block">موضوع<input name="subject" required maxLength={100} className={input}/></label>}<label className="block">پیام<textarea name="message" required minLength={2} maxLength={2000} rows={3} className={input}/></label><button disabled={busy} className={primary}>{busy?'در حال ارسال…':'ارسال پیام'}</button></form>}</>}
 <p role="status" className="text-sm text-accent">{notice}</p></section>;
}

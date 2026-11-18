import { updateStore } from "@/features/store/store";

export type Ticket = {
  id:string; subject:string; closed:boolean;
  messages:{from:"customer" | "admin"; text:string; date:string}[];
};

function message(text:string, from:"customer" | "admin") {
  const value=text.trim();
  if (value.length<2 || value.length>2000) throw Error("پیام باید بین ۲ و ۲۰۰۰ نویسه باشد.");
  return {from,text:value,date:new Date().toISOString()};
}
export function openTicket(subject:string, text:string) {
  const title=subject.trim();
  if (!title || title.length>100) throw Error("عنوان درخواست را وارد کنید.");
  const id=crypto.randomUUID();
  const ticket:Ticket={id,subject:title,closed:false,messages:[message(text,"customer")]};
  updateStore(s=>({...s,tickets:[ticket,...s.tickets]}));
  return id;
}
export function replyToTicket(id:string,text:string,from:"customer" | "admin") {
  const entry=message(text,from);
  updateStore(s=>{
    const ticket=s.tickets.find(t=>t.id===id);
    if (!ticket || ticket.closed) throw Error("درخواست برای پاسخ‌گویی باز نیست.");
    return {...s,tickets:s.tickets.map(t=>t.id===id ? {...t,messages:[...t.messages,entry]} : t)};
  });
}
export function toggleTicket(id:string) {
  updateStore(s=>({...s,tickets:s.tickets.map(t=>t.id===id ? {...t,closed:!t.closed} : t)}));
}

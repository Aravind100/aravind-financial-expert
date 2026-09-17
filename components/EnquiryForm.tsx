'use client';
import {useState} from 'react';
export default function EnquiryForm({service='General Enquiry'}:{service?:string}) {
 const [form,setForm]=useState({name:'',phone:'',email:'',service, message:''});
 const [status,setStatus]=useState('');
 async function submit(e:React.FormEvent){e.preventDefault();setStatus('Sending...');
  const r=await fetch('/api/leads',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)});
  const d=await r.json();setStatus(r.ok?'Thank you. Your enquiry has been received.':(d.error||'Something went wrong.'));
 }
 return <form className="form" onSubmit={submit}>
  <input required placeholder="Full name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
  <input required placeholder="Mobile number" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/>
  <input type="email" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
  <select value={form.service} onChange={e=>setForm({...form,service:e.target.value})}>
   {['General Enquiry','Mutual Funds / SIP','Equity / Demat','PMS','AIF','IMP','SWP','Life / Term Insurance','Health Insurance','Home Loan','Business Loan','Personal Loan'].map(x=><option key={x}>{x}</option>)}
  </select>
  <textarea placeholder="How can we help?" value={form.message} onChange={e=>setForm({...form,message:e.target.value})}/>
  <button className="btn" type="submit">Send Enquiry</button>{status&&<div className="status">{status}</div>}
 </form>
}
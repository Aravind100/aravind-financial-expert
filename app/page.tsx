import Link from 'next/link';
export default function Home(){return <><section className="hero"><div>
 <div className="pill">FINANCIAL SERVICES & WEALTH SOLUTIONS</div>
 <h1>Your financial goals.<br/><span>One trusted solution.</span></h1>
 <p>Explore investment, insurance, loan and wealth solutions designed around your financial needs.</p>
 <div className="actions"><Link className="btn" href="/contact">Start a Conversation</Link><a className="btn alt" href="https://wa.me/919173334069">WhatsApp Me</a></div>
 </div><div className="card heroCard"><h2>Aravind Chaudhary</h2><p className="muted">Financial Services & Wealth Solutions</p><hr/><p>Investment • Insurance • Loans • Portfolio Solutions</p><a className="btn" href="tel:+919173334069">Call +91 91733 34069</a></div></section>
 <section className="section"><h2>Solutions for every stage of your financial journey</h2><p className="muted">Understand your options, compare solutions and take informed financial decisions.</p></section>
 <div className="grid">{[['Investments','Mutual Funds, SIP, Equity, PMS & AIF','/investments'],['IMP','Intelligent Model Portfolio','/imp'],['SWP','Systematic Withdrawal Planning','/swp'],['Insurance','Life, Term & Health Insurance','/insurance'],['Loans','Home, Business & Personal Loans','/loans'],['Financial Awareness','Simple explanations for investors & families','/awareness']].map(([a,b,c])=><Link className="card" href={c} key={a}><h3>{a}</h3><p className="muted">{b}</p><b>Explore →</b></Link>)}</div>
 </> }
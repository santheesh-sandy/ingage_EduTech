# Layout check: every page at 7 screen sizes, logged out and logged in.
# Flags sideways scrolling, content off screen and headings not lined up with the logo.
# Usage: npm start (in another terminal), then:  pip install playwright && playwright install chromium && python3 scripts/check_layout.py
import asyncio, json, os
BASE=os.environ.get('SITE','http://localhost:5173')
from playwright.async_api import async_playwright
U='learner@test.in'
CHECK="""()=>{const W=innerWidth,out=[];if(document.documentElement.scrollWidth>W+1)out.push('page scrolls sideways '+document.documentElement.scrollWidth);
const hw=document.querySelector('header .w'),hl=hw.getBoundingClientRect().left+parseFloat(getComputedStyle(hw).paddingLeft);
const sec=document.querySelector('section.v.on');if(!sec)return['no page'];
const vis=e=>{const s=getComputedStyle(e);return s.display!='none'&&s.visibility!='hidden'&&e.offsetParent!==null};
// page headings (not inside cards/heros/centred blocks) must start where the logo starts
[...sec.querySelectorAll('h1,h2')].filter(vis).filter(h=>!h.closest('.card,.ip-hero,.lh,.cta,[style*="text-align:center"],.ut,.pg-card,.syl-gate,.lc,.hero .g > div:last-child')).forEach(h=>{const l=h.getBoundingClientRect().left;if(Math.abs(l-hl)>3)out.push('heading not aligned with logo ('+Math.round(l)+' vs '+Math.round(hl)+'): '+h.textContent.trim().slice(0,30))});
sec.querySelectorAll('*').forEach(e=>{if(!vis(e))return;const r=e.getBoundingClientRect();if(r.width<2)return;
 if(r.right>W+1&&!e.closest('table,.xd,nav,.ai-p,.utb,.cx-nav,[style*="overflow"]'))out.push('off-screen '+e.tagName+'.'+(e.className||'')+' "'+(e.textContent||'').trim().slice(0,30)+'"')});
// overlapping text: sibling text blocks that intersect
return [...new Set(out)].slice(0,6)}"""
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        pg0=await b.new_page();await pg0.goto(BASE+'/#home');await pg0.wait_for_timeout(300)
        ids=await pg0.evaluate("(()=>{const f=[];mods(cf(1)).forEach(m=>m.ls.forEach(l=>f.push(l.id)));return f})()")
        seed={'sf_sess':{'email':U,'name':'Priya','role':'s'},'sf_enr':{U:{'1':{'txn':'T1','inv':'I','date':'19/11/2026','amt':4999,'list':4999,'pm':'UPI','done':ids[:20]}}},'sf_ms':{U:{'1':[30]}}}
        bad=0
        for W,H in [(1920,1080),(1536,864),(1366,768),(1280,720),(1024,768),(820,1180),(390,844)]:
            for logged in [False,True]:
                ctx=await b.new_context(viewport={'width':W,'height':H});pg=await ctx.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
                await pg.add_init_script("window.AITEASER_MS=1e9;try{if(window.top===window){"+("".join(f"localStorage.setItem({json.dumps(k)},{json.dumps(json.dumps(v))});" for k,v in seed.items()) if logged else "localStorage.clear();")+"}}catch(e){}")
                pages=['learn','next','internship','course:1','courses'] if logged else ['landing','courses','home','internship','about','contact','course:1','course:2','course:6']
                for h in pages:
                    if h.startswith('course:'):
                        await pg.goto(BASE+'/#courses');await pg.wait_for_timeout(200);await pg.evaluate(f"show({h[7:]})")
                    else: await pg.goto(BASE+'/#'+h)
                    await pg.wait_for_timeout(400)
                    iss=await pg.evaluate(CHECK)
                    if iss: bad+=1; print(f"{W} {'in ' if logged else 'out'} {h:<10} {iss}")
                e2=[e for e in errs if 'localStorage' not in e]
                if e2: print(W,'JS errors',e2[:2]); bad+=1
                await ctx.close()
        print('PAGES WITH ISSUES:',bad)
        await b.close()
asyncio.run(main())

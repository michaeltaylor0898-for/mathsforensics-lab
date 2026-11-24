"""Small SVG diagrams for case-file sheets (print-friendly, mm-scaled by width)."""
def graph(x0,x1,y0,y1,curves=(),pts=(),xstep=1,ystep=1,xlab="x",ylab="y",w=110,h=None,xmajor=None,ymajor=None,fn_samples=200,grid_minor=None):
    W=w; H=h or w*(y1-y0)/(x1-x0)
    if H>95: H=95
    pad=10
    sx=lambda v:pad+(v-x0)/(x1-x0)*(W-2*pad)
    sy=lambda v:H-pad-(v-y0)/(y1-y0)*(H-2*pad)
    o=[f'<svg viewBox="0 0 {W} {H}" style="width:{W}mm;height:{H}mm;display:block;margin:2mm 0 1mm 4mm" font-family="DejaVu Sans" font-size="3">']
    def frange(a,b,s):
        v=a
        while v<=b+1e-9: yield round(v,6); v+=s
    if grid_minor:
        for v in frange(x0,x1,grid_minor): o.append(f'<line x1="{sx(v):.2f}" y1="{sy(y0):.2f}" x2="{sx(v):.2f}" y2="{sy(y1):.2f}" stroke="#E4E8F2" stroke-width=".2"/>')
        for v in frange(y0,y1,grid_minor*(ystep/xstep)): o.append(f'<line x1="{sx(x0):.2f}" y1="{sy(v):.2f}" x2="{sx(x1):.2f}" y2="{sy(v):.2f}" stroke="#E4E8F2" stroke-width=".2"/>')
    for v in frange(x0,x1,xstep): o.append(f'<line x1="{sx(v):.2f}" y1="{sy(y0):.2f}" x2="{sx(v):.2f}" y2="{sy(y1):.2f}" stroke="#C9D0E2" stroke-width=".3"/>')
    for v in frange(y0,y1,ystep): o.append(f'<line x1="{sx(x0):.2f}" y1="{sy(v):.2f}" x2="{sx(x1):.2f}" y2="{sy(v):.2f}" stroke="#C9D0E2" stroke-width=".3"/>')
    ax=max(min(0,y1),y0); ay=max(min(0,x1),x0)
    o.append(f'<line x1="{sx(x0):.2f}" y1="{sy(ax):.2f}" x2="{sx(x1)+3:.2f}" y2="{sy(ax):.2f}" stroke="#16203F" stroke-width=".5"/>')
    o.append(f'<line x1="{sx(ay):.2f}" y1="{sy(y0):.2f}" x2="{sx(ay):.2f}" y2="{sy(y1)-3:.2f}" stroke="#16203F" stroke-width=".5"/>')
    if len(xlab)>2: o.append(f'<text x="{(sx(x0)+sx(x1))/2:.2f}" y="{H-1.2:.2f}" text-anchor="middle" font-size="3.2">{xlab}</text>')
    else: o.append(f'<text x="{sx(x1)+3.5:.2f}" y="{sy(ax)+1:.2f}" font-style="italic" font-family="DejaVu Serif" font-size="3.6">{xlab}</text>')
    o.append(f'<text x="{sx(ay)+1.2:.2f}" y="{sy(y1)-3.5:.2f}" font-style="{"normal" if len(ylab)>2 else "italic"}" font-family="{"DejaVu Sans" if len(ylab)>2 else "DejaVu Serif"}" font-size="{3.2 if len(ylab)>2 else 3.6}">{ylab}</text>')
    xm=xmajor or xstep; ym=ymajor or ystep
    for v in frange(x0,x1,xm):
        if abs(v-ay)<1e-9 and x0<0: continue
        o.append(f'<text x="{sx(v):.2f}" y="{sy(ax)+3.8:.2f}" text-anchor="middle">{("%g"%v).replace("-","−")}</text>')
    for v in frange(y0,y1,ym):
        if abs(v-ax)<1e-9: continue
        o.append(f'<text x="{sx(ay)-1.2:.2f}" y="{sy(v)+1:.2f}" text-anchor="end">{("%g"%v).replace("-","−")}</text>')
    for c in curves:
        if callable(c):
            p=[]; 
            for i in range(fn_samples+1):
                xv=x0+(x1-x0)*i/fn_samples; yv=c(xv)
                if y0-0.01<=yv<=y1+0.01: p.append(f"{sx(xv):.2f},{sy(yv):.2f}")
                elif p: o.append(f'<polyline points="{" ".join(p)}" fill="none" stroke="#1B36FF" stroke-width=".7"/>'); p=[]
            if p: o.append(f'<polyline points="{" ".join(p)}" fill="none" stroke="#1B36FF" stroke-width=".7"/>')
        else:
            o.append(f'<polyline points="{" ".join(f"{sx(a):.2f},{sy(b):.2f}" for a,b in c)}" fill="none" stroke="#1B36FF" stroke-width=".7" stroke-linejoin="round"/>')
    for (a,b,l) in pts:
        o.append(f'<circle cx="{sx(a):.2f}" cy="{sy(b):.2f}" r=".8" fill="#16203F"/><text x="{sx(a)+1.5:.2f}" y="{sy(b)-1.2:.2f}" font-size="3.2" font-weight="bold">{l}</text>')
    o.append('</svg>'); return "".join(o)

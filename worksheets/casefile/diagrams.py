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

import math
def tri(P,names=("A","B","C"),sides=None,angles=None,right=None,w=60,h=40,note="Not drawn accurately"):
    """P: three (x,y) points in arbitrary units (y up). sides: {(i,j):label}. angles: {i:label}. right: vertex index."""
    xs=[p[0] for p in P]; ys=[p[1] for p in P]
    pad=8; sc=min((w-2*pad)/max(1e-9,max(xs)-min(xs)),(h-2*pad)/max(1e-9,max(ys)-min(ys)))
    T=[(pad+(px-min(xs))*sc,h-pad-(py-min(ys))*sc) for px,py in P]
    cx=sum(p[0] for p in T)/3; cy=sum(p[1] for p in T)/3
    o=[f'<svg viewBox="0 0 {w} {h}" style="width:{w}mm;height:{h}mm;display:block;margin:2mm 0 1mm 4mm" font-family="DejaVu Sans" font-size="3.2">',
       f'<polygon points="{" ".join(f"{a:.2f},{b:.2f}" for a,b in T)}" fill="#F3F6FC" stroke="#16203F" stroke-width=".5" stroke-linejoin="round"/>']
    for i,(a,b) in enumerate(T):
        dx,dy=a-cx,b-cy; L=math.hypot(dx,dy) or 1
        if names and names[i]: o.append(f'<text x="{a+dx/L*3.2:.2f}" y="{b+dy/L*3.2+1.1:.2f}" text-anchor="middle" font-weight="bold">{names[i]}</text>')
    for (i,j),lab in (sides or {}).items():
        (a,b),(c,d)=T[i],T[j]; mx,my=(a+c)/2,(b+d)/2; dx,dy=mx-cx,my-cy; L=math.hypot(dx,dy) or 1
        o.append(f'<text x="{mx+dx/L*3.4:.2f}" y="{my+dy/L*3.4+1.1:.2f}" text-anchor="middle" fill="#1B36FF">{lab}</text>')
    for i,lab in (angles or {}).items():
        a,b=T[i]; dx,dy=cx-a,cy-b; L=math.hypot(dx,dy) or 1
        o.append(f'<text x="{a+dx/L*7:.2f}" y="{b+dy/L*7+1.1:.2f}" text-anchor="middle" font-size="2.9">{lab}</text>')
    if right is not None:
        a,b=T[right]; n=[T[(right+1)%3],T[(right+2)%3]]
        u=[((p[0]-a)/math.hypot(p[0]-a,p[1]-b),(p[1]-b)/math.hypot(p[0]-a,p[1]-b)) for p in n]; s=2.6
        p1=(a+u[0][0]*s,b+u[0][1]*s); p3=(a+u[1][0]*s,b+u[1][1]*s); p2=(p1[0]+u[1][0]*s,p1[1]+u[1][1]*s)
        o.append(f'<polyline points="{p1[0]:.2f},{p1[1]:.2f} {p2[0]:.2f},{p2[1]:.2f} {p3[0]:.2f},{p3[1]:.2f}" fill="none" stroke="#16203F" stroke-width=".35"/>')
    if note: o.append(f'<text x="{w-1:.2f}" y="{h-1:.2f}" text-anchor="end" font-size="2.4" fill="#5B6585">{note}</text>')
    o.append('</svg>'); return "".join(o)

def cuboid(L,W,H,labels=("ABCD","EFGH"),dims=None,diag=None,w=70,h=48):
    """Oblique cuboid. Bottom ABCD (front-left, front-right, back-right, back-left), top EFGH above. diag: list of (p,q) vertex names to draw dashed."""
    k=0.45; sc=min((w-16)/(L+W*k*0.9),(h-12)/(H+W*k*0.6))
    ox,oy=6,h-6
    def P(x,y,z): return (ox+(x+y*k*0.9)*sc, oy-(z+y*k*0.6)*sc)
    V={"A":P(0,0,0),"B":P(L,0,0),"C":P(L,W,0),"D":P(0,W,0),"E":P(0,0,H),"F":P(L,0,H),"G":P(L,W,H),"H":P(0,W,H)}
    if labels!=("ABCD","EFGH"):
        names=dict(zip("ABCDEFGH",labels[0]+labels[1])); V={names[q]:v for q,v in V.items()}
    n=list(V)
    vis=[(0,1),(1,2),(0,4),(1,5),(2,6),(4,5),(5,6),(6,7),(7,4)]; hid=[(2,3),(3,0),(3,7)]
    o=[f'<svg viewBox="0 0 {w} {h}" style="width:{w}mm;height:{h}mm;display:block;margin:2mm 0 1mm 4mm" font-family="DejaVu Sans" font-size="3.2">']
    for i,j in vis: o.append(f'<line x1="{V[n[i]][0]:.2f}" y1="{V[n[i]][1]:.2f}" x2="{V[n[j]][0]:.2f}" y2="{V[n[j]][1]:.2f}" stroke="#16203F" stroke-width=".5"/>')
    for i,j in hid: o.append(f'<line x1="{V[n[i]][0]:.2f}" y1="{V[n[i]][1]:.2f}" x2="{V[n[j]][0]:.2f}" y2="{V[n[j]][1]:.2f}" stroke="#16203F" stroke-width=".35" stroke-dasharray="1,1"/>')
    for p,q in (diag or []): o.append(f'<line x1="{V[p][0]:.2f}" y1="{V[p][1]:.2f}" x2="{V[q][0]:.2f}" y2="{V[q][1]:.2f}" stroke="#1B36FF" stroke-width=".5" stroke-dasharray="1.6,.8"/>')
    off={0:(-2.5,3),1:(2,3),2:(2.5,1),3:(-2.5,-1),4:(-2.5,-1),5:(1.5,-1.5),6:(2.5,-1),7:(-2.5,-1.5)}
    for i,q in enumerate(n): o.append(f'<text x="{V[q][0]+off[i][0]:.2f}" y="{V[q][1]+off[i][1]:.2f}" text-anchor="middle" font-weight="bold">{q}</text>')
    if dims:
        a,b,c=dims
        (x1,y1),(x2,y2)=V[n[0]],V[n[1]]; o.append(f'<text x="{(x1+x2)/2:.2f}" y="{y1+4:.2f}" text-anchor="middle" fill="#1B36FF">{a}</text>')
        (x1,y1),(x2,y2)=V[n[1]],V[n[2]]; o.append(f'<text x="{(x1+x2)/2+3:.2f}" y="{(y1+y2)/2+2.5:.2f}" fill="#1B36FF">{b}</text>')
        (x1,y1),(x2,y2)=V[n[2]],V[n[6]]; o.append(f'<text x="{x1+1.5:.2f}" y="{(y1+y2)/2:.2f}" fill="#1B36FF">{c}</text>')
    o.append('</svg>'); return "".join(o)

def venn(a="A",b="B",only_a="",both="",only_b="",out="",w=80,h=46,title="ξ"):
    o=[f'<svg viewBox="0 0 {w} {h}" style="width:{w}mm;height:{h}mm;display:block;margin:2mm 0 1mm 4mm" font-family="DejaVu Sans" font-size="3.4">',
       f'<rect x="1" y="1" width="{w-2}" height="{h-2}" rx="1.5" fill="none" stroke="#16203F" stroke-width=".5"/>',
       f'<text x="3" y="5.5" font-family="DejaVu Serif" font-style="italic">{title}</text>']
    r=h*0.34; cy=h/2+1; c1=w/2-r*0.55; c2=w/2+r*0.55
    o.append(f'<circle cx="{c1:.2f}" cy="{cy:.2f}" r="{r:.2f}" fill="rgba(0,169,159,.08)" stroke="#00A99F" stroke-width=".6"/>')
    o.append(f'<circle cx="{c2:.2f}" cy="{cy:.2f}" r="{r:.2f}" fill="rgba(27,54,255,.06)" stroke="#1B36FF" stroke-width=".6"/>')
    o.append(f'<text x="{c1-r*0.75:.2f}" y="{cy-r*0.82:.2f}" font-weight="bold" fill="#00A99F">{a}</text><text x="{c2+r*0.6:.2f}" y="{cy-r*0.82:.2f}" font-weight="bold" fill="#1B36FF">{b}</text>')
    for xx,v in ((c1-r*0.5,only_a),(w/2,both),(c2+r*0.5,only_b)): o.append(f'<text x="{xx:.2f}" y="{cy+1.2:.2f}" text-anchor="middle">{v}</text>')
    o.append(f'<text x="{w-5:.2f}" y="{h-4:.2f}" text-anchor="end">{out}</text></svg>'); return "".join(o)

def tree(first,second,w=100,h=56):
    """first: [(label, prob)], second: [[(label, prob)] per first branch]. Probabilities may be '' for students to fill."""
    o=[f'<svg viewBox="0 0 {w} {h}" style="width:{w}mm;height:{h}mm;display:block;margin:2mm 0 1mm 4mm" font-family="DejaVu Sans" font-size="3.2">']
    x0,x1=4,34; n1=len(first); ys1=[h*(i+0.5)/n1 for i in range(n1)]
    def pl(xa,ya,xb,yb,txt,up):
        mx,my=(xa+xb)/2,(ya+yb)/2
        return f'<text x="{mx:.2f}" y="{my+(-1.8 if up else 4.2):.2f}" text-anchor="middle" fill="#1B36FF">{txt or "……"}</text>'
    for i,((lab,p),yy) in enumerate(zip(first,ys1)):
        o.append(f'<line x1="{x0}" y1="{h/2:.2f}" x2="{x1}" y2="{yy:.2f}" stroke="#16203F" stroke-width=".45"/>')
        o.append(f'<text x="{x1+1}" y="{yy+1.1:.2f}">{lab}</text>')
        o.append(pl(x0,h/2,x1,yy,p,yy<h/2))
        xs=x1+2+len(lab)*1.95; xe=xs+26
        sub=second[i]; m=len(sub)
        for j,(l2,p2) in enumerate(sub):
            y2=yy+(j-(m-1)/2)*(h/n1/m)*0.95
            o.append(f'<line x1="{xs:.2f}" y1="{yy:.2f}" x2="{xe:.2f}" y2="{y2:.2f}" stroke="#16203F" stroke-width=".45"/>')
            o.append(f'<text x="{xe+1:.2f}" y="{y2+1.1:.2f}">{l2}</text>')
            o.append(pl(xs,yy,xe,y2,p2,y2<yy))
    o.append('</svg>'); return "".join(o)

def circ(pts,segs=(),center="O",angles=None,tangents=(),extra=None,w=50,h=44,note="Not drawn accurately"):
    """pts: {name: degrees on circle (0 = right, anticlockwise)} or {name: (x,y)} for points off the circle (unit-circle coords).
    segs: [(p,q)] chords/lines. angles: {(p,vertex,q): label}. tangents: [(point, extend_units)] draws tangent line through point."""
    import math
    R=min(w,h)*0.33; cx=w/2; cy=h/2+1
    P={}
    for n,v in pts.items():
        if isinstance(v,tuple): P[n]=(cx+v[0]*R, cy-v[1]*R)
        else: P[n]=(cx+R*math.cos(math.radians(v)), cy-R*math.sin(math.radians(v)))
    if center: P[center]=(cx,cy)
    o=[f'<svg viewBox="0 0 {w} {h}" style="width:{w}mm;height:{h}mm;display:block;margin:2mm 0 1mm 4mm" font-family="DejaVu Sans" font-size="3.2">',
       f'<circle cx="{cx}" cy="{cy}" r="{R:.2f}" fill="#F7F9FD" stroke="#16203F" stroke-width=".5"/>']
    for t,ext in tangents:
        x,y=P[t]; dx,dy=x-cx,y-cy; L=math.hypot(dx,dy); ux,uy=-dy/L,dx/L
        o.append(f'<line x1="{x-ux*ext*R:.2f}" y1="{y-uy*ext*R:.2f}" x2="{x+ux*ext*R:.2f}" y2="{y+uy*ext*R:.2f}" stroke="#16203F" stroke-width=".5"/>')
    for p,q in segs: o.append(f'<line x1="{P[p][0]:.2f}" y1="{P[p][1]:.2f}" x2="{P[q][0]:.2f}" y2="{P[q][1]:.2f}" stroke="#16203F" stroke-width=".45"/>')
    if center: o.append(f'<circle cx="{cx}" cy="{cy}" r=".7" fill="#16203F"/>')
    for n,(x,y) in P.items():
        dx,dy=x-cx,y-cy; L=math.hypot(dx,dy)
        if L<0.1: lx,ly=x+2.2,y+3.6
        else: lx,ly=x+dx/L*3.4,y+dy/L*3.4+1.1
        o.append(f'<text x="{lx:.2f}" y="{ly:.2f}" text-anchor="middle" font-weight="bold">{n}</text>')
    for (p,v,q),lab in (angles or {}).items():
        vx,vy=P[v]; a1=(P[p][0]-vx,P[p][1]-vy); a2=(P[q][0]-vx,P[q][1]-vy)
        l1=math.hypot(*a1); l2=math.hypot(*a2); bx=a1[0]/l1+a2[0]/l2; by=a1[1]/l1+a2[1]/l2; bl=math.hypot(bx,by) or 1
        o.append(f'<text x="{vx+bx/bl*6.5:.2f}" y="{vy+by/bl*6.5+1.1:.2f}" text-anchor="middle" font-size="2.9" fill="#1B36FF">{lab}</text>')
    if extra: o.append(extra(P,cx,cy,R))
    if note: o.append(f'<text x="{w-1:.2f}" y="{h-1:.2f}" text-anchor="end" font-size="2.4" fill="#5B6585">{note}</text>')
    o.append('</svg>'); return "".join(o)

def poly(P,names=None,segs=None,sides=None,angles=None,w=80,h=42,note="Not drawn accurately",fill=True):
    """Generic figure: P = {name:(x,y)} (y up). segs: [(p,q)] lines; sides {(p,q):label}; angles {(p,v,q):label}."""
    import math
    xs=[v[0] for v in P.values()]; ys=[v[1] for v in P.values()]; pad=7
    sc=min((w-2*pad)/max(1e-9,max(xs)-min(xs)),(h-2*pad)/max(1e-9,max(ys)-min(ys)))
    T={n:(pad+(x-min(xs))*sc, h-pad-(y-min(ys))*sc) for n,(x,y) in P.items()}
    cx=sum(v[0] for v in T.values())/len(T); cy=sum(v[1] for v in T.values())/len(T)
    o=[f'<svg viewBox="0 0 {w} {h}" style="width:{w}mm;height:{h}mm;display:block;margin:2mm 0 1mm 4mm" font-family="DejaVu Sans" font-size="3.2">']
    for p,q in segs: o.append(f'<line x1="{T[p][0]:.2f}" y1="{T[p][1]:.2f}" x2="{T[q][0]:.2f}" y2="{T[q][1]:.2f}" stroke="#16203F" stroke-width=".5"/>')
    for n,(x,y) in T.items():
        nb=[T[q] if p==n else T[p] for p,q in segs if n in (p,q)]
        if nb:
            mx=sum(a for a,b in nb)/len(nb); my=sum(b for a,b in nb)/len(nb); dx,dy=x-mx,y-my
        else: dx,dy=x-cx,y-cy
        L=math.hypot(dx,dy) or 1
        o.append(f'<text x="{x+dx/L*3.2:.2f}" y="{y+dy/L*3.2+1.1:.2f}" text-anchor="middle" font-weight="bold">{n}</text>')
    for (p,q),lab in (sides or {}).items():
        (a,b),(c,d)=T[p],T[q]; mx,my=(a+c)/2,(b+d)/2; nx,ny=-(d-b),(c-a); L=math.hypot(nx,ny) or 1
        s=1 if (nx*(mx-cx)+ny*(my-cy))>=0 else -1
        o.append(f'<text x="{mx+s*nx/L*3.2:.2f}" y="{my+s*ny/L*3.2+1.1:.2f}" text-anchor="middle" fill="#1B36FF">{lab}</text>')
    for (p,v,q),lab in (angles or {}).items():
        vx,vy=T[v]; a1=(T[p][0]-vx,T[p][1]-vy); a2=(T[q][0]-vx,T[q][1]-vy)
        l1=math.hypot(*a1); l2=math.hypot(*a2); bx=a1[0]/l1+a2[0]/l2; by=a1[1]/l1+a2[1]/l2; bl=math.hypot(bx,by) or 1
        o.append(f'<text x="{vx+bx/bl*6:.2f}" y="{vy+by/bl*6+1.1:.2f}" text-anchor="middle" font-size="2.9" fill="#1B36FF">{lab}</text>')
    if note: o.append(f'<text x="{w-1:.2f}" y="{h-1:.2f}" text-anchor="end" font-size="2.4" fill="#5B6585">{note}</text>')
    o.append('</svg>'); return "".join(o)

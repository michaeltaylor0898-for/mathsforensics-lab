import subprocess, glob, os
R = os.path.dirname(os.path.abspath(__file__)) + '/../'
PU = glob.glob(R + 'rec/pursuit/*.webm')[0]; IV = glob.glob(R + 'rec/interrogation/*.webm')[0]
def cap(eb, title):
    # lower third: navy band, cyan rule, mono eyebrow, bold title
    t = lambda s: s.replace(':', r'\:').replace("'", "’")
    return (f"drawbox=x=0:y=ih-150:w=iw:h=150:color=0x070C20@0.88:t=fill,drawbox=x=60:y=ih-112:w=36:h=4:color=0x00FCF1:t=fill,"
            f"drawtext=fontfile=JBMono.ttf:text='{t(eb)}':fontcolor=0x00FCF1:fontsize=22:x=110:y=h-122,"
            f"drawtext=fontfile=JosefinBold.ttf:text='{t(title)}':fontcolor=0xEAF0FF:fontsize=44:x=60:y=h-84")
FADE = lambda d: f"fade=t=in:st=0:d=0.35,fade=t=out:st={d-0.35}:d=0.35"
def clip(out, src, ss, d, eb, title):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(ss), '-t', str(d), '-i', src, '-vf',
        f"fps=30,scale=1280:720,setsar=1,{cap(eb, title)},{FADE(d)}", '-an', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p', out], check=True)
def still(out, img, d, eb, title):
    n = int(d * 30)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-loop', '1', '-i', img, '-vf',
        f"scale=1920:1200,zoompan=z='1+0.06*on/{n}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={n}:s=1280x800:fps=30,crop=1280:720:0:20,setsar=1,{cap(eb, title)},{FADE(d)}",
        '-t', str(d), '-an', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p', out], check=True)
def card(out, d):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'lavfi', '-i', f'color=c=0x0B122C:s=1280x720:d={d}:r=30', '-vf',
        "drawtext=fontfile=JBMono.ttf:text='MATHS FORENSICS HQ':fontcolor=0x00FCF1:fontsize=26:x=(w-tw)/2:y=h/2-90,"
        "drawtext=fontfile=JosefinBold.ttf:text='The Incident Room':fontcolor=0xEAF0FF:fontsize=78:x=(w-tw)/2:y=h/2-40,"
        "drawtext=fontfile=JosefinBold.ttf:text='Solo, with friends or as a whole class':fontcolor=0x9AA6CC:fontsize=34:x=(w-tw)/2:y=h/2+60,"
        + FADE(d), '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p', out], check=True)
card('s0.mp4', 2.6)
clip('s1.mp4', PU, 16.5, 7, 'HOT PURSUIT · FREE', 'Get the reward to HQ before your Shadow catches you')
clip('s2.mp4', IV, 14.5, 7.5, 'THE INTERROGATION', 'Two right in a row: promoted to Inspector')
still('s3.mp4', R + 'stills/vault.png', 3.6, 'THE POLYNOMIAL VAULT', 'Drag in the brackets, crack ten algebra locks')
still('s4.mp4', R + 'stills/harbour.png', 3.6, 'HARBOUR WATCH', 'Prove your firing solution to hit the boats')
still('s5.mp4', R + 'stills/home.png', 3.2, 'ONE CODE ON THE BOARD', 'Every student joins on their own device')
card('s6.mp4', 2.6)
open('list.txt', 'w').write(''.join(f"file 's{i}.mp4'\n" for i in range(7)))
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', 'list.txt', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '23', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', 'incident-room-tour.mp4'], check=True)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', '20', '-i', 'incident-room-tour.mp4', '-frames:v', '1', '-q:v', '3', 'incident-room-poster.jpg'], check=True)
print('done')

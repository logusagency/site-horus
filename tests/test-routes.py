#!/usr/bin/env python3
"""Exercise nginx inside a network-none local container, including missing form behavior."""
import hashlib, pathlib, subprocess, time, uuid
root=pathlib.Path(__file__).resolve().parents[1]
name='horus-site-qa-'+uuid.uuid4().hex[:12]
def run(args,**kw): return subprocess.run(args,capture_output=True,text=True,**kw)
try:
    r=run(['docker','build','--network=none','-t','horus-site-esfinge-1310:local','.'],cwd=root)
    assert r.returncode==0,r.stderr
    r=run(['docker','run','--pull=never','-d','--network','none','--name',name,'horus-site-esfinge-1310:local'])
    assert r.returncode==0,r.stderr
    for _ in range(40):
        r=run(['docker','exec',name,'wget','-qO-','http://127.0.0.1/formulario'])
        if r.returncode==0: break
        time.sleep(.1)
    assert r.returncode==0,r.stderr
    assert 'id="lead-form"' in r.stdout and 'id="privacy"' in r.stdout
    assert hashlib.sha256(r.stdout.encode()).hexdigest()==hashlib.sha256((root/'formulario.html').read_bytes()).hexdigest()
    print('PASS /formulario serves exact formulario.html with form and consent')
    r=run(['docker','exec',name,'wget','-qO-','http://127.0.0.1/formulario?utm_source=instagram'])
    assert r.returncode==0 and 'id="lead-form"' in r.stdout
    print('PASS campaign query preserves form route')
    for route in ['/','/politica-privacidade','/public/horus-lead-config.js']:
        r=run(['docker','exec',name,'wget','-qO-',f'http://127.0.0.1{route}'])
        assert r.returncode==0,r.stderr
        print('PASS HTTP 200 '+route)
    # Mutate only the disposable test container to prove missing file cannot become homepage 200.
    r=run(['docker','exec',name,'mv','/usr/share/nginx/html/formulario.html','/tmp/formulario.html'])
    assert r.returncode==0,r.stderr
    r=run(['docker','exec',name,'wget','-S','-O','/dev/null','http://127.0.0.1/formulario'])
    assert '404 Not Found' in r.stderr,r.stderr
    print('PASS missing formulario.html returns 404, not false 200/homepage')
    r=run(['docker','image','inspect','horus-site-esfinge-1310:local','--format','{{.Id}}'])
    print('LOCAL IMAGE '+r.stdout.strip())
    print('ALL 6 NGINX CHECKS PASSED (network=none, no host ports)')
finally:
    run(['docker','rm','-f',name])

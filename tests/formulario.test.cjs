const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');
const html = fs.readFileSync('formulario.html','utf8');
const source = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].at(-1)[1];
const leadId = '12345678-1234-4234-8234-123456789abc';
function setup(reply, config = {endpoint:'http://localhost:54321/functions/v1/register-inbound-lead',turnstileSiteKey:'mock',whatsappNumber:''}) {
  const dom = new JSDOM(html, {url:'http://localhost:3000/formulario?utm_source=instagram',runScripts:'outside-only'});
  const w = dom.window; let calls = []; let widgetOptions;
  w.HORUS_LEAD_CONFIG = config;
  w.matchMedia = () => ({matches:true}); w.IntersectionObserver = class {observe(){} unobserve(){}};
  w.CSS = {escape:v=>v}; w.HTMLElement.prototype.scrollIntoView = () => {};
  w.AbortSignal = AbortSignal;
  w.turnstile = {render:(el,options)=>{widgetOptions=options; options.callback('mock-proof');return 'widget';},reset:()=>{}};
  w.fetch = async (url,options)=>{calls.push({url,options});if(reply instanceof Error) throw reply;return reply;};
  w.eval(source);
  for(const [id,value] of Object.entries({nome:'QA Local',whatsapp:'11999990000',email:'qa@example.invalid',profissao:'Dev'})) w.document.getElementById(id).value=value;
  w.document.getElementById('privacy').checked=true;
  const submit = async()=>{w.document.getElementById('lead-form').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));await new Promise(resolve=>setImmediate(resolve));};
  return {dom,w,calls,submit,proof:()=>widgetOptions?.callback('new-proof')};
}
for(const status of [401,400,500,429]) test(`HTTP ${status}: preserves fields, error visible, no success`,async()=>{
  const x=setup(new Response(JSON.stringify({lead_id:leadId}),{status}));await x.submit();
  assert.equal(x.calls.length,1); assert.equal(x.w.document.getElementById('lead-form').classList.contains('hidden'),false);
  assert.equal(x.w.document.getElementById('success-state').classList.contains('hidden'),true);
  assert.equal(x.w.document.getElementById('submit-error').hidden,false);
  assert.equal(x.w.document.getElementById('nome').value,'QA Local'); assert.equal(x.w.document.getElementById('submit-btn').disabled,false);x.dom.window.close();
});
for(const [name,reply] of [['network',Error('offline')],['invalid JSON',new Response('invalid')],['no ID',new Response('{}')],['invalid ID',new Response('{"lead_id":"fake"}')]]) test(`${name}: does not confirm`,async()=>{
  const x=setup(reply);await x.submit(); assert.equal(x.w.document.getElementById('success-state').classList.contains('hidden'),true);assert.equal(x.w.document.getElementById('submit-error').hidden,false);x.dom.window.close();
});
for(const status of [200,201]) test(`HTTP ${status} plus UUID: confirms and sends consent`,async()=>{
  const x=setup(new Response(JSON.stringify({lead_id:leadId}),{status}));await x.submit();
  assert.equal(x.w.document.getElementById('success-state').classList.contains('hidden'),false);
  const body=JSON.parse(x.calls[0].options.body);assert.deepEqual(body.consentimento,{aceito:true,versao:'horus-contato-2026-10-13'});assert.equal(body.origem,'inbound_instagram');assert.equal(body.turnstile_token,'mock-proof');
  assert.equal(x.w.document.getElementById('wa-success').hidden,true);x.dom.window.close();
});
test('missing consent: no request',async()=>{const x=setup(new Response('{}'));x.w.document.getElementById('privacy').checked=false;await x.submit();assert.equal(x.calls.length,0);x.dom.window.close();});
test('missing configuration: no request, visible error',async()=>{const x=setup(new Response('{}'),{});await x.submit();assert.equal(x.calls.length,0);assert.equal(x.w.document.getElementById('submit-error').hidden,false);x.dom.window.close();});
test('consumed proof requires a new verification before retry',async()=>{const x=setup(new Response('',{status:500}));await x.submit();await x.submit();assert.equal(x.calls.length,1);x.proof();await x.submit();assert.equal(x.calls.length,2);x.dom.window.close();});
test('visible consent matches frozen server wording',()=>{const dom=new JSDOM(html);const text=dom.window.document.querySelector('.check-wrap').textContent.replace(/\s+/g,' ').trim();assert.ok(text.includes('Li a Política de Privacidade e autorizo o tratamento dos meus dados para contato pela Hórus.'));dom.window.close();});

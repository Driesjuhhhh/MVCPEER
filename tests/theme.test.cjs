const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync, readdirSync } = require('node:fs');
const vm = require('node:vm');
const source = readFileSync('js/theme.js', 'utf8');
function setup(values = {}, systemDark = false, blocked = false) {
  const stored = new Map(Object.entries(values));
  const classes = new Set();
  const events = {};
  const windowEvents = {};
  const buttons = [0, 1].map(() => ({ attrs: {}, setAttribute(k,v) { this.attrs[k]=v; }, addEventListener(k,fn) { this[k]=fn; } }));
  const media = { matches: systemDark, addEventListener(k,fn) { this[k]=fn; } };
  const root = { style: {}, classList: { contains: k => classes.has(k), toggle(k,on) { if(on) classes.add(k); else classes.delete(k); } } };
  vm.runInNewContext(source, {
    document: { documentElement: root, querySelectorAll: () => buttons, addEventListener: (k,fn) => events[k]=fn },
    window: { matchMedia: () => media, addEventListener: (k,fn) => windowEvents[k]=fn },
    localStorage: { getItem(k) { if(blocked) throw Error(); return stored.get(k) ?? null; }, setItem(k,v) { if(blocked) throw Error(); stored.set(k,v); }, removeItem(k) { stored.delete(k); } }
  });
  return { stored, root, events, buttons, media, windowEvents, dark: () => classes.has('dark') };
}
test('saved preference applies before DOMContentLoaded and wins over system and legacy values', () => {
  for(const mode of ['light','dark']) {
    const s=setup({'color-theme':mode,theme:mode==='dark'?'light':'dark'},mode==='light');
    assert.equal(s.dark(),mode==='dark');
    s.events.DOMContentLoaded();
    s.buttons[0].click();
    assert.equal(s.dark(),mode!=='dark');
    assert.equal(s.stored.get('color-theme'),mode==='dark'?'light':'dark');
    assert.equal(s.buttons[1].attrs['aria-pressed'],String(s.dark()));
    s.buttons[1].click();
    assert.equal(s.dark(),mode==='dark');
  }
});
test('system changes apply only without an explicit choice', () => {
  const s=setup({},true); assert.equal(s.dark(),true);
  s.media.matches=false; s.media.change(); assert.equal(s.dark(),false);
  s.events.DOMContentLoaded();s.buttons[0].click();
  s.media.change();assert.equal(s.dark(),true);
});
test('legacy choices and unavailable storage are supported', () => {
  assert.equal(setup({theme:'dark'}).dark(),true);
  assert.equal(setup({darkmode:'true'}).dark(),true);
  const s=setup({},false,true);s.events.DOMContentLoaded();s.buttons[0].click();assert.equal(s.dark(),true);
});
test('theme synchronizes across browser tabs', () => {
  const s=setup();s.stored.set('color-theme','dark');s.windowEvents.storage({key:'color-theme'});assert.equal(s.dark(),true);
});
test('every HTML page loads shared theme before Tailwind, with no competing theme handlers', () => {
  for(const file of readdirSync('.').filter(f=>f.endsWith('.html'))) {
    const html=readFileSync(file,'utf8');
    assert.equal((html.match(/src="js\/theme.js"/g)||[]).length,1,file);
    const tailwind=html.indexOf('src="https://cdn.tailwindcss.com');
    if(tailwind>=0) assert.ok(html.indexOf('src="js/theme.js"')<tailwind,file);
    assert.ok(!/localStorage\.(getItem|setItem)\(['"](?:theme|color-theme|darkmode)['"]/.test(html),file);
  }
});

'use strict';
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.join(root,f),'utf8'),pkg=JSON.parse(read('package.json'));
assert.equal(pkg.version,'11.0.0');assert.equal(pkg.build.appId,'com.nova.browser');assert.deepEqual(pkg.build.win.target,['nsis','portable']);
const {normalizeHttpOrigin,isHttpOrigin,permissionKeysForRequest,permissionDecision}=require('../permission-policy.js');
assert.deepEqual(permissionKeysForRequest('media',{mediaTypes:['audio','video']}),['cam','mic']);
assert.equal(permissionDecision(['cam','mic'],'example.com',{'example.com':{cam:'allow'}},{}),'ask');
assert.equal(permissionDecision(['cam','mic'],'example.com',{'example.com':{cam:'allow',mic:'block'}},{}),'block');
assert.equal(normalizeHttpOrigin('https://EXAMPLE.com:443/path'),'https://example.com');assert.equal(isHttpOrigin('file:///tmp/x'),false);
const {configurePortableUserData}=require('../portable-user-data.js');const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'nova-quantum-qa-'));
try{
 const profile=path.join(tmp,'win-profile'),session=path.join(tmp,'win-session');fs.mkdirSync(profile);fs.mkdirSync(session);fs.writeFileSync(path.join(profile,'prefs.json'),'legacy');
 const appMock={paths:{userData:profile,sessionData:session},getPath(n){return this.paths[n]},setPath(n,v){this.paths[n]=v}};const log={info(){},warn(){}};
 const regular=configurePortableUserData(appMock,{}, {logger:log});assert.equal(regular.active,false);assert.equal(appMock.paths.userData,profile);
 const dir=path.join(tmp,'Portable');fs.mkdirSync(dir);const exe=path.join(dir,'NOVA-X-QUANTUM-Portable-11.0.0.exe');fs.writeFileSync(exe,'exe');
 const freshApp={paths:{userData:profile,sessionData:session},getPath(n){return this.paths[n]},setPath(n,v){this.paths[n]=v}};
 const portable=configurePortableUserData(freshApp,{PORTABLE_EXECUTABLE_FILE:exe,PORTABLE_EXECUTABLE_DIR:dir},{logger:log});assert.equal(portable.active,true);assert.equal(portable.migrated,false);assert.equal(portable.path,path.join(dir,'User Data'));
 assert.ok(fs.existsSync(path.join(dir,'User Data')));assert.ok(fs.existsSync(path.join(profile,'prefs.json')));
}finally{fs.rmSync(tmp,{recursive:true,force:true})}
const nav=require('../shell/navigation.js');assert.equal(nav.resolveNavigation('example.com'),'https://example.com/');assert.ok(nav.resolveNavigation('palabra clave').startsWith('https://www.google.com/search?q='));assert.ok(nav.resolveNavigation('javascript:alert(1)').startsWith('https://www.google.com/search?q='));
const inline=[...read('shell/newtab.html').matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(x=>x[1]).filter(Boolean);assert.ok(inline.length);inline.forEach((s,i)=>new vm.Script(s,{filename:`newtab-${i}.js`}));
const main=read('main.js'),renderer=read('shell/nova.js'),preload=read('shell/preload.js');assert.ok(main.includes("app.setName('NOVA X')"));assert.ok(main.includes('127.0.0.1:11434'));assert.ok(main.indexOf("app.on('web-contents-created'")<main.indexOf('createMain();'));
assert.ok(/nodeIntegration:\s*false/.test(main)&&/contextIsolation:\s*true/.test(main));assert.ok(preload.includes('profiles-create')&&preload.includes('vault-save'));
assert.ok(renderer.includes('QUANTUM Capsules')||read('shell/quantum.js').includes('QUANTUM Capsules'));
console.log('QA NOVA X QUANTUM: PASS — URL policy, permission policy, portable isolation, renderer scripts and core wiring.');

"use strict";
const fs=require("fs"),path=require("path"); const root=path.resolve(__dirname,".."); const R=f=>fs.readFileSync(path.join(root,f),"utf8"); const E=f=>fs.existsSync(path.join(root,f)); let bad=0; const fail=m=>{console.error("CHECK FAIL:",m);bad++}; const ok=m=>console.log("CHECK OK:",m);
let p;try{p=JSON.parse(R("package.json"))}catch{fail("package.json");process.exit(1)}
if(p.version!=="5.3.0")fail("version");else ok("version 5.3.0"); if(!p.main||!E(p.main))fail("main entry");else ok("main entry");
for(const f of ["shell/index.html","shell/newtab.html","shell/quantum.css","shell/quantum-newtab.css","shell/quantum-base.css","shell/nova50.js","shell/nova51.js","shell/nova52.js","assets/icon.png","assets/icon.ico"])if(!E(f))fail("missing "+f);else ok("exists "+f);
const idx=R("shell/index.html");if(idx.includes("themes.css"))fail("legacy themes.css linked");if(!idx.includes('nova51.js'))fail("nova51 not loaded");if(!idx.includes('id="nt"'))fail("new tab button missing");
if(E("shell/themes.css"))fail("legacy themes file present");if(E("assets/logos"))fail("legacy logos folder present");
if(!p.build?.files?.includes("shell/**")||!p.build?.files?.includes("assets/**"))fail("electron-builder package globs");else ok("builder globs");
if(bad){process.exit(1)} console.log("Nova 5.3.0 project checks OK");

import{a5 as F,a1 as W,I as $,J as O,ag as z,S as B,k as L,av as k,aw as T,m as E,ax as D,ay as H,az as G,ah as R}from"./entry.c0e09020.js";import{r as Q}from"./asyncData.6d7b50d8.js";import V from"./ContentPreviewMode.4ce6df23.js";/* empty css                               */const X=(a=[],s,c)=>{const u=[...s||[]],m=[...c||[]],p=JSON.parse(JSON.stringify(a));for(const i of u)if(i.oldPath)if(m.splice(m.findIndex(l=>l.path===i.oldPath),1),u.find(l=>l.path===i.oldPath))p.push({path:i.path,parsed:i.parsed});else{const l=p.find(g=>g.path===i.oldPath);l&&(l.path=i.path,i.parsed?l.parsed=i.parsed:i.pathMeta&&["_file","_path","_id","_locale"].forEach(g=>{l.parsed[g]=i.pathMeta[g]}))}else if(i.new)p.push({path:i.path,parsed:i.parsed});else{const f=p.find(l=>l.path===i.path);f&&Object.assign(f,{path:i.path,parsed:i.parsed})}for(const i of m)p.splice(p.findIndex(f=>f.path===i.path),1);const P=new Intl.Collator(void 0,{numeric:!0});return p.sort((i,f)=>P.compare(i.path,f.path)),p},K=".studio",C={appConfig:`${K}/app.config.json`,tokensConfig:`${K}/tokens.config.json`},Y=a=>{let s;return(...c)=>(s||(s=a()),s)};function M(a,s){for(const c in a){const u=s[c];c in s||delete a[c],u!==null&&typeof u=="object"&&M(a[c],s[c])}}function U(a,s){for(const c in s){const u=s[c];u!==null&&typeof u=="object"?(a[c]=a[c]||{},U(a[c],u)):a[c]=u}}const Z=Y(()=>JSON.parse(JSON.stringify(E()))),se=()=>{const a=F(),{studio:s,content:c}=W().public;$();const u=Z();let m;const p=O("studio-client-db",()=>null),P=O("studio-preview-db-files",()=>[]);p.value||(a.hook("content:storage",e=>{p.value=e}),z("/non-existing-path").findOne());const i=async(e,t,o=!0)=>{const d=k("previewToken",{sameSite:"none",secure:!0}),n=await e.getKeys(`${d.value}:`);await Promise.all(n.map(v=>e.removeItem(v)));const r=new Set(t.map(v=>v.parsed._id.split(":").shift()));await e.setItem(`${d.value}$`,JSON.stringify({ignoreSources:Array.from(r)})),await Promise.all(t.map(v=>e.setItem(`${d.value}:${v.parsed._id}`,JSON.stringify(v.parsed))))},f=e=>{const t=T(a,E);U(t,D(e,u)),e||M(t,u)},l=e=>{var o,d,n,r;const t=(r=(n=(d=(o=a==null?void 0:a.vueApp)==null?void 0:o._context)==null?void 0:d.config)==null?void 0:n.globalProperties)==null?void 0:r.$pinceauTheme;!t||!(t!=null&&t.updateTheme)||(m||(m=JSON.parse(JSON.stringify((t==null?void 0:t.theme.value)||{}))),T(a,t.updateTheme,[D(e,m)]))},g=async e=>{if(P.value=e.files=e.files||P.value||[],!p.value)return!1;const t=X(e.files,e.additions,e.deletions),o=t.filter(r=>!r.path.startsWith(K));await i(p.value,o,(e.files||[]).length!==0);const d=t.find(r=>r.path===C.appConfig);f(d==null?void 0:d.parsed);const n=t.find(r=>r.path===C.tokensConfig);return l(n==null?void 0:n.parsed),x(),!0},N=async()=>{const e=k("previewToken",{sameSite:"none",secure:!0});await $fetch("api/projects/preview/sync",{baseURL:s==null?void 0:s.apiURL,method:"POST",params:{token:e.value}})},b=()=>{const e=k("previewToken",{sameSite:"none",secure:!0}),t=document.createElement("div");t.id="__nuxt_preview_wrapper",document.body.appendChild(t),H(V,{previewToken:e,apiURL:s==null?void 0:s.apiURL,syncPreview:g,requestPreviewSyncAPI:N}).mount(t)},_=async e=>{var d,n,r;const t=k("previewToken",{sameSite:"none",secure:!0});if(!e)return null;e=e.replace(/\/$/,"");let o=await((d=p.value)==null?void 0:d.getItem(`${t.value}:${e}`));return o||(o=await((n=p.value)==null?void 0:n.getItem(`cached:${e}`))),o||(o=o=await((r=p.value)==null?void 0:r.getItem(e))),o},A=e=>{var o;const t=k("previewToken",{sameSite:"none",secure:!0});p.value&&p.value.setItem(`${t.value}:${(o=e.parsed)==null?void 0:o._id}`,JSON.stringify(e.parsed))},J=async e=>{var o;const t=k("previewToken",{sameSite:"none",secure:!0});await((o=p.value)==null?void 0:o.removeItem(`${t.value}:${e}`))},x=async()=>{if(c!=null&&c.documentDriven){const{pages:e}=T(a,G);for(const t in e.value)e.value[t]&&(e.value[t]=await _(e.value[t]._id))}T(a,Q)};return{apiURL:s==null?void 0:s.apiURL,contentStorage:p,syncPreviewFiles:i,syncPreviewAppConfig:f,syncPreviewTokensConfig:l,requestPreviewSynchronization:N,findContentWithId:_,updateContent:A,removeContentWithId:J,requestRerender:x,mountPreviewUI:b,initiateIframeCommunication:q};function q(){if(!window.parent||window.self===window.parent)return;const e=B(),t=L(""),o=L(!0),d=n=>({path:n.path,query:R(n.query),params:R(n.params),fullPath:n.fullPath,meta:R(n.meta)});window.addEventListener("keydown",n=>{(n.metaKey||n.ctrlKey||n.altKey||n.shiftKey)&&window.parent.postMessage({type:"nuxt-studio:preview:keydown",payload:{key:n.key,metaKey:n.metaKey,ctrlKey:n.ctrlKey,shiftKey:n.shiftKey,altKey:n.altKey}},"*")}),window.addEventListener("message",async n=>{const{type:r,payload:v={}}=n.data||{};switch(r){case"nuxt-studio:editor:file-selected":{const h=await _(v.path);h&&(h._partial||h._path!==$().path&&(t.value=h._path,e.push(h._path)));break}case"nuxt-studio:editor:file-changed":{const{additions:h=[],deletions:S=[]}=v;for(const w of h)await A(w);for(const w of S)await J(w.path);x();break}case"nuxt-studio:config:file-changed":{const{additions:h=[],deletions:S=[]}=v,w=h.find(y=>y.path===C.appConfig);w&&f(w==null?void 0:w.parsed),S.find(y=>y.path===C.appConfig)&&f(void 0);const I=h.find(y=>y.path===C.tokensConfig);I&&l(I==null?void 0:I.parsed),S.find(y=>y.path===C.tokensConfig)&&l(void 0);break}}}),a.hook("content:document-driven:finish",({route:n,page:r,dedup:v})=>{if(v||o.value){o.value=!1;return}if(r&&t.value===r._path){t.value="";return}window.parent.postMessage({type:"nuxt-studio:preview:document-driven:finish",payload:{...d(n),contentId:r==null?void 0:r._id}},"*")}),a.hook("nuxt-studio:preview:ready",()=>{window.parent.postMessage({type:"nuxt-studio:preview:ready",payload:d($())},"*"),e==null||e.afterEach(n=>{window.parent.postMessage({type:"nuxt-studio:preview:route-changed",payload:d(n)},"*")})})}};export{se as useStudio};
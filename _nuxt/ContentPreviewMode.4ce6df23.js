import{a as S,a5 as q,S as A,k as p,K as I,_ as L,a7 as M,o as u,j as l,l as B,M as R,y as e,b as _,e as k,w as g,V as b,t as N,av as U,I as x,aA as V,X as z,A as E,B as H,i as j}from"./entry.c0e09020.js";import{r as D}from"./asyncData.6d7b50d8.js";/* empty css                               */const r=i=>(E("data-v-6b9e914f"),i=i(),H(),i),F=r(()=>e("svg",{viewBox:"0 0 90 90",fill:"none",xmlns:"http://www.w3.org/2000/svg"},[e("path",{d:"M50.0016 71.0999h29.2561c.9293.0001 1.8422-.241 2.6469-.6992.8047-.4582 1.4729-1.1173 1.9373-1.9109.4645-.7936.7088-1.6939.7083-2.6102-.0004-.9162-.2455-1.8163-.7106-2.6095L64.192 29.713c-.4644-.7934-1.1325-1.4523-1.937-1.9105-.8046-.4581-1.7173-.6993-2.6463-.6993-.9291 0-1.8418.2412-2.6463.6993-.8046.4582-1.4726 1.1171-1.937 1.9105l-5.0238 8.5861-9.8224-16.7898c-.4648-.7934-1.1332-1.4522-1.938-1.9102-.8047-.4581-1.7176-.6992-2.6468-.6992-.9292 0-1.842.2411-2.6468.6992-.8048.458-1.4731 1.1168-1.9379 1.9102L6.56062 63.2701c-.46512.7932-.71021 1.6933-.71061 2.6095-.00041.9163.24389 1.8166.70831 2.6102.46443.7936 1.1326 1.4527 1.93732 1.9109.80473.4582 1.71766.6993 2.64686.6992h18.3646c7.2763 0 12.6422-3.1516 16.3345-9.3002l8.9642-15.3081 4.8015-8.1925 14.4099 24.6083H54.8058l-4.8042 8.1925ZM29.2077 62.899l-12.8161-.0028L35.603 30.0869l9.5857 16.4047-6.418 10.9645c-2.4521 3.9894-5.2377 5.4429-9.563 5.4429Z",fill:"currentColor"})],-1)),O=r(()=>e("span",null,"Preview mode enabled",-1)),Z={key:0},K=r(()=>e("div",{id:"__preview_background"},null,-1)),X=r(()=>e("svg",{id:"__preview_loading_icon",width:"32",height:"32",viewBox:"0 0 24 24"},[e("path",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M4 4v5h.582m15.356 2A8.001 8.001 0 0 0 4.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 0 1-15.357-2m15.357 2H15"})],-1)),$=r(()=>e("p",null,"Initializing the preview...",-1)),G={key:0},J=r(()=>e("div",{id:"__preview_background"},null,-1)),Q={id:"__preview_loader"},W=S({__name:"ContentPreviewMode",props:{previewToken:{type:Object,required:!0},apiURL:{type:String,required:!0},syncPreview:{type:Function,required:!0},requestPreviewSyncAPI:{type:Function,required:!0}},setup(i){const s=i,w=["__nuxt_preview","__preview_enabled"],C=q(),P=A(),f=p(!0),m=p(!1),t=p(!1),n=p("");let o;const y=async()=>{U("previewToken").value="",x().query.preview="",await V(x().path),z(()=>{D()}),f.value=!1,n.value="",document.body.classList.remove(...w)},h=async c=>{const a=await s.syncPreview(c);if(t.value!==!0){if(!a){setTimeout(()=>h(c),1e3);return}t.value=!0,C.callHook("nuxt-studio:preview:ready"),P.replace({query:{}}),window.parent&&window.self!==window.parent&&o.disconnect()}};return I(async()=>{o=(await L(()=>import("./index.9fea434a.js"),[],import.meta.url)).connect(`${s.apiURL}/preview`,{transports:["websocket","polling"],auth:{token:s.previewToken.value}});let a;o.on("connect",()=>{a=setTimeout(()=>{t.value||(a=setTimeout(()=>{n.value="Preview sync timed out",t.value=!1},3e4),o.emit("draft:requestSync"))},3e4)});const d=()=>{a&&(clearTimeout(a),a=null)};o.on("draft:sync",async v=>{if(d(),!v){try{o.once("draft:ready",()=>{o.emit("draft:requestSync")}),await s.requestPreviewSyncAPI()}catch(T){switch(d(),T.response.status){case 404:n.value="Preview draft not found",t.value=!1;break;default:n.value="An error occurred while syncing preview",t.value=!1}}return}h(v)}),o.on("draft:unauthorized",()=>{d(),n.value="Unauthorized preview token",t.value=!1}),o.on("disconnect",()=>{d()}),document.body.classList.add(...w),o.on("draft:update",v=>{m.value=!0,s.syncPreview(v),m.value=!1})}),M(()=>{document.body.classList.remove(...w)}),(c,a)=>(u(),l("div",null,[f.value?(u(),l("div",{key:0,id:"__nuxt_preview",class:B({__preview_ready:t.value,__preview_refreshing:m.value})},[t.value?(u(),l(R,{key:0},[F,O,e("button",{onClick:y}," Close ")],64)):_("",!0)],2)):_("",!0),k(b,{name:"preview-loading"},{default:g(()=>[f.value&&!t.value&&!n.value?(u(),l("div",Z,[K,e("div",{id:"__preview_loader"},[X,$,e("button",{onClick:y}," Cancel ")])])):_("",!0)]),_:1}),k(b,{name:"preview-loading"},{default:g(()=>[n.value?(u(),l("div",G,[J,e("div",Q,[e("p",null,N(n.value),1),e("button",{onClick:y}," Exit preview ")])])):_("",!0)]),_:1})]))}}),oe=j(W,[["__scopeId","data-v-6b9e914f"]]);export{oe as default};
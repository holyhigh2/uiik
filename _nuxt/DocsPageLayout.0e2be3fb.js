import K from"./DocsAside.531ff04a.js";import O from"./ProseCodeInline.bbc61eac.js";import R from"./Alert.bdd0c80e.js";import U from"./DocsPageBottom.f24877ab.js";import q from"./DocsPrevNext.fd592a50.js";import{a as Q,G as W,E as X,I as Y,p as m,k as V,J as Z,K as ee,L as oe,o as u,c as A,w as h,u as t,j as g,e as r,b as y,y as _,r as te,z as k,t as ne,M as se,l as x,f as ae,N as ce,A as le,B as re,i as ie}from"./entry.c0e09020.js";import pe from"./DocsToc.5ad4d086.js";/* empty css                           *//* empty css                      */import"./ContentSlot.ee027fbb.js";/* empty css                  */import"./ProseA.8706a56d.js";/* empty css                   */import"./EditOnLink.vue.a93833cb.js";/* empty css                           *//* empty css                         */import"./DocsTocLinks.dbe2453e.js";/* empty css                         *//* empty css                    */const ue=d=>(le("data-v-fa18c501"),d=d(),re(),d),_e={class:"page-body"},de={key:1,class:"toc"},me={class:"toc-wrapper"},fe=ue(()=>_("span",{class:"title"},"Table of Contents",-1)),ve=Q({__name:"DocsPageLayout",setup(d){const{page:s}=W(),{config:f,tree:T}=X(),M=Y(),j=(e,o=!0)=>{var n;return typeof((n=s.value)==null?void 0:n[e])<"u"?s.value[e]:o},S=m(()=>{var e,o,n;return!s.value||((n=(o=(e=s.value)==null?void 0:e.body)==null?void 0:o.children)==null?void 0:n.length)>0}),b=m(()=>{var e,o,n,c,l;return((e=s.value)==null?void 0:e.toc)!==!1&&((l=(c=(n=(o=s.value)==null?void 0:o.body)==null?void 0:n.toc)==null?void 0:c.links)==null?void 0:l.length)>=2}),C=m(()=>{var e,o,n,c,l;return((e=s.value)==null?void 0:e.aside)!==!1&&(((o=T.value)==null?void 0:o.length)>1||((l=(c=(n=T.value)==null?void 0:n[0])==null?void 0:c.children)==null?void 0:l.length))}),z=m(()=>j("bottom",!0)),i=V(!1),a=V(null),v=()=>M.path.split("/").slice(0,2).join("/"),p=Z("asideScroll",()=>{var e;return{parentPath:v(),scrollTop:((e=a.value)==null?void 0:e.scrollTop)||0}});function P(){a.value&&(a.value.scrollHeight===0&&setTimeout(P,0),a.value.scrollTop=p.value.scrollTop)}return ee(()=>{p.value.parentPath!==v()?(p.value.parentPath=v(),p.value.scrollTop=0):P()}),oe(()=>{a.value&&(p.value.scrollTop=a.value.scrollTop)}),(e,o)=>{var B,N,w,D,I,$;const n=K,c=O,l=R,E=U,H=q,L=ae,F=pe,G=ce;return u(),A(G,{fluid:(N=(B=t(f))==null?void 0:B.main)==null?void 0:N.fluid,padded:(D=(w=t(f))==null?void 0:w.main)==null?void 0:D.padded,class:x(["docs-page-content",{fluid:($=(I=t(f))==null?void 0:I.main)==null?void 0:$.fluid,"has-toc":t(b),"has-aside":t(C)}])},{default:h(()=>[t(C)?(u(),g("aside",{key:0,ref_key:"asideNav",ref:a,class:"aside-nav"},[r(n,{class:"app-aside"})],512)):y("",!0),_("article",_e,[t(S)?te(e.$slots,"default",{key:0},void 0,!0):(u(),A(l,{key:1,type:"info"},{default:h(()=>[k(" Start writing in "),r(c,null,{default:h(()=>[k("content/"+ne(t(s)._file),1)]),_:1}),k(" to see this page taking shape. ")]),_:1})),t(S)&&t(s)&&t(z)?(u(),g(se,{key:2},[r(E),r(H)],64)):y("",!0)]),t(b)?(u(),g("div",de,[_("div",me,[_("button",{onClick:o[0]||(o[0]=J=>i.value=!t(i))},[fe,r(L,{name:"heroicons-outline:chevron-right",class:x(["icon",[t(i)&&"rotate"]])},null,8,["class"])]),_("div",{class:x(["docs-toc-wrapper",[t(i)&&"opened"]])},[r(F,{onMove:o[1]||(o[1]=J=>i.value=!1)})],2)])])):y("",!0)]),_:3},8,["fluid","padded","class"])}}}),je=ie(ve,[["__scopeId","data-v-fa18c501"]]);export{je as default};
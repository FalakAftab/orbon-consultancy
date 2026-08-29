import{d as o,j as i}from"./index-BAxq7WBO.js";/**
 * @license lucide-react v1.29.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const n=[["rect",{width:"7",height:"7",x:"3",y:"3",rx:"1",key:"1g98yp"}],["rect",{width:"7",height:"7",x:"14",y:"3",rx:"1",key:"6d4xhi"}],["rect",{width:"7",height:"7",x:"14",y:"14",rx:"1",key:"nxv5o0"}],["rect",{width:"7",height:"7",x:"3",y:"14",rx:"1",key:"1bb6yr"}]],l=o("layout-grid",n);/**
 * @license lucide-react v1.29.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const c=[["path",{d:"M3 5h.01",key:"18ugdj"}],["path",{d:"M3 12h.01",key:"nlz23k"}],["path",{d:"M3 19h.01",key:"noohij"}],["path",{d:"M8 5h13",key:"1pao27"}],["path",{d:"M8 12h13",key:"1za7za"}],["path",{d:"M8 19h13",key:"m83p4d"}]],s=o("list",c);function y({value:t,onChange:d}){return i.jsx("div",{role:"group","aria-label":"View mode",style:{display:"inline-flex",border:"1px solid var(--color-border)",borderRadius:"var(--radius-full)",overflow:"hidden",background:"var(--color-surface)"},children:[{id:"grid",label:"Grid",icon:l},{id:"list",label:"List",icon:s}].map(e=>{const a=e.icon,r=t===e.id;return i.jsxs("button",{type:"button",onClick:()=>d(e.id),"aria-pressed":r,style:{display:"inline-flex",alignItems:"center",gap:"0.4rem",padding:"0.45rem 1rem",fontSize:"0.8125rem",fontWeight:r?600:400,color:r?"var(--color-forest)":"var(--color-muted)",background:r?"rgba(11,59,54,0.08)":"transparent",border:"none",cursor:"pointer"},children:[i.jsx(a,{size:14}),e.label]},e.id)})})}export{y as V};

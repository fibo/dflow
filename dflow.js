const u=n=>`${n} must be a string`,k=n=>`${n} must be a number`,E=(n,t)=>`${t} pin not found nodeId=${n}`,b=(n,t,e)=>`${E(n,t)} position=${e}`,P=(n,t,e)=>`${E(n,t)} pinId=${e}`;class I{id;kind;types;constructor(t,{id:e,types:s}){this.id=e,this.kind=t,this.types=s}}class N extends I{#t;constructor({id:t,types:e}){super("input",{id:t,types:e})}connectTo(t){this.#t=t}disconnect(){this.#t=void 0}get data(){return this.#t?.data}toJSON(){return JSON.stringify(this.toObject())}toObject(){const t={id:this.id};return typeof this.types!="undefined"&&(t.types=this.types),t}}class O extends I{#t;constructor({id:t,data:e,types:s}){super("output",{id:t,types:s});this.data=e}get data(){return this.#t}set data(t){const e=this.types??[];if(typeof t!="undefined"){const s=Array.isArray(t),o=t===null,d=typeof t=="object"&&!o&&!s;switch(!0){case typeof this.types=="undefined":case(typeof t=="string"&&e.includes("string")):case(typeof t=="number"&&e.includes("number")):case(typeof t=="boolean"&&e.includes("boolean")):case(o&&e.includes("null")):case(d&&e.includes("object")):case(s&&e.includes("array")):{this.#t=t;break}default:throw new Error(`could not set data pinTypes=${JSON.stringify(this.types)} typeof=${typeof t}`)}}}toJSON(){return JSON.stringify(this.toObject())}toObject(){const t={id:this.id};return typeof this.#t!="undefined"&&(t.data=this.#t),typeof this.types!="undefined"&&(t.types=this.types),t}}class a{id;kind;meta;inputs=new Map;outputs=new Map;#t=[];#e=[];constructor({id:t,kind:e,inputs:s=[],outputs:o=[]},{isAsync:d=!1,isConstant:r=!1}={}){this.id=t,this.kind=e,this.meta={isAsync:d,isConstant:r};for(const i of s)this.newInput(i);for(const i of o)this.newOutput(i)}getInputById(t){if(typeof t!="string")throw new TypeError(u("inputId"));const e=this.inputs.get(t);if(e instanceof N)return e;throw new Error(P(this.id,"input",t))}getInputByPosition(t){if(typeof t!="number")throw new TypeError(k("position"));const e=this.#t[t];if(typeof e=="undefined")throw new Error(b(this.id,"input",t));return this.getInputById(e)}getOutputById(t){if(typeof t!="string")throw new TypeError(u("outputId"));const e=this.outputs.get(t);if(e instanceof O)return e;throw new Error(P(this.id,"output",t))}getOutputByPosition(t){if(typeof t!="number")throw new TypeError(k("position"));const e=this.#e[t];if(typeof e=="undefined")throw new Error(b(this.id,"output",t));return this.getOutputById(e)}newInput(t){const e=new N(t);this.inputs.set(e.id,e),this.#t.push(e.id)}newOutput(t){const e=new O(t);this.outputs.set(e.id,e),this.#e.push(e.id)}run(){throw new Error(`${this.constructor.name} does not implement a run() method`)}toJSON(){return JSON.stringify(this.toObject())}toObject(){const t={id:this.id,kind:this.kind},e=Object.values(this.inputs).map(o=>o.toObject());e.length>0&&(t.inputs=e);const s=Object.values(this.outputs).map(o=>o.toObject());return s.length>0&&(t.outputs=s),t}}class h extends a{static kind="Unknown";constructor(t){super({...t,kind:h.kind})}run(){}}class p{id;source;target;constructor({id:t,source:e,target:s}){this.id=t;const[o,d]=e,[r,i]=s;if(typeof o!="string")throw new TypeError(u("sourceNodeId"));if(typeof d!="string")throw new TypeError(u("sourcePinId"));if(typeof r!="string")throw new TypeError(u("targetNodeId"));if(typeof i!="string")throw new TypeError(u("targetPinId"));this.source=e,this.target=s}toJSON(){return JSON.stringify(this.toObject())}toObject(){return{id:this.id,source:this.source,target:this.target}}}class g{#t="success";nodes=new Map;edges=new Map;static sort(t,e){const s={},o=r=>e.filter(({targetId:i})=>r===i).map(({sourceId:i})=>i),d=r=>{const i=o(r);if(i.length===0)return 0;let c=0;for(const w of i){const y=d(w);c=Math.max(y,c)}return c+1};for(const r of t)s[r]=d(r);return t.slice().sort((r,i)=>s[r]<=s[i]?-1:1)}clear(){this.nodes.clear(),this.edges.clear()}getNodeById(t){if(typeof t!="string")throw new TypeError(u("nodeId"));const e=this.nodes.get(t);if(e instanceof a)return e;throw new Error(`DflowNode not found, id=${t}`)}getEdgeById(t){if(typeof t!="string")throw new TypeError(u("edgeId"));const e=this.edges.get(t);if(e instanceof p)return e;throw new Error(`DflowEdge not found, id=${t}`)}generateEdgeId(t=this.edges.size){const e=`e${t}`;return this.edges.has(e)?this.generateEdgeId(t+1):e}generateNodeId(t=this.nodes.size){const e=`n${t}`;return this.nodes.has(e)?this.generateNodeId(t+1):e}async run(){this.runStatusIsSuccess&&(this.#t="waiting");const t=g.sort([...this.nodes.keys()],[...this.edges.values()].map(e=>({sourceId:e.source[0],targetId:e.target[0]})));for(const e of t){const s=this.nodes.get(e);try{s.meta.isConstant===!1&&(s.meta.isAsync?await s.run():s.run())}catch(o){console.error(o),this.#t="failure"}}this.runStatusIsWaiting&&(this.#t="success")}get runStatusIsSuccess(){return this.#t==="success"}get runStatusIsWaiting(){return this.#t==="waiting"}get runStatusIsFailure(){return this.#t==="failure"}toJSON(){return JSON.stringify(this.toObject())}toObject(){const t=Object.values(this.nodes).map(s=>s.toObject()),e=Object.values(this.edges).map(s=>s.toObject());return{nodes:t,edges:e}}}class C{graph=new g;#t;constructor(t={}){this.#t=t}connect(t,e=0){return{to:(s,o=0)=>{const d=this.graph.generateEdgeId(),r=t.getOutputByPosition(e),i=s.getInputByPosition(o);this.newEdge({id:d,source:[t.id,r.id],target:[s.id,i.id]})}}}deleteEdge(t){if(typeof t!="string")throw new TypeError(u("edgeId"));const e=this.graph.getEdgeById(t);if(e instanceof p){const[s,o]=e.target;this.graph.getNodeById(s).getInputById(o).disconnect(),this.graph.edges.delete(t)}else throw new Error(`DflowEdge not found, id=${t}`)}deleteNode(t){if(typeof t!="string")throw new TypeError(u("nodeId"));const e=this.graph.getNodeById(t);if(e instanceof a){for(const s of this.graph.edges.values()){const{source:[o],target:[d]}=s;(o===e.id||d===e.id)&&this.deleteEdge(s.id)}this.graph.nodes.delete(t)}else throw new Error(`DflowNode not found, id=${t}`)}newNode(t){const e=this.#t[t.kind]??h,s=typeof t.id=="string"?t.id:this.graph.generateNodeId(),o=new e({...t,id:s});if(this.graph.nodes.has(o.id))throw new Error(`Cannot overwrite DflowNode, id=${o.id}`);return this.graph.nodes.set(o.id,o),o}newEdge(t){const e=typeof t.id=="string"?t.id:this.graph.generateEdgeId(),s=new p({...t,id:e});if(this.graph.edges.has(s.id))throw new Error(`Cannot overwrite DflowEdge, id=${s.id}`);this.graph.edges.set(s.id,s);const[o,d]=s.source,[r,i]=s.target,c=this.graph.getNodeById(o),w=this.graph.getNodeById(r),y=c.getOutputById(d);return w.getInputById(i).connectTo(y),s}newInput(t,e){this.graph.getNodeById(t).newInput(e)}newOutput(t,e){this.graph.getNodeById(t).newOutput(e)}}export{I as DflowPin};export{N as DflowInput};export{O as DflowOutput};export{a as DflowNode};export{h as DflowUnknownNode};export{p as DflowEdge};export{g as DflowGraph};export{C as DflowHost};const D=(n,t)=>`unimplemented method ${n} nodeKind=${t}`,A=n=>({id:"out",types:["boolean"],data:n}),B=()=>({id:"in",types:["number"]}),m=n=>({id:"out",types:["number"],data:n});class x extends a{constructor(t){super({...t,inputs:[B()],outputs:[A()]})}task(t){throw new Error(D("task",this.kind))}run(){const t=this.getInputByPosition(0).data;if(typeof t=="number"){const e=this.task(t);this.getOutputByPosition(0).data=e}}}class f extends a{constructor(t){super({...t,inputs:[B()],outputs:[m()]})}task(t){throw new Error(D("task",this.kind))}run(){const t=this.getInputByPosition(0).data;if(typeof t=="number"){const e=this.task(t);this.getOutputByPosition(0).data=e}}}class S extends a{static kind="num";constructor(t){super({...t,outputs:[m()]})}run(){}}const _={[S.kind]:S};class $ extends f{static kind="cos";task(t){return Math.cos(t)}}class j extends f{static kind="cosh";task(t){return Math.cosh(t)}}class l extends a{static kind="PI";static metadata={isConstant:!0};constructor(t){super({...t,outputs:[m(Math.PI)]},l.metadata)}}class M extends f{static kind="sin";task(t){return Math.sin(t)}}class T extends f{static kind="sinh";task(t){return Math.sinh(t)}}const z={[$.kind]:$,[j.kind]:j,[l.kind]:l,[M.kind]:M,[T.kind]:T};class v extends x{static kind="isFinite";task(t){return Number.isFinite(t)}}class J extends x{static kind="isNaN";task(t){return Number.isNaN(t)}}const F={[v.kind]:v,[J.kind]:J},H={..._,...z,...F};export{H as catalog};

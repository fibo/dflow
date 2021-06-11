const u=d=>`${d} must be a string`,y=d=>`${d} must be a number`,I=(d,t)=>`${t} pin not found nodeId=${d}`,N=(d,t,e)=>`${I(d,t)} position=${e}`,O=(d,t,e)=>`${I(d,t)} pinId=${e}`;class h{id;kind;types;#t;#e;constructor(t,{id:e,data:s,types:n}){this.kind=t,this.id=e,this.types=n,this.setData(s)}connectTo(t){this.kind==="input"&&(this.#e=t)}disconnect(){this.kind==="input"&&(this.#e=void 0)}getData(){if(this.kind==="output")return this.#t;{const t=this.#e;if(typeof t!="undefined")return t.getData()}}setData(t){const e=this.types??[];if(typeof t!="undefined"){const s=Array.isArray(t),n=t===null,i=typeof t=="object"&&!n&&!s;switch(!0){case typeof this.types=="undefined":case(typeof t=="string"&&e.includes("string")):case(typeof t=="number"&&e.includes("number")):case(typeof t=="boolean"&&e.includes("boolean")):case(n&&e.includes("null")):case(i&&e.includes("object")):case(s&&e.includes("array")):{this.#t=t;break}default:throw new Error(`could not set data pinKind=${this.kind} pinTypes=${JSON.stringify(this.types)} typeof=${typeof t}`)}}}toJSON(){return JSON.stringify(this.toObject())}toObject(){const t={id:this.id};return typeof this.#t!="undefined"&&(t.data=this.#t),t}}class a{id;kind;isAsync;inputs=new Map;outputs=new Map;#t=[];#e=[];constructor({id:t,kind:e,inputs:s=[],outputs:n=[]},i=!1){this.id=t,this.kind=e,this.isAsync=i;for(const o of s)this.newInput(o);for(const o of n)this.newOutput(o)}getInputById(t){if(typeof t!="string")throw new TypeError(u("inputId"));const e=this.inputs.get(t);if(e instanceof h)return e;throw new Error(`DflowPin not found, id=${t}, kind={input}`)}getInputByPosition(t){if(typeof t!="number")throw new TypeError(y("position"));const e=this.#t[t];if(typeof e=="undefined")throw new Error(N(this.id,"input",t));return this.getInputById(e)}getOutputById(t){if(typeof t!="string")throw new TypeError(u("outputId"));const e=this.outputs.get(t);if(e instanceof h)return e;throw new Error(O(this.id,"input",t))}getOutputByPosition(t){if(typeof t!="number")throw new TypeError(y("position"));const e=this.#e[t];if(typeof e=="undefined")throw new Error(N(this.id,"output",t));return this.getOutputById(e)}newInput(t){const e=new h("input",t);this.inputs.set(e.id,e),this.#t.push(e.id)}newOutput(t){const e=new h("output",t);this.outputs.set(e.id,e),this.#e.push(e.id)}run(){throw new Error(`${this.constructor.name} does not implement a run() method`)}toJSON(){return JSON.stringify(this.toObject())}toObject(){const t={id:this.id,kind:this.kind},e=Object.values(this.inputs).map(n=>n.toObject());e.length>0&&(t.inputs=e);const s=Object.values(this.outputs).map(n=>n.toObject());return s.length>0&&(t.outputs=s),t}}class p extends a{static kind="Unknown";constructor(t){super({...t,kind:p.kind})}run(){}}class g{id;source;target;constructor({id:t,source:e,target:s}){this.id=t;const[n,i]=e,[o,r]=s;if(typeof n!="string")throw new TypeError(u("sourceNodeId"));if(typeof i!="string")throw new TypeError(u("sourcePinId"));if(typeof o!="string")throw new TypeError(u("targetNodeId"));if(typeof r!="string")throw new TypeError(u("targetPinId"));this.source=e,this.target=s}toJSON(){return JSON.stringify(this.toObject())}toObject(){return{id:this.id,source:this.source,target:this.target}}}class f{nodes=new Map;edges=new Map;#t="success";static sort(t,e){const s={},n=o=>e.filter(({targetId:r})=>o===r).map(({sourceId:r})=>r),i=o=>{const r=n(o);if(r.length===0)return 0;let c=0;for(const w of r){const l=i(w);c=Math.max(l,c)}return c+1};for(const o of t)s[o]=i(o);return t.slice().sort((o,r)=>s[o]<=s[r]?-1:1)}clear(){this.nodes.clear(),this.edges.clear()}getNodeById(t){if(typeof t!="string")throw new TypeError(u("nodeId"));const e=this.nodes.get(t);if(e instanceof a)return e;throw new Error(`DflowNode not found, id=${t}`)}getEdgeById(t){if(typeof t!="string")throw new TypeError(u("edgeId"));const e=this.edges.get(t);if(e instanceof g)return e;throw new Error(`DflowEdge not found, id=${t}`)}async run(){this.runStatusIsSuccess&&(this.#t="waiting");const t=f.sort([...this.nodes.keys()],[...this.edges.values()].map(e=>({sourceId:e.source[0],targetId:e.target[0]})));for(const e of t){const s=this.nodes.get(e);try{s.isAsync?await s.run():s.run()}catch(n){console.error(n),this.#t="failure"}}this.runStatusIsWaiting&&(this.#t="success")}get runStatusIsSuccess(){return this.#t==="success"}get runStatusIsWaiting(){return this.#t==="waiting"}get runStatusIsFailure(){return this.#t==="failure"}toJSON(){return JSON.stringify(this.toObject())}toObject(){const t=Object.values(this.nodes).map(s=>s.toObject()),e=Object.values(this.edges).map(s=>s.toObject());return{nodes:t,edges:e}}}class E{graph=new f;#t;constructor(t={}){this.#t=t}connect(t,e=0){return{to:(s,n=0)=>{const i=`e${this.graph.edges.size+1}`,o=t.getOutputByPosition(e),r=s.getInputByPosition(n);this.newEdge({id:i,source:[t.id,o.id],target:[s.id,r.id]})}}}deleteEdge(t){if(typeof t!="string")throw new TypeError(u("edgeId"));const e=this.graph.getEdgeById(t);if(e instanceof g){const[s,n]=e.target;this.graph.getNodeById(s).getInputById(n).disconnect(),this.graph.edges.delete(t)}else throw new Error(`DflowEdge not found, id=${t}`)}deleteNode(t){if(typeof t!="string")throw new TypeError(u("nodeId"));const e=this.graph.getNodeById(t);if(e instanceof a){for(const s of this.graph.edges.values()){const{source:[n],target:[i]}=s;(n===e.id||i===e.id)&&this.deleteEdge(s.id)}this.graph.nodes.delete(t)}else throw new Error(`DflowNode not found, id=${t}`)}newNode(t){const e=this.#t[t.kind]??p,s=new e(t);if(this.graph.nodes.has(s.id))throw new Error(`Cannot overwrite DflowNode, id=${s.id}`);return this.graph.nodes.set(s.id,s),s}newEdge(t){const e=new g(t);if(this.graph.edges.has(e.id))throw new Error(`Cannot overwrite DflowEdge, id=${e.id}`);this.graph.edges.set(e.id,e);const[s,n]=e.source,[i,o]=e.target,r=this.graph.getNodeById(s),c=this.graph.getNodeById(i),w=r.getOutputById(n);return c.getInputById(o).connectTo(w),e}newInput(t,e){this.graph.nodes.get(t)?.newInput(e)}newOutput(t,e){this.graph.nodes.get(t)?.newOutput(e)}}export{h as DflowPin};export{a as DflowNode};export{p as DflowUnknownNode};export{g as DflowEdge};export{f as DflowGraph};export{E as DflowHost};

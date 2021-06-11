const u=s=>`${s} must be a string`,I=s=>`${s} must be a number`,O=(s,t)=>`${t} pin not found nodeId=${s}`,N=(s,t,e)=>`${O(s,t)} position=${e}`,B=(s,t,e)=>`${O(s,t)} pinId=${e}`;class h{id;kind;#t;#e;constructor(t,{id:e,data:n}){this.kind=t,this.id=e,this.setData(n)}connectTo(t){this.kind==="input"&&(this.#e=t)}disconnect(){this.kind==="input"&&(this.#e=void 0)}getData(){if(this.kind==="output")return this.#t;{const t=this.#e;if(typeof t!="undefined")return t.getData()}}setData(t){typeof t!="undefined"&&(this.#t=t)}toJSON(){return JSON.stringify(this.toObject())}toObject(){const t={id:this.id};return typeof this.#t!="undefined"&&(t.data=this.#t),t}}class a{id;kind;isAsync;inputs=new Map;outputs=new Map;#t=[];#e=[];constructor({id:t,kind:e,inputs:n=[],outputs:o=[]},d=!1){this.id=t,this.kind=e,this.isAsync=d;for(const i of n)this.newInput(i);for(const i of o)this.newOutput(i)}getInputById(t){if(typeof t!="string")throw new TypeError(u("inputId"));const e=this.inputs.get(t);if(e instanceof h)return e;throw new Error(`DflowPin not found, id=${t}, kind={input}`)}getInputByPosition(t){if(typeof t!="number")throw new TypeError(I("position"));const e=this.#t[t];if(typeof e=="undefined")throw new Error(N(this.id,"input",t));return this.getInputById(e)}getOutputById(t){if(typeof t!="string")throw new TypeError(u("outputId"));const e=this.outputs.get(t);if(e instanceof h)return e;throw new Error(B(this.id,"input",t))}getOutputByPosition(t){if(typeof t!="number")throw new TypeError(I("position"));const e=this.#e[t];if(typeof e=="undefined")throw new Error(N(this.id,"output",t));return this.getOutputById(e)}newInput(t){const e=new h("input",t);this.inputs.set(e.id,e),this.#t.push(e.id)}newOutput(t){const e=new h("output",t);this.outputs.set(e.id,e),this.#e.push(e.id)}run(){throw new Error(`${this.constructor.name} does not implement a run() method`)}toJSON(){return JSON.stringify(this.toObject())}toObject(){const t={id:this.id,kind:this.kind},e=Object.values(this.inputs).map(o=>o.toObject());e.length>0&&(t.inputs=e);const n=Object.values(this.outputs).map(o=>o.toObject());return n.length>0&&(t.outputs=n),t}}class p extends a{static kind="Unknown";constructor(t){super({...t,kind:p.kind})}run(){}}class g{id;source;target;constructor({id:t,source:e,target:n}){this.id=t;const[o,d]=e,[i,r]=n;if(typeof o!="string")throw new TypeError(u("sourceNodeId"));if(typeof d!="string")throw new TypeError(u("sourcePinId"));if(typeof i!="string")throw new TypeError(u("targetNodeId"));if(typeof r!="string")throw new TypeError(u("targetPinId"));this.source=e,this.target=n}toJSON(){return JSON.stringify(this.toObject())}toObject(){return{id:this.id,source:this.source,target:this.target}}}class f{nodes=new Map;edges=new Map;#t="success";static sort(t,e){const n={},o=i=>e.filter(({targetId:r})=>i===r).map(({sourceId:r})=>r),d=i=>{const r=o(i);if(r.length===0)return 0;let c=0;for(const l of r){const y=d(l);c=Math.max(y,c)}return c+1};for(const i of t)n[i]=d(i);return t.slice().sort((i,r)=>n[i]<=n[r]?-1:1)}clear(){this.nodes.clear(),this.edges.clear()}getNodeById(t){if(typeof t!="string")throw new TypeError(u("nodeId"));const e=this.nodes.get(t);if(e instanceof a)return e;throw new Error(`DflowNode not found, id=${t}`)}getEdgeById(t){if(typeof t!="string")throw new TypeError(u("edgeId"));const e=this.edges.get(t);if(e instanceof g)return e;throw new Error(`DflowEdge not found, id=${t}`)}async run(){this.runStatusIsSuccess&&(this.#t="waiting");const t=f.sort([...this.nodes.keys()],[...this.edges.values()].map(e=>({sourceId:e.source[0],targetId:e.target[0]})));for(const e of t){const n=this.nodes.get(e);try{n.isAsync?await n.run():n.run()}catch(o){console.error(o),this.#t="failure"}}this.runStatusIsWaiting&&(this.#t="success")}get runStatusIsSuccess(){return this.#t==="success"}get runStatusIsWaiting(){return this.#t==="waiting"}get runStatusIsFailure(){return this.#t==="failure"}toJSON(){return JSON.stringify(this.toObject())}toObject(){const t=Object.values(this.nodes).map(n=>n.toObject()),e=Object.values(this.edges).map(n=>n.toObject());return{nodes:t,edges:e}}}class S{graph=new f;#t;constructor(t={}){this.#t=t}connect(t,e=0){return{to:(n,o=0)=>{const d=`e${this.graph.edges.size+1}`,i=t.getOutputByPosition(e),r=n.getInputByPosition(o);this.newEdge({id:d,source:[t.id,i.id],target:[n.id,r.id]})}}}deleteEdge(t){if(typeof t!="string")throw new TypeError(u("edgeId"));const e=this.graph.getEdgeById(t);if(e instanceof g){const[n,o]=e.target;this.graph.getNodeById(n).getInputById(o).disconnect(),this.graph.edges.delete(t)}else throw new Error(`DflowEdge not found, id=${t}`)}deleteNode(t){if(typeof t!="string")throw new TypeError(u("nodeId"));const e=this.graph.getNodeById(t);if(e instanceof a){for(const n of this.graph.edges.values()){const{source:[o],target:[d]}=n;(o===e.id||d===e.id)&&this.deleteEdge(n.id)}this.graph.nodes.delete(t)}else throw new Error(`DflowNode not found, id=${t}`)}newNode(t){const e=this.#t[t.kind]??p,n=new e(t);if(this.graph.nodes.has(n.id))throw new Error(`Cannot overwrite DflowNode, id=${n.id}`);return this.graph.nodes.set(n.id,n),n}newEdge(t){const e=new g(t);if(this.graph.edges.has(e.id))throw new Error(`Cannot overwrite DflowEdge, id=${e.id}`);this.graph.edges.set(e.id,e);const[n,o]=e.source,[d,i]=e.target,r=this.graph.getNodeById(n),c=this.graph.getNodeById(d),l=r.getOutputById(o);return c.getInputById(i).connectTo(l),e}newInput(t,e){this.graph.nodes.get(t)?.newInput(e)}newOutput(t,e){this.graph.nodes.get(t)?.newOutput(e)}}export{h as DflowPin};export{a as DflowNode};export{p as DflowUnknownNode};export{g as DflowEdge};export{f as DflowGraph};export{S as DflowHost};class x extends a{constructor({id:t,kind:e}){super({id:t,kind:e,outputs:[{id:"out"}]})}}class $ extends a{constructor({id:t,kind:e}){super({id:t,kind:e,inputs:[{id:"in"}],outputs:[{id:"out"}]})}}class w extends ${operation(t){throw new Error(`Unimplemented operation nodeKind=${this.kind}`)}run(){const t=this.getInputByPosition(0).getData();if(typeof t=="number"){const e=this.operation(t);this.getOutputByPosition(0).setData(e)}}}class k extends x{static kind="num";run(){}}const j={[k.kind]:k};class E extends w{static kind="mathCos";operation(t){return Math.cos(t)}}class m extends w{static kind="mathCosh";operation(t){return Math.cosh(t)}}class P extends a{static kind="mathPI";constructor({id:t,kind:e}){super({id:t,kind:e,outputs:[{id:"out",data:Math.PI}]})}}class D extends w{static kind="mathSin";operation(t){return Math.sin(t)}}class b extends w{static kind="mathSinh";operation(t){return Math.sinh(t)}}const M={[E.kind]:E,[m.kind]:m,[P.kind]:P,[D.kind]:D,[b.kind]:b},T={...j,...M};export{T as catalog};

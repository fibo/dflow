const c=s=>`${s} must be a string`,T=s=>`${s} must be a number`,A=(s,t)=>`${t} pin not found nodeId=${s}`,P=(s,t,e)=>`${A(s,t)} position=${e}`,S=(s,t,e)=>`${A(s,t)} pinId=${e}`;class b{id;kind;types;constructor(t,{id:e,types:n=[]}){this.id=e,this.kind=t,this.types=n}get hasTypeAny(){return this.types.length===0}get hasTypeString(){return this.hasTypeAny||this.types.includes("string")}get hasTypeNumber(){return this.hasTypeAny||this.types.includes("number")}get hasTypeBoolean(){return this.hasTypeAny||this.types.includes("boolean")}get hasTypeNull(){return this.hasTypeAny||this.types.includes("null")}get hasTypeObject(){return this.hasTypeAny||this.types.includes("object")}get hasTypeArray(){return this.hasTypeAny||this.types.includes("array")}}class i{static isArray(t){return Array.isArray(t)}static isBoolean(t){return typeof t=="boolean"}static isObject(t){return!i.isUndefined(t)&&!i.isNull(t)&&!i.isArray(t)&&typeof t=="object"}static isNull(t){return t===null}static isNumber(t){return typeof t=="number"}static isString(t){return typeof t=="string"}static isUndefined(t){return typeof t=="undefined"}static validate(t,e){return e.length===0?!0:e.some(n=>{switch(n){case"array":return i.isArray(t);case"boolean":return i.isBoolean(t);case"null":return i.isNull(t);case"number":return i.isNumber(t);case"object":return i.isObject(t);case"string":return i.isString(t);default:return!1}},!0)}}class m extends b{#t;constructor({id:t,types:e}){super("input",{id:t,types:e})}connectTo(t){this.#t=t}disconnect(){this.#t=void 0}get data(){return this.#t?.data}toJSON(){return JSON.stringify(this.toObject())}toObject(){const t={id:this.id};return this.types.length>0&&(t.types=this.types),t}}class E extends b{#t;constructor({id:t,data:e,types:n}){super("output",{id:t,types:n});this.#t=e}clear(){this.#t=void 0}get data(){return this.#t}set data(t){switch(!0){case i.isUndefined(t):this.clear();break;case this.hasTypeAny:case(i.isString(t)&&this.hasTypeString):case(i.isNumber(t)&&this.hasTypeNumber):case(i.isBoolean(t)&&this.hasTypeBoolean):case(i.isNull(t)&&this.hasTypeNull):case(i.isObject(t)&&this.hasTypeObject):case(i.isArray(t)&&this.hasTypeArray):{this.#t=t;break}default:throw new Error(`could not set data pinTypes=${JSON.stringify(this.types)} typeof=${typeof t}`)}}toJSON(){return JSON.stringify(this.toObject())}toObject(){const t={id:this.id};return i.isUndefined(this.#t)||(t.data=this.#t),this.types.length>0&&(t.types=this.types),t}}class d{id;kind;meta;inputs=new Map;outputs=new Map;#t=[];#e=[];constructor({id:t,kind:e,inputs:n=[],outputs:r=[]},{isAsync:a=!1,isConstant:u=!1}={}){this.id=t,this.kind=e,this.meta={isAsync:a,isConstant:u};for(const o of n)this.newInput(o);for(const o of r)this.newOutput(o)}getInputById(t){if(typeof t!="string")throw new TypeError(c("inputId"));const e=this.inputs.get(t);if(e instanceof m)return e;throw new Error(S(this.id,"input",t))}getInputByPosition(t){if(typeof t!="number")throw new TypeError(T("position"));const e=this.#t[t];if(typeof e=="undefined")throw new Error(P(this.id,"input",t));return this.getInputById(e)}getOutputById(t){if(typeof t!="string")throw new TypeError(c("outputId"));const e=this.outputs.get(t);if(e instanceof E)return e;throw new Error(S(this.id,"output",t))}getOutputByPosition(t){if(typeof t!="number")throw new TypeError(T("position"));const e=this.#e[t];if(typeof e=="undefined")throw new Error(P(this.id,"output",t));return this.getOutputById(e)}newInput(t){const e=new m(t);this.inputs.set(e.id,e),this.#t.push(e.id)}newOutput(t){const e=new E(t);this.outputs.set(e.id,e),this.#e.push(e.id)}run(){throw new Error(`${this.constructor.name} does not implement a run() method`)}toJSON(){return JSON.stringify(this.toObject())}toObject(){const t={id:this.id,kind:this.kind},e=Object.values(this.inputs).map(r=>r.toObject());e.length>0&&(t.inputs=e);const n=Object.values(this.outputs).map(r=>r.toObject());return n.length>0&&(t.outputs=n),t}}class f extends d{static kind="Unknown";constructor(t){super({...t,kind:f.kind})}run(){}}class y{id;source;target;constructor({id:t,source:e,target:n}){this.id=t;const[r,a]=e,[u,o]=n;if(typeof r!="string")throw new TypeError(c("sourceNodeId"));if(typeof a!="string")throw new TypeError(c("sourcePinId"));if(typeof u!="string")throw new TypeError(c("targetNodeId"));if(typeof o!="string")throw new TypeError(c("targetPinId"));this.source=e,this.target=n}toJSON(){return JSON.stringify(this.toObject())}toObject(){return{id:this.id,source:this.source,target:this.target}}}class w{#t="success";nodes=new Map;edges=new Map;static sort(t,e){const n={},r=u=>e.filter(({targetId:o})=>u===o).map(({sourceId:o})=>o),a=u=>{const o=r(u);if(o.length===0)return 0;let l=0;for(const O of o){const N=a(O);l=Math.max(N,l)}return l+1};for(const u of t)n[u]=a(u);return t.slice().sort((u,o)=>n[u]<=n[o]?-1:1)}clear(){this.nodes.clear(),this.edges.clear()}getNodeById(t){if(typeof t!="string")throw new TypeError(c("nodeId"));const e=this.nodes.get(t);if(e instanceof d)return e;throw new Error(`DflowNode not found, id=${t}`)}getEdgeById(t){if(typeof t!="string")throw new TypeError(c("edgeId"));const e=this.edges.get(t);if(e instanceof y)return e;throw new Error(`DflowEdge not found, id=${t}`)}generateEdgeId(t=this.edges.size){const e=`e${t}`;return this.edges.has(e)?this.generateEdgeId(t+1):e}generateNodeId(t=this.nodes.size){const e=`n${t}`;return this.nodes.has(e)?this.generateNodeId(t+1):e}async run(){this.runStatusIsSuccess&&(this.#t="waiting");const t=w.sort([...this.nodes.keys()],[...this.edges.values()].map(e=>({sourceId:e.source[0],targetId:e.target[0]})));for(const e of t){const n=this.nodes.get(e);try{n.meta.isConstant===!1&&(n.meta.isAsync?await n.run():n.run())}catch(r){console.error(r),this.#t="failure"}}this.runStatusIsWaiting&&(this.#t="success")}get runStatusIsSuccess(){return this.#t==="success"}get runStatusIsWaiting(){return this.#t==="waiting"}get runStatusIsFailure(){return this.#t==="failure"}toJSON(){return JSON.stringify(this.toObject())}toObject(){const t=Object.values(this.nodes).map(n=>n.toObject()),e=Object.values(this.edges).map(n=>n.toObject());return{nodes:t,edges:e}}}class tt{graph=new w;#t;constructor(t={}){this.#t=t}connect(t,e=0){return{to:(n,r=0)=>{const a=this.graph.generateEdgeId(),u=t.getOutputByPosition(e),o=n.getInputByPosition(r);this.newEdge({id:a,source:[t.id,u.id],target:[n.id,o.id]})}}}deleteEdge(t){if(typeof t!="string")throw new TypeError(c("edgeId"));const e=this.graph.getEdgeById(t);if(e instanceof y){const[n,r]=e.target;this.graph.getNodeById(n).getInputById(r).disconnect(),this.graph.edges.delete(t)}else throw new Error(`DflowEdge not found, id=${t}`)}deleteNode(t){if(typeof t!="string")throw new TypeError(c("nodeId"));const e=this.graph.getNodeById(t);if(e instanceof d){for(const n of this.graph.edges.values()){const{source:[r],target:[a]}=n;(r===e.id||a===e.id)&&this.deleteEdge(n.id)}this.graph.nodes.delete(t)}else throw new Error(`DflowNode not found, id=${t}`)}newNode(t){const e=this.#t[t.kind]??f,n=typeof t.id=="string"?t.id:this.graph.generateNodeId(),r=new e({...t,id:n});if(this.graph.nodes.has(r.id))throw new Error(`Cannot overwrite DflowNode, id=${r.id}`);return this.graph.nodes.set(r.id,r),r}newEdge(t){const e=typeof t.id=="string"?t.id:this.graph.generateEdgeId(),n=new y({...t,id:e});if(this.graph.edges.has(n.id))throw new Error(`Cannot overwrite DflowEdge, id=${n.id}`);this.graph.edges.set(n.id,n);const[r,a]=n.source,[u,o]=n.target,l=this.graph.getNodeById(r),O=this.graph.getNodeById(u),N=l.getOutputById(a);return O.getInputById(o).connectTo(N),n}newInput(t,e){this.graph.getNodeById(t).newInput(e)}newOutput(t,e){this.graph.getNodeById(t).newOutput(e)}}export{b as DflowPin};export{i as DflowData};export{m as DflowInput};export{E as DflowOutput};export{d as DflowNode};export{f as DflowUnknownNode};export{y as DflowEdge};export{w as DflowGraph};export{tt as DflowHost};const h=(s,t)=>`unimplemented method ${s} nodeKind=${t}`,et=()=>({id:"in"}),st=()=>({id:"out"}),nt=()=>({id:"in",types:["array"]}),D=s=>({id:"out",types:["array"],data:s}),x=s=>({id:"out",types:["boolean"],data:s}),rt=()=>({id:"in",types:["object"]}),it=s=>({id:"out",types:["object"],data:s}),B=()=>({id:"in",types:["number"]}),g=s=>({id:"out",types:["number"],data:s}),ot=()=>({id:"in",types:["string"]}),ut=s=>({id:"out",types:["string"],data:s});class p extends d{get input(){return this.getInputByPosition(0)}get output(){return this.getOutputByPosition(0)}run(){const t=this.input.data;i.isUndefined(t)?this.output.clear():i.validate(t,this.input.types)&&(this.output.data=this.task(t))}task(t){throw new Error(h("task",this.kind))}}class at extends p{constructor(t){super({...t,inputs:[et()],outputs:[x()]})}task(t){throw new Error(h("task",this.kind))}}class dt extends p{constructor(t){super({...t,inputs:[nt()],outputs:[g()]})}task(t){throw new Error(h("task",this.kind))}}class $ extends p{constructor(t){super({...t,inputs:[rt()],outputs:[D()]})}task(t){throw new Error(h("task",this.kind))}}class v extends p{constructor(t){super({...t,inputs:[B()],outputs:[x()]})}task(t){throw new Error(h("task",this.kind))}}class k extends p{constructor(t){super({...t,inputs:[B()],outputs:[g()]})}task(t){throw new Error(h("task",this.kind))}}class j extends p{constructor(t){super({...t,inputs:[ot()],outputs:[g()]})}task(t){throw new Error(h("task",this.kind))}}class M extends dt{static kind="arrayLength";task(t){return t.length}}const ct={[M.kind]:M};class J extends d{static kind="data";constructor(t){super({...t,outputs:[st()]})}run(){}}class C extends d{static kind="array";constructor(t){super({...t,outputs:[D()]})}run(){}}class F extends d{static kind="boolean";constructor(t){super({...t,outputs:[x()]})}run(){}}class U extends d{static kind="number";constructor(t){super({...t,outputs:[g()]})}run(){}}class L extends d{static kind="object";constructor(t){super({...t,outputs:[it()]})}run(){}}class z extends d{static kind="string";constructor(t){super({...t,outputs:[ut()]})}run(){}}const ht={[J.kind]:J,[C.kind]:C,[F.kind]:F,[U.kind]:U,[L.kind]:L,[z.kind]:z};class K extends k{static kind="mathCos";task(t){return Math.cos(t)}}class H extends k{static kind="mathCosh";task(t){return Math.cosh(t)}}class I extends d{static kind="mathPI";static metadata={isConstant:!0};constructor(t){super({...t,outputs:[g(Math.PI)]},I.metadata)}}class V extends k{static kind="mathSin";task(t){return Math.sin(t)}}class W extends k{static kind="mathSinh";task(t){return Math.sinh(t)}}const pt={[K.kind]:K,[H.kind]:H,[I.kind]:I,[V.kind]:V,[W.kind]:W};class G extends v{static kind="isFinite";task(t){return Number.isFinite(t)}}class _ extends v{static kind="isInteger";task(t){return Number.isInteger(t)}}class q extends at{static kind="isNaN";task(t){return Number.isNaN(t)}}class Q extends j{static kind="parseFloat";task(t){return Number.parseFloat(t)}}class R extends j{static kind="parseInt";task(t){return Number.parseInt(t)}}const lt={[G.kind]:G,[_.kind]:_,[q.kind]:q,[Q.kind]:Q,[R.kind]:R};class X extends ${static kind="objectKeys";task(t){return Object.keys(t)}}class Y extends ${static kind="objectValues";task(t){return Object.values(t)}}const gt={[X.kind]:X,[Y.kind]:Y};class Z extends j{static kind="stringLength";task(t){return t.length}}const ft={[Z.kind]:Z},yt={...ct,...ht,...pt,...lt,...gt,...ft};export{yt as catalog};

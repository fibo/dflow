const c=d=>`${d} must be a string`,E=d=>`${d} must be a number`,O=(d,t)=>`${t} pin not found nodeId=${d}`,b=(d,t,e)=>`${O(d,t)} position=${e}`,T=(d,t,e)=>`${O(d,t)} pinId=${e}`;class r{static isArray(t){return Array.isArray(t)}static isBoolean(t){return typeof t=="boolean"}static isDflowGraph(t){return typeof t=="object"&&t!==null&&!Array.isArray(t)&&Array.isArray(t.nodes)&&Array.isArray(t.edges)&&l.isDflowGraph(t)}static isObject(t){return!r.isUndefined(t)&&!r.isNull(t)&&!r.isArray(t)&&typeof t=="object"}static isNull(t){return t===null}static isNumber(t){return typeof t=="number"}static isString(t){return typeof t=="string"}static isStringNotEmpty(t){return r.isString(t)&&t.length>0}static isUndefined(t){return typeof t=="undefined"}static validate(t,e){return e.length===0?!0:e.some(s=>{switch(s){case"array":return r.isArray(t);case"boolean":return r.isBoolean(t);case"null":return r.isNull(t);case"number":return r.isNumber(t);case"object":return r.isObject(t);case"string":return r.isString(t);case"DflowGraph":return r.isDflowGraph(t);default:return!1}},!0)}}class h{id;name;static isDflowItem({id:t,name:e}){return typeof t=="string"&&["undefined","string"].includes(typeof e)}constructor({id:t,name:e}){this.id=t,this.name=e}toJSON(){return JSON.stringify(this.toObject())}toObject(){const t={id:this.id};return typeof this.name=="string"&&(t.name=this.name),t}}class p extends h{kind;types;static types=["string","number","boolean","null","object","array","DflowGraph"];static isDflowPin({types:t=[],...e}){return h.isDflowItem(e)&&t.every(s=>p.isDflowPinType(s))}static isDflowPinType(t){p.types.includes(t)}constructor(t,{id:e,types:s=[]}){super({id:e});this.kind=t,this.types=s}get hasTypeAny(){return this.types.length===0}get hasTypeString(){return this.hasTypeAny||this.types.includes("string")}get hasTypeNumber(){return this.hasTypeAny||this.types.includes("number")}get hasTypeBoolean(){return this.hasTypeAny||this.types.includes("boolean")}get hasTypeNull(){return this.hasTypeAny||this.types.includes("null")}get hasTypeObject(){return this.hasTypeAny||this.types.includes("object")}get hasTypeArray(){return this.hasTypeAny||this.types.includes("array")}}class y extends p{#t;static isDflowInput({id:t,types:e}){return p.isDflowPin({id:t,types:e})}constructor(t){super("input",t)}connectTo(t){this.#t=t}disconnect(){this.#t=void 0}get data(){return this.#t?.data}toObject(){const t={id:this.id};return this.types.length>0&&(t.types=this.types),t}}class w extends p{#t;static isDflowOutput({id:t,data:e,types:s=[]}){return p.isDflowPin({id:t,types:s})&&r.validate(e,s)}constructor({data:t,...e}){super("output",e);this.#t=t}clear(){this.#t=void 0}get data(){return this.#t}set data(t){switch(!0){case r.isUndefined(t):this.clear();break;case this.hasTypeAny:case(r.isString(t)&&this.hasTypeString):case(r.isNumber(t)&&this.hasTypeNumber):case(r.isBoolean(t)&&this.hasTypeBoolean):case(r.isNull(t)&&this.hasTypeNull):case(r.isObject(t)&&this.hasTypeObject):case(r.isArray(t)&&this.hasTypeArray):{this.#t=t;break}default:throw new Error(`could not set data pinTypes=${JSON.stringify(this.types)} typeof=${typeof t}`)}}toObject(){const t={...super.toObject()};return r.isUndefined(this.#t)||(t.data=this.#t),this.types.length>0&&(t.types=this.types),t}}class g extends h{kind;meta;inputs=new Map;outputs=new Map;#t=[];#e=[];static isDflowNode({kind:t,inputs:e=[],outputs:s=[],...n}){return h.isDflowItem(n)&&typeof t=="string"&&e.every(o=>y.isDflowInput(o))&&s.every(o=>w.isDflowOutput(o))}constructor({kind:t,inputs:e=[],outputs:s=[],...n},{isAsync:o=!1,isConstant:u=!1}={}){super(n);this.kind=t,this.meta={isAsync:o,isConstant:u};for(const i of e)this.newInput(i);for(const i of s)this.newOutput(i)}generateInputId(t=this.inputs.size){const e=`i${t}`;return this.inputs.has(e)?this.generateInputId(t+1):e}generateOutputId(t=this.outputs.size){const e=`o${t}`;return this.outputs.has(e)?this.generateOutputId(t+1):e}getInputById(t){if(typeof t!="string")throw new TypeError(c("inputId"));const e=this.inputs.get(t);if(e instanceof y)return e;throw new Error(T(this.id,"input",t))}getInputByPosition(t){if(typeof t!="number")throw new TypeError(E("position"));const e=this.#t[t];if(typeof e=="undefined")throw new Error(b(this.id,"input",t));return this.getInputById(e)}getOutputById(t){if(typeof t!="string")throw new TypeError(c("outputId"));const e=this.outputs.get(t);if(e instanceof w)return e;throw new Error(T(this.id,"output",t))}getOutputByPosition(t){if(typeof t!="number")throw new TypeError(E("position"));const e=this.#e[t];if(typeof e=="undefined")throw new Error(b(this.id,"output",t));return this.getOutputById(e)}newInput(t){const e=r.isStringNotEmpty(t.id)?t.id:this.generateInputId(),s=new y({...t,id:e});return this.storeInput(s),s}newOutput(t){const e=r.isStringNotEmpty(t.id)?t.id:this.generateOutputId(),s=new w({...t,id:e});return this.storeOutput(s),s}run(){throw new Error(`${this.constructor.name} does not implement a run() method`)}storeInput(t){this.inputs.set(t.id,t),this.#t.push(t.id)}storeOutput(t){this.outputs.set(t.id,t),this.#e.push(t.id)}toObject(){const t={...super.toObject(),kind:this.kind},e=[],s=[];for(const n of this.inputs.values())e.push(n.toObject());e.length>0&&(t.inputs=e);for(const n of this.outputs.values())s.push(n.toObject());return s.length>0&&(t.outputs=s),t}}class I extends g{static kind="Unknown";constructor(t){super({...t,kind:I.kind})}run(){}}class f extends h{source;target;static isDflowEdge({source:t,target:e,...s},n){return h.isDflowItem(s)&&Array.isArray(t)&&t.length===2&&n.nodes.find(({id:o,outputs:u=[]})=>o===t[0]&&u.find(({id:i})=>i===t[1]))&&Array.isArray(e)&&e.length===2&&n.nodes.find(({id:o,inputs:u=[]})=>o===e[0]&&u.find(({id:i})=>i===e[1]))}constructor({source:t,target:e,...s}){super(s);const[n,o]=t,[u,i]=e;if(typeof n!="string")throw new TypeError(c("sourceNodeId"));if(typeof o!="string")throw new TypeError(c("sourcePinId"));if(typeof u!="string")throw new TypeError(c("targetNodeId"));if(typeof i!="string")throw new TypeError(c("targetPinId"));this.source=t,this.target=e}toObject(){return{...super.toObject(),source:this.source,target:this.target}}}class l extends h{#t="success";nodes=new Map;edges=new Map;static isDflowGraph(t){return t.nodes.every(e=>g.isDflowNode(e))&&t.edges.every(e=>f.isDflowEdge(e,t))}static sort(t,e){const s={},n=u=>e.filter(({targetId:i})=>u===i).map(({sourceId:i})=>i),o=u=>{const i=n(u);if(i.length===0)return 0;let a=0;for(const N of i){const m=o(N);a=Math.max(m,a)}return a+1};for(const u of t)s[u]=o(u);return t.slice().sort((u,i)=>s[u]<=s[i]?-1:1)}clear(){this.nodes.clear(),this.edges.clear()}getNodeById(t){if(typeof t!="string")throw new TypeError(c("nodeId"));const e=this.nodes.get(t);if(e instanceof g)return e;throw new Error(`DflowNode not found, id=${t}`)}getEdgeById(t){if(typeof t!="string")throw new TypeError(c("edgeId"));const e=this.edges.get(t);if(e instanceof f)return e;throw new Error(`DflowEdge not found, id=${t}`)}generateEdgeId(t=this.edges.size){const e=`e${t}`;return this.edges.has(e)?this.generateEdgeId(t+1):e}generateNodeId(t=this.nodes.size){const e=`n${t}`;return this.nodes.has(e)?this.generateNodeId(t+1):e}async run(){this.runStatusIsSuccess&&(this.#t="waiting");const t=l.sort([...this.nodes.keys()],[...this.edges.values()].map(e=>({sourceId:e.source[0],targetId:e.target[0]})));for(const e of t){const s=this.nodes.get(e);try{s.meta.isConstant===!1&&(s.meta.isAsync?await s.run():s.run())}catch(n){console.error(n),this.#t="failure"}}this.runStatusIsWaiting&&(this.#t="success")}get runStatusIsSuccess(){return this.#t==="success"}get runStatusIsWaiting(){return this.#t==="waiting"}get runStatusIsFailure(){return this.#t==="failure"}toObject(){const t={...super.toObject(),nodes:[],edges:[]};for(const e of this.nodes.values())t.nodes.push(e.toObject());for(const e of this.edges.values())t.edges.push(e.toObject());return t}}class P{graph;#t;constructor(t={}){this.#t=t,this.graph=new l({id:"g1"})}connect(t,e=0){return{to:(s,n=0)=>{const o=this.graph.generateEdgeId(),u=t.getOutputByPosition(e),i=s.getInputByPosition(n);this.newEdge({id:o,source:[t.id,u.id],target:[s.id,i.id]})}}}deleteEdge(t){if(typeof t!="string")throw new TypeError(c("edgeId"));const e=this.graph.getEdgeById(t);if(e instanceof f){const[s,n]=e.target;this.graph.getNodeById(s).getInputById(n).disconnect(),this.graph.edges.delete(t)}else throw new Error(`DflowEdge not found, id=${t}`)}deleteNode(t){if(typeof t!="string")throw new TypeError(c("nodeId"));const e=this.graph.getNodeById(t);if(e instanceof g){for(const s of this.graph.edges.values()){const{source:[n],target:[o]}=s;(n===e.id||o===e.id)&&this.deleteEdge(s.id)}this.graph.nodes.delete(t)}else throw new Error(`DflowNode not found, id=${t}`)}newNode(t){const e=this.#t[t.kind]??I,s=r.isStringNotEmpty(t.id)?t.id:this.graph.generateNodeId(),n=new e({...t,id:s});if(this.graph.nodes.has(n.id))throw new Error(`Cannot overwrite DflowNode, id=${n.id}`);return this.graph.nodes.set(n.id,n),n}newEdge(t){const e=r.isStringNotEmpty(t.id)?t.id:this.graph.generateEdgeId(),s=new f({...t,id:e});if(this.graph.edges.has(s.id))throw new Error(`Cannot overwrite DflowEdge, id=${s.id}`);this.graph.edges.set(s.id,s);const[n,o]=s.source,[u,i]=s.target,a=this.graph.getNodeById(n),N=this.graph.getNodeById(u),m=a.getOutputById(o);return N.getInputById(i).connectTo(m),s}newInput(t,e){return this.graph.getNodeById(t).newInput(e)}newOutput(t,e){return this.graph.getNodeById(t).newOutput(e)}}export{r as DflowData};export{h as DflowItem};export{p as DflowPin};export{y as DflowInput};export{w as DflowOutput};export{g as DflowNode};export{I as DflowUnknownNode};export{f as DflowEdge};export{l as DflowGraph};export{P as DflowHost};

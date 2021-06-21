const c=e=>`${e} must be a string`,P=e=>`${e} must be a number`,j=(e,t)=>`${t} pin not found nodeId=${e}`,S=(e,t,s)=>`${j(e,t)} position=${s}`,v=(e,t,s)=>`${j(e,t)} pinId=${s}`;class i{static isArray(t){return Array.isArray(t)}static isBoolean(t){return typeof t=="boolean"}static isDflowGraph(t){return typeof t=="object"&&t!==null&&!Array.isArray(t)&&Array.isArray(t.nodes)&&Array.isArray(t.edges)&&I.isDflowGraph(t)}static isObject(t){return!i.isUndefined(t)&&!i.isNull(t)&&!i.isArray(t)&&typeof t=="object"}static isNull(t){return t===null}static isNumber(t){return typeof t=="number"}static isString(t){return typeof t=="string"}static isStringNotEmpty(t){return i.isString(t)&&t.length>0}static isUndefined(t){return typeof t=="undefined"}static validate(t,s){return s.length===0?!0:s.some(n=>{switch(n){case"array":return i.isArray(t);case"boolean":return i.isBoolean(t);case"null":return i.isNull(t);case"number":return i.isNumber(t);case"object":return i.isObject(t);case"string":return i.isString(t);case"DflowGraph":return i.isDflowGraph(t);default:return!1}},!0)}}class h{id;name;static isDflowItem({id:t,name:s}){return typeof t=="string"&&["undefined","string"].includes(typeof s)}constructor({id:t,name:s}){this.id=t,this.name=s}toJSON(){return JSON.stringify(this.toObject())}toObject(){const t={id:this.id};return typeof this.name=="string"&&(t.name=this.name),t}}class l extends h{kind;types;static types=["string","number","boolean","null","object","array","DflowGraph"];static isDflowPin({types:t=[],...s}){return h.isDflowItem(s)&&t.every(n=>l.isDflowPinType(n))}static isDflowPinType(t){l.types.includes(t)}constructor(t,{id:s,types:n=[]}){super({id:s});this.kind=t,this.types=n}get hasTypeAny(){return this.types.length===0}get hasTypeString(){return this.hasTypeAny||this.types.includes("string")}get hasTypeNumber(){return this.hasTypeAny||this.types.includes("number")}get hasTypeBoolean(){return this.hasTypeAny||this.types.includes("boolean")}get hasTypeNull(){return this.hasTypeAny||this.types.includes("null")}get hasTypeObject(){return this.hasTypeAny||this.types.includes("object")}get hasTypeArray(){return this.hasTypeAny||this.types.includes("array")}}class O extends l{#t;static isDflowInput({id:t,types:s}){return l.isDflowPin({id:t,types:s})}constructor(t){super("input",t)}connectTo(t){this.#t=t}disconnect(){this.#t=void 0}get data(){return this.#t?.data}toObject(){const t={id:this.id};return this.types.length>0&&(t.types=this.types),t}}class b extends l{#t;static isDflowOutput({id:t,data:s,types:n=[]}){return l.isDflowPin({id:t,types:n})&&i.validate(s,n)}constructor({data:t,...s}){super("output",s);this.#t=t}clear(){this.#t=void 0}get data(){return this.#t}set data(t){switch(!0){case i.isUndefined(t):this.clear();break;case this.hasTypeAny:case(i.isString(t)&&this.hasTypeString):case(i.isNumber(t)&&this.hasTypeNumber):case(i.isBoolean(t)&&this.hasTypeBoolean):case(i.isNull(t)&&this.hasTypeNull):case(i.isObject(t)&&this.hasTypeObject):case(i.isArray(t)&&this.hasTypeArray):{this.#t=t;break}default:throw new Error(`could not set data pinTypes=${JSON.stringify(this.types)} typeof=${typeof t}`)}}toObject(){const t={...super.toObject()};return i.isUndefined(this.#t)||(t.data=this.#t),this.types.length>0&&(t.types=this.types),t}}class d extends h{kind;meta;inputs=new Map;outputs=new Map;#t=[];#s=[];static isDflowNode({kind:t,inputs:s=[],outputs:n=[],...r}){return h.isDflowItem(r)&&typeof t=="string"&&s.every(o=>O.isDflowInput(o))&&n.every(o=>b.isDflowOutput(o))}constructor({kind:t,inputs:s=[],outputs:n=[],...r},{isAsync:o=!1,isConstant:u=!1}={}){super(r);this.kind=t,this.meta={isAsync:o,isConstant:u};for(const a of s)this.newInput(a);for(const a of n)this.newOutput(a)}generateInputId(t=this.inputs.size){const s=`i${t}`;return this.inputs.has(s)?this.generateInputId(t+1):s}generateOutputId(t=this.outputs.size){const s=`o${t}`;return this.outputs.has(s)?this.generateOutputId(t+1):s}getInputById(t){if(typeof t!="string")throw new TypeError(c("inputId"));const s=this.inputs.get(t);if(s instanceof O)return s;throw new Error(v(this.id,"input",t))}getInputByPosition(t){if(typeof t!="number")throw new TypeError(P("position"));const s=this.#t[t];if(typeof s=="undefined")throw new Error(S(this.id,"input",t));return this.getInputById(s)}getOutputById(t){if(typeof t!="string")throw new TypeError(c("outputId"));const s=this.outputs.get(t);if(s instanceof b)return s;throw new Error(v(this.id,"output",t))}getOutputByPosition(t){if(typeof t!="number")throw new TypeError(P("position"));const s=this.#s[t];if(typeof s=="undefined")throw new Error(S(this.id,"output",t));return this.getOutputById(s)}newInput(t){const s=i.isStringNotEmpty(t.id)?t.id:this.generateInputId(),n=new O({...t,id:s});return this.storeInput(n),n}newOutput(t){const s=i.isStringNotEmpty(t.id)?t.id:this.generateOutputId(),n=new b({...t,id:s});return this.storeOutput(n),n}run(t){throw new Error(`${this.constructor.name} does not implement a run() method`)}storeInput(t){this.inputs.set(t.id,t),this.#t.push(t.id)}storeOutput(t){this.outputs.set(t.id,t),this.#s.push(t.id)}toObject(){const t={...super.toObject(),kind:this.kind},s=[],n=[];for(const r of this.inputs.values())s.push(r.toObject());s.length>0&&(t.inputs=s);for(const r of this.outputs.values())n.push(r.toObject());return n.length>0&&(t.outputs=n),t}}class m extends d{static kind="Unknown";constructor(t){super({...t,kind:m.kind})}run(){}}class k extends h{source;target;static isDflowEdge({source:t,target:s,...n},r){return h.isDflowItem(n)&&Array.isArray(t)&&t.length===2&&r.nodes.find(({id:o,outputs:u=[]})=>o===t[0]&&u.find(({id:a})=>a===t[1]))&&Array.isArray(s)&&s.length===2&&r.nodes.find(({id:o,inputs:u=[]})=>o===s[0]&&u.find(({id:a})=>a===s[1]))}constructor({source:t,target:s,...n}){super(n);const[r,o]=t,[u,a]=s;if(typeof r!="string")throw new TypeError(c("sourceNodeId"));if(typeof o!="string")throw new TypeError(c("sourcePinId"));if(typeof u!="string")throw new TypeError(c("targetNodeId"));if(typeof a!="string")throw new TypeError(c("targetPinId"));this.source=t,this.target=s}toObject(){return{...super.toObject(),source:this.source,target:this.target}}}class I extends h{#t="success";nodes=new Map;edges=new Map;static isDflowGraph(t){return t.nodes.every(s=>d.isDflowNode(s))&&t.edges.every(s=>k.isDflowEdge(s,t))}static sort(t,s){const n={},r=u=>s.filter(({targetId:a})=>u===a).map(({sourceId:a})=>a),o=u=>{const a=r(u);if(a.length===0)return 0;let w=0;for(const A of a){const T=o(A);w=Math.max(T,w)}return w+1};for(const u of t)n[u]=o(u);return t.slice().sort((u,a)=>n[u]<=n[a]?-1:1)}clear(){this.nodes.clear(),this.edges.clear()}getNodeById(t){if(typeof t!="string")throw new TypeError(c("nodeId"));const s=this.nodes.get(t);if(s instanceof d)return s;throw new Error(`DflowNode not found, id=${t}`)}getEdgeById(t){if(typeof t!="string")throw new TypeError(c("edgeId"));const s=this.edges.get(t);if(s instanceof k)return s;throw new Error(`DflowEdge not found, id=${t}`)}generateEdgeId(t=this.edges.size){const s=`e${t}`;return this.edges.has(s)?this.generateEdgeId(t+1):s}generateNodeId(t=this.nodes.size){const s=`n${t}`;return this.nodes.has(s)?this.generateNodeId(t+1):s}async run(t){this.runStatusIsSuccess&&(this.#t="waiting");const s=I.sort([...this.nodes.keys()],[...this.edges.values()].map(n=>({sourceId:n.source[0],targetId:n.target[0]})));for(const n of s){const r=this.nodes.get(n);try{r.meta.isConstant===!1&&(r.meta.isAsync?await r.run(t):r.run(t))}catch(o){console.error(o),this.#t="failure"}}this.runStatusIsWaiting&&(this.#t="success")}get runStatusIsSuccess(){return this.#t==="success"}get runStatusIsWaiting(){return this.#t==="waiting"}get runStatusIsFailure(){return this.#t==="failure"}toObject(){const t={...super.toObject(),nodes:[],edges:[]};for(const s of this.nodes.values())t.nodes.push(s.toObject());for(const s of this.edges.values())t.edges.push(s.toObject());return t}}class yt{graph;#t;constructor(t={}){this.#t=t,this.graph=new I({id:"g1"})}get nodeKinds(){return Object.keys(this.#t)}connect(t,s=0){return{to:(n,r=0)=>{const o=this.graph.generateEdgeId(),u=t.getOutputByPosition(s),a=n.getInputByPosition(r);this.newEdge({id:o,source:[t.id,u.id],target:[n.id,a.id]})}}}deleteEdge(t){if(typeof t!="string")throw new TypeError(c("edgeId"));const s=this.graph.getEdgeById(t);if(s instanceof k){const[n,r]=s.target;this.graph.getNodeById(n).getInputById(r).disconnect(),this.graph.edges.delete(t)}else throw new Error(`DflowEdge not found, id=${t}`)}deleteNode(t){if(typeof t!="string")throw new TypeError(c("nodeId"));const s=this.graph.getNodeById(t);if(s instanceof d){for(const n of this.graph.edges.values()){const{source:[r],target:[o]}=n;(r===s.id||o===s.id)&&this.deleteEdge(n.id)}this.graph.nodes.delete(t)}else throw new Error(`DflowNode not found, id=${t}`)}newNode(t){const s=this.#t[t.kind]??m,n=i.isStringNotEmpty(t.id)?t.id:this.graph.generateNodeId(),r=new s({...t,id:n});if(this.graph.nodes.has(r.id))throw new Error(`Cannot overwrite DflowNode, id=${r.id}`);return this.graph.nodes.set(r.id,r),r}newEdge(t){const s=i.isStringNotEmpty(t.id)?t.id:this.graph.generateEdgeId(),n=new k({...t,id:s});if(this.graph.edges.has(n.id))throw new Error(`Cannot overwrite DflowEdge, id=${n.id}`);this.graph.edges.set(n.id,n);const[r,o]=n.source,[u,a]=n.target,w=this.graph.getNodeById(r),A=this.graph.getNodeById(u),T=w.getOutputById(o);return A.getInputById(a).connectTo(T),n}newInput(t,s){return this.graph.getNodeById(t).newInput(s)}newOutput(t,s){return this.graph.getNodeById(t).newOutput(s)}async run(){await this.graph.run(this)}}export{i as DflowData};export{h as DflowItem};export{l as DflowPin};export{O as DflowInput};export{b as DflowOutput};export{d as DflowNode};export{m as DflowUnknownNode};export{k as DflowEdge};export{I as DflowGraph};export{yt as DflowHost};const p=(e,t)=>`unimplemented method ${e} nodeKind=${t}`,wt=()=>({id:"i1"}),kt=()=>({id:"o1"}),It=()=>({id:"i1",types:["array"]}),$=e=>({id:"o1",types:["array"],data:e}),Ot=()=>({id:"i1",types:["boolean"]}),g=e=>({id:"o1",types:["boolean"],data:e}),bt=()=>({id:"i1",types:["object"]}),mt=e=>({id:"o1",types:["object"],data:e}),M=()=>({id:"i1",types:["number"]}),y=e=>({id:"o1",types:["number"],data:e}),Nt=()=>({id:"i1",types:["string"]}),Dt=e=>({id:"o1",types:["string"],data:e}),C=()=>[{id:"1i",types:["boolean"]},{id:"i2",types:["boolean"]}],L=()=>[{id:"1i",types:["number"]},{id:"i2",types:["number"]}];class f extends d{get input(){return this.getInputByPosition(0)}get output(){return this.getOutputByPosition(0)}run(){const{input:{data:t,types:s},output:n,task:r}=this;i.isUndefined(t)?n.clear():i.validate(t,s)&&(n.data=r(t))}task(t){throw new Error(p("task",this.kind))}}class xt extends f{constructor(t){super({...t,inputs:[wt()],outputs:[g()]})}task(t){throw new Error(p("task",this.kind))}}class Et extends f{constructor(t){super({...t,inputs:[It()],outputs:[y()]})}task(t){throw new Error(p("task",this.kind))}}class G extends f{constructor(t){super({...t,inputs:[bt()],outputs:[$()]})}task(t){throw new Error(p("task",this.kind))}}class U extends f{constructor(t){super({...t,inputs:[M()],outputs:[g()]})}task(t){throw new Error(p("task",this.kind))}}class N extends f{constructor(t){super({...t,inputs:[M()],outputs:[y()]})}task(t){throw new Error(p("task",this.kind))}}class B extends f{constructor(t){super({...t,inputs:[Nt()],outputs:[y()]})}task(t){throw new Error(p("task",this.kind))}}class D extends d{get input1(){return this.getInputByPosition(0)}get input2(){return this.getInputByPosition(1)}get output(){return this.getOutputByPosition(0)}run(){const{input1:{data:t,types:s},input2:{data:n,types:r},output:o,task:u}=this;i.isUndefined(t)||i.isUndefined(n)?o.clear():i.validate(t,s)&&i.validate(n,r)&&(o.data=u(t,n))}task(t,s){throw new Error(p("task",this.kind))}}class x extends D{constructor(t){super({...t,inputs:L(),outputs:[g()]})}task(t,s){throw new Error(p("task",this.kind))}}class F extends D{constructor(t){super({...t,inputs:L(),outputs:[y()]})}task(t,s){throw new Error(p("task",this.kind))}}class q extends Et{static kind="arrayLength";task(t){return t.length}}const At={[q.kind]:q};class z extends d{static kind="if";constructor(t){super({...t,inputs:[{id:"i1",name:"condition",types:["boolean"]},{id:"i2",name:"then"},{id:"i3",name:"else"}],outputs:[{id:"o1"}]})}run(){const t=this.getInputByPosition(0).data,s=this.getInputByPosition(1).data,n=this.getInputByPosition(2).data,r=this.getOutputByPosition(0);t?r.data=s:r.data=n}}const Tt={[z.kind]:z};class K extends d{static kind="data";constructor(t){super({...t,outputs:[kt()]})}run(){}}class _ extends d{static kind="array";constructor(t){super({...t,outputs:[$()]})}run(){}}class J extends d{static kind="boolean";constructor(t){super({...t,outputs:[g()]})}run(){}}class H extends d{static kind="number";constructor(t){super({...t,outputs:[y()]})}run(){}}class V extends d{static kind="object";constructor(t){super({...t,outputs:[mt()]})}run(){}}class W extends d{static kind="string";constructor(t){super({...t,outputs:[Dt()]})}run(){}}const Bt={[K.kind]:K,[_.kind]:_,[J.kind]:J,[H.kind]:H,[V.kind]:V,[W.kind]:W};class Q extends D{static kind="logicAnd";constructor(t){super({...t,inputs:C(),outputs:[g()]})}task(t,s){return t&&s}}class R extends f{static kind="logicNot";constructor(t){super({...t,inputs:[Ot()],outputs:[g()]})}task(t){return!t}}class X extends D{static kind="logicOr";constructor(t){super({...t,inputs:C(),outputs:[g()]})}task(t,s){return t||s}}const Pt={[Q.kind]:Q,[R.kind]:R,[X.kind]:X};class Y extends N{static kind="mathCos";task(t){return Math.cos(t)}}class Z extends N{static kind="mathCosh";task(t){return Math.cosh(t)}}class E extends d{static kind="mathPI";static metadata={isConstant:!0};constructor(t){super({...t,outputs:[y(Math.PI)]},E.metadata)}}class tt extends N{static kind="mathSin";task(t){return Math.sin(t)}}class st extends N{static kind="mathSinh";task(t){return Math.sinh(t)}}const jt={[Y.kind]:Y,[Z.kind]:Z,[E.kind]:E,[tt.kind]:tt,[st.kind]:st};class et extends U{static kind="isFinite";task(t){return Number.isFinite(t)}}class nt extends U{static kind="isInteger";task(t){return Number.isInteger(t)}}class rt extends xt{static kind="isNaN";task(t){return Number.isNaN(t)}}class it extends B{static kind="parseFloat";task(t){return Number.parseFloat(t)}}class ot extends B{static kind="parseInt";task(t){return Number.parseInt(t)}}const St={[et.kind]:et,[nt.kind]:nt,[rt.kind]:rt,[it.kind]:it,[ot.kind]:ot};class ut extends G{static kind="objectKeys";task(t){return Object.keys(t)}}class at extends G{static kind="objectValues";task(t){return Object.values(t)}}const vt={[ut.kind]:ut,[at.kind]:at};class dt extends F{static kind="addition";task(t,s){return t+s}}class ct extends x{static kind="lessThan";task(t,s){return t<s}}class pt extends x{static kind="lessThanOrEqual";task(t,s){return t<=s}}class ht extends x{static kind="greaterThan";task(t,s){return t>s}}class lt extends x{static kind="greaterThanOrEqual";task(t,s){return t>=s}}class gt extends F{static kind="subtraction";task(t,s){return t-s}}const $t={[dt.kind]:dt,[ht.kind]:ht,[lt.kind]:lt,[ct.kind]:ct,[pt.kind]:pt,[gt.kind]:gt};class ft extends B{static kind="stringLength";task(t){return t.length}}const Mt={[ft.kind]:ft},Ct={...At,...Tt,...Bt,...Pt,...jt,...St,...vt,...$t,...Mt};export{Ct as catalog};

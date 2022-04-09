var D=Object.defineProperty;var qt=Object.getOwnPropertyDescriptor;var Gt=Object.getOwnPropertyNames;var Kt=Object.prototype.hasOwnProperty;var zt=n=>D(n,"__esModule",{value:!0});var Ht=(n,t)=>{for(var e in t)D(n,e,{get:t[e],enumerable:!0})},Jt=(n,t,e,i)=>{if(t&&typeof t=="object"||typeof t=="function")for(let a of Gt(t))!Kt.call(n,a)&&(e||a!=="default")&&D(n,a,{get:()=>t[a],enumerable:!(i=qt(t,a))||i.enumerable});return n};var Vt=(n=>(t,e)=>n&&n.get(t)||(e=Jt(zt({}),t,1),n&&n.set(t,e),e))(typeof WeakMap!="undefined"?new WeakMap:0);var os={};Ht(os,{DflowData:()=>u,DflowEdge:()=>m,DflowGraph:()=>h,DflowHost:()=>$t,DflowInput:()=>b,DflowItem:()=>g,DflowNode:()=>s,DflowOutput:()=>k,DflowPin:()=>f,DflowUnknownNode:()=>x,catalog:()=>Rt});const l=n=>`${n} must be a string`,O=n=>`${n} must be a number`,T=(n,t)=>`${t} pin not found nodeId=${n}`,E=(n,t,e)=>`${T(n,t)} position=${e}`,P=(n,t,e)=>`${T(n,t)} pinId=${e}`,N=({id:n,kind:t,outputs:e})=>({id:n,kind:t,outputs:e?.map(({id:i,data:a,name:o})=>({id:i,data:a,name:o}))});class u{static isArray(t){return Array.isArray(t)}static isBoolean(t){return typeof t=="boolean"}static isDflowGraph(t){return typeof t=="object"&&t!==null&&!Array.isArray(t)&&Array.isArray(t.nodes)&&Array.isArray(t.edges)&&h.isDflowGraph(t)}static isDflowId(t){return u.isStringNotEmpty(t)}static isDflowType(t){return typeof t=="string"&&f.types.includes(t)}static isObject(t){return!u.isUndefined(t)&&!u.isNull(t)&&!u.isArray(t)&&typeof t=="object"}static isNull(t){return t===null}static isNumber(t){return typeof t=="number"}static isString(t){return typeof t=="string"}static isStringNotEmpty(t){return u.isString(t)&&t.length>0}static isUndefined(t){return typeof t>"u"}static validate(t,e){return e.length===0?!0:e.some(i=>{switch(i){case"array":return u.isArray(t);case"boolean":return u.isBoolean(t);case"null":return u.isNull(t);case"number":return u.isNumber(t);case"object":return u.isObject(t);case"string":return u.isString(t);case"DflowGraph":return u.isDflowGraph(t);case"DflowId":return u.isDflowId(t);case"DflowType":return u.isDflowType(t);default:return!1}},!0)}}class g{id;name;static isDflowItem({id:t,name:e}){return u.isDflowId(t)&&(u.isUndefined(e)||u.isStringNotEmpty(e))}constructor({id:t,name:e}){this.id=t,this.name=e}toObject(){const t={id:this.id};return typeof this.name=="string"&&(t.name=this.name),t}}class f extends g{kind;types;static types=["string","number","boolean","null","object","array","DflowId","DflowGraph","DflowType"];static isDflowPin({types:t=[],...e}){return g.isDflowItem(e)&&t.every(i=>f.isDflowPinType(i))}static isDflowPinType(t){f.types.includes(t)}constructor(t,{types:e=[],...i}){super(i);this.kind=t,this.types=e}get hasTypeAny(){return this.types.length===0}get hasTypeDflowId(){return this.hasTypeAny||this.types.includes("DflowId")}get hasTypeDflowGraph(){return this.hasTypeAny||this.types.includes("DflowGraph")}get hasTypeDflowType(){return this.hasTypeAny||this.types.includes("DflowType")}get hasTypeString(){return this.hasTypeAny||this.types.includes("string")}get hasTypeNumber(){return this.hasTypeAny||this.types.includes("number")}get hasTypeBoolean(){return this.hasTypeAny||this.types.includes("boolean")}get hasTypeNull(){return this.hasTypeAny||this.types.includes("null")}get hasTypeObject(){return this.hasTypeAny||this.types.includes("object")}get hasTypeArray(){return this.hasTypeAny||this.types.includes("array")}addType(t){this.types.push(t)}removeType(t){this.types.splice(this.types.indexOf(t),1)}}class b extends f{#t;#s;static isDflowInput({id:t,types:e}){return f.isDflowPin({id:t,types:e})}constructor({optional:t,...e}){super("input",e);this.#s=t}get data(){return this.#t?.data}get isConnected(){return typeof this.#t>"u"}get isOptional(){return this.#s}connectTo(t){const{hasTypeAny:e,types:i}=this,{types:a}=t;if(e||i.some(o=>a.includes(o)))this.#t=t;else throw new Error(`mismatching pinTypes, source has types [${a.join()}] and target has types [${i.join()}]`)}disconnect(){this.#t=void 0}toObject(){const t={id:this.id};return this.types.length>0&&(t.types=this.types),t}}class k extends f{#t;static isDflowOutput({id:t,data:e,types:i=[]}){return f.isDflowPin({id:t,types:i})&&u.validate(e,i)}constructor({data:t,...e}){super("output",e);this.#t=t}clear(){this.#t=void 0}get data(){return this.#t}set data(t){switch(!0){case u.isUndefined(t):this.clear();break;case this.hasTypeAny:case(u.isDflowGraph(t)&&this.hasTypeDflowGraph):case(u.isDflowId(t)&&this.hasTypeDflowId):case(u.isString(t)&&this.hasTypeString):case(u.isNumber(t)&&this.hasTypeNumber):case(u.isBoolean(t)&&this.hasTypeBoolean):case(u.isNull(t)&&this.hasTypeNull):case(u.isObject(t)&&this.hasTypeObject):case(u.isArray(t)&&this.hasTypeArray):{this.#t=t;break}default:throw new Error(`could not set data pinTypes=${JSON.stringify(this.types)} typeof=${typeof t}`)}}toObject(){const t={...super.toObject()};return u.isUndefined(this.#t)||(t.data=this.#t),this.types.length>0&&(t.types=this.types),t}}class s extends g{#t=new Map;#s=new Map;#e=[];#n=[];#i;kind;meta;host;static kind;static isAsync;static isConstant;static label;static inputs;static outputs;static generateInputIds(t=[]){return t.map((e,i)=>({...e,id:`i${i}`}))}static generateOutputIds(t=[]){return t.map((e,i)=>({...e,id:`o${i}`}))}static in(t=[],e){return[{types:t,...e}]}static ins(t,e=[]){return Array(t).fill(s.in(e)).flat()}static out(t=[],e){return[{types:t,...e}]}static outs(t,e=[]){return Array(t).fill(s.out(e)).flat()}static outputNumber(t){return{...t,types:["number"]}}static isDflowNode({kind:t,inputs:e=[],outputs:i=[],...a}){return g.isDflowItem(a)&&u.isStringNotEmpty(t)&&e.every(o=>b.isDflowInput(o))&&i.every(o=>k.isDflowOutput(o))}constructor({kind:t,inputs:e=[],outputs:i=[],...a},o,{isAsync:r=!1,isConstant:d=!1,label:y}={}){super(a);this.#i=y,this.host=o,this.kind=t,this.meta={isAsync:r,isConstant:d};for(const c of e)this.newInput(c);for(const c of i)this.newOutput(c);this.onCreate()}get label(){return this.#i||this.kind}get inputs(){return this.#t.values()}get outputs(){return this.#s.values()}get numInputs(){return this.#t.size}get numOutputs(){return this.#s.size}generateInputId(t=this.numInputs){const e=`i${t}`;return this.#t.has(e)?this.generateInputId(t+1):e}generateOutputId(t=this.numOutputs){const e=`o${t}`;return this.#s.has(e)?this.generateOutputId(t+1):e}getInputById(t){if(typeof t!="string")throw new TypeError(l("inputId"));const e=this.#t.get(t);if(e instanceof b)return e;throw new Error(P(this.id,"input",t))}input(t){if(typeof t!="number")throw new TypeError(O("position"));const e=this.#e[t];if(u.isUndefined(e))throw new Error(E(this.id,"input",t));return this.getInputById(e)}getOutputById(t){if(typeof t!="string")throw new TypeError(l("outputId"));const e=this.#s.get(t);if(e instanceof k)return e;throw new Error(P(this.id,"output",t))}output(t){if(typeof t!="number")throw new TypeError(O("position"));const e=this.#n[t];if(u.isUndefined(e))throw new Error(E(this.id,"output",t));return this.getOutputById(e)}deleteInput(t){this.host.deleteEdgesConnectedToPin([this.id,t]),this.#t.delete(t),this.#e.splice(this.#e.indexOf(t),1)}deleteOutput(t){this.host.deleteEdgesConnectedToPin([this.id,t]),this.#s.delete(t),this.#n.splice(this.#n.indexOf(t),1)}onBeforeConnectInput(t,e){}onCreate(){}newInput(t){const e=u.isDflowId(t.id)?t.id:this.generateInputId(),i=new b({...t,id:e});return this.#t.set(e,i),this.#e.push(e),i}newOutput(t){const e=u.isDflowId(t.id)?t.id:this.generateOutputId(),i=new k({...t,id:e});return this.#s.set(e,i),this.#n.push(e),i}run(){}toObject(){const t={...super.toObject(),kind:this.kind},e=[],i=[];for(const a of this.inputs)e.push(a.toObject());e.length>0&&(t.inputs=e);for(const a of this.outputs)i.push(a.toObject());return i.length>0&&(t.outputs=i),t}}class x extends s{static kind="Unknown";constructor(t,e){super({...t,kind:x.kind},e)}run(){}}class m extends g{source;target;static isDflowEdge({source:t,target:e,...i},a){return g.isDflowItem(i)&&Array.isArray(t)&&t.length===2&&a.nodes.find(({id:o,outputs:r=[]})=>o===t[0]&&r.find(({id:d})=>d===t[1]))&&Array.isArray(e)&&e.length===2&&a.nodes.find(({id:o,inputs:r=[]})=>o===e[0]&&r.find(({id:d})=>d===e[1]))}constructor({source:t,target:e,...i}){super(i);const[a,o]=t,[r,d]=e;if(typeof a!="string")throw new TypeError(l("sourceNodeId"));if(typeof o!="string")throw new TypeError(l("sourcePinId"));if(typeof r!="string")throw new TypeError(l("targetNodeId"));if(typeof d!="string")throw new TypeError(l("targetPinId"));this.source=t,this.target=e}toObject(){return{...super.toObject(),source:this.source,target:this.target}}}class h extends g{#t=new Map;#s=new Map;runOptions={verbose:!1};runStatus=null;executionReport=null;static isDflowGraph(t){return t.nodes.every(e=>s.isDflowNode(e))&&t.edges.every(e=>m.isDflowEdge(e,t))}static childrenOfNodeId(t,e){return e.filter(({sourceId:i})=>t===i).map(({targetId:i})=>i)}static parentsOfNodeId(t,e){return e.filter(({targetId:i})=>t===i).map(({sourceId:i})=>i)}static levelOfNodeId(t,e){const i=h.parentsOfNodeId(t,e);if(i.length===0)return 0;let a=0;for(const o of i){const r=h.levelOfNodeId(o,e);a=Math.max(r,a)}return a+1}static ancestorsOfNodeId(t,e){const i=h.parentsOfNodeId(t,e);return i.length===0?[]:i.reduce((a,o,r,d)=>{const y=h.ancestorsOfNodeId(o,e),c=a.concat(y);return r===d.length-1?Array.from(new Set(d.concat(c))):c},[])}static sort(t,e){const i={};for(const a of t)i[a]=h.levelOfNodeId(a,e);return t.slice().sort((a,o)=>i[a]<=i[o]?-1:1)}get edges(){return this.#s.values()}get nodes(){return this.#t.values()}get nodeConnections(){return[...this.#s.values()].map(t=>({sourceId:t.source[0],targetId:t.target[0]}))}get edgeIds(){return[...this.#s.keys()]}get nodeIds(){return[...this.#t.keys()]}get numEdges(){return this.#s.size}get numNodes(){return this.#t.size}addEdge(t){if(this.#s.has(t.id))throw new Error(`cannot overwrite edge, id=${t.id}`);this.#s.set(t.id,t)}addNode(t){if(this.#t.has(t.id))throw new Error(`cannot overwrite node, id=${t.id}`);this.#t.set(t.id,t)}clear(){this.#t.clear(),this.#s.clear()}deleteEdge(t){this.#s.delete(t)}deleteNode(t){this.#t.delete(t)}getNodeById(t){if(typeof t!="string")throw new TypeError(l("nodeId"));const e=this.#t.get(t);if(e instanceof s)return e;throw new Error(`DflowNode not found, id=${t}`)}getEdgeById(t){if(typeof t!="string")throw new TypeError(l("edgeId"));const e=this.#s.get(t);if(e instanceof m)return e;throw new Error(`DflowEdge not found, id=${t}`)}generateEdgeId(t=this.numEdges){const e=`e${t}`;return this.#s.has(e)?this.generateEdgeId(t+1):e}generateNodeId(t=this.numNodes){const e=`n${t}`;return this.#t.has(e)?this.generateNodeId(t+1):e}nodeIdsInsideFunctions(){const t=[];for(const e of this.nodes)e.kind==="return"&&t.push(h.ancestorsOfNodeId(e.id,this.nodeConnections));return Array.from(new Set(t.flat()))}async run(){const{verbose:t}=this.runOptions;this.runStatus="waiting",this.executionReport={status:this.runStatus,start:new Date},t&&(this.executionReport.steps=[]);const e=this.nodeIdsInsideFunctions(),i=h.sort(this.nodeIds.filter(a=>!e.includes(a)),this.nodeConnections);s:for(const a of i){const o=this.#t.get(a);try{if(!o.meta.isConstant){let r=!1;t:for(const{data:d,types:y,isOptional:c}of o.inputs){if(c&&typeof d>"u")continue t;if(!u.validate(d,y)){r=!0;break t}}if(r){for(const d of o.outputs)d.clear();t&&this.executionReport.steps?.push(N(o.toObject()));continue s}o.meta.isAsync?await o.run():o.run()}t&&this.executionReport.steps?.push(N(o.toObject()))}catch(r){console.error(r),this.runStatus="failure"}}this.runStatus==="waiting"&&(this.runStatus="success"),this.executionReport.status=this.runStatus,this.executionReport.end=new Date}toObject(){const t={...super.toObject(),nodes:[],edges:[]};for(const e of this.nodes)t.nodes.push(e.toObject());for(const e of this.edges)t.edges.push(e.toObject());return t}}class $t{#t;#s;context;constructor(t={}){this.#s=t,this.#t=new h({id:"g1"}),this.context={}}get executionReport(){return this.#t.executionReport}get edges(){return this.#t.edges}get nodes(){return this.#t.nodes}get numEdges(){return this.#t.numEdges}get numNodes(){return this.#t.numNodes}get nodeKinds(){return Object.keys(this.#s)}get runStatusIsSuccess(){return this.#t.runStatus==="success"}get runStatusIsWaiting(){return this.#t.runStatus==="waiting"}get runStatusIsFailure(){return this.#t.runStatus==="failure"}set verbose(t){this.#t.runOptions.verbose=t}clearGraph(){this.#t.clear()}connect(t,e=0){return{to:(i,a=0)=>{const o=this.#t.generateEdgeId(),r=t.output(e),d=i.input(a);i.onBeforeConnectInput(t,e),this.newEdge({id:o,source:[t.id,r.id],target:[i.id,d.id]})}}}deleteEdge(t){if(typeof t!="string")throw new TypeError(l("edgeId"));const e=this.#t.getEdgeById(t);if(e instanceof m){const[i,a]=e.target;this.getNodeById(i).getInputById(a).disconnect(),this.#t.deleteEdge(t)}else throw new Error(`DflowEdge not found, id=${t}`)}deleteNode(t){if(typeof t!="string")throw new TypeError(l("nodeId"));const e=this.getNodeById(t);if(e instanceof s){for(const i of this.#t.edges){const{source:[a],target:[o]}=i;(a===e.id||o===e.id)&&this.deleteEdge(i.id)}this.#t.deleteNode(t)}else throw new Error(`DflowNode not found, id=${t}`)}deleteEdgesConnectedToPin([t,e]){for(const i of this.edges){const[a,o]=i.source,[r,d]=i.target;(a===t&&o===e||r===t&&d===e)&&this.deleteEdge(i.id)}}executeFunction(t,e){const{verbose:i}=this.#t.runOptions,a=this.#t.nodeConnections,o=h.childrenOfNodeId(t,a),r=[];for(const c of o){const p=this.getNodeById(c);p.kind==="return"&&r.push(p.id)}const d=r.reduce((c,p,w,Lt)=>{const Ut=h.ancestorsOfNodeId(p,a),A=c.concat(Ut);return w===Lt.length?Array.from(new Set(A)):A},[]),y=h.sort([...r,...d],a);for(const c of y){const p=this.getNodeById(c);try{switch(p.kind){case"argument":{const w=Math.max(p.input(1).data??0,0);p.output(0).data=e[w];break}case"return":return p.input(1).data;default:!p.meta.isConstant&&!p.meta.isAsync&&p.run(),i&&this.executionReport?.steps?.push(N(p.toObject()))}}catch(w){console.error(w)}}}getEdgeById(t){return this.#t.getEdgeById(t)}getNodeById(t){return this.#t.getNodeById(t)}newNode(t){const e=this.#s[t.kind]??x,i=u.isDflowId(t.id)?t.id:this.#t.generateNodeId(),a={isAsync:e.isAsync,isConstant:e.isConstant,label:e.label},o=Array.isArray(t.inputs)?t.inputs:s.generateInputIds(e.inputs),r=Array.isArray(t.outputs)?t.outputs:s.generateOutputIds(e.outputs),d=new e({...t,id:i,inputs:o,outputs:r},this,a);return this.#t.addNode(d),d}newEdge(t){const e=u.isDflowId(t.id)?t.id:this.#t.generateEdgeId(),i=new m({...t,id:e});this.#t.addEdge(i);const[a,o]=i.source,[r,d]=i.target,y=this.#t.getNodeById(a),c=this.#t.getNodeById(r),p=y.getOutputById(o);return c.getInputById(d).connectTo(p),i}newInput(t,e){return this.#t.getNodeById(t).newInput(e)}newOutput(t,e){return this.#t.getNodeById(t).newOutput(e)}toObject(){return this.#t.toObject()}async run(){await this.#t.run()}}class S extends s{static kind="arrayAt";static inputs=[...s.in(["array"]),...s.in(["number"],{name:"index"})];static outputs=s.out();run(){const t=this.input(0).data,e=this.input(1).data;this.output(0).data=t.at(e)}}class j extends s{static kind="arrayFilter";static inputs=[...s.in(["array"]),...s.in(["DflowId"],{name:"functionId"})];static outputs=s.out(["array"]);run(){this.output(0).data=this.input(0).data.filter((...t)=>this.host.executeFunction(this.input(1).data,t))}}class v extends s{static kind="arrayFindLastIndex";static inputs=[...s.in(["array"]),...s.in(["DflowId"],{name:"functionId"})];static outputs=s.out(["number"]);run(){this.output(0).data=this.input(0).data.findLastIndex((...t)=>this.host.executeFunction(this.input(1).data,t))}}class C extends s{static kind="arrayFindIndex";static inputs=[...s.in(["array"]),...s.in(["DflowId"],{name:"functionId"})];static outputs=s.out(["number"]);run(){this.output(0).data=this.input(0).data.findIndex((...t)=>this.host.executeFunction(this.input(1).data,t))}}class M extends s{static kind="arrayIncludes";static inputs=[...s.in(["array"],{name:"array"}),...s.in(["string"],{name:"element"})];static outputs=s.out(["boolean"]);run(){const t=this.input(0).data,e=this.input(1).data;Array.isArray(t)&&(this.output(0).data=t.includes(e))}}class B extends s{static kind="arrayJoin";static inputs=[...s.in(["array"],{name:"array"}),...s.in(["string"],{name:"separator",optional:!0})];static outputs=s.out(["string"]);run(){const t=this.input(0).data,e=this.input(1).data??",";Array.isArray(t)&&(this.output(0).data=t.join(e))}}class F extends s{static kind="arrayLength";static inputs=s.in(["array"]);static outputs=s.out(["number"]);run(){const t=this.input(0).data;Array.isArray(t)?this.output(0).data=t.length:this.output(0).clear}}class $ extends s{static kind="arrayMap";static inputs=[...s.in(["array"]),...s.in(["DflowId"],{name:"functionId"})];static outputs=s.out(["array"]);run(){this.output(0).data=this.input(0).data.map((...t)=>this.host.executeFunction(this.input(1).data,t))}}class R extends s{static kind="arrayPop";static inputs=s.in(["array"]);static outputs=[...s.out([],{name:"element"}),...s.out(["array"],{name:"rest"})];run(){const t=this.input(0).data.slice(),e=t.pop();this.output(0).data=e,this.output(1).data=t}}class L extends s{static kind="arrayPush";static inputs=[...s.in(["array"]),...s.in([],{name:"element"})];static outputs=s.out(["array"]);run(){const t=this.input(0).data.slice(),e=this.input(1).data;e&&t.push(e),this.output(0).data=t}}class U extends s{static kind="arrayReverse";static inputs=s.in(["array"]);static outputs=s.in(["array"]);run(){const t=this.input(0).data.slice();this.output(0).data=t.reverse()}}class q extends s{static kind="arrayShift";static inputs=s.in(["array"]);static outputs=[...s.out([],{name:"element"}),...s.out(["array"],{name:"rest"})];run(){const t=this.input(0).data.slice(),e=t.shift();this.output(0).data=e,this.output(1).data=t}}class G extends s{static kind="arraySlice";static inputs=[...s.in(["array"]),...s.in(["number"],{name:"start"}),...s.in(["number"],{name:"end",optional:!0})];static outputs=s.out(["array"]);run(){const t=this.input(0).data,e=this.input(1).data,i=this.input(2).data;typeof i=="number"?this.output(0).data=t.slice(e,i):this.output(0).data=t.slice(e)}}const Wt={[S.kind]:S,[j.kind]:j,[v.kind]:v,[C.kind]:C,[M.kind]:M,[B.kind]:B,[F.kind]:F,[$.kind]:$,[R.kind]:R,[L.kind]:L,[U.kind]:U,[q.kind]:q,[G.kind]:G};class K extends s{static kind="if";static inputs=[...s.in(["boolean"],{name:"condition"}),...s.in([],{name:"then"}),...s.in([],{name:"else"})];static outputs=s.out();run(){this.output(0).data=this.input(0).data?this.input(1).data:this.input(2).data}}const Qt={[K.kind]:K};class z extends s{static kind="consoleLog";static inputs=[...s.in([])];run(){console.log(this.input(0).data)}}const Xt={[z.kind]:z};class H extends s{static kind="now";static outputs=s.out(["number"]);run(){this.output(0).data=Date.now()}}const Yt={[H.kind]:H};class J extends s{static kind="data";static isConstant=!0;static outputs=s.out()}class V extends s{static kind="array";static inputs=s.in();static outputs=s.out(["array"]);run(){const t=this.input(0).data;Array.isArray(t)?this.output(0).data=t:this.output(0).clear()}}class W extends s{static kind="boolean";static inputs=s.in();static outputs=s.out(["boolean"]);run(){const t=this.input(0).data;typeof t=="boolean"?this.output(0).data=t:this.output(0).clear()}}class Q extends s{static kind="number";static inputs=s.in();static outputs=s.out(["number"]);run(){const t=this.input(0).data;typeof t=="number"?this.output(0).data=t:this.output(0).clear()}}class X extends s{static kind="object";static inputs=s.in();static outputs=s.out(["object"]);run(){const t=this.input(0).data;typeof t=="object"&&t!==null?this.output(0).data=t:this.output(0).clear()}}class Y extends s{static kind="string";static inputs=s.in();static outputs=s.out(["string"]);run(){const t=this.input(0).data;typeof t=="string"?this.output(0).data=t:this.output(0).clear()}}class Z extends s{static kind="isArray";static inputs=s.out();static outputs=s.out(["boolean"]);run(){const t=this.input(0).data;this.output(0).data=Array.isArray(t)}}class _ extends s{static kind="isDefined";static inputs=s.in();static outputs=s.out(["boolean"]);run(){const t=this.input(0).data;this.output(0).data=typeof t<"u"}}class tt extends s{static kind="isUndefined";static inputs=s.in();static outputs=s.out(["boolean"]);run(){const t=this.input(0).data;this.output(0).data=typeof t>"u"}}const Zt={[J.kind]:J,[_.kind]:_,[tt.kind]:tt,[V.kind]:V,[W.kind]:W,[Q.kind]:Q,[X.kind]:X,[Y.kind]:Y,[Z.kind]:Z};class I extends s{static kind="dflow";static outputs=s.out(["array"],{name:"nodeKinds"});run(){const t=this.output(0);t.data=this.host.nodeKinds}}class st extends s{static kind="comment";static isConstant=!0;static outputs=s.out(["string"])}class et extends s{static kind="typeNumber";static isConstant=!0;static outputs=s.out(["DflowType"],{name:"number",data:"number"})}class nt extends s{static kind="argument";static isConstant=!0;static inputs=[...s.in(["DflowType"],{name:"type"}),...s.in(["number"],{name:"argumentPosition"})];static outputs=s.out();onBeforeConnectInput(t,e){const i=t.output(e).data;this.output(0).addType(i)}}class it extends s{static kind="function";static isConstant=!0;static outputs=I.out(["DflowId"],{name:"id"});onCreate(){this.output(0).data=this.id}}class at extends s{static kind="return";static isConstant=!0;static inputs=[...I.in(["DflowId"],{name:"functionId"}),...I.in([],{name:"value"})]}const _t={[I.kind]:I,[nt.kind]:nt,[st.kind]:st,[it.kind]:it,[at.kind]:at,[et.kind]:et};class ot extends s{static kind="and";static inputs=s.ins(2,["boolean"]);static outputs=s.out(["boolean"]);run(){this.output(0).data=this.input(0).data&&this.input(1).data}}class ut extends s{static kind="not";static inputs=s.in(["boolean"]);static outputs=s.out(["boolean"]);run(){this.output(0).data=!this.input(0).data}}class rt extends s{static kind="or";static inputs=s.ins(2,["boolean"]);static outputs=s.out(["boolean"]);run(){this.output(0).data=this.input(0).data||this.input(1).data}}const ts={[ot.kind]:ot,[ut.kind]:ut,[rt.kind]:rt};class dt extends s{static kind="mathAbs";static inputs=s.in(["number"]);static outputs=s.out(["number"]);run(){this.output(0).data=Math.abs(this.input(0).data)}}class ct extends s{static kind="mathCos";static inputs=s.in(["number"]);static outputs=s.out(["number"]);run(){this.output(0).data=Math.cos(this.input(0).data)}}class pt extends s{static kind="mathCosh";static inputs=s.in(["number"]);static outputs=s.out(["number"]);run(){this.output(0).data=Math.cosh(this.input(0).data)}}class ht extends s{static kind="mathFloor";static inputs=s.in(["number"]);static outputs=s.out(["number"]);run(){this.output(0).data=Math.floor(this.input(0).data)}}class lt extends s{static kind="mathMax";static inputs=s.in(["array"]);static outputs=s.out(["number"]);run(){const t=this.input(0).data,e=Math.max(...t);isNaN(e)?this.output(0).clear():this.output(0).data=e}}class ft extends s{static kind="mathMin";static inputs=s.in(["array"]);static outputs=s.out(["number"]);run(){const t=this.input(0).data,e=Math.min(...t);isNaN(e)?this.output(0).clear():this.output(0).data=e}}class yt extends s{static kind="mathPI";static isConstant=!0;static outputs=s.out(["number"],{name:"\u03C0",data:Math.PI})}class gt extends s{static kind="mathRound";static inputs=s.in(["number"]);static outputs=s.out(["number"]);run(){this.output(0).data=Math.round(this.input(0).data)}}class wt extends s{static kind="mathSin";static inputs=s.in(["number"]);static outputs=s.out(["number"]);run(){this.output(0).data=Math.sin(this.input(0).data)}}class mt extends s{static kind="mathSinh";static inputs=s.in(["number"]);static outputs=s.out(["number"]);run(){this.output(0).data=Math.sinh(this.input(0).data)}}const ss={[dt.kind]:dt,[ct.kind]:ct,[pt.kind]:pt,[ht.kind]:ht,[lt.kind]:lt,[ft.kind]:ft,[yt.kind]:yt,[gt.kind]:gt,[wt.kind]:wt,[mt.kind]:mt};class It extends s{static kind="isFinite";static inputs=s.in(["number"]);static outputs=s.out(["boolean"]);run(){this.output(0).data=Number.isFinite(this.input(0).data)}}class bt extends s{static kind="isInteger";static inputs=s.in([]);static outputs=s.out(["boolean"]);run(){this.output(0).data=Number.isInteger(this.input(0).data)}}class kt extends s{static kind="isNaN";static inputs=s.in([]);static outputs=s.out(["boolean"]);run(){this.output(0).data=Number.isNaN(this.input(0).data)}}class xt extends s{static kind="parseFloat";static inputs=s.in(["string"]);static outputs=s.out(["number"]);run(){this.output(0).data=parseFloat(this.input(0).data)}}class Dt extends s{static kind="parseInt";static inputs=s.in(["number","string"]);static outputs=s.out(["number"]);run(){this.output(0).data=parseInt(this.input(0).data)}}const es={[It.kind]:It,[bt.kind]:bt,[kt.kind]:kt,[xt.kind]:xt,[Dt.kind]:Dt};class Nt extends s{static kind="objectKeys";static inputs=s.in(["object"]);static outputs=s.out(["array"]);run(){this.output(0).data=Object.keys(this.input(0).data)}}class At extends s{static kind="objectValues";static inputs=s.in(["object"]);static outputs=s.out(["array"]);run(){this.output(0).data=Object.values(this.input(0).data)}}const ns={[Nt.kind]:Nt,[At.kind]:At};class Ot extends s{static kind="addition";static inputs=s.ins(2,["number"]);static outputs=s.out(["number"]);run(){this.output(0).data=this.input(0).data+this.input(1).data}}class Tt extends s{static kind="division";static inputs=s.ins(2,["number"]);static outputs=s.out(["number"]);run(){this.input(1).data?this.output(0).data=this.input(0).data/this.input(1).data:this.output(0).clear()}}class Et extends s{static kind="equality";static inputs=s.ins(2);static outputs=s.out(["boolean"]);run(){this.output(0).data=this.input(0).data==this.input(1).data}}class Pt extends s{static kind="lessThan";static inputs=s.ins(2,["number"]);static outputs=s.out(["boolean"]);run(){this.output(0).data=this.input(0).data<this.input(1).data}}class St extends s{static kind="lessThanOrEqual";static inputs=s.ins(2,["number"]);static outputs=s.out(["boolean"]);run(){this.output(0).data=this.input(0).data<=this.input(1).data}}class jt extends s{static kind="greaterThan";static inputs=s.ins(2,["number"]);static outputs=s.out(["boolean"]);run(){this.output(0).data=this.input(0).data>this.input(1).data}}class vt extends s{static kind="greaterThanOrEqual";static inputs=s.ins(2,["number"]);static outputs=s.out(["boolean"]);run(){this.output(0).data=this.input(0).data>=this.input(1).data}}class Ct extends s{static kind="inequality";static inputs=s.ins(2);static outputs=s.out(["boolean"]);run(){this.output(0).data=this.input(0).data!=this.input(1).data}}class Mt extends s{static kind="multiplication";static inputs=s.ins(2,["number"]);static outputs=s.out(["number"]);run(){this.output(0).data=this.input(0).data*this.input(1).data}}class Bt extends s{static kind="subtraction";static inputs=s.ins(2,["number"]);static outputs=s.out(["number"]);run(){this.output(0).data=this.input(0).data-this.input(1).data}}const is={[Ot.kind]:Ot,[Tt.kind]:Tt,[Et.kind]:Et,[jt.kind]:jt,[vt.kind]:vt,[Pt.kind]:Pt,[St.kind]:St,[Ct.kind]:Ct,[Mt.kind]:Mt,[Bt.kind]:Bt};class Ft extends s{static kind="stringLength";static inputs=s.in(["string"]);static outputs=s.out(["number"]);run(){this.output(0).data=this.input(0).data.length}}const as={[Ft.kind]:Ft},Rt={...Wt,...Qt,...Xt,...Zt,...Yt,..._t,...ts,...ss,...es,...ns,...is,...as};module.exports=Vt(os);

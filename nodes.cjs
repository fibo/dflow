var D=Object.defineProperty;var Gt=Object.getOwnPropertyDescriptor;var Vt=Object.getOwnPropertyNames;var Ht=Object.prototype.hasOwnProperty;var Wt=i=>D(i,"__esModule",{value:!0});var Qt=(i,t)=>{for(var s in t)D(i,s,{get:t[s],enumerable:!0})},Xt=(i,t,s,e)=>{if(t&&typeof t=="object"||typeof t=="function")for(let a of Vt(t))!Ht.call(i,a)&&(s||a!=="default")&&D(i,a,{get:()=>t[a],enumerable:!(e=Gt(t,a))||e.enumerable});return i};var Yt=(i=>(t,s)=>i&&i.get(t)||(s=Xt(Wt({}),t,1),i&&i.set(t,s),s))(typeof WeakMap!="undefined"?new WeakMap:0);var gs={};Qt(gs,{nodesCatalog:()=>Kt});const y=i=>`${i} must be a string`,P=i=>`${i} must be a number`,j=(i,t)=>`${t} pin not found nodeId=${i}`,v=(i,t,s)=>`${j(i,t)} position=${s}`,M=(i,t,s)=>`${j(i,t)} pinId=${s}`,O=({id:i,kind:t,outputs:s})=>({id:i,kind:t,outputs:s?.map(({id:e,data:a,name:u})=>({id:e,data:a,name:u}))});class o{static isArray(t){return Array.isArray(t)}static isBoolean(t){return typeof t=="boolean"}static isDflowGraph(t){return typeof t=="object"&&t!==null&&!Array.isArray(t)&&Array.isArray(t.nodes)&&Array.isArray(t.edges)&&l.isDflowGraph(t)}static isDflowId(t){return o.isStringNotEmpty(t)}static isDflowType(t){return typeof t=="string"&&h.types.includes(t)}static isObject(t){return!o.isUndefined(t)&&!o.isNull(t)&&!o.isArray(t)&&typeof t=="object"}static isNull(t){return t===null}static isNumber(t){return typeof t=="number"&&!isNaN(t)}static isString(t){return typeof t=="string"}static isStringNotEmpty(t){return o.isString(t)&&t.length>0}static isUndefined(t){return typeof t>"u"}static validate(t,s){return s.length===0?!0:s.some(e=>{switch(e){case"array":return o.isArray(t);case"boolean":return o.isBoolean(t);case"null":return o.isNull(t);case"number":return o.isNumber(t);case"object":return o.isObject(t);case"string":return o.isString(t);case"DflowGraph":return o.isDflowGraph(t);case"DflowId":return o.isDflowId(t);case"DflowType":return o.isDflowType(t);default:return!1}},!0)}}class b{id;name;static isDflowItem({id:t,name:s}){return o.isDflowId(t)&&(o.isUndefined(s)||o.isStringNotEmpty(s))}constructor({id:t,name:s}){this.id=t,this.name=s}toObject(){const t={id:this.id};return typeof this.name=="string"&&(t.name=this.name),t}}class h extends b{kind;types;static types=["string","number","boolean","null","object","array","DflowId","DflowGraph","DflowType"];static isDflowPin({types:t=[],...s}){return b.isDflowItem(s)&&h.isDflowPinTypes(t)}static isDflowPinType(t){return typeof t!="string"?!1:h.types.includes(t)}static isDflowPinTypes(t){return Array.isArray(t)?t.every(s=>h.isDflowPinType(s)):!1}constructor(t,{types:s=[],...e}){super(e);this.kind=t,this.types=s}get hasTypeAny(){return this.types.length===0}hasType(t){return this.hasTypeAny||this.types.includes(t)}}class C extends h{#t;#s;static isDflowInput({id:t,types:s}){return h.isDflowPin({id:t,types:s})}constructor({optional:t,...s}){super("input",s);this.#s=t}get data(){return this.#t?.data}get isConnected(){return typeof this.#t>"u"}get isOptional(){return this.#s}connectTo(t){const{hasTypeAny:s,types:e}=this,{types:a}=t;if(s||e.some(u=>a.includes(u)))this.#t=t;else throw new Error(`mismatching pinTypes, source has types [${a.join()}] and target has types [${e.join()}]`)}disconnect(){this.#t=void 0}toObject(){const t={id:this.id};return this.types.length>0&&(t.types=this.types),t}}class B extends h{#t;static isDflowOutput({id:t,data:s,types:e=[]}){return h.isDflowPin({id:t,types:e})&&o.validate(s,e)}constructor({data:t,...s}){super("output",s);this.#t=t}clear(){this.#t=void 0}get data(){return this.#t}set data(t){switch(!0){case o.isUndefined(t):this.clear();break;case this.hasTypeAny:case(o.isDflowGraph(t)&&this.hasType("DflowGraph")):case(o.isDflowId(t)&&this.hasType("DflowId")):case(o.isString(t)&&this.hasType("string")):case(o.isNumber(t)&&this.hasType("number")):case(o.isBoolean(t)&&this.hasType("boolean")):case(o.isNull(t)&&this.hasType("null")):case(o.isObject(t)&&this.hasType("object")):case(o.isArray(t)&&this.hasType("array")):{this.#t=t;break}default:throw new Error(`could not set data pinTypes=${JSON.stringify(this.types)} typeof=${typeof t}`)}}toObject(){const t={...super.toObject()};return o.isUndefined(this.#t)||(t.data=this.#t),this.types.length>0&&(t.types=this.types),t}}class n extends b{#t=new Map;#s=new Map;#n=[];#i=[];kind;meta;host;static kind;static isAsync;static isConstant;static inputs;static outputs;static input(t=[],s){if(h.isDflowPinType(t))return{types:[t],...s};if(h.isDflowPinTypes(t))return{types:t,...s};throw new TypeError("invalid input definition")}static output(t=[],s){if(h.isDflowPinType(t))return{types:[t],...s};if(h.isDflowPinTypes(t))return{types:t,...s};throw new TypeError("invalid output definition")}static in(t=[],s){return[{types:t,...s}]}static out(t=[],s){return[{types:t,...s}]}static isDflowNode({kind:t,inputs:s=[],outputs:e=[],...a}){return b.isDflowItem(a)&&o.isStringNotEmpty(t)&&s.every(u=>C.isDflowInput(u))&&e.every(u=>B.isDflowOutput(u))}constructor({kind:t,inputs:s=[],outputs:e=[],...a},u,{isAsync:r=!1,isConstant:d=!1}={}){super(a);this.host=u,this.kind=t,this.meta={isAsync:r,isConstant:d};for(const g of s)this.newInput(g);for(const g of e)this.newOutput(g)}get inputs(){return this.#t.values()}get outputs(){return this.#s.values()}get numInputs(){return this.#t.size}get numOutputs(){return this.#s.size}clearOutputs(){for(const t of this.outputs)t.clear()}#e(t=this.numInputs){const s=`i${t}`;return this.#t.has(s)?this.#e(t+1):s}#a(t=this.numOutputs){const s=`o${t}`;return this.#s.has(s)?this.#a(t+1):s}getInputById(t){if(typeof t!="string")throw new TypeError(y("inputId"));const s=this.#t.get(t);if(s)return s;throw new Error(M(this.id,"input",t))}input(t){if(typeof t!="number")throw new TypeError(P("position"));const s=this.#n[t];if(o.isUndefined(s))throw new Error(v(this.id,"input",t));return this.getInputById(s)}getOutputById(t){if(typeof t!="string")throw new TypeError(y("outputId"));const s=this.#s.get(t);if(s)return s;throw new Error(M(this.id,"output",t))}output(t){if(typeof t!="number")throw new TypeError(P("position"));const s=this.#i[t];if(o.isUndefined(s))throw new Error(v(this.id,"output",t));return this.getOutputById(s)}deleteInput(t){this.host.deleteEdgesConnectedToPin([this.id,t]),this.#t.delete(t),this.#n.splice(this.#n.indexOf(t),1)}deleteOutput(t){this.host.deleteEdgesConnectedToPin([this.id,t]),this.#s.delete(t),this.#i.splice(this.#i.indexOf(t),1)}newInput(t){const s=o.isDflowId(t.id)?t.id:this.#e(),e=new C({...t,id:s});return this.#t.set(s,e),this.#n.push(s),e}newOutput(t){const s=o.isDflowId(t.id)?t.id:this.#a(),e=new B({...t,id:s});return this.#s.set(s,e),this.#i.push(s),e}run(){}toObject(){const t={...super.toObject(),kind:this.kind},s=[],e=[];for(const a of this.inputs)s.push(a.toObject());s.length>0&&(t.inputs=s);for(const a of this.outputs)e.push(a.toObject());return e.length>0&&(t.outputs=e),t}}class T extends n{static kind="Unknown";constructor(t,s){super({...t,kind:T.kind},s)}run(){}}class F extends b{source;target;static isDflowEdge({source:t,target:s,...e},a){return b.isDflowItem(e)&&Array.isArray(t)&&t.length===2&&a.nodes.find(({id:u,outputs:r=[]})=>u===t[0]&&r.find(({id:d})=>d===t[1]))&&Array.isArray(s)&&s.length===2&&a.nodes.find(({id:u,inputs:r=[]})=>u===s[0]&&r.find(({id:d})=>d===s[1]))}constructor({source:t,target:s,...e}){super(e);const[a,u]=t,[r,d]=s;if(typeof a!="string")throw new TypeError(y("sourceNodeId"));if(typeof u!="string")throw new TypeError(y("sourcePinId"));if(typeof r!="string")throw new TypeError(y("targetNodeId"));if(typeof d!="string")throw new TypeError(y("targetPinId"));this.source=t,this.target=s}toObject(){return{...super.toObject(),source:this.source,target:this.target}}}class l extends b{#t=new Map;#s=new Map;runOptions={verbose:!1};runStatus=null;executionReport=null;static isDflowGraph(t){return t.nodes.every(s=>n.isDflowNode(s))&&t.edges.every(s=>F.isDflowEdge(s,t))}static childrenOfNodeId(t,s){return s.filter(({sourceId:e})=>t===e).map(({targetId:e})=>e)}static parentsOfNodeId(t,s){return s.filter(({targetId:e})=>t===e).map(({sourceId:e})=>e)}static levelOfNodeId(t,s){const e=l.parentsOfNodeId(t,s);if(e.length===0)return 0;let a=0;for(const u of e){const r=l.levelOfNodeId(u,s);a=Math.max(r,a)}return a+1}static ancestorsOfNodeId(t,s){const e=l.parentsOfNodeId(t,s);return e.length===0?[]:e.reduce((a,u,r,d)=>{const g=l.ancestorsOfNodeId(u,s),f=a.concat(g);return r===d.length-1?Array.from(new Set(d.concat(f))):f},[])}static sort(t,s){const e={};for(const a of t)e[a]=l.levelOfNodeId(a,s);return t.slice().sort((a,u)=>e[a]<=e[u]?-1:1)}get edges(){return this.#s.values()}get nodes(){return this.#t.values()}get nodeConnections(){return[...this.#s.values()].map(t=>({sourceId:t.source[0],targetId:t.target[0]}))}get edgeIds(){return[...this.#s.keys()]}get nodeIds(){return[...this.#t.keys()]}get numEdges(){return this.#s.size}get numNodes(){return this.#t.size}addEdge(t){if(this.#s.has(t.id))throw new Error(`cannot overwrite edge, id=${t.id}`);this.#s.set(t.id,t)}addNode(t){if(this.#t.has(t.id))throw new Error(`cannot overwrite node, id=${t.id}`);this.#t.set(t.id,t)}clear(){this.#t.clear(),this.#s.clear()}deleteEdge(t){this.#s.delete(t)}deleteNode(t){this.#t.delete(t)}getNodeById(t){if(typeof t!="string")throw new TypeError(y("nodeId"));const s=this.#t.get(t);if(s)return s;throw new Error(`DflowNode not found, id=${t}`)}getEdgeById(t){if(typeof t!="string")throw new TypeError(y("edgeId"));const s=this.#s.get(t);if(s)return s;throw new Error(`DflowEdge not found, id=${t}`)}generateEdgeId(t=this.numEdges){const s=`e${t}`;return this.#s.has(s)?this.generateEdgeId(t+1):s}generateNodeId(t=this.numNodes){const s=`n${t}`;return this.#t.has(s)?this.generateNodeId(t+1):s}nodeIdsInsideFunctions(){const t=[];for(const s of this.nodes)s.kind==="return"&&t.push(l.ancestorsOfNodeId(s.id,this.nodeConnections));return Array.from(new Set(t.flat()))}async run(){const{verbose:t}=this.runOptions;this.runStatus="waiting",this.executionReport={status:this.runStatus,start:new Date},t&&(this.executionReport.steps=[]);const s=this.nodeIdsInsideFunctions(),e=l.sort(this.nodeIds.filter(a=>!s.includes(a)),this.nodeConnections);s:for(const a of e){const u=this.#t.get(a);try{if(!u.meta.isConstant){let r=!1;t:for(const{data:d,types:g,isOptional:f}of u.inputs){if(f&&typeof d>"u")continue t;if(!o.validate(d,g)){r=!0;break t}}if(r){for(const d of u.outputs)d.clear();t&&this.executionReport.steps?.push(O(u.toObject()));continue s}u.meta.isAsync?await u.run():u.run()}t&&this.executionReport.steps?.push(O(u.toObject()))}catch(r){console.error(r),this.runStatus="failure"}}this.runStatus==="waiting"&&(this.runStatus="success"),this.executionReport.status=this.runStatus,this.executionReport.end=new Date}toObject(){const t={...super.toObject(),nodes:[],edges:[]};for(const s of this.nodes)t.nodes.push(s.toObject());for(const s of this.edges)t.edges.push(s.toObject());return t}}const{input:$,output:R}=n;class E extends n{static kind="argument";static isConstant=!0;static inputs=[$("number",{name:"position",optional:!0})];static outputs=[R()]}class L extends n{static kind="array";static inputs=n.in();static outputs=n.out(["array"]);run(){const t=this.input(0).data;o.isArray(t)?this.output(0).data=t:this.output(0).clear()}}class U extends n{static kind="boolean";static inputs=[$()];static outputs=[R("boolean")];run(){const t=this.input(0).data;o.isBoolean(t)?this.output(0).data=t:this.output(0).clear()}}class q extends n{static kind="data";static isConstant=!0;static outputs=n.out()}class J extends n{static kind="function";static isConstant=!0;static outputs=n.out(["DflowId"],{name:"id"});constructor(...t){super(...t);this.output(0).data=this.id}}class K extends n{static kind="dflow";static outputs=n.out(["array"],{name:"nodeKinds"});run(){const t=this.output(0);t.data=this.host.nodeKinds}}class z extends n{static kind="isUndefined";static inputs=n.in();static outputs=n.out(["boolean"]);run(){this.output(0).data=o.isUndefined(this.input(0).data)}}class G extends n{static kind="number";static inputs=n.in();static outputs=n.out(["number"]);run(){const t=this.input(0).data;o.isNumber(t)?this.output(0).data=t:this.output(0).clear()}}class V extends n{static kind="object";static inputs=n.in();static outputs=n.out(["object"]);run(){const t=this.input(0).data;o.isObject(t)?this.output(0).data=t:this.output(0).clear()}}class I extends n{static kind="return";static isConstant=!0;static inputs=[...n.in(["DflowId"],{name:"functionId"}),...n.in([],{name:"value"})]}class H extends n{static kind="string";static inputs=n.in();static outputs=n.out(["string"]);run(){const t=this.input(0).data;o.isString(t)?this.output(0).data=t:this.output(0).clear()}}const Zt={[E.kind]:E,[L.kind]:L,[U.kind]:U,[q.kind]:q,[K.kind]:K,[z.kind]:z,[G.kind]:G,[V.kind]:V,[J.kind]:J,[H.kind]:H,[I.kind]:I};class A{#t;nodesCatalog;context;static#s(t=[]){return t.map((s,e)=>({...s,id:`i${e}`}))}static#n(t=[]){return t.map((s,e)=>({...s,id:`o${e}`}))}constructor(t={}){this.nodesCatalog={...t,...Zt},this.#t=new l({id:"g1"}),this.context={}}get executionReport(){return this.#t.executionReport}get edges(){return this.#t.edges}get nodes(){return this.#t.nodes}get numEdges(){return this.#t.numEdges}get numNodes(){return this.#t.numNodes}get nodeKinds(){return Object.keys(this.nodesCatalog)}get runStatusIsSuccess(){return this.#t.runStatus==="success"}get runStatusIsWaiting(){return this.#t.runStatus==="waiting"}get runStatusIsFailure(){return this.#t.runStatus==="failure"}set verbose(t){this.#t.runOptions.verbose=t}clearGraph(){this.#t.clear()}connect(t,s=0){return{to:(e,a=0)=>{const u=this.#t.generateEdgeId(),r=t.output(s),d=e.input(a);this.newEdge({id:u,source:[t.id,r.id],target:[e.id,d.id]})}}}deleteEdge(t){if(typeof t!="string")throw new TypeError(y("edgeId"));const s=this.#t.getEdgeById(t);if(s){const[e,a]=s.target;this.getNodeById(e).getInputById(a).disconnect(),this.#t.deleteEdge(t)}else throw new Error(`DflowEdge not found, id=${t}`)}deleteNode(t){if(typeof t!="string")throw new TypeError(y("nodeId"));const s=this.getNodeById(t);if(s){for(const e of this.#t.edges){const{source:[a],target:[u]}=e;(a===s.id||u===s.id)&&this.deleteEdge(e.id)}this.#t.deleteNode(t)}else throw new Error(`DflowNode not found, id=${t}`)}deleteEdgesConnectedToPin([t,s]){for(const e of this.edges){const[a,u]=e.source,[r,d]=e.target;(a===t&&u===s||r===t&&d===s)&&this.deleteEdge(e.id)}}executeFunction(t,s){const{verbose:e}=this.#t.runOptions,a=this.#t.nodeConnections,u=l.childrenOfNodeId(t,a),r=[];for(const f of u){const p=this.getNodeById(f);p.kind===I.kind&&r.push(p.id)}const d=r.reduce((f,p,m,x)=>{const zt=l.ancestorsOfNodeId(p,a),S=f.concat(zt);return m===x.length?Array.from(new Set(S)):S},[]),g=l.sort([...r,...d],a);for(const f of g){const p=this.getNodeById(f);try{switch(p.kind){case E.kind:{const m=p.input(0).data,x=typeof m=="number"&&!isNaN(m)?Math.max(m,0):0;p.output(0).data=s[x];break}case I.kind:return p.input(1).data;default:!p.meta.isConstant&&!p.meta.isAsync&&p.run(),e&&this.executionReport?.steps?.push(O(p.toObject()))}}catch(m){console.error(m)}}}getEdgeById(t){return this.#t.getEdgeById(t)}getNodeById(t){return this.#t.getNodeById(t)}newNode(t){const s=this.nodesCatalog[t.kind]??T,e=o.isDflowId(t.id)?t.id:this.#t.generateNodeId(),a={isAsync:s.isAsync,isConstant:s.isConstant},u=Array.isArray(t.inputs)?t.inputs:A.#s(s.inputs),r=Array.isArray(t.outputs)?t.outputs:A.#n(s.outputs),d=new s({...t,id:e,inputs:u,outputs:r},this,a);return this.#t.addNode(d),d}newEdge(t){const s=o.isDflowId(t.id)?t.id:this.#t.generateEdgeId(),e=new F({...t,id:s});this.#t.addEdge(e);const[a,u]=e.source,[r,d]=e.target,g=this.#t.getNodeById(a),f=this.#t.getNodeById(r),p=g.getOutputById(u);return f.getInputById(d).connectTo(p),e}newInput(t,s){return this.#t.getNodeById(t).newInput(s)}newOutput(t,s){return this.#t.getNodeById(t).newOutput(s)}toObject(){return this.#t.toObject()}async run(){await this.#t.run()}}class W extends n{static kind="arrayAt";static inputs=[...n.in(["array"]),...n.in(["number"],{name:"index"})];static outputs=n.out();run(){const t=this.input(0).data,s=this.input(1).data;this.output(0).data=t.at(s)}}class Q extends n{static kind="arrayFilter";static inputs=[...n.in(["array"]),...n.in(["DflowId"],{name:"functionId"})];static outputs=n.out(["array"]);run(){this.output(0).data=this.input(0).data.filter((...t)=>this.host.executeFunction(this.input(1).data,t))}}class X extends n{static kind="arrayFindLastIndex";static inputs=[...n.in(["array"]),...n.in(["DflowId"],{name:"functionId"})];static outputs=n.out(["number"]);run(){this.output(0).data=this.input(0).data.findLastIndex((...t)=>this.host.executeFunction(this.input(1).data,t))}}class Y extends n{static kind="arrayFindIndex";static inputs=[...n.in(["array"]),...n.in(["DflowId"],{name:"functionId"})];static outputs=n.out(["number"]);run(){this.output(0).data=this.input(0).data.findIndex((...t)=>this.host.executeFunction(this.input(1).data,t))}}class Z extends n{static kind="arrayIncludes";static inputs=[...n.in(["array"],{name:"array"}),...n.in(["string"],{name:"element"})];static outputs=n.out(["boolean"]);run(){const t=this.input(0).data,s=this.input(1).data;Array.isArray(t)&&(this.output(0).data=t.includes(s))}}class _ extends n{static kind="arrayJoin";static inputs=[...n.in(["array"],{name:"array"}),...n.in(["string"],{name:"separator",optional:!0})];static outputs=n.out(["string"]);run(){this.output(0).data=this.input(0).data.join(this.input(1).data)}}class tt extends n{static kind="arrayLength";static inputs=n.in(["array"]);static outputs=n.out(["number"]);run(){const t=this.input(0).data;Array.isArray(t)?this.output(0).data=t.length:this.output(0).clear}}class st extends n{static kind="arrayMap";static inputs=[...n.in(["array"]),...n.in(["DflowId"],{name:"functionId"})];static outputs=n.out(["array"]);run(){this.output(0).data=this.input(0).data.map((...t)=>this.host.executeFunction(this.input(1).data,t))}}class nt extends n{static kind="arrayPop";static inputs=n.in(["array"]);static outputs=[...n.out([],{name:"element"}),...n.out(["array"],{name:"rest"})];run(){const t=this.input(0).data.slice(),s=t.pop();this.output(0).data=s,this.output(1).data=t}}class it extends n{static kind="arrayPush";static inputs=[...n.in(["array"]),...n.in([],{name:"element"})];static outputs=n.out(["array"]);run(){const t=this.input(0).data.slice(),s=this.input(1).data;s&&t.push(s),this.output(0).data=t}}class et extends n{static kind="arrayReverse";static inputs=n.in(["array"]);static outputs=n.in(["array"]);run(){const t=this.input(0).data.slice();this.output(0).data=t.reverse()}}class at extends n{static kind="arrayShift";static inputs=n.in(["array"]);static outputs=[...n.out([],{name:"element"}),...n.out(["array"],{name:"rest"})];run(){const t=this.input(0).data.slice(),s=t.shift();this.output(0).data=s,this.output(1).data=t}}class ut extends n{static kind="arraySlice";static inputs=[...n.in(["array"]),...n.in(["number"],{name:"start"}),...n.in(["number"],{name:"end",optional:!0})];static outputs=n.out(["array"]);run(){const t=super.input(0).data,s=super.input(1).data,e=super.input(2).data;typeof e=="number"?super.output(0).data=t.slice(s,e):super.output(0).data=t.slice(s)}}const _t={[W.kind]:W,[Q.kind]:Q,[X.kind]:X,[Y.kind]:Y,[Z.kind]:Z,[_.kind]:_,[tt.kind]:tt,[st.kind]:st,[nt.kind]:nt,[it.kind]:it,[et.kind]:et,[at.kind]:at,[ut.kind]:ut};class ot extends n{static kind="if";static inputs=[...n.in([],{name:"condition"}),...n.in([],{name:"then"}),...n.in([],{name:"else"})];static outputs=n.out();run(){this.output(0).data=this.input(0).data?this.input(1).data:this.input(2).data}}const ts={[ot.kind]:ot};class rt extends n{static kind="consoleLog";static inputs=[...n.in([])];run(){console.log(this.input(0).data)}}const ss={[rt.kind]:rt},dt=[...n.out(["string"]),...n.out(["number"],{name:"milliseconds"})];class ct extends n{static kind="newDate";static inputs=n.in(["string","number"],{optional:!0});static outputs=dt;run(){const t=this.input(0).data;if(typeof t=="string"||typeof t=="number"){const e=new Date(t),a=e.toJSON();a!==null&&(this.output(0).data=a,this.output(1).data=e.getTime())}const s=new Date;this.output(0).data=s.toJSON(),this.output(1).data=s.getTime()}}class pt extends n{static kind="now";static outputs=dt;run(){const t=Date.now();this.output(0).data=new Date(t).toJSON(),this.output(1).data=t}}const ns={[ct.kind]:ct,[pt.kind]:pt},{input:k,output:is}=n;class ht extends n{static kind="and";static inputs=[k("boolean"),k("boolean")];static outputs=[is("boolean")];run(){this.output(0).data=this.input(0).data&&this.input(1).data}}class lt extends n{static kind="not";static inputs=n.in(["boolean"]);static outputs=n.out(["boolean"]);run(){this.output(0).data=!this.input(0).data}}class ft extends n{static kind="??";static inputs=[...n.in(),...n.in()];static outputs=n.out();run(){this.output(0).data=this.input(0).data??this.input(1).data}}class gt extends n{static kind="or";static inputs=[k("boolean"),k("boolean")];static outputs=n.out(["boolean"]);run(){this.output(0).data=this.input(0).data||this.input(1).data}}const es={[ht.kind]:ht,[lt.kind]:lt,[ft.kind]:ft,[gt.kind]:gt},{input:as}=n;class yt extends n{static kind="mathAbs";static inputs=n.in(["number"]);static outputs=n.out(["number"]);run(){this.output(0).data=Math.abs(this.input(0).data)}}class wt extends n{static kind="mathCos";static inputs=[as("number")];static outputs=n.out(["number"]);run(){this.output(0).data=Math.cos(this.input(0).data)}}class mt extends n{static kind="mathCosh";static inputs=n.in(["number"]);static outputs=n.out(["number"]);run(){this.output(0).data=Math.cosh(this.input(0).data)}}class bt extends n{static kind="mathFloor";static inputs=n.in(["number"]);static outputs=n.out(["number"]);run(){this.output(0).data=Math.floor(this.input(0).data)}}class It extends n{static kind="mathMax";static inputs=n.in(["array"]);static outputs=n.out(["number"]);run(){const t=this.input(0).data,s=Math.max(...t);isNaN(s)?this.output(0).clear():this.output(0).data=s}}class kt extends n{static kind="mathMin";static inputs=n.in(["array"]);static outputs=n.out(["number"]);run(){const t=this.input(0).data,s=Math.min(...t);isNaN(s)?this.output(0).clear():this.output(0).data=s}}class Nt extends n{static kind="mathPI";static isConstant=!0;static outputs=n.out(["number"],{name:"\u03C0",data:Math.PI})}class xt extends n{static kind="mathRound";static inputs=n.in(["number"]);static outputs=n.out(["number"]);run(){this.output(0).data=Math.round(this.input(0).data)}}class Dt extends n{static kind="mathSin";static inputs=n.in(["number"]);static outputs=n.out(["number"]);run(){this.output(0).data=Math.sin(this.input(0).data)}}class Ot extends n{static kind="mathSinh";static inputs=n.in(["number"]);static outputs=n.out(["number"]);run(){this.output(0).data=Math.sinh(this.input(0).data)}}const us={[yt.kind]:yt,[wt.kind]:wt,[mt.kind]:mt,[bt.kind]:bt,[It.kind]:It,[kt.kind]:kt,[Nt.kind]:Nt,[xt.kind]:xt,[Dt.kind]:Dt,[Ot.kind]:Ot};class Et extends n{static kind="isFinite";static inputs=n.in(["number"]);static outputs=n.out(["boolean"]);run(){this.output(0).data=Number.isFinite(this.input(0).data)}}class At extends n{static kind="isInteger";static inputs=n.in([]);static outputs=n.out(["boolean"]);run(){this.output(0).data=Number.isInteger(this.input(0).data)}}class Tt extends n{static kind="isNaN";static inputs=n.in([]);static outputs=n.out(["boolean"]);run(){this.output(0).data=Number.isNaN(this.input(0).data)}}class St extends n{static kind="parseFloat";static inputs=n.in(["string"]);static outputs=n.out(["number"]);run(){this.output(0).data=parseFloat(this.input(0).data)}}class Pt extends n{static kind="parseInt";static inputs=n.in(["number","string"]);static outputs=n.out(["number"]);run(){this.output(0).data=parseInt(this.input(0).data)}}const os={[Et.kind]:Et,[At.kind]:At,[Tt.kind]:Tt,[St.kind]:St,[Pt.kind]:Pt};class jt extends n{static kind="objectKeys";static inputs=n.in(["object"]);static outputs=n.out(["array"]);run(){this.output(0).data=Object.keys(this.input(0).data)}}class vt extends n{static kind="objectValues";static inputs=n.in(["object"]);static outputs=n.out(["array"]);run(){this.output(0).data=Object.values(this.input(0).data)}}const rs={[jt.kind]:jt,[vt.kind]:vt},{input:c,output:w}=n;class Mt extends n{static kind="addition";static inputs=[c("number"),c("number")];static outputs=[w("number")];run(){this.output(0).data=this.input(0).data+this.input(1).data}}class Ct extends n{static kind="division";static inputs=[c("number"),c("number")];static outputs=[w("number")];run(){this.input(1).data?this.output(0).data=this.input(0).data/this.input(1).data:this.output(0).clear()}}class Bt extends n{static kind="equality";static inputs=[c(),c()];static outputs=[w("boolean")];run(){this.output(0).data=this.input(0).data==this.input(1).data}}class Ft extends n{static kind="lessThan";static inputs=[c("number"),c("number")];static outputs=[w("boolean")];run(){this.output(0).data=this.input(0).data<this.input(1).data}}class $t extends n{static kind="lessThanOrEqual";static inputs=[c("number"),c("number")];static outputs=[w("boolean")];run(){this.output(0).data=this.input(0).data<=this.input(1).data}}class Rt extends n{static kind="greaterThan";static inputs=[c("number"),c("number")];static outputs=[w("boolean")];run(){this.output(0).data=this.input(0).data>this.input(1).data}}class Lt extends n{static kind="greaterThanOrEqual";static inputs=[c("number"),c("number")];static outputs=[w("boolean")];run(){this.output(0).data=this.input(0).data>=this.input(1).data}}class Ut extends n{static kind="inequality";static inputs=[c(),c()];static outputs=[w("boolean")];run(){this.output(0).data=this.input(0).data!=this.input(1).data}}class qt extends n{static kind="multiplication";static inputs=[c("number"),c("number")];static outputs=[w("number")];run(){this.output(0).data=this.input(0).data*this.input(1).data}}class Jt extends n{static kind="subtraction";static inputs=[c("number"),c("number")];static outputs=[w("number")];run(){this.output(0).data=this.input(0).data-this.input(1).data}}const ds={[Mt.kind]:Mt,[Ct.kind]:Ct,[Bt.kind]:Bt,[Rt.kind]:Rt,[Lt.kind]:Lt,[Ft.kind]:Ft,[$t.kind]:$t,[Ut.kind]:Ut,[qt.kind]:qt,[Jt.kind]:Jt},{input:N,output:cs}=n;class ps extends n{static kind="stringLength";static inputs=[N("string")];static outputs=[cs("number")];run(){this.output(0).data=this.input(0).data.length}}class hs extends n{static kind="substring";static inputs=[N("string"),N("number",{name:"start"}),N("number",{name:"end",optional:!0})];static outputs=n.out(["string"]);run(){const t=this.input(0).data,s=this.input(1).data,e=this.input(2).data;this.output(0).data=t.substring(s,e)}}const ls={DflowNodeStringLength:ps,DflowNodeSubstring:hs},fs=Object.values(ls).reduce((i,t)=>({[t.kind]:t,...i}),{}),Kt={..._t,...ts,...ss,...ns,...es,...us,...os,...rs,...ds,...fs};module.exports=Yt(gs);

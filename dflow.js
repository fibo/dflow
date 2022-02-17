var _t=Object.defineProperty,Dt=Object.defineProperties;var ts=Object.getOwnPropertyDescriptors;var jt=Object.getOwnPropertySymbols;var Wt=Object.prototype.hasOwnProperty,Jt=Object.prototype.propertyIsEnumerable;var Ft=(u,t,s)=>t in u?_t(u,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):u[t]=s,l=(u,t)=>{for(var s in t||(t={}))Wt.call(t,s)&&Ft(u,s,t[s]);if(jt)for(var s of jt(t))Jt.call(t,s)&&Ft(u,s,t[s]);return u},b=(u,t)=>Dt(u,ts(t));var T=(u,t)=>{var s={};for(var i in u)Wt.call(u,i)&&t.indexOf(i)<0&&(s[i]=u[i]);if(u!=null&&jt)for(var i of jt(u))t.indexOf(i)<0&&Jt.call(u,i)&&(s[i]=u[i]);return s};var e=(u,t,s)=>(Ft(u,typeof t!="symbol"?t+"":t,s),s),Qt=(u,t,s)=>{if(!t.has(u))throw TypeError("Cannot "+s)};var r=(u,t,s)=>(Qt(u,t,"read from private field"),s?s.call(u):t.get(u)),f=(u,t,s)=>{if(t.has(u))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(u):t.set(u,s)},x=(u,t,s,i)=>(Qt(u,t,"write to private field"),i?i.call(u,s):t.set(u,s),s);var S,Pt,E,w,A,G,R,Ct,m,I,p,z;const N=u=>`${u} must be a string`,Vt=u=>`${u} must be a number`,Xt=(u,t)=>`${t} pin not found nodeId=${u}`,Yt=(u,t,s)=>`${Xt(u,t)} position=${s}`,Zt=(u,t,s)=>`${Xt(u,t)} pinId=${s}`,Mt=({id:u,kind:t,outputs:s})=>({id:u,kind:t,outputs:s==null?void 0:s.map(({id:i,data:a,name:o})=>({id:i,data:a,name:o}))});class d{static isArray(t){return Array.isArray(t)}static isBoolean(t){return typeof t=="boolean"}static isDflowGraph(t){return typeof t=="object"&&t!==null&&!Array.isArray(t)&&Array.isArray(t.nodes)&&Array.isArray(t.edges)&&j.isDflowGraph(t)}static isDflowId(t){return d.isStringNotEmpty(t)}static isDflowType(t){return typeof t=="string"&&P.types.includes(t)}static isObject(t){return!d.isUndefined(t)&&!d.isNull(t)&&!d.isArray(t)&&typeof t=="object"}static isNull(t){return t===null}static isNumber(t){return typeof t=="number"}static isString(t){return typeof t=="string"}static isStringNotEmpty(t){return d.isString(t)&&t.length>0}static isUndefined(t){return typeof t=="undefined"}static validate(t,s){return s.length===0?!0:s.some(i=>{switch(i){case"array":return d.isArray(t);case"boolean":return d.isBoolean(t);case"null":return d.isNull(t);case"number":return d.isNumber(t);case"object":return d.isObject(t);case"string":return d.isString(t);case"DflowGraph":return d.isDflowGraph(t);case"DflowId":return d.isDflowId(t);case"DflowType":return d.isDflowType(t);default:return!1}},!0)}}class v{constructor({id:t,name:s}){e(this,"id");e(this,"name");this.id=t,this.name=s}static isDflowItem({id:t,name:s}){return d.isDflowId(t)&&(d.isUndefined(s)||d.isStringNotEmpty(s))}toObject(){const t={id:this.id};return typeof this.name=="string"&&(t.name=this.name),t}}const Ut=class extends v{constructor(t,a){var o=a,{types:s=[]}=o,i=T(o,["types"]);super(i);e(this,"kind");e(this,"types");this.kind=t,this.types=s}static isDflowPin(i){var a=i,{types:t=[]}=a,s=T(a,["types"]);return v.isDflowItem(s)&&t.every(o=>Ut.isDflowPinType(o))}static isDflowPinType(t){Ut.types.includes(t)}get hasTypeAny(){return this.types.length===0}get hasTypeDflowId(){return this.hasTypeAny||this.types.includes("DflowId")}get hasTypeDflowGraph(){return this.hasTypeAny||this.types.includes("DflowGraph")}get hasTypeDflowType(){return this.hasTypeAny||this.types.includes("DflowType")}get hasTypeString(){return this.hasTypeAny||this.types.includes("string")}get hasTypeNumber(){return this.hasTypeAny||this.types.includes("number")}get hasTypeBoolean(){return this.hasTypeAny||this.types.includes("boolean")}get hasTypeNull(){return this.hasTypeAny||this.types.includes("null")}get hasTypeObject(){return this.hasTypeAny||this.types.includes("object")}get hasTypeArray(){return this.hasTypeAny||this.types.includes("array")}addType(t){this.types.push(t)}removeType(t){this.types.splice(this.types.indexOf(t),1)}};let P=Ut;e(P,"types",["string","number","boolean","null","object","array","DflowId","DflowGraph","DflowType"]);class $t extends P{constructor(i){var a=i,{optional:t}=a,s=T(a,["optional"]);super("input",s);f(this,S,void 0);f(this,Pt,void 0);x(this,Pt,t)}static isDflowInput({id:t,types:s}){return P.isDflowPin({id:t,types:s})}get data(){var t;return(t=r(this,S))==null?void 0:t.data}get isConnected(){return typeof r(this,S)=="undefined"}get isOptional(){return r(this,Pt)}connectTo(t){const{hasTypeAny:s,types:i}=this,{types:a}=t;if(s||i.some(o=>a.includes(o)))x(this,S,t);else throw new Error(`mismatching pinTypes, source has types [${a.join()}] and target has types [${i.join()}]`)}disconnect(){x(this,S,void 0)}toObject(){const t={id:this.id};return this.types.length>0&&(t.types=this.types),t}}S=new WeakMap,Pt=new WeakMap;class St extends P{constructor(i){var a=i,{data:t}=a,s=T(a,["data"]);super("output",s);f(this,E,void 0);x(this,E,t)}static isDflowOutput({id:t,data:s,types:i=[]}){return P.isDflowPin({id:t,types:i})&&d.validate(s,i)}clear(){x(this,E,void 0)}get data(){return r(this,E)}set data(t){switch(!0){case d.isUndefined(t):this.clear();break;case this.hasTypeAny:case(d.isDflowGraph(t)&&this.hasTypeDflowGraph):case(d.isDflowId(t)&&this.hasTypeDflowId):case(d.isString(t)&&this.hasTypeString):case(d.isNumber(t)&&this.hasTypeNumber):case(d.isBoolean(t)&&this.hasTypeBoolean):case(d.isNull(t)&&this.hasTypeNull):case(d.isObject(t)&&this.hasTypeObject):case(d.isArray(t)&&this.hasTypeArray):{x(this,E,t);break}default:throw new Error(`could not set data pinTypes=${JSON.stringify(this.types)} typeof=${typeof t}`)}}toObject(){const t=l({},super.toObject());return d.isUndefined(r(this,E))||(t.data=r(this,E)),this.types.length>0&&(t.types=this.types),t}}E=new WeakMap;const zt=class extends v{constructor(y,o,{isAsync:c=!1,isConstant:h=!1,label:g}={}){var O=y,{kind:t,inputs:s=[],outputs:i=[]}=O,a=T(O,["kind","inputs","outputs"]);super(a);f(this,w,new Map);f(this,A,new Map);f(this,G,[]);f(this,R,[]);f(this,Ct,void 0);e(this,"kind");e(this,"meta");e(this,"host");x(this,Ct,g),this.host=o,this.kind=t,this.meta={isAsync:c,isConstant:h};for(const C of s)this.newInput(C);for(const C of i)this.newOutput(C);this.onCreate()}static generateInputIds(t=[]){return t.map((s,i)=>b(l({},s),{id:`i${i}`}))}static generateOutputIds(t=[]){return t.map((s,i)=>b(l({},s),{id:`o${i}`}))}static in(t=[],s){return[l({types:t},s)]}static ins(t,s=[]){return Array(t).fill(zt.in(s)).flat()}static out(t=[],s){return[l({types:t},s)]}static outs(t,s=[]){return Array(t).fill(zt.out(s)).flat()}static outputNumber(t){return b(l({},t),{types:["number"]})}static isDflowNode(o){var c=o,{kind:t,inputs:s=[],outputs:i=[]}=c,a=T(c,["kind","inputs","outputs"]);return v.isDflowItem(a)&&d.isStringNotEmpty(t)&&s.every(h=>$t.isDflowInput(h))&&i.every(h=>St.isDflowOutput(h))}get label(){return r(this,Ct)||this.kind}get inputs(){return r(this,w).values()}get outputs(){return r(this,A).values()}get numInputs(){return r(this,w).size}get numOutputs(){return r(this,A).size}generateInputId(t=this.numInputs){const s=`i${t}`;return r(this,w).has(s)?this.generateInputId(t+1):s}generateOutputId(t=this.numOutputs){const s=`o${t}`;return r(this,A).has(s)?this.generateOutputId(t+1):s}getInputById(t){if(typeof t!="string")throw new TypeError(N("inputId"));const s=r(this,w).get(t);if(s instanceof $t)return s;throw new Error(Zt(this.id,"input",t))}input(t){if(typeof t!="number")throw new TypeError(Vt("position"));const s=r(this,G)[t];if(d.isUndefined(s))throw new Error(Yt(this.id,"input",t));return this.getInputById(s)}getOutputById(t){if(typeof t!="string")throw new TypeError(N("outputId"));const s=r(this,A).get(t);if(s instanceof St)return s;throw new Error(Zt(this.id,"output",t))}output(t){if(typeof t!="number")throw new TypeError(Vt("position"));const s=r(this,R)[t];if(d.isUndefined(s))throw new Error(Yt(this.id,"output",t));return this.getOutputById(s)}deleteInput(t){this.host.deleteEdgesConnectedToPin([this.id,t]),r(this,w).delete(t),r(this,G).splice(r(this,G).indexOf(t),1)}deleteOutput(t){this.host.deleteEdgesConnectedToPin([this.id,t]),r(this,A).delete(t),r(this,R).splice(r(this,R).indexOf(t),1)}onBeforeConnectInput(t,s){}onCreate(){}newInput(t){const s=d.isDflowId(t.id)?t.id:this.generateInputId(),i=new $t(b(l({},t),{id:s}));return r(this,w).set(s,i),r(this,G).push(s),i}newOutput(t){const s=d.isDflowId(t.id)?t.id:this.generateOutputId(),i=new St(b(l({},t),{id:s}));return r(this,A).set(s,i),r(this,R).push(s),i}run(){throw new Error(`${this.constructor.name} does not implement a run() method`)}toObject(){const t=b(l({},super.toObject()),{kind:this.kind}),s=[],i=[];for(const a of this.inputs)s.push(a.toObject());s.length>0&&(t.inputs=s);for(const a of this.outputs)i.push(a.toObject());return i.length>0&&(t.outputs=i),t}};let n=zt;w=new WeakMap,A=new WeakMap,G=new WeakMap,R=new WeakMap,Ct=new WeakMap,e(n,"kind"),e(n,"isAsync"),e(n,"isConstant"),e(n,"label"),e(n,"inputs"),e(n,"outputs");const Ht=class extends n{constructor(t,s){super(b(l({},t),{kind:Ht.kind}),s)}run(){}};let Gt=Ht;e(Gt,"kind","Unknown");class K extends v{constructor(a){var o=a,{source:t,target:s}=o,i=T(o,["source","target"]);super(i);e(this,"source");e(this,"target");const[c,h]=t,[g,y]=s;if(typeof c!="string")throw new TypeError(N("sourceNodeId"));if(typeof h!="string")throw new TypeError(N("sourcePinId"));if(typeof g!="string")throw new TypeError(N("targetNodeId"));if(typeof y!="string")throw new TypeError(N("targetPinId"));this.source=t,this.target=s}static isDflowEdge(o,a){var c=o,{source:t,target:s}=c,i=T(c,["source","target"]);return v.isDflowItem(i)&&Array.isArray(t)&&t.length===2&&a.nodes.find(({id:h,outputs:g=[]})=>h===t[0]&&g.find(({id:y})=>y===t[1]))&&Array.isArray(s)&&s.length===2&&a.nodes.find(({id:h,inputs:g=[]})=>h===s[0]&&g.find(({id:y})=>y===s[1]))}toObject(){return b(l({},super.toObject()),{source:this.source,target:this.target})}}const B=class extends v{constructor(){super(...arguments);f(this,m,new Map);f(this,I,new Map);e(this,"runOptions",{verbose:!1});e(this,"runStatus",null);e(this,"executionReport",null)}static isDflowGraph(t){return t.nodes.every(s=>n.isDflowNode(s))&&t.edges.every(s=>K.isDflowEdge(s,t))}static childrenOfNodeId(t,s){return s.filter(({sourceId:i})=>t===i).map(({targetId:i})=>i)}static parentsOfNodeId(t,s){return s.filter(({targetId:i})=>t===i).map(({sourceId:i})=>i)}static levelOfNodeId(t,s){const i=B.parentsOfNodeId(t,s);if(i.length===0)return 0;let a=0;for(const o of i){const c=B.levelOfNodeId(o,s);a=Math.max(c,a)}return a+1}static ancestorsOfNodeId(t,s){const i=B.parentsOfNodeId(t,s);return i.length===0?[]:i.reduce((a,o,c,h)=>{const g=B.ancestorsOfNodeId(o,s),y=a.concat(g);return c===h.length-1?Array.from(new Set(h.concat(y))):y},[])}static sort(t,s){const i={};for(const a of t)i[a]=B.levelOfNodeId(a,s);return t.slice().sort((a,o)=>i[a]<=i[o]?-1:1)}get edges(){return r(this,I).values()}get nodes(){return r(this,m).values()}get nodeConnections(){return[...r(this,I).values()].map(t=>({sourceId:t.source[0],targetId:t.target[0]}))}get edgeIds(){return[...r(this,I).keys()]}get nodeIds(){return[...r(this,m).keys()]}get numEdges(){return r(this,I).size}get numNodes(){return r(this,m).size}addEdge(t){if(r(this,I).has(t.id))throw new Error(`cannot overwrite edge, id=${t.id}`);r(this,I).set(t.id,t)}addNode(t){if(r(this,m).has(t.id))throw new Error(`cannot overwrite node, id=${t.id}`);r(this,m).set(t.id,t)}clear(){r(this,m).clear(),r(this,I).clear()}deleteEdge(t){r(this,I).delete(t)}deleteNode(t){r(this,m).delete(t)}getNodeById(t){if(typeof t!="string")throw new TypeError(N("nodeId"));const s=r(this,m).get(t);if(s instanceof n)return s;throw new Error(`DflowNode not found, id=${t}`)}getEdgeById(t){if(typeof t!="string")throw new TypeError(N("edgeId"));const s=r(this,I).get(t);if(s instanceof K)return s;throw new Error(`DflowEdge not found, id=${t}`)}generateEdgeId(t=this.numEdges){const s=`e${t}`;return r(this,I).has(s)?this.generateEdgeId(t+1):s}generateNodeId(t=this.numNodes){const s=`n${t}`;return r(this,m).has(s)?this.generateNodeId(t+1):s}nodeIdsInsideFunctions(){const t=[];for(const s of this.nodes)s.kind==="return"&&t.push(B.ancestorsOfNodeId(s.id,this.nodeConnections));return Array.from(new Set(t.flat()))}async run(){var a;const{verbose:t}=this.runOptions;this.runStatus="waiting",this.executionReport={status:this.runStatus,start:new Date},t&&(this.executionReport.steps=[]);const s=this.nodeIdsInsideFunctions(),i=B.sort(this.nodeIds.filter(o=>!s.includes(o)),this.nodeConnections);for(const o of i){const c=r(this,m).get(o);try{if(!c.meta.isConstant){let h=!1;for(const{data:g,types:y,isOptional:O}of c.inputs)if(!(O&&typeof g=="undefined")&&!d.validate(g,y)){h=!0;break}if(h){for(const g of c.outputs)g.clear();break}c.meta.isAsync?await c.run():c.run()}t&&((a=this.executionReport.steps)==null||a.push(Mt(c.toObject())))}catch(h){console.error(h),this.runStatus="failure"}}this.runStatus==="waiting"&&(this.runStatus="success"),this.executionReport.status=this.runStatus,this.executionReport.end=new Date}toObject(){const t=b(l({},super.toObject()),{nodes:[],edges:[]});for(const s of this.nodes)t.nodes.push(s.toObject());for(const s of this.edges)t.edges.push(s.toObject());return t}};let j=B;m=new WeakMap,I=new WeakMap;class ss{constructor(t={}){f(this,p,void 0);f(this,z,void 0);e(this,"context");x(this,z,t),x(this,p,new j({id:"g1"})),this.context={}}get executionReport(){return r(this,p).executionReport}get edges(){return r(this,p).edges}get nodes(){return r(this,p).nodes}get numEdges(){return r(this,p).numEdges}get numNodes(){return r(this,p).numNodes}get nodeKinds(){return Object.keys(r(this,z))}get runStatusIsSuccess(){return r(this,p).runStatus==="success"}get runStatusIsWaiting(){return r(this,p).runStatus==="waiting"}get runStatusIsFailure(){return r(this,p).runStatus==="failure"}set verbose(t){r(this,p).runOptions.verbose=t}clearGraph(){r(this,p).clear()}connect(t,s=0){return{to:(i,a=0)=>{const o=r(this,p).generateEdgeId(),c=t.output(s),h=i.input(a);i.onBeforeConnectInput(t,s),this.newEdge({id:o,source:[t.id,c.id],target:[i.id,h.id]})}}}deleteEdge(t){if(typeof t!="string")throw new TypeError(N("edgeId"));const s=r(this,p).getEdgeById(t);if(s instanceof K){const[i,a]=s.target;this.getNodeById(i).getInputById(a).disconnect(),r(this,p).deleteEdge(t)}else throw new Error(`DflowEdge not found, id=${t}`)}deleteNode(t){if(typeof t!="string")throw new TypeError(N("nodeId"));const s=this.getNodeById(t);if(s instanceof n){for(const i of r(this,p).edges){const{source:[a],target:[o]}=i;(a===s.id||o===s.id)&&this.deleteEdge(i.id)}r(this,p).deleteNode(t)}else throw new Error(`DflowNode not found, id=${t}`)}deleteEdgesConnectedToPin([t,s]){for(const i of this.edges){const[a,o]=i.source,[c,h]=i.target;(a===t&&o===s||c===t&&h===s)&&this.deleteEdge(i.id)}}executeFunction(t,s){var y,O,C;const{verbose:i}=r(this,p).runOptions,a=r(this,p).nodeConnections,o=j.childrenOfNodeId(t,a),c=[];for(const F of o){const k=this.getNodeById(F);k.kind==="return"&&c.push(k.id)}const h=c.reduce((F,k,H,qt)=>{const Lt=j.ancestorsOfNodeId(k,a),Kt=F.concat(Lt);return H===qt.length?Array.from(new Set(Kt)):Kt},[]),g=j.sort([...c,...h],a);for(const F of g){const k=this.getNodeById(F);try{switch(k.kind){case"argument":{const H=Math.max((y=k.input(1).data)!=null?y:0,0);k.output(0).data=s[H];break}case"return":return k.input(1).data;default:k.meta.isConstant||k.run(),i&&((C=(O=this.executionReport)==null?void 0:O.steps)==null||C.push(Mt(k.toObject())))}}catch(H){console.error(H)}}}getEdgeById(t){return r(this,p).getEdgeById(t)}getNodeById(t){return r(this,p).getNodeById(t)}newNode(t){var g;const s=(g=r(this,z)[t.kind])!=null?g:Gt,i=d.isDflowId(t.id)?t.id:r(this,p).generateNodeId(),a={isAsync:s.isAsync,isConstant:s.isConstant,label:s.label},o=Array.isArray(t.inputs)?t.inputs:n.generateInputIds(s.inputs),c=Array.isArray(t.outputs)?t.outputs:n.generateOutputIds(s.outputs),h=new s(b(l({},t),{id:i,inputs:o,outputs:c}),this,a);return r(this,p).addNode(h),h}newEdge(t){const s=d.isDflowId(t.id)?t.id:r(this,p).generateEdgeId(),i=new K(b(l({},t),{id:s}));r(this,p).addEdge(i);const[a,o]=i.source,[c,h]=i.target,g=r(this,p).getNodeById(a),y=r(this,p).getNodeById(c),O=g.getOutputById(o);return y.getInputById(h).connectTo(O),i}newInput(t,s){return r(this,p).getNodeById(t).newInput(s)}newOutput(t,s){return r(this,p).getNodeById(t).newOutput(s)}toObject(){return r(this,p).toObject()}async run(){await r(this,p).run()}}p=new WeakMap,z=new WeakMap;export{d as DflowData};export{v as DflowItem};export{P as DflowPin};export{$t as DflowInput};export{St as DflowOutput};export{n as DflowNode};export{Gt as DflowUnknownNode};export{K as DflowEdge};export{j as DflowGraph};export{ss as DflowHost};class W extends n{run(){this.output(0).data=this.input(0).data.filter((...t)=>this.host.executeFunction(this.input(1).data,t))}}e(W,"kind","arrayFilter"),e(W,"inputs",[...n.in(["array"]),...n.in(["DflowId"],{name:"functionId"})]),e(W,"outputs",n.out(["array"]));class J extends n{run(){const t=this.input(0).data,s=this.input(1).data;Array.isArray(t)&&(this.output(0).data=t.includes(s))}}e(J,"kind","arrayIncludes"),e(J,"inputs",[...n.in(["array"],{name:"array"}),...n.in(["string"],{name:"element"})]),e(J,"outputs",n.out(["boolean"]));class Q extends n{run(){var i;const t=this.input(0).data,s=(i=this.input(1).data)!=null?i:",";Array.isArray(t)&&(this.output(0).data=t.join(s))}}e(Q,"kind","arrayJoin"),e(Q,"inputs",[...n.in(["array"],{name:"array"}),...n.in(["string"],{name:"separator",optional:!0})]),e(Q,"outputs",n.out(["string"]));class V extends n{run(){const t=this.input(0).data;Array.isArray(t)?this.output(0).data=t.length:this.output(0).clear}}e(V,"kind","arrayLength"),e(V,"inputs",n.in(["array"])),e(V,"outputs",n.out(["number"]));class X extends n{run(){this.output(0).data=this.input(0).data.map((...t)=>this.host.executeFunction(this.input(1).data,t))}}e(X,"kind","arrayMap"),e(X,"inputs",[...n.in(["array"]),...n.in(["DflowId"],{name:"functionId"})]),e(X,"outputs",n.out(["array"]));const es={[W.kind]:W,[J.kind]:J,[Q.kind]:Q,[V.kind]:V,[X.kind]:X};class Y extends n{run(){this.output(0).data=this.input(0).data?this.input(1).data:this.input(2).data}}e(Y,"kind","if"),e(Y,"inputs",[...n.in(["boolean"],{name:"condition"}),...n.in([],{name:"then"}),...n.in([],{name:"else"})]),e(Y,"outputs",n.out());const ns={[Y.kind]:Y};class Rt extends n{run(){console.log(this.input(0).data)}}e(Rt,"kind","consoleLog"),e(Rt,"inputs",[...n.in([])]);const is={[Rt.kind]:Rt};class Z extends n{}e(Z,"kind","data"),e(Z,"outputs",n.out()),e(Z,"isConstant",!0);class M extends n{}e(M,"kind","array"),e(M,"outputs",n.out(["array"])),e(M,"isConstant",!0);class q extends n{}e(q,"kind","boolean"),e(q,"outputs",n.out(["boolean"])),e(q,"isConstant",!0);class L extends n{}e(L,"kind","number"),e(L,"outputs",n.out(["number"])),e(L,"isConstant",!0);class _ extends n{}e(_,"kind","object"),e(_,"outputs",n.out(["object"])),e(_,"isConstant",!0);class D extends n{}e(D,"kind","string"),e(D,"outputs",n.out(["string"])),e(D,"isConstant",!0);const us={[Z.kind]:Z,[M.kind]:M,[q.kind]:q,[L.kind]:L,[_.kind]:_,[D.kind]:D};class $ extends n{run(){const t=this.output(0);t.data=this.host.nodeKinds}}e($,"kind","dflow"),e($,"outputs",n.out(["array"],{name:"nodeKinds"}));class tt extends n{}e(tt,"kind","comment"),e(tt,"isConstant",!0),e(tt,"outputs",n.out(["string"]));class st extends n{}e(st,"kind","typeNumber"),e(st,"isConstant",!0),e(st,"outputs",n.out(["DflowType"],{name:"number",data:"number"}));class U extends n{onBeforeConnectInput(t,s){const i=t.output(s).data;this.output(0).addType(i)}}e(U,"kind","argument"),e(U,"isConstant",!0),e(U,"inputs",[...n.in(["DflowType"],{name:"type"}),...n.in(["number"],{name:"argumentPosition"})]),e(U,"outputs",n.out());class et extends n{onCreate(){this.output(0).data=this.id}}e(et,"kind","function"),e(et,"isConstant",!0),e(et,"outputs",$.out(["DflowId"],{name:"id"}));class nt extends n{}e(nt,"kind","return"),e(nt,"isConstant",!0),e(nt,"inputs",[...$.in(["DflowId"],{name:"functionId"}),...$.in([],{name:"value"})]);const rs={[$.kind]:$,[U.kind]:U,[tt.kind]:tt,[et.kind]:et,[nt.kind]:nt,[st.kind]:st};class it extends n{run(){this.output(0).data=this.input(0).data&&this.input(1).data}}e(it,"kind","and"),e(it,"inputs",n.ins(2,["boolean"])),e(it,"outputs",n.out(["boolean"]));class ut extends n{run(){this.output(0).data=!this.input(0).data}}e(ut,"kind","not"),e(ut,"inputs",n.in(["boolean"])),e(ut,"outputs",n.out(["boolean"]));class rt extends n{run(){this.output(0).data=this.input(0).data||this.input(1).data}}e(rt,"kind","or"),e(rt,"inputs",n.ins(2,["boolean"])),e(rt,"outputs",n.out(["boolean"]));const as={[it.kind]:it,[ut.kind]:ut,[rt.kind]:rt};class at extends n{run(){this.output(0).data=Math.cos(this.input(0).data)}}e(at,"kind","mathCos"),e(at,"inputs",n.in(["number"])),e(at,"outputs",n.out(["number"]));class ot extends n{run(){this.output(0).data=Math.cosh(this.input(0).data)}}e(ot,"kind","mathCosh"),e(ot,"inputs",n.in(["number"])),e(ot,"outputs",n.out(["number"]));class dt extends n{}e(dt,"kind","mathPI"),e(dt,"isConstant",!0),e(dt,"outputs",n.out(["number"],{name:"\u03C0",data:Math.PI}));class ct extends n{run(){this.output(0).data=Math.sin(this.input(0).data)}}e(ct,"kind","mathSin"),e(ct,"inputs",n.in(["number"])),e(ct,"outputs",n.out(["number"]));class pt extends n{run(){this.output(0).data=Math.sinh(this.input(0).data)}}e(pt,"kind","mathSinh"),e(pt,"inputs",n.in(["number"])),e(pt,"outputs",n.out(["number"]));const os={[at.kind]:at,[ot.kind]:ot,[dt.kind]:dt,[ct.kind]:ct,[pt.kind]:pt};class ht extends n{run(){this.output(0).data=Number.isFinite(this.input(0).data)}}e(ht,"kind","isFinite"),e(ht,"inputs",n.in(["number"])),e(ht,"outputs",n.out(["boolean"]));class lt extends n{run(){this.output(0).data=Number.isInteger(this.input(0).data)}}e(lt,"kind","isInteger"),e(lt,"inputs",n.in([])),e(lt,"outputs",n.out(["boolean"]));class gt extends n{run(){this.output(0).data=Number.isNaN(this.input(0).data)}}e(gt,"kind","isNaN"),e(gt,"inputs",n.in([])),e(gt,"outputs",n.out(["boolean"]));class yt extends n{run(){this.output(0).data=parseFloat(this.input(0).data)}}e(yt,"kind","parseFloat"),e(yt,"inputs",n.in(["string"])),e(yt,"outputs",n.out(["number"]));class ft extends n{run(){this.output(0).data=parseInt(this.input(0).data)}}e(ft,"kind","parseInt"),e(ft,"inputs",n.in(["number","string"])),e(ft,"outputs",n.out(["number"]));const ds={[ht.kind]:ht,[lt.kind]:lt,[gt.kind]:gt,[yt.kind]:yt,[ft.kind]:ft};class mt extends n{run(){this.output(0).data=Object.keys(this.input(0).data)}}e(mt,"kind","objectKeys"),e(mt,"inputs",n.in(["object"])),e(mt,"outputs",n.out(["array"]));class It extends n{run(){this.output(0).data=Object.values(this.input(0).data)}}e(It,"kind","objectValues"),e(It,"inputs",n.in(["object"])),e(It,"outputs",n.out(["array"]));const cs={[mt.kind]:mt,[It.kind]:It};class kt extends n{run(){this.output(0).data=this.input(0).data+this.input(1).data}}e(kt,"kind","addition"),e(kt,"inputs",n.ins(2,["number"])),e(kt,"outputs",n.out(["number"]));class bt extends n{run(){this.input(1).data?this.output(0).data=this.input(0).data/this.input(1).data:this.output(0).clear()}}e(bt,"kind","division"),e(bt,"inputs",n.ins(2,["number"])),e(bt,"outputs",n.out(["number"]));class xt extends n{run(){this.output(0).data=this.input(0).data==this.input(1).data}}e(xt,"kind","equality"),e(xt,"inputs",n.ins(2)),e(xt,"outputs",n.out(["boolean"]));class Nt extends n{run(){this.output(0).data=this.input(0).data<this.input(1).data}}e(Nt,"kind","lessThan"),e(Nt,"inputs",n.ins(2,["number"])),e(Nt,"outputs",n.out(["boolean"]));class Ot extends n{run(){this.output(0).data=this.input(0).data<=this.input(1).data}}e(Ot,"kind","lessThanOrEqual"),e(Ot,"inputs",n.ins(2,["number"])),e(Ot,"outputs",n.out(["boolean"]));class Tt extends n{run(){this.output(0).data=this.input(0).data>this.input(1).data}}e(Tt,"kind","greaterThan"),e(Tt,"inputs",n.ins(2,["number"])),e(Tt,"outputs",n.out(["boolean"]));class Et extends n{run(){this.output(0).data=this.input(0).data>=this.input(1).data}}e(Et,"kind","greaterThanOrEqual"),e(Et,"inputs",n.ins(2,["number"])),e(Et,"outputs",n.out(["boolean"]));class wt extends n{run(){this.output(0).data=this.input(0).data!=this.input(1).data}}e(wt,"kind","inequality"),e(wt,"inputs",n.ins(2)),e(wt,"outputs",n.out(["boolean"]));class At extends n{run(){this.output(0).data=this.input(0).data*this.input(1).data}}e(At,"kind","multiplication"),e(At,"inputs",n.ins(2,["number"])),e(At,"outputs",n.out(["number"]));class Bt extends n{run(){this.output(0).data=this.input(0).data-this.input(1).data}}e(Bt,"kind","subtraction"),e(Bt,"inputs",n.ins(2,["number"])),e(Bt,"outputs",n.out(["number"]));const ps={[kt.kind]:kt,[bt.kind]:bt,[xt.kind]:xt,[Tt.kind]:Tt,[Et.kind]:Et,[Nt.kind]:Nt,[Ot.kind]:Ot,[wt.kind]:wt,[At.kind]:At,[Bt.kind]:Bt};class vt extends n{run(){this.output(0).data=this.input(0).data.length}}e(vt,"kind","stringLength"),e(vt,"inputs",n.in(["string"])),e(vt,"outputs",n.out(["number"]));const hs={[vt.kind]:vt},ls=l(l(l(l(l(l(l(l(l(l(l({},es),ns),is),us),rs),as),os),ds),cs),ps),hs);export{ls as catalog};

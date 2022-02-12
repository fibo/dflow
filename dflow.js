var Xt=Object.defineProperty,Yt=Object.defineProperties;var Zt=Object.getOwnPropertyDescriptors;var At=Object.getOwnPropertySymbols;var Ut=Object.prototype.hasOwnProperty,zt=Object.prototype.propertyIsEnumerable;var St=(r,t,s)=>t in r?Xt(r,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):r[t]=s,l=(r,t)=>{for(var s in t||(t={}))Ut.call(t,s)&&St(r,s,t[s]);if(At)for(var s of At(t))zt.call(t,s)&&St(r,s,t[s]);return r},k=(r,t)=>Yt(r,Zt(t));var A=(r,t)=>{var s={};for(var i in r)Ut.call(r,i)&&t.indexOf(i)<0&&(s[i]=r[i]);if(r!=null&&At)for(var i of At(r))t.indexOf(i)<0&&zt.call(r,i)&&(s[i]=r[i]);return s};var e=(r,t,s)=>(St(r,typeof t!="symbol"?t+"":t,s),s),Ft=(r,t,s)=>{if(!t.has(r))throw TypeError("Cannot "+s)};var u=(r,t,s)=>(Ft(r,t,"read from private field"),s?s.call(r):t.get(r)),b=(r,t,s)=>{if(t.has(r))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(r):t.set(r,s)},N=(r,t,s,i)=>(Ft(r,t,"write to private field"),i?i.call(r,s):t.set(r,s),s);var S,T,O,w,G,R,Et,f,I,p,z;const x=r=>`${r} must be a string`,Ht=r=>`${r} must be a number`,Kt=(r,t)=>`${t} pin not found nodeId=${r}`,Jt=(r,t,s)=>`${Kt(r,t)} position=${s}`,Wt=(r,t,s)=>`${Kt(r,t)} pinId=${s}`,Mt=({id:r,kind:t,outputs:s})=>({id:r,kind:t,outputs:s==null?void 0:s.map(({id:i,data:o,name:a})=>({id:i,data:o,name:a}))});class d{static isArray(t){return Array.isArray(t)}static isBoolean(t){return typeof t=="boolean"}static isDflowGraph(t){return typeof t=="object"&&t!==null&&!Array.isArray(t)&&Array.isArray(t.nodes)&&Array.isArray(t.edges)&&j.isDflowGraph(t)}static isDflowId(t){return d.isStringNotEmpty(t)}static isDflowType(t){return typeof t=="string"&&B.types.includes(t)}static isObject(t){return!d.isUndefined(t)&&!d.isNull(t)&&!d.isArray(t)&&typeof t=="object"}static isNull(t){return t===null}static isNumber(t){return typeof t=="number"}static isString(t){return typeof t=="string"}static isStringNotEmpty(t){return d.isString(t)&&t.length>0}static isUndefined(t){return typeof t=="undefined"}static validate(t,s){return s.length===0?!0:s.some(i=>{switch(i){case"array":return d.isArray(t);case"boolean":return d.isBoolean(t);case"null":return d.isNull(t);case"number":return d.isNumber(t);case"object":return d.isObject(t);case"string":return d.isString(t);case"DflowGraph":return d.isDflowGraph(t);case"DflowId":return d.isDflowId(t);case"DflowType":return d.isDflowType(t);default:return!1}},!0)}}class v{constructor({id:t,name:s}){e(this,"id");e(this,"name");this.id=t,this.name=s}static isDflowItem({id:t,name:s}){return d.isDflowId(t)&&(d.isUndefined(s)||d.isStringNotEmpty(s))}toObject(){const t={id:this.id};return typeof this.name=="string"&&(t.name=this.name),t}}const jt=class extends v{constructor(t,o){var a=o,{types:s=[]}=a,i=A(a,["types"]);super(i);e(this,"kind");e(this,"types");this.kind=t,this.types=s}static isDflowPin(i){var o=i,{types:t=[]}=o,s=A(o,["types"]);return v.isDflowItem(s)&&t.every(a=>jt.isDflowPinType(a))}static isDflowPinType(t){jt.types.includes(t)}get hasTypeAny(){return this.types.length===0}get hasTypeDflowId(){return this.hasTypeAny||this.types.includes("DflowId")}get hasTypeDflowGraph(){return this.hasTypeAny||this.types.includes("DflowGraph")}get hasTypeDflowType(){return this.hasTypeAny||this.types.includes("DflowType")}get hasTypeString(){return this.hasTypeAny||this.types.includes("string")}get hasTypeNumber(){return this.hasTypeAny||this.types.includes("number")}get hasTypeBoolean(){return this.hasTypeAny||this.types.includes("boolean")}get hasTypeNull(){return this.hasTypeAny||this.types.includes("null")}get hasTypeObject(){return this.hasTypeAny||this.types.includes("object")}get hasTypeArray(){return this.hasTypeAny||this.types.includes("array")}addType(t){this.types.push(t)}removeType(t){this.types.splice(this.types.indexOf(t),1)}};let B=jt;e(B,"types",["string","number","boolean","null","object","array","DflowId","DflowGraph","DflowType"]);class vt extends B{constructor(t){super("input",t);b(this,S,void 0)}static isDflowInput({id:t,types:s}){return B.isDflowPin({id:t,types:s})}get data(){var t;return(t=u(this,S))==null?void 0:t.data}get isConnected(){return typeof u(this,S)=="undefined"}connectTo(t){const{hasTypeAny:s,types:i}=this,{types:o}=t;if(s||i.some(a=>o.includes(a)))N(this,S,t);else throw new Error(`mismatching pinTypes, source has types [${o.join()}] and target has types [${i.join()}]`)}disconnect(){N(this,S,void 0)}toObject(){const t={id:this.id};return this.types.length>0&&(t.types=this.types),t}}S=new WeakMap;class Bt extends B{constructor(i){var o=i,{data:t}=o,s=A(o,["data"]);super("output",s);b(this,T,void 0);N(this,T,t)}static isDflowOutput({id:t,data:s,types:i=[]}){return B.isDflowPin({id:t,types:i})&&d.validate(s,i)}clear(){N(this,T,void 0)}get data(){return u(this,T)}set data(t){switch(!0){case d.isUndefined(t):this.clear();break;case this.hasTypeAny:case(d.isDflowGraph(t)&&this.hasTypeDflowGraph):case(d.isDflowId(t)&&this.hasTypeDflowId):case(d.isString(t)&&this.hasTypeString):case(d.isNumber(t)&&this.hasTypeNumber):case(d.isBoolean(t)&&this.hasTypeBoolean):case(d.isNull(t)&&this.hasTypeNull):case(d.isObject(t)&&this.hasTypeObject):case(d.isArray(t)&&this.hasTypeArray):{N(this,T,t);break}default:throw new Error(`could not set data pinTypes=${JSON.stringify(this.types)} typeof=${typeof t}`)}}toObject(){const t=l({},super.toObject());return d.isUndefined(u(this,T))||(t.data=u(this,T)),this.types.length>0&&(t.types=this.types),t}}T=new WeakMap;const $t=class extends v{constructor(y,a,{isAsync:c=!1,isConstant:h=!1,label:g}={}){var P=y,{kind:t,inputs:s=[],outputs:i=[]}=P,o=A(P,["kind","inputs","outputs"]);super(o);b(this,O,new Map);b(this,w,new Map);b(this,G,[]);b(this,R,[]);b(this,Et,void 0);e(this,"kind");e(this,"meta");e(this,"host");N(this,Et,g),this.host=a,this.kind=t,this.meta={isAsync:c,isConstant:h};for(const C of s)this.newInput(C);for(const C of i)this.newOutput(C);this.onCreate()}static generateInputIds(t=[]){return t.map((s,i)=>k(l({},s),{id:`i${i}`}))}static generateOutputIds(t=[]){return t.map((s,i)=>k(l({},s),{id:`o${i}`}))}static in(t=[],s){return[l({types:t},s)]}static ins(t,s=[]){return Array(t).fill($t.in(s)).flat()}static out(t=[],s){return[l({types:t},s)]}static outs(t,s=[]){return Array(t).fill($t.out(s)).flat()}static outputNumber(t){return k(l({},t),{types:["number"]})}static isDflowNode(a){var c=a,{kind:t,inputs:s=[],outputs:i=[]}=c,o=A(c,["kind","inputs","outputs"]);return v.isDflowItem(o)&&d.isStringNotEmpty(t)&&s.every(h=>vt.isDflowInput(h))&&i.every(h=>Bt.isDflowOutput(h))}get label(){return u(this,Et)||this.kind}get inputs(){return u(this,O).values()}get outputs(){return u(this,w).values()}get numInputs(){return u(this,O).size}get numOutputs(){return u(this,w).size}generateInputId(t=this.numInputs){const s=`i${t}`;return u(this,O).has(s)?this.generateInputId(t+1):s}generateOutputId(t=this.numOutputs){const s=`o${t}`;return u(this,w).has(s)?this.generateOutputId(t+1):s}getInputById(t){if(typeof t!="string")throw new TypeError(x("inputId"));const s=u(this,O).get(t);if(s instanceof vt)return s;throw new Error(Wt(this.id,"input",t))}input(t){if(typeof t!="number")throw new TypeError(Ht("position"));const s=u(this,G)[t];if(d.isUndefined(s))throw new Error(Jt(this.id,"input",t));return this.getInputById(s)}getOutputById(t){if(typeof t!="string")throw new TypeError(x("outputId"));const s=u(this,w).get(t);if(s instanceof Bt)return s;throw new Error(Wt(this.id,"output",t))}output(t){if(typeof t!="number")throw new TypeError(Ht("position"));const s=u(this,R)[t];if(d.isUndefined(s))throw new Error(Jt(this.id,"output",t));return this.getOutputById(s)}deleteInput(t){this.host.deleteEdgesConnectedToPin([this.id,t]),u(this,O).delete(t),u(this,G).splice(u(this,G).indexOf(t),1)}deleteOutput(t){this.host.deleteEdgesConnectedToPin([this.id,t]),u(this,w).delete(t),u(this,R).splice(u(this,R).indexOf(t),1)}onBeforeConnectInput(t,s){}onCreate(){}newInput(t){const s=d.isDflowId(t.id)?t.id:this.generateInputId(),i=new vt(k(l({},t),{id:s}));return u(this,O).set(s,i),u(this,G).push(s),i}newOutput(t){const s=d.isDflowId(t.id)?t.id:this.generateOutputId(),i=new Bt(k(l({},t),{id:s}));return u(this,w).set(s,i),u(this,R).push(s),i}run(){throw new Error(`${this.constructor.name} does not implement a run() method`)}toObject(){const t=k(l({},super.toObject()),{kind:this.kind}),s=[],i=[];for(const o of this.inputs)s.push(o.toObject());s.length>0&&(t.inputs=s);for(const o of this.outputs)i.push(o.toObject());return i.length>0&&(t.outputs=i),t}};let n=$t;O=new WeakMap,w=new WeakMap,G=new WeakMap,R=new WeakMap,Et=new WeakMap,e(n,"kind"),e(n,"isAsync"),e(n,"isConstant"),e(n,"label"),e(n,"inputs"),e(n,"outputs");const Gt=class extends n{constructor(t,s){super(k(l({},t),{kind:Gt.kind}),s)}run(){}};let Pt=Gt;e(Pt,"kind","Unknown");class K extends v{constructor(o){var a=o,{source:t,target:s}=a,i=A(a,["source","target"]);super(i);e(this,"source");e(this,"target");const[c,h]=t,[g,y]=s;if(typeof c!="string")throw new TypeError(x("sourceNodeId"));if(typeof h!="string")throw new TypeError(x("sourcePinId"));if(typeof g!="string")throw new TypeError(x("targetNodeId"));if(typeof y!="string")throw new TypeError(x("targetPinId"));this.source=t,this.target=s}static isDflowEdge(a,o){var c=a,{source:t,target:s}=c,i=A(c,["source","target"]);return v.isDflowItem(i)&&Array.isArray(t)&&t.length===2&&o.nodes.find(({id:h,outputs:g=[]})=>h===t[0]&&g.find(({id:y})=>y===t[1]))&&Array.isArray(s)&&s.length===2&&o.nodes.find(({id:h,inputs:g=[]})=>h===s[0]&&g.find(({id:y})=>y===s[1]))}toObject(){return k(l({},super.toObject()),{source:this.source,target:this.target})}}const E=class extends v{constructor(){super(...arguments);b(this,f,new Map);b(this,I,new Map);e(this,"runOptions",{verbose:!1});e(this,"runStatus",null);e(this,"executionReport",null)}static isDflowGraph(t){return t.nodes.every(s=>n.isDflowNode(s))&&t.edges.every(s=>K.isDflowEdge(s,t))}static childrenOfNodeId(t,s){return s.filter(({sourceId:i})=>t===i).map(({targetId:i})=>i)}static parentsOfNodeId(t,s){return s.filter(({targetId:i})=>t===i).map(({sourceId:i})=>i)}static levelOfNodeId(t,s){const i=E.parentsOfNodeId(t,s);if(i.length===0)return 0;let o=0;for(const a of i){const c=E.levelOfNodeId(a,s);o=Math.max(c,o)}return o+1}static ancestorsOfNodeId(t,s){const i=E.parentsOfNodeId(t,s);return i.length===0?[]:i.reduce((o,a,c,h)=>{const g=E.ancestorsOfNodeId(a,s),y=o.concat(g);return c===h.length-1?Array.from(new Set(h.concat(y))):y},[])}static sort(t,s){const i={};for(const o of t)i[o]=E.levelOfNodeId(o,s);return t.slice().sort((o,a)=>i[o]<=i[a]?-1:1)}get edges(){return u(this,I).values()}get nodes(){return u(this,f).values()}get nodeConnections(){return[...u(this,I).values()].map(t=>({sourceId:t.source[0],targetId:t.target[0]}))}get edgeIds(){return[...u(this,I).keys()]}get nodeIds(){return[...u(this,f).keys()]}get numEdges(){return u(this,I).size}get numNodes(){return u(this,f).size}addEdge(t){if(u(this,I).has(t.id))throw new Error(`cannot overwrite edge, id=${t.id}`);u(this,I).set(t.id,t)}addNode(t){if(u(this,f).has(t.id))throw new Error(`cannot overwrite node, id=${t.id}`);u(this,f).set(t.id,t)}clear(){u(this,f).clear(),u(this,I).clear()}deleteEdge(t){u(this,I).delete(t)}deleteNode(t){u(this,f).delete(t)}getNodeById(t){if(typeof t!="string")throw new TypeError(x("nodeId"));const s=u(this,f).get(t);if(s instanceof n)return s;throw new Error(`DflowNode not found, id=${t}`)}getEdgeById(t){if(typeof t!="string")throw new TypeError(x("edgeId"));const s=u(this,I).get(t);if(s instanceof K)return s;throw new Error(`DflowEdge not found, id=${t}`)}generateEdgeId(t=this.numEdges){const s=`e${t}`;return u(this,I).has(s)?this.generateEdgeId(t+1):s}generateNodeId(t=this.numNodes){const s=`n${t}`;return u(this,f).has(s)?this.generateNodeId(t+1):s}nodeIdsInsideFunctions(){const t=[];for(const s of this.nodes)s.kind==="return"&&t.push(E.ancestorsOfNodeId(s.id,this.nodeConnections));return Array.from(new Set(t.flat()))}async run(){var o;const{verbose:t}=this.runOptions;this.runStatus="waiting",this.executionReport={status:this.runStatus,start:new Date},t&&(this.executionReport.steps=[]);const s=this.nodeIdsInsideFunctions(),i=E.sort(this.nodeIds.filter(a=>!s.includes(a)),this.nodeConnections);for(const a of i){const c=u(this,f).get(a);try{if(c.meta.isConstant===!1){let h=!1;for(const{data:g,types:y}of c.inputs)if(!d.validate(g,y)){h=!0;break}if(h){for(const g of c.outputs)g.clear();break}c.meta.isAsync?await c.run():c.run()}t&&((o=this.executionReport.steps)==null||o.push(Mt(c.toObject())))}catch(h){console.error(h),this.runStatus="failure"}}this.runStatus==="waiting"&&(this.runStatus="success"),this.executionReport.status=this.runStatus,this.executionReport.end=new Date}toObject(){const t=k(l({},super.toObject()),{nodes:[],edges:[]});for(const s of this.nodes)t.nodes.push(s.toObject());for(const s of this.edges)t.edges.push(s.toObject());return t}};let j=E;f=new WeakMap,I=new WeakMap;class qt{constructor(t={}){b(this,p,void 0);b(this,z,void 0);e(this,"context");N(this,z,t),N(this,p,new j({id:"g1"})),this.context={}}get executionReport(){return u(this,p).executionReport}get edges(){return u(this,p).edges}get nodes(){return u(this,p).nodes}get numEdges(){return u(this,p).numEdges}get numNodes(){return u(this,p).numNodes}get nodeKinds(){return Object.keys(u(this,z))}get runStatusIsSuccess(){return u(this,p).runStatus==="success"}get runStatusIsWaiting(){return u(this,p).runStatus==="waiting"}get runStatusIsFailure(){return u(this,p).runStatus==="failure"}set verbose(t){u(this,p).runOptions.verbose=t}clearGraph(){u(this,p).clear()}connect(t,s=0){return{to:(i,o=0)=>{const a=u(this,p).generateEdgeId(),c=t.output(s),h=i.input(o);i.onBeforeConnectInput(t,s),this.newEdge({id:a,source:[t.id,c.id],target:[i.id,h.id]})}}}deleteEdge(t){if(typeof t!="string")throw new TypeError(x("edgeId"));const s=u(this,p).getEdgeById(t);if(s instanceof K){const[i,o]=s.target;this.getNodeById(i).getInputById(o).disconnect(),u(this,p).deleteEdge(t)}else throw new Error(`DflowEdge not found, id=${t}`)}deleteNode(t){if(typeof t!="string")throw new TypeError(x("nodeId"));const s=this.getNodeById(t);if(s instanceof n){for(const i of u(this,p).edges){const{source:[o],target:[a]}=i;(o===s.id||a===s.id)&&this.deleteEdge(i.id)}u(this,p).deleteNode(t)}else throw new Error(`DflowNode not found, id=${t}`)}deleteEdgesConnectedToPin([t,s]){for(const i of this.edges){const[o,a]=i.source,[c,h]=i.target;(o===t&&a===s||c===t&&h===s)&&this.deleteEdge(i.id)}}executeFunction(t,s){var y,P,C;const{verbose:i}=u(this,p).runOptions,o=u(this,p).nodeConnections,a=j.childrenOfNodeId(t,o),c=[];for(const F of a){const m=this.getNodeById(F);m.kind==="return"&&c.push(m.id)}const h=c.reduce((F,m,H,Qt)=>{const Vt=j.ancestorsOfNodeId(m,o),Rt=F.concat(Vt);return H===Qt.length?Array.from(new Set(Rt)):Rt},[]),g=j.sort([...c,...h],o);for(const F of g){const m=this.getNodeById(F);try{switch(m.kind){case"argument":{const H=Math.max((y=m.input(1).data)!=null?y:0,0);m.output(0).data=s[H];break}case"return":return m.input(1).data;default:m.meta.isConstant||m.run(),i&&((C=(P=this.executionReport)==null?void 0:P.steps)==null||C.push(Mt(m.toObject())))}}catch(H){console.error(H)}}}getEdgeById(t){return u(this,p).getEdgeById(t)}getNodeById(t){return u(this,p).getNodeById(t)}newNode(t){var g;const s=(g=u(this,z)[t.kind])!=null?g:Pt,i=d.isDflowId(t.id)?t.id:u(this,p).generateNodeId(),o={isAsync:s.isAsync,isConstant:s.isConstant,label:s.label},a=Array.isArray(t.inputs)?t.inputs:n.generateInputIds(s.inputs),c=Array.isArray(t.outputs)?t.outputs:n.generateOutputIds(s.outputs),h=new s(k(l({},t),{id:i,inputs:a,outputs:c}),this,o);return u(this,p).addNode(h),h}newEdge(t){const s=d.isDflowId(t.id)?t.id:u(this,p).generateEdgeId(),i=new K(k(l({},t),{id:s}));u(this,p).addEdge(i);const[o,a]=i.source,[c,h]=i.target,g=u(this,p).getNodeById(o),y=u(this,p).getNodeById(c),P=g.getOutputById(a);return y.getInputById(h).connectTo(P),i}newInput(t,s){return u(this,p).getNodeById(t).newInput(s)}newOutput(t,s){return u(this,p).getNodeById(t).newOutput(s)}toObject(){return u(this,p).toObject()}async run(){await u(this,p).run()}}p=new WeakMap,z=new WeakMap;export{d as DflowData};export{v as DflowItem};export{B as DflowPin};export{vt as DflowInput};export{Bt as DflowOutput};export{n as DflowNode};export{Pt as DflowUnknownNode};export{K as DflowEdge};export{j as DflowGraph};export{qt as DflowHost};class J extends n{run(){this.output(0).data=this.input(0).data.filter((...t)=>this.host.executeFunction(this.input(1).data,t))}}e(J,"kind","arrayFilter"),e(J,"inputs",[...n.in(["array"]),...n.in(["DflowId"],{name:"functionId"})]),e(J,"outputs",n.out(["array"]));class W extends n{run(){this.output(0).data=this.input(0).data.length}}e(W,"kind","arrayLength"),e(W,"inputs",n.in(["array"])),e(W,"outputs",n.out(["number"]));class M extends n{run(){this.output(0).data=this.input(0).data.map((...t)=>this.host.executeFunction(this.input(1).data,t))}}e(M,"kind","arrayMap"),e(M,"inputs",[...n.in(["array"]),...n.in(["DflowId"],{name:"functionId"})]),e(M,"outputs",n.out(["array"]));const Lt={[J.kind]:J,[W.kind]:W,[M.kind]:M};class Q extends n{run(){this.output(0).data=this.input(0).data?this.input(1).data:this.input(2).data}}e(Q,"kind","if"),e(Q,"inputs",[...n.in(["boolean"],{name:"condition"}),...n.in([],{name:"then"}),...n.in([],{name:"else"})]),e(Q,"outputs",n.out());const _t={[Q.kind]:Q};class Ct extends n{run(){console.log(this.input(0).data)}}e(Ct,"kind","consoleLog"),e(Ct,"inputs",[...n.in([])]);const Dt={[Ct.kind]:Ct};class V extends n{}e(V,"kind","data"),e(V,"outputs",n.out()),e(V,"isConstant",!0);class X extends n{}e(X,"kind","array"),e(X,"outputs",n.out(["array"])),e(X,"isConstant",!0);class Y extends n{}e(Y,"kind","boolean"),e(Y,"outputs",n.out(["boolean"])),e(Y,"isConstant",!0);class Z extends n{}e(Z,"kind","number"),e(Z,"outputs",n.out(["number"])),e(Z,"isConstant",!0);class q extends n{}e(q,"kind","object"),e(q,"outputs",n.out(["object"])),e(q,"isConstant",!0);class L extends n{}e(L,"kind","string"),e(L,"outputs",n.out(["string"])),e(L,"isConstant",!0);const ts={[V.kind]:V,[X.kind]:X,[Y.kind]:Y,[Z.kind]:Z,[q.kind]:q,[L.kind]:L};class $ extends n{run(){const t=this.output(0);t.data=this.host.nodeKinds}}e($,"kind","dflow"),e($,"outputs",n.out(["array"],{name:"nodeKinds"}));class _ extends n{}e(_,"kind","comment"),e(_,"isConstant",!0),e(_,"outputs",n.out(["string"]));class D extends n{}e(D,"kind","typeNumber"),e(D,"isConstant",!0),e(D,"outputs",n.out(["DflowType"],{name:"number",data:"number"}));class U extends n{onBeforeConnectInput(t,s){const i=t.output(s).data;this.output(0).addType(i)}}e(U,"kind","argument"),e(U,"isConstant",!0),e(U,"inputs",[...n.in(["DflowType"],{name:"type"}),...n.in(["number"],{name:"argumentPosition"})]),e(U,"outputs",n.out());class tt extends n{onCreate(){this.output(0).data=this.id}}e(tt,"kind","function"),e(tt,"isConstant",!0),e(tt,"outputs",$.out(["DflowId"],{name:"id"}));class st extends n{}e(st,"kind","return"),e(st,"isConstant",!0),e(st,"inputs",[...$.in(["DflowId"],{name:"functionId"}),...$.in([],{name:"value"})]);const ss={[$.kind]:$,[U.kind]:U,[_.kind]:_,[tt.kind]:tt,[st.kind]:st,[D.kind]:D};class et extends n{run(){this.output(0).data=this.input(0).data&&this.input(1).data}}e(et,"kind","and"),e(et,"inputs",n.ins(2,["boolean"])),e(et,"outputs",n.out(["boolean"]));class nt extends n{run(){this.output(0).data=!this.input(0).data}}e(nt,"kind","not"),e(nt,"inputs",n.in(["boolean"])),e(nt,"outputs",n.out(["boolean"]));class it extends n{run(){this.output(0).data=this.input(0).data||this.input(1).data}}e(it,"kind","or"),e(it,"inputs",n.ins(2,["boolean"])),e(it,"outputs",n.out(["boolean"]));const es={[et.kind]:et,[nt.kind]:nt,[it.kind]:it};class rt extends n{run(){this.output(0).data=Math.cos(this.input(0).data)}}e(rt,"kind","mathCos"),e(rt,"inputs",n.in(["number"])),e(rt,"outputs",n.out(["number"]));class ut extends n{run(){this.output(0).data=Math.cosh(this.input(0).data)}}e(ut,"kind","mathCosh"),e(ut,"inputs",n.in(["number"])),e(ut,"outputs",n.out(["number"]));class ot extends n{}e(ot,"kind","mathPI"),e(ot,"isConstant",!0),e(ot,"outputs",n.out(["number"],{data:Math.PI}));class at extends n{run(){this.output(0).data=Math.sin(this.input(0).data)}}e(at,"kind","mathSin"),e(at,"inputs",n.in(["number"])),e(at,"outputs",n.out(["number"]));class dt extends n{run(){this.output(0).data=Math.sinh(this.input(0).data)}}e(dt,"kind","mathSinh"),e(dt,"inputs",n.in(["number"])),e(dt,"outputs",n.out(["number"]));const ns={[rt.kind]:rt,[ut.kind]:ut,[ot.kind]:ot,[at.kind]:at,[dt.kind]:dt};class ct extends n{run(){this.output(0).data=Number.isFinite(this.input(0).data)}}e(ct,"kind","isFinite"),e(ct,"inputs",n.in(["number"])),e(ct,"outputs",n.out(["boolean"]));class pt extends n{run(){this.output(0).data=Number.isInteger(this.input(0).data)}}e(pt,"kind","isInteger"),e(pt,"inputs",n.in([])),e(pt,"outputs",n.out(["boolean"]));class ht extends n{run(){this.output(0).data=Number.isNaN(this.input(0).data)}}e(ht,"kind","isNaN"),e(ht,"inputs",n.in([])),e(ht,"outputs",n.out(["boolean"]));class lt extends n{run(){this.output(0).data=parseFloat(this.input(0).data)}}e(lt,"kind","parseFloat"),e(lt,"inputs",n.in(["string"])),e(lt,"outputs",n.out(["number"]));class gt extends n{run(){this.output(0).data=parseInt(this.input(0).data)}}e(gt,"kind","parseInt"),e(gt,"inputs",n.in(["number","string"])),e(gt,"outputs",n.out(["number"]));const is={[ct.kind]:ct,[pt.kind]:pt,[ht.kind]:ht,[lt.kind]:lt,[gt.kind]:gt};class yt extends n{run(){this.output(0).data=Object.keys(this.input(0).data)}}e(yt,"kind","objectKeys"),e(yt,"inputs",n.in(["object"])),e(yt,"outputs",n.out(["array"]));class ft extends n{run(){this.output(0).data=Object.values(this.input(0).data)}}e(ft,"kind","objectValues"),e(ft,"inputs",n.in(["object"])),e(ft,"outputs",n.out(["array"]));const rs={[yt.kind]:yt,[ft.kind]:ft};class It extends n{run(){this.output(0).data=this.input(0).data+this.input(1).data}}e(It,"kind","addition"),e(It,"inputs",n.ins(2,["number"])),e(It,"outputs",n.out(["number"]));class mt extends n{run(){this.output(0).data=this.input(0).data==this.input(1).data}}e(mt,"kind","equality"),e(mt,"inputs",n.ins(2)),e(mt,"outputs",n.out(["boolean"]));class kt extends n{run(){this.output(0).data=this.input(0).data<this.input(1).data}}e(kt,"kind","lessThan"),e(kt,"inputs",n.ins(2,["number"])),e(kt,"outputs",n.out(["boolean"]));class bt extends n{run(){this.output(0).data=this.input(0).data<=this.input(1).data}}e(bt,"kind","lessThanOrEqual"),e(bt,"inputs",n.ins(2,["number"])),e(bt,"outputs",n.out(["boolean"]));class xt extends n{run(){this.output(0).data=this.input(0).data>this.input(1).data}}e(xt,"kind","greaterThan"),e(xt,"inputs",n.ins(2,["number"])),e(xt,"outputs",n.out(["boolean"]));class Nt extends n{run(){this.output(0).data=this.input(0).data>=this.input(1).data}}e(Nt,"kind","greaterThanOrEqual"),e(Nt,"inputs",n.ins(2,["number"])),e(Nt,"outputs",n.out(["boolean"]));class Tt extends n{run(){this.output(0).data=this.input(0).data!=this.input(1).data}}e(Tt,"kind","inequality"),e(Tt,"inputs",n.ins(2)),e(Tt,"outputs",n.out(["boolean"]));class Ot extends n{run(){this.output(0).data=this.input(0).data-this.input(1).data}}e(Ot,"kind","subtraction"),e(Ot,"inputs",n.ins(2,["number"])),e(Ot,"outputs",n.out(["number"]));const us={[It.kind]:It,[mt.kind]:mt,[xt.kind]:xt,[Nt.kind]:Nt,[kt.kind]:kt,[bt.kind]:bt,[Tt.kind]:Tt,[Ot.kind]:Ot};class wt extends n{run(){this.output(0).data=this.input(0).data.length}}e(wt,"kind","stringLength"),e(wt,"inputs",n.in(["string"])),e(wt,"outputs",n.out(["number"]));const os={[wt.kind]:wt},as=l(l(l(l(l(l(l(l(l(l(l({},Lt),_t),Dt),ts),ss),es),ns),is),rs),us),os);export{as as catalog};

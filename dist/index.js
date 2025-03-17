import{defineInterface as e}from"@directus/extensions-sdk";import{defineComponent as n,ref as t,watchEffect as o,onMounted as r,resolveComponent as a,openBlock as l,createElementBlock as i,createElementVNode as c,createCommentVNode as s,createVNode as u,createTextVNode as d,toDisplayString as p}from"vue";const f={id:"bunny-upload-directus"},m={key:0,class:"loader"},y={class:"upload-container"},g={for:"file-upload",class:"custom-file-upload"},v={key:0,class:"file-info"},b={class:"file-name"};var h=n({__name:"interface",props:{folder:{type:String,default:""},collection_as_subfolder:{type:Boolean,default:!0},value:{type:String,default:null},collection:{type:String,default:null},primaryKey:{type:[String,Number],default:null}},emits:["input"],setup(e,{emit:n}){const h=e,x=n,w=t("https://la.storage.bunnycdn.com/mckp-live-storage"),k=t("840f968d-7235-4c28-8da439cda2f5-1a6f-4d68"),$=t("https://mockup-live-cdn.b-cdn.net"),_=t(""),S=t(!1),C=(()=>{if(h.primaryKey&&"+"!==h.primaryKey)return console.log("Using primaryKey from props:",h.primaryKey),h.primaryKey;try{const e=window.location.pathname.split("/"),n=e[e.length-1];if(n&&!isNaN(Number(n)))return console.log("Extracted ID from URL:",n),n}catch(e){console.error("Error extracting ID from URL:",e)}return null})();let D="";h.collection&&(D=h.collection,C?D=`${D}/${C}`:console.warn("Не удалось получить ID документа")),h.folder&&(D=h.folder+(D?`/${D}`:"")),console.log("Folder path:",D),console.log("Collection:",h.collection),console.log("Item ID:",C);const N=()=>S.value=!S.value,j=e=>{if(e)try{const n=e.split("/");_.value=n[n.length-1]}catch(e){console.error("Ошибка при извлечении имени файла:",e),_.value=""}else _.value=""};async function T(e){if(e&&e.length>0)try{const n=e[0],t=n.name.split("."),o=t.pop()||"",r=t.join("."),a=(e=>{const n="abvgdeejzijklmnoprstufhzcssyye";return e.split("").map((e=>{const t=e.toLowerCase(),o="абвгдеёжзийклмнопрстуфхцчшщъыьэюя".indexOf(t);return o>=0?e===t?n[o]:n[o].toUpperCase():e})).join("")})(String(r)).toLowerCase().replace(/[^\w\-]/g,"_").replace(/_{2,}/g,"_"),l=((new Date).getTime().toString(),`${a}-${Math.random().toString(36).substring(2,6)+Date.now().toString(36).substring(0,4)}.${o}`);_.value=l;const i=await async function(e,n){N();const t=D?`${w.value}/${D}/${e}`:`${w.value}/${e}`,o=k.value;try{const r=await fetch(t,{method:"PUT",body:n,headers:{"content-type":"application/octet-stream",AccessKey:o}});if(!r.ok)throw new Error(`HTTP error! Status: ${r.status}`);return N(),D?`${$.value}/${D}/${e}`:`${$.value}/${e}`}catch(e){throw N(),console.error("Error uploading to Bunny CDN:",e),e}}(l,n);x("input",i)}catch(e){console.error("Ошибка при обработке файла:",e)}}return o((()=>{h.value&&j(h.value)})),r((()=>{h.value&&j(h.value)})),(e,n)=>{const t=a("v-icon");return l(),i("div",f,[S.value?(l(),i("div",m,n[1]||(n[1]=[c("div",null,"Uploading file to Bunny CDN please wait...",-1)]))):s("v-if",!0),c("div",y,[c("label",g,[u(t,{name:"upload",left:""}),n[2]||(n[2]=d(" Upload file to Bunny CDN "))]),c("input",{id:"file-upload",type:"file",style:{display:"none"},onChange:n[0]||(n[0]=e=>T(e.target.files))},null,32),_.value?(l(),i("div",v,[u(t,{name:"description"}),c("span",b,p(_.value),1)])):s("v-if",!0)])])}}}),x=[],w=[];!function(e,n){if(e&&"undefined"!=typeof document){var t,o=!0===n.prepend?"prepend":"append",r=!0===n.singleTag,a="string"==typeof n.container?document.querySelector(n.container):document.getElementsByTagName("head")[0];if(r){var l=x.indexOf(a);-1===l&&(l=x.push(a)-1,w[l]={}),t=w[l]&&w[l][o]?w[l][o]:w[l][o]=i()}else t=i();65279===e.charCodeAt(0)&&(e=e.substring(1)),t.styleSheet?t.styleSheet.cssText+=e:t.appendChild(document.createTextNode(e))}function i(){var e=document.createElement("style");if(e.setAttribute("type","text/css"),n.attributes)for(var t=Object.keys(n.attributes),r=0;r<t.length;r++)e.setAttribute(t[r],n.attributes[t[r]]);var l="prepend"===o?"afterbegin":"beforeend";return a.insertAdjacentElement(l,e),e}}("\n#bunny-upload-directus {\n  width: 100%;\n  padding: 20px;\n  border: 1px solid var(--v-input-border-color-hover, var(--theme--form--field--input--border-color-hover));\n  border-radius: 10px;\n  position: relative;\n}\n#bunny-upload-directus .upload-container {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n}\n\n/* Стилизация кнопки загрузки */\n#bunny-upload-directus .custom-file-upload {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n  padding: 8px 12px;\n  background-color: var(--theme--primary);\n  color: var(--theme--primary-background);\n  border-radius: 4px;\n  cursor: pointer;\n  font-weight: 500;\n  transition: background-color 0.2s ease;\n  width: fit-content;\n}\n#bunny-upload-directus .custom-file-upload:hover {\n  background-color: var(--theme--primary-accent);\n}\n#bunny-upload-directus .file-info {\n  margin-top: 10px;\n  padding: 10px;\n  background: var(--theme--form--field--input--background);\n  border-radius: 5px;\n  border: 1px solid var(--v-input-border-color-hover, var(--theme--form--field--input--border-color-hover));\n  display: flex;\n  align-items: center;\n  gap: 10px;\n}\n#bunny-upload-directus .file-name {\n  font-weight: 500;\n  word-break: break-all;\n}\n#bunny-upload-directus .loader {\n  background: var(--theme--form--field--input--background);\n  text-align: center;\n  position: absolute;\n  border-radius: 10px;\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  color: var(--v-input-color);\n}\n",{});var k=e({id:"bunny-upload-files",name:"Bunny CDN Upload Files",icon:"file_present",description:"Interface to receive files and send to Bunny!",group:"relational",component:((e,n)=>{const t=e.__vccOpts||e;for(const[e,o]of n)t[e]=o;return t})(h,[["__file","interface.vue"]]),relational:!0,options:[{field:"folder",name:"Folder",meta:{width:"full",interface:"input",options:{placeholder:"folder (without start/end slash)"}}},{field:"collection_as_subfolder",name:"Include collection name as subfolder",type:"boolean",meta:{width:"half",interface:"boolean"},schema:{default_value:!0}}],types:["string"]});export{k as default};

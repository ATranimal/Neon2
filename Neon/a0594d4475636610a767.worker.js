!function(e){var t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="/Neon/Neon/",r(r.s=0)}([function(e,t){importScripts("./verovio-toolkit.js");var r=new verovio.toolkit;r.setOptions({format:"mei",noFooter:1,noHeader:1,pageMarginLeft:0,pageMarginTop:0,font:"Bravura",useFacsimile:!0,createDefaultSyl:!0,createDefaultSylBBox:!0}),onmessage=function(e){let t=e.data,n={id:t.id};switch(t.action){case"renderData":n.svg=r.renderData(t.mei,{});break;case"getElementAttr":n.attributes=r.getElementAttr(t.elementId);break;case"edit":n.result=r.edit(t.editorAction);break;case"getMEI":n.mei=r.getMEI(0,!0);break;case"editInfo":n.info=r.editInfo();break;case"renderToSVG":n.svg=r.renderToSVG(1)}postMessage(n)}}]);
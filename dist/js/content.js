!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=33)}({33:function(e,t,n){"use strict";window.addEventListener("message",function(e){var t={refTitle:document.title,refDomain:document.URL},n=e.data;if("getAccount"===n.key&&chrome.runtime.sendMessage({key:"getAccount",msg:{}}),"sendTransferTx"===n.key&&(alert("ContentScript: sendInvokeTx"),chrome.runtime.sendMessage({key:"sendTransferTx",msg:{refInfo:t,from:n.msg.from,to:n.msg.to,asset:n.msg.asset,value:n.msg.value}})),"sendInvokeTx"===n.key){alert("ContentScript: sendInvokeTx");var r=n.msg.scriptHash,o=n.msg.invokeParam;chrome.runtime.sendMessage({key:"sendInvokeTx",msg:{refInfo:t,scriptHash:r,invokeParam:o}})}console.log(n)},!1),window.onload=function(){!function(e){e=e||"js/inject.js";var t=document.createElement("script");t.setAttribute("type","text/javascript"),t.src=chrome.extension.getURL(e),t.onload=function(){},document.head.appendChild(t)}(),window.postMessage({test:"这里是contentScript.js"},"*")}}});
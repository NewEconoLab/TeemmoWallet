
// 向页面注入JS
function injectCustomJs(jsPath?)
{
    jsPath = jsPath || 'js/inject.js';
    var temp = document.createElement('script');
    temp.setAttribute('type', 'text/javascript');
    // 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
    temp.src = chrome.extension.getURL(jsPath);
    temp.onload = function()
    {
        // 放在页面不好看，执行完后移除掉
        // this.parentNode.removeChild(this);
    };
    document.head.appendChild(temp);
}

function sendMsgTest() {
    window.postMessage({"test": '这里是contentScript.js'}, '*');
}

// 接收向页面注入的JS
window.addEventListener("message", function(e)
{
    sendMesageToBackground(e);
    // var icon = "";
    // var links = document.getElementsByTagName("link");
    // for (const link of links) {
    //     if(link.type.includes('image')){         
    //         getBase64ByUrl(link.href)
    //         .then(result=>{
    //             console.log(result);                
    //         })
    //     }
    // }
    // //获取Dapp页面信息
    // var title = document.title;
    // var domain = document.URL;
    // var message = {title,domain}
    // var request = e.data;
    
    // if(request.command)
    // {
    //     request['message']=message;
    //     chrome.runtime.sendMessage(request);
    // }
    // if(request.eventInit)
    // {
    //     chrome.runtime.sendMessage(request);
    // }

}, false);

const sendMesageToBackground = async(e)=>{
    var icon = "";
    var links = document.getElementsByTagName("link");
    for (const link of links) {
        if(link.type.includes('image')){         
            icon = await getBase64ByUrl(link.href);
        }
    }
    //获取Dapp页面信息
    var title = document.title;
    var domain = document.URL;
    var message = {title,domain,icon}
    var request = e.data;
    
    if(request.command)
    {
        request['message']=message;
        chrome.runtime.sendMessage(request);
    }
    if(request.eventInit)
    {
        chrome.runtime.sendMessage(request);
    }
}

/**
 * 发送返回值
 */
chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => 
    {
        console.log(request);
        
        if(request.return)
            window.postMessage(request,'*');
        if(request.EventName)
        {
            window.postMessage(request,'*');
        }
    }
);

chrome.extension.onRequest.addListener((request, sender, sendResponse)=>{
    console.log(request);
})

enum WalletEventsName
{
    READY="Teemmo.NEO.READY",
    CONNECTED="Teemmo.NEO.CONNECTED",
    DISCONNECTED="Teemmo.NEO.DISCONNECTED",
    NETWORK_CHANGED="Teemmo.NEO.NETWORK_CHANGED",
    ACCOUNT_CHANGED="Teemmo.NEO.ACCOUNT_CHANGED"
}


window.addEventListener(WalletEventsName.CONNECTED,(event)=>{
    console.log("这里是Content 这里竟然监听到了" + WalletEventsName.CONNECTED);
    console.log("监听到的数据是 "+event);
    
})

window.onload=()=>{
    injectCustomJs()
    sendMsgTest()
}


function getBase64Image(img) {  
    var canvas = document.createElement("canvas");  
    canvas.width = img.width;  
    canvas.height = img.height;  
    var ctx = canvas.getContext("2d");  
    ctx.drawImage(img, 0, 0, img.width, img.height);  
    var ext = img.src.substring(img.src.lastIndexOf(".")+1).toLowerCase();  
    var dataURL = canvas.toDataURL("image/"+ext);  
    return dataURL;  
}

function getBase64ByUrl(url:string) {
    return new Promise<string>((r,j)=>{
        var image = new Image();  
        image.src = url;  
        image.onload = ()=>{  
        let base64 = getBase64Image(image);  
        r(base64);
        }
    })
}

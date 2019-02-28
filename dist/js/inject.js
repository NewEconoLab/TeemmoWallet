const BLOCKCHAIN = 'NEO';
const VERSION = 'v1';
var ArgumentDataType;
(function (ArgumentDataType) {
    ArgumentDataType["STRING"] = "String";
    ArgumentDataType["BOOLEAN"] = "Boolean";
    ArgumentDataType["HASH160"] = "Hash160";
    ArgumentDataType["HASH256"] = "Hash256";
    ArgumentDataType["INTEGER"] = "Integer";
    ArgumentDataType["BYTEARRAY"] = "ByteArray";
    ArgumentDataType["ARRAY"] = "Array";
    ArgumentDataType["ADDRESS"] = "Address";
    ArgumentDataType["HOOKTXID"] = "Hook_Txid";
})(ArgumentDataType || (ArgumentDataType = {}));
var Command;
(function (Command) {
    Command["isReady"] = "isReady";
    Command["getProvider"] = "getProvider";
    Command["getNetworks"] = "getNetworks";
    Command["getAccount"] = "getAccount";
    Command["getPublicKey"] = "getPublicKey";
    Command["getBalance"] = "getBalance";
    Command["getStorage"] = "getStorage";
    Command["invokeRead"] = "invokeRead";
    Command["send"] = "send";
    Command["invoke"] = "invoke";
    Command["invokeGroup"] = "invokeGroup";
    Command["event"] = "event";
    Command["disconnect"] = "disconnect";
})(Command || (Command = {}));
var EventName;
(function (EventName) {
    EventName["READY"] = "READY";
    EventName["ACCOUNT_CHANGED"] = "ACCOUNT_CHANGED";
    EventName["CONNECTED"] = "CONNECTED";
    EventName["DISCONNECTED"] = "DISCONNECTED";
    EventName["NETWORK_CHANGED"] = "NETWORK_CHANGED";
})(EventName || (EventName = {}));
/**
 * 发送请求
 * @param command 指令名称
 * @param data
 */
function sendMessage(command, params) {
    return new Promise((resolve, reject) => {
        const request = params ? { command, params } : { command };
        window.postMessage(request, "*");
        window.addEventListener("message", e => {
            const response = e.data;
            console.log(response);
            if (response.return == command) // 判断return参数是否有值 并且 判断返回名称是否对应如果是则抛出异常或数据
             {
                if (response.error) {
                    reject(response.error);
                }
                else {
                    resolve(response.data);
                }
            }
        });
    });
}
var Teemmo;
(function (Teemmo) {
    class NEO {
        /**
         * 获得当前网络信息
         * @returns {GetNetworksOutput} 网络信息
         */
        static getNetworks() {
            return sendMessage(Command.getNetworks);
        }
        /**
         * 获得当前账户信息
         * @returns {AccountOutput} 账户信息
         */
        static getAccount() {
            return sendMessage(Command.getAccount);
        }
        /**
         * 查询余额
         * @param {GetBalanceArgs} params 查询余额参数
         */
        static getBalance(params) {
            return sendMessage(Command.getBalance, params);
        }
        /**
         * 查询存储区数据
         * @param {GetStorageArgs} params 查询存储区参数
         */
        static getStorage(params) {
            return sendMessage(Command.getStorage, params);
        }
        /**
         * 转账方法
         * @param {SendArgs} params 转账参数
         */
        static send(params) {
            return sendMessage(Command.send, params);
        }
        /**
         * invoke交易发送
         * @param {InvokeArgs} params invoke 参数
         * @returns {InvokeOutput} invoke执行结果返回
         */
        static invoke(params) {
            return sendMessage(Command.invoke, params);
        }
        static invokeGroup(params) {
            return sendMessage(Command.invoke, params);
        }
    }
    NEO.getProvider = () => {
        return sendMessage(Command.getProvider);
    };
    Teemmo.NEO = NEO;
})(Teemmo || (Teemmo = {}));
//# sourceMappingURL=inject.js.map
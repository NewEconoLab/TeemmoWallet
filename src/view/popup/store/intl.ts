import { observable, action } from "mobx";
import { en_US, zh_CN } from "./language";

class Intl
{
    @observable public currentLang:Language;

    @observable public message:{
        button:Language_Button;
        toast:Language_Toast;
        welcome:Language_Welcome;
        walletnew:any;
        login:Language_Login;
        mywallet:Language_MyWallet;
        history:Language_History;
        exchange:Language_exchange;
        transfer:Language_Transfer;
        assets:Language_Assets;
        notify: Language_Notify;
    };

    @action public initLanguage=()=>{
        const lang = localStorage.getItem('language');
        if(lang)
        {
            this.currentLang = lang=='zh'?Language.CN:Language.EN;            
        }
        else
        {
            this.currentLang = Language.CN;
        }
        this.changeLanguage(this.currentLang);
    }

    @action public changeLanguage=(language:Language)=>
    {
        if(language==Language.CN)
        {
            this.currentLang = Language.CN;
            this.message = zh_CN;
            console.log(language);
            
            localStorage.setItem('language', 'zh');
        }else{
            this.currentLang = Language.EN;
            this.message = en_US;
            console.log(language);
            localStorage.setItem('language', 'en');
        }
    }
}

export interface Language_Button
{
    confirm:string,
    cancel:string,
    refuse: string;
}

export interface Language_Toast
{
    successfully:string,
    failed:string,
    copySuccess:string
}

export interface Language_Welcome{start:string,welcomeToUse:string,describe:string}

export interface Language_Login{welcome:string,goCreate:string,placeholder1:string,button:string,error:string}

export interface Language_Notify
{
    message1:string,
    message2:string,
    from:string,
    dappNote:string,
    tranData:string,
    Info:string,
    tranInfo:string,
    method:string,
    scriptHash:string,
    toAddress:string,
    AssetsID:string
}

export interface Language_MyWallet{
    records: string;
    assets: string;
    mainnet: string;
    testnet: string;
    currentnet: string;
    cgasExchange: string;
    explorer: string;
}

export interface Language_History{
    wait: string;
    tranHistory: string;
    contract: string;
    waitConfirm: string;
    failed: string;
    hide: string;
    scriptHash: string;
    note: string;
    amount: string;
    fee: string;
    presonalTransfer: string;
    from:string;
    to:string;
    all: string;
}

export interface Language_exchange{
    gasToCgas: string;
    cgasToGas: string;
    operationType: string;
    amount: string;
    payfee: string;
    noBalance: string;
}

export interface Language_Transfer{    
    sendTo: string;
    amount: string;
    payfee: string;
    title: string;
    title1: string;
    title2: string;
    title3: string;
    title4: string;
    next:string;
    error1:string;
    error2:string;
}

export interface Language_Assets{
    receiving: string;
    transfer: string;
    assetlist: string;
    copy: string;
}

export enum Language
{
    CN='中',
    EN='En'
}

export default new Intl();
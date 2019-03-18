import * as React from 'react';
import './index.less';
import Button from '../../../components/Button';
import { RouteComponentProps } from 'react-router-dom';
import Label from '../../../components/Label';
import Select, { IOption } from '../../../components/Select';
import Input from '../../../components/Input';
import Chooser from '../../../components/Chooser';
import { AccountInfo, NepAccount } from '../../../../common/entity';
import { neotools } from '../../utils/neotools';
import AddrList from './addrlist';
import common from '../../../popup/store/common';
import { Storage_local } from '../../../../common/util';
import { bg } from '../../../popup/utils/storagetools';

interface AppProps {
    goHome:(account:{address:string,label:string})=>void;
}

interface AppState {
    password:string,
    passwordError:boolean,
    confirm:string,
    options:IOption[],
    currentOption:IOption,
    currentAccount:NepAccount,
}

export default class Login extends React.Component<AppProps,AppState> {
    constructor(props: AppProps, state: AppState) {
        super(props, state);
    }
    public options=[]
    public state:AppState = {
        password:"",
        passwordError:false,
        confirm:"",
        options:[],
        currentOption:{id:"",name:""},
        currentAccount:null
    }

    public componentDidMount() 
    {
        const arr = Storage_local.getAccount();
        if(arr && arr.length){            
            let options = arr.map((acc,index)=>{
                return {id:acc.address,name:(acc.walletName?acc.walletName:["我的钱包",(index+1)].join(' '))}as IOption;
            });
            
            this.setState({
                options,       
            })
            this.getcurrentOption(options[0]);
        }
    }

    public getcurrentOption=(event: IOption)=>{        
        Storage_local.getAccount().forEach(currentAccount=>{
            if(currentAccount.address===event.id){
                this.setState({
                    currentAccount
                })
            }
        })
        this.setState({
            currentOption:event
        })
    }

    /**
     * 输入密码后触发的改变方法
     * @param {string} event change方法返回的字符对象
     */
    public passwordChange=(event:string)=>
    {
        this.setState({password:event})
    }

    public chooserAddr=(event:IOption)=>
    {
        this.setState({
            currentOption:event
        });
    }

    /**
     * 输入密码后触发的改变方法
     * @param {string} event change方法返回的字符对象
     */
    public nep2Change=(event:string)=>
    {
        this.setState({password:event})
    }

    public toCreateWallet=()=>
    {
    }

    public loginWallet=()=>{
        bg.AccountManager.deciphering(this.state.password,this.state.currentAccount)
        .then(account =>{
            // bg['storage'].account = account;
            this.props.goHome(account)
        })
        .catch(error=>{
            console.log(error);
            
            this.setState({
                passwordError:true
            })
        })
    }
    

    render() {
        return (
            <div className="loginContainer">
                <div className="titleBackground">
                    <div className="title">欢迎回来</div>
                </div>
                <div className="content">
                    <div className="box">
                        <div className="box-content">
                            <div className="form-title">
                                <AddrList 
                                    options={this.state.options} 
                                    onCallback={this.getcurrentOption} 
                                    title={this.state.currentOption.name}
                                    message={this.state.currentOption.id}
                                />
                            </div>
                            <div className="login-password">
                                <Input type='password' placeholder='输入密码' 
                                    value={this.state.password} 
                                    onChange={this.passwordChange}
                                    error={this.state.passwordError}
                                    message={this.state.passwordError?"密码错误，请重试":""}
                                />
                            </div>
                            <div className="login-button">
                                <Button type='primary' size='long' text="登陆" onClick={this.loginWallet} />
                            </div>
                        </div>
                    </div>
                    <div className="href" onClick={this.toCreateWallet}>忘记密码，请重新导入钱包。</div>
                </div>
            </div>
        )
    }
}
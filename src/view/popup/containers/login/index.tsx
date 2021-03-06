import * as React from 'react';
import './index.less';
import Button from '../../../components/Button';
import { RouteComponentProps } from 'react-router-dom';
import { IOption } from '../../../components/Select';
import Input from '../../../components/Input';
import { bg, Storage_local} from '../../utils/storagetools';
import { NepAccount } from '../../../../common/entity';
import AddrList from './addrlist';
import { observer } from 'mobx-react';
import common from '../../store/common';
import intl from '../../store/intl';

interface AppProps extends RouteComponentProps {
    develop:boolean;
}

interface AppState {
    password:string,
    passwordError:boolean,
    confirm:string,
    options:IOption[],
    currentOption:IOption,
    currentAccount:NepAccount,
}

@observer
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
        if(bg.AccountManager.getCurrentAccount()){            
            this.props.history.push("/mywallet")
        }else if(common.accountList.length){
            this.props.history.push("/login")
        }else{
            this.props.history.push('/welcome')
        }
        if(common.accountList.length){            
            let options = common.accountList.map((acc,index)=>{
                return {id:acc.address,name:(acc.walletName?acc.walletName:["我的钱包",(index+1)].join(' '))}as IOption;
            });
            
            this.setState({
                options,       
            })
            const curaddr = localStorage.getItem('current-addr');            
            if(curaddr)
            {
                const index = options.findIndex(opt=>opt.id==curaddr);
                this.getcurrentOption(options[index>0?index:0])
            }
            else
            {                
                this.getcurrentOption(options[0]);
            }
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
        this.setState(
        {
            passwordError:false,
            password:event
        })
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
        this.props.history.push('/walletnew')
    }

    public loginWallet=()=>{        
        bg.AccountManager.deciphering(this.state.password,this.state.currentAccount)
        .then(account =>{
            // bg['storage'].account = account;
            this.props.history.push('/mywallet')
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
                    <div className="title">{intl.message.login.welcome}</div>
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
                                <Input type='password' placeholder={intl.message.login.placeholder1} 
                                    value={this.state.password} 
                                    onChange={this.passwordChange}
                                    error={this.state.passwordError}
                                    message={this.state.passwordError&&intl.message.login.error}
                                    onEnter={this.loginWallet}
                                />
                            </div>
                            <div className="login-button">
                                <Button type='primary' size='long' text={intl.message.login.button} onClick={this.loginWallet} />
                            </div>
                        </div>
                    </div>
                    <div className="href" onClick={this.toCreateWallet}>{intl.message.login.goCreate}</div>
                </div>
            </div>
        )
    }
}
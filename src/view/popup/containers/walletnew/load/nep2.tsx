// 输入框组件
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import Input from '../../../../components/Input';
import { bg } from '../../../utils/storagetools';
import intl from '../../../store/intl';

interface IState{
    nep2:string;
    password:string,
    filename:string,    
    nep2_error:boolean,
    password_error:boolean
}

interface IPorps{
    goMyWallet:()=>void;
}

// @observer
export default class Nep2Import extends React.Component<IPorps, IState> {
	constructor(props: any) {
		super(props);
    }
    public reader = new FileReader();
    public componentDidMount() 
    {
        // Example of how to send a message to eventPage.ts.
        this.reader.onload=()=>{            
            this.wallet.fromJsonStr(this.reader.result as string);

        }
    }
    
    public wallet: ThinNeo.nep6wallet = new ThinNeo.nep6wallet();

    public state:IState={
        nep2:"",
        password:"",
        filename:"",    
        nep2_error:false,
        password_error:false
    }
    
    public passwordChange=(event)=>{
        this.setState({
            password:event,
            password_error:false
        })
    }
    
    public nep2Change=(event)=>{
        this.setState({
            nep2:event,
            nep2_error:false
        })
    }

    goMyWallet =()=> {
        if(this.props.goMyWallet)
            this.props.goMyWallet();
    }
    /**
     * 导入NEP6钱包
     */
    loadWallet =()=>
    {
        if(this.state.nep2)
        {            
            bg.AccountManager.nep2Load(this.state.nep2,this.state.password)
            .then(accounts =>{
                this.goMyWallet();
            })
            .catch(error =>{
                this.setState({
                    password_error:true
                })      
            })
        }else{
            this.setState({nep2_error:true})
        }
    }

	public render() {
        return(                
            <div className="form-content">                            
                <div className="input">
                    <Input type="text" placeholder={intl.message.walletnew.nep2.placeholder1} 
                        value={this.state.nep2} 
                        onChange={this.nep2Change}
                        error={this.state.nep2_error}
                        message={this.state.nep2_error?intl.message.walletnew.nep2.error1:""}
                    />
                </div>
                <div className="input">
                    <Input type="password" placeholder={intl.message.walletnew.nep2.placeholder2} 
                        value={this.state.password} 
                        onChange={this.passwordChange}
                        error={this.state.password_error}
                        message={this.state.password_error?intl.message.walletnew.nep2.error2:""}
                        onEnter={this.loadWallet}
                    />
                </div>
            </div>
        );
	}
}
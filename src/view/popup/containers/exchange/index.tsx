/**
 * 按钮组件
 */
import * as React from 'react';
// import { observer } from 'mobx-react';
import './index.less';
import Modal from '../../../components/Modal';
import Select, { IOption } from '../../../components/Select';
import Input from '../../../components/Input';
import Checkbox from '../../../components/Checkbox';
import Button from '../../../components/Button';
import common from '../../store/common';
import { bg } from '../../utils/storagetools';
import { asNumber } from '../../utils/numberTool';
import { observer } from 'mobx-react';
import Toast from '../../../components/Toast';
import historyStore from '../history/store/history.store';
import intl from '../../store/intl';

interface IProps
{
	show:boolean
	onHide?:()=>void;
}

interface IState
{
	show:boolean,
	amount:string,
	netfee:boolean,
	inputError:boolean,
	errorMessage:string,
	currentOption:IOption
}

@observer
export default class Exchange extends React.Component<IProps, IState> 
{
	constructor(props: IProps)
	{
		super(props);		
	}
	public state = {
		show:false,
		amount:'',
		netfee:false,
		inputError:false,
		errorMessage:'',
		currentOption:{id:'cgasexchange',name:intl.message.exchange.gasToCgas}
	}
	public options:IOption[]=[
		{id:'cgasexchange',name:intl.message.exchange.gasToCgas},
		{id:'gasexchange',name:intl.message.exchange.cgasToGas}
	]
	// 监控输入内容
	public onChange = (event) =>
	{
		const amount = asNumber(event,8);
		if(this.state.currentOption.id=='cgasexchange')
		{
			if(Neo.Fixed8.parse(amount).compareTo(Neo.Fixed8.fromNumber(common.balances.GAS))>0)
			{
				this.setState({
					inputError:true,
					errorMessage:intl.message.exchange.noBalance
				})
			}else{
				this.setState({inputError:false,errorMessage:""});
			}
		}
		else
		{
			if(Neo.Fixed8.parse(amount).compareTo(Neo.Fixed8.fromNumber(common.balances.CGAS))>0)
			{
				this.setState({
					inputError:true,
					errorMessage:intl.message.exchange.noBalance
				})
			}
			else
			{
				this.setState({inputError:false,errorMessage:""});
			}
		}
		this.setState({amount});
	}

	public onSelect=(event:IOption)=>
	{
		this.setState({currentOption:event})
	}

	public onCheck=(netfee:boolean)=>{		
		this.setState({netfee})
	}

	public onHide=()=>{
		this.setState({
			show:false,
			amount:'',
			netfee:false,
			inputError:false,
			errorMessage:'',
			currentOption:{id:'cgasexchange',name:intl.message.exchange.gasToCgas}
		})
		this.props.onHide?this.props.onHide():null;
	}

	public send=()=>{
		if(this.state.currentOption.id=="cgasexchange")
		{
			bg.exchangeGas(parseFloat(this.state.amount),this.state.netfee?0.001:0)
			.then(result=>{
				Toast(intl.message.toast.successfully)
				console.log(result);
				historyStore.initHistoryList()
				this.props.onHide();			
			})
			.catch(error=>{
				console.log(error);
				Toast(intl.message.toast.failed,"error")
			})
		}
		else
		{
			bg.exchangeCgas(parseFloat(this.state.amount),this.state.netfee?0.001:0)
			.then(result=>{
				Toast(intl.message.toast.successfully)
				historyStore.initHistoryList()
				console.log(result);			
				this.props.onHide();	
			})
			.catch(error=>{
				console.log(error);
				Toast(intl.message.toast.failed,"error")
			})
		}
	}

	public render()
	{
		const options:IOption[]=[
			{id:'cgasexchange',name:intl.message.exchange.gasToCgas},
			{id:'gasexchange',name:intl.message.exchange.cgasToGas}
		]
		return (
			<Modal title={intl.message.mywallet.cgasExchange} show={this.props.show}>
				<div className="line">
					<Select currentOption={options.find(opt=>opt.id==this.state.currentOption.id)} onCallback={this.onSelect} options={options} text={intl.message.exchange.operationType} size="big" />
				</div>
				<div className="line">
					<Input placeholder={intl.message.exchange.amount} value={this.state.amount+""} onChange={this.onChange} type="text" error={this.state.inputError} message={this.state.errorMessage} />		
				</div>		
				<div className="line-checkbox">
					<Checkbox text={this.state.currentOption.id=='cgasexchange'?intl.message.transfer.payfee:intl.message.exchange.payfee} onClick={this.onCheck} />
				</div>
				<div className="btn-list">
					<div className="cancel">
						<Button type="warn" text={intl.message.button.cancel} onClick={this.onHide} />
					</div>
					<div className="confrim">
						<Button type="primary" text={intl.message.button.confirm} onClick={this.send} />
					</div>
				</div>
			</Modal>
		);
	}
}
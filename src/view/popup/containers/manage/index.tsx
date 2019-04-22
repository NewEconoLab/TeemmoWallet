/**
 * 代币管理
 */
import * as React from 'react';
import './index.less';
import Button from '../../../components/Button';
import { observer } from 'mobx-react';
import manageStore from './store/manage.store';
interface IProps
{
  lableChange: (table: string) => void
}

interface IState
{
  checkedAssets:{[asset:string]:boolean};
  searchList:AssetInfo[]
  checkedList:{name:string,amount:string,value:string,check:boolean}[],
  inputName:string
}

@observer
export default class ManageAsset extends React.Component<IProps, IState>
{
  constructor(props: any)
  {
    super(props);
    manageStore.initAssetList()
  }
  public state:IState = {
    checkedAssets:{},
    searchList:[],
    checkedList: [],
    inputName: '',// 搜索代币
  }
  public checkList = [
    {
      name: "NEO",
      amount: "11111",
      value: 'neo',
      check: false
    },
    {
      name: "NEO",
      amount: "2222",
      value: 'neo2',
      check: false
    },
    {
      name: "NEO",
      amount: "111333311",
      value: 'neo3',
      check: false
    }, {
      name: "NEO",
      amount: "11144411",
      value: 'neo4',
      check: false
    },
    {
      name: "NEO",
      amount: "5555",
      value: 'neo5',
      check: false
    }
  ]
  // 筛选状态
  public chooseStatus = (event: React.ChangeEvent<HTMLInputElement>) =>
  {
    const item: string = event.target.value;
    const checkedList = this.state.checkedList;
    const index = this.state.checkedList.indexOf(item as never);
    if (index > -1)
    {
      console.log("存在过，删除");
      checkedList.splice(index, 1)
    } else
    {
      console.log("不存在，添加");
      // checkedList.push(item);
    }
    this.setState({
      checkedList
    })
    console.log(this.state.checkedList)
  }
  public onChangeInput = (e: any) =>
  {
    
    this.setState({
      inputName: e.target.value,
    })
    const list = manageStore.queryAssetInfo(e.target.value);
    this.setState({
      searchList:list
    })
  }
  public onClearInput = () =>
  {
    this.setState({
      inputName: ''
    })
  }
  // 返回上一页
  public goBack = () =>
  {
    if (this.props.lableChange)
    {
      this.props.lableChange('history');
    }
  }
  public onSaveManage = () =>
  {
    if (this.props.lableChange)
    {
      this.props.lableChange('history');
    }
  }
  public onCancel = () =>
  {
    this.setState({
      checkedAssets:{},
      inputName: ''})
  }
  public onAddBalance = () =>
  {
    for (const key in this.state.checkedAssets) {
      if (this.state.checkedAssets.hasOwnProperty(key)) {
        const value = this.state.checkedAssets[key];
        if(value)
        {
          manageStore.addAssetInfo(key);
        }
      }
    }
    manageStore.initAssetList();
  }
  public onSelect = (assetid:string)=>{
    const checkedAssets=this.state.checkedAssets
    checkedAssets[assetid]=!checkedAssets[assetid];
    this.setState({
      checkedAssets
    },()=>{console.log(this.state.checkedAssets)})
  }
  public render()
  {
    return (
      <div className="manage-wrapper">
        <p className="tips-text">选择要显示在主页的token类型</p>
        <div className="search-asset">
          <input type="text" placeholder="请输入代币名称或哈希进行搜索" value={this.state.inputName} onChange={this.onChangeInput} />
          <img className="search-icon" src={require('../../../image/search.png')} alt="" />
          {
            this.state.inputName !== '' && (
              <>
                <img className="clear-search" src={require("../../../image/close3.png")} alt="" onClick={this.onClearInput} />
                <div className="search-content">
                  <div className="search-list">
                  {
                    this.state.searchList.map(asset=>{
                      console.log(this.state.checkedAssets[asset.assetid])
                      return (                        
                      // <div className="small-box active">
                      //   <div className="small-name">NEOVERSION（我是全称我...</div>
                      //   <div className="small-txid">0xc5...7c9b</div>
                      // </div>
                        <div className={`small-box ${this.state.checkedAssets[asset.assetid]?'active':''}`} onClick={this.onSelect.bind(this,asset.assetid)}>
                          <div className="small-name">{asset.symbol}{asset.type=='nep5'?`（${asset.name}）`:''}</div>
                          <div className="small-txid">{asset.assetid.substr(0,4)+"..."+asset.assetid.substr(asset.assetid.length-3,4)}</div>
                        </div>
                      )
                    }) 
                  }
                  </div>
                  <div className="search-btn">
                    <Button text="取消" type="warn" onClick={this.onCancel} />
                    <Button text="添加" type="primary" onClick={this.onAddBalance} />
                  </div>
                </div>
              </>
            )
          }

        </div>
        {/* <div className="nodata-wrapper">
          <img className="nodata-img" src={require("../../../image/quesheng.png")} alt=""/>
          <p>没有搜索结果哦</p>
        </div> */}
        {
          this.state.inputName === '' && (
            <>
              <div className="manage-list">
                {
                  manageStore.myAssets.map((k, v) =>
                  {
                    // const index = this.state.checkedList.indexOf(k as never);
                    return (
                      <div className="asset-wrapper">
                        <label>
                          <input type="checkbox" name='assets' onChange={this.chooseStatus} />
                          <img className="checked-img" src={true ? require("../../../image/tick.png") : require("../../../image/unchecked.png")} alt="" />
                        </label>
                        <span>{k.symbol}</span>
                        <div className="asset-amount">{k.type}</div>
                      </div>
                    )
                  })
                }
              </div>
              <div className="manage-footer">
                <Button text="取消" type="warn" onClick={this.goBack} />
                <Button text="保存" type="primary" onClick={this.onSaveManage} />
              </div>
            </>
          )
        }

      </div>
    );
  }
}
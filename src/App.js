import React from 'react';
import './App.css';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            totalBTC : 10, //static
            totalUSDT : 1000, //static
            oneBTC : 5730,
            oneUSDT : 0.994837,
            market : "BTC",
            amount:0,
            buyOrSell : 'buy',
            tagetCrypto : 'BTC',
            inputValue:0,
            trading:'none',
            BTCFee:0.001,
            USDTFee:1,
            commission:0
        }
    }

   change = (event)=>{
       this.setState({market: event.target.value,inputValue:0,amount:0,trading:'none',commission:0});
    };

    trade = (e)=>{
        let id = e.target.id;

        if((id==='buyUSDT' || id==='selUSDT') && this.state.market==='USDT'){
            alert("Select market other than USDT");
        }
        else if((id==='buyBTC' || id==='selBTC') && this.state.market==='BTC'){
            alert("Select market other than BTC");
        }
        else{
            let buyOrSell;
            if(id==='buyUSDT'||'buyBTC'){
                buyOrSell = 'buy'
            }else{
                buyOrSell='sell'
            }
            this.setState({
                buyOrSell: buyOrSell,
                tagetCrypto: id.substring(3,id.length),
                inputValue:0,amount:0,commission:0

            })
         }
    };

    inputChange = (event)=>{
        this.setState({inputValue:event.target.value})
        if(this.state.buyOrSell==='buy'){
            if(this.state.market==='USDT' && this.state.tagetCrypto==='BTC'){
                let amount = (event.target.value /this.state.oneBTC)*this.state.oneUSDT
                this.setState({amount:amount})
            }

            if(this.state.market==='BTC' && this.state.tagetCrypto==='USDT'){
                let amount = (event.target.value /this.state.oneUSDT)*this.state.oneBTC
                this.setState({amount:amount})
            }

        }else{
            if(this.state.market==='USDT' && this.state.tagetCrypto==='BTC'){
                let amount = (event.target.value /this.state.oneUSDT)*this.state.oneBTC
                this.setState({amount:amount})
            }

            if(this.state.market==='BTC' && this.state.tagetCrypto==='USDT'){
                let amount = (event.target.value *this.state.oneUSDT)/this.state.oneBTC
                this.setState({amount:amount})
            }

        }

    };
    
    tradeButton = ()=>{
        if(this.state.inputValue===0){
            alert("Enter some value")
            return;
        }
        if(this.state.tagetCrypto===this.state.market){
            alert("Change the market or target token")
            return;
        }
        let fee = null;

        if(this.state.tagetCrypto==='BTC'){
            fee = this.state.buyOrSell==='buy'?this.state.BTCFee*this.state.amount:this.state.BTCFee*this.state.inputValue
        }else{
            fee = this.state.buyOrSell==='buy'?this.state.inputValue*this.state.BTCFee : this.state.BTCFee*this.state.amount
        }
        this.setState({
            commission:fee*this.state.oneBTC.toFixed(5)
        });
        let BuyerUserID=null,SellerUserID=null,BuyerFee=null,SellerFee=null,BuyOrderID=null,SellOrderID=null;
        if(this.state.buyOrSell==='buy'){
            BuyerUserID = 1234; //static for now
            BuyerFee = (fee*this.state.oneBTC).toFixed(5);
            BuyOrderID = 123; // static for now
        }else{
            SellerUserID = 1111; //static for now
            SellerFee = fee*this.state.oneBTC.toFixed(5);
            SellOrderID = 123;// static for now
        }

        //////GraphQL mutation query

        let query = `mutation trade($TradeID: Int!,$Timestamp: Int!,$BuyOrderID: Int,
                            $SellOrderID:Int,$Market:String!,$BuyerUserID:Int,$SellerUserID:Int,$BuyerFee:Float,$SellerFee:Float) {
                    trade(TradeID: $TradeID,Timestamp:$Timestamp,BuyOrderID: $BuyOrderID,
                        SellOrderID:$SellOrderID,$Market:Market,$BuyerUserID:BuyerUserID,$SellerUserID:SellerUserID,$BuyerFee:BuyerFee,$SellerFee:SellerFee) {
                    message
          }
        }`;

        let tradeId = 123;
        let timestamp = 1234;
        let market = this.state.market;


        ///////////////API call
        fetch("/trade",{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query,
                variables: {
                    tradeId, timestamp,BuyOrderID,SellOrderID,market,BuyerUserID,SellerUserID,BuyerFee,SellerFee
                },
            })
        }).then((res)=>{

        });
       alert("API called");
    };
    render() {
        return (
            <div>
                <nav className="navbar navbar-light bg-light justify-content-between">
                    <a className="navbar-brand">Trading</a>
                    <form className="form-inline">
                        <h6>BTC :{this.state.totalBTC} </h6> &nbsp;
                        <h6>USDT :{this.state.totalUSDT} </h6>&nbsp;
                    </form>
                </nav>
                <div className="container">

                    <div className="row" style={{marginTop: 30}}>
                        <div className="col-sm" style={{}}>
                            <h4>Select Market</h4>
                            <select className="custom-select" onChange={this.change} value={this.state.value}>
                                <option value="BTC" selected>BTC</option>
                                <option value="USDT">USDT</option>
                            </select>
                            <table className="table">
                                <thead>
                                <tr>
                                    <th scope="col">Token</th>
                                    <th scope="col">Current Price</th>
                                    <th scope="col">Buy/Sell</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>BTC</td>
                                    <td>$5730.00</td>
                                    <td>
                                        <button id="buyBTC" type="button" onClick={this.trade} className="btn btn-primary btn-sm">Buy</button>
                                        &nbsp;
                                        <button id="selBTC" type="button"  onClick={this.trade} className="btn btn-secondary  btn-sm">Sell</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>USDT</td>
                                    <td>$0.994837</td>
                                    <td>
                                        <button id="buyUSDT" type="button"  onClick={this.trade} className="btn btn-primary btn-sm ">Buy</button>
                                        &nbsp;
                                        <button id="selUSDT" type="button"  onClick={this.trade} className="btn btn-secondary  btn-sm">Sell</button>
                                    </td>
                                </tr>

                                </tbody>
                            </table>

                        </div>
                        <div className="col-sm">
                            <div>
                            <h3>Trading - {this.state.buyOrSell==='buy'?this.state.market:this.state.tagetCrypto}</h3>
                            <input className="form-control" onChange={this.inputChange} value={this.state.inputValue}  type="number" placeholder="Enter amount"/>
                            <h4>Total Amount = {this.state.amount.toFixed(5)} {this.state.buyOrSell==='sell'?this.state.market:this.state.tagetCrypto}</h4>
                            <button type="button"
                             onClick={this.tradeButton} className="btn btn-primary btn-sm">{this.state.buyOrSell}</button>
                            </div>
                        </div>
                    </div>
                    <h3>Commission : ${this.state.commission}</h3>
                </div>
            </div>
        );
    }


}

export default App;

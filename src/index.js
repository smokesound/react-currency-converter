import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

  class CurrencyList extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        inputcoin: 10,
        dissapear: [],
        popping: ''
      };
      this.handleClickPopping = this.handleClickPopping.bind(this)
      this.handleChangePopping = this.handleChangePopping.bind(this);
      this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount() {
      fetch("https://api.exchangeratesapi.io/latest?base=USD")
      .then(res2 =>res2.json())
        .then(
          (result1) => {
            var obj = result1.rates
            var resultss = Object.keys(obj).map(function(key) {
              var curr = obj[key]
              return {key, curr};
            });
            for (var i = 0; i < resultss.length; i++ ) {
              this.state.dissapear.push({
                'id': i,
                'nation': resultss[i]['key'],
                'currency': parseFloat(resultss[i]['curr']).toFixed(0)
              })
            }
            this.setState({
              currencybase: result1.base,
              currencyall: resultss,
              currencystart: [this.state.dissapear[16]],
              currencymodified: this.state.dissapear
            });
          },
          (error) => {
            this.setState({
              isLoaded: true,
              error
            });
          }
        )
    }
    handleChange(event) {
      this.setState({inputcoin: event.target.value});
    }
    handleChangePopping(event) {
      this.setState({popping: event.target.value});
    }
    choiceCurrency(param){
      var index = this.state.currencymodified.findIndex(x => x.nation===param)
      var index2 = this.state.currencystart.findIndex(x => x.nation===param.toUpperCase())
      if( index >= 0){
        if(index2 < 0){
          this.state.currencystart.push(this.state.currencymodified[index])
        } else {
          alert('data already added')
        }
        this.setState({popping: param});
      } else {
        alert('data not found')
      }
    }
    deleteClick(param){
      var index = this.state.currencystart.findIndex(x => x.nation===param)
      console.log(index)
      if( index >= 0){
        this.state.currencystart.splice(index, 1)
        console.log(this.state.currencystart)
        this.setState({popping: param});
      } else {
        alert('data not found')
      }
    }
    handleClickPopping(event){
      // alert(this.state.popping)
      var index = this.state.currencymodified.findIndex(x => x.nation===this.state.popping.toUpperCase())
      var index2 = this.state.currencystart.findIndex(x => x.nation===this.state.popping.toUpperCase())
      if( index >= 0){
        if(index2 < 0){
          this.state.currencystart.push(this.state.currencymodified[index])
        } else {
          alert('data already added')
        }
        this.setState({popping: this.state.popping.toUpperCase()});
      } else {
        alert('data not found')
      }
    }
    render(){
      var currency = this.state.currencybase
      var currencymodified = this.state.currencymodified
      var currencystart = this.state.currencystart
      return (
        <div>
          <div className="warning">
            <span>please use screen not more than 500px to view the application</span>
          </div>
          <div className="allmover">
            <div className="container header">
              <div className="row">
                <div className="col-6 currency py-3">
                  <span>{currency}</span>
                </div>
                <div className="col-6 text-center whitebg pl-0">
                  <span className="dols">$</span><input type="number" className="currency pl-4 py-3 noall" value={this.state.inputcoin} onChange={this.handleChange} />
                </div>
              </div>
            </div>
            <div className="container slide py-2">
            {currencymodified ? 
              currencymodified.map(listcurrency => 
              <div className="choosercurrency mx-1" key={listcurrency.nation}  onClick={() => this.choiceCurrency(listcurrency.nation)} >{listcurrency.nation}</div>  )
              : ''
              }
            </div>
            <div className="container noborder">
              <div className="row">
                  <div className="col-12">
                  {currencystart ? 
                    currencystart.map(curr =>
                      <div key={curr.nation} >
                            <div className="row carding" id={curr.nation}>
                              <div className="col-12">
                                <div className="row">
                                  <div className="col-6" key={curr.status}>{curr.nation}</div> <div className="col-6 text-right">{curr.currency*this.state.inputcoin}</div>
                                </div>
                                <div className="row">
                                  <div className="col-8" key={curr.id}>1 USD = {curr.nation} {curr.currency}</div>
                                  <div className="col-4 text-right delete" key={curr.nation} onClick={() => this.deleteClick(curr.nation)} key={curr.nation}> delete </div>
                                </div>
                              </div>
                            </div> 
                          </div>
                          ) : 
                        ''}
                      </div>
                </div>
            </div>
            
            <div className="container stick pb-3 pt-2">
                <div className="col-12">
                <div className="row">
                  <div className="col-12 pl-0">
                    <div className="whitefont">Add more currency</div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-8 pl-0">
                    <input className="inputmore" type="text" placeholder="e.g IDR" value={this.state.popping} onChange={this.handleChangePopping} />
                  </div>
                  <div className="col-4 text-center addmore">
                    <input className="whitefont mt-1" type="submit" value="Submit" onClick={() => this.handleClickPopping()}/>
                  </div>
                </div>
                </div>
            </div>
          </div>
        </div>
      )
    }
  }
  class Fuser extends React.Component {
      render() {
        return (
          <div>
            <CurrencyList/>
          </div>
        )
      }
  }
  // ========================================
  
  ReactDOM.render(<Fuser />, document.getElementById("root"));
  
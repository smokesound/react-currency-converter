import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

  class CurrencyList extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        inputcoin: 10000,
        dissapear: [],
        popping: ''
      };
      this.handleClickPopping = this.handleClickPopping.bind(this)
      this.handleChangePopping = this.handleChangePopping.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
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
                'currency': resultss[i]['curr'],
                'status': 'inactive'
              })
              this.state.dissapear[0].status = 'active'
            }
            this.setState({
              currencybase: result1.base,
              currencyall: resultss,
              currencystart: this.state.dissapear,
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
    handleSubmit(event) {
      alert('A name was submitted: ' + this.state.inputcoin);
      event.preventDefault();
    }
    choiceCurrency(param){
      var index = this.state.currencymodified.findIndex(x => x.nation===param)
      if( index >= 0){
        this.state.currencymodified[index].status = 'active'
        this.setState({popping: param});
      } else {
        alert('data not found')
      }
    }
    handleClick(param){
      console.log(param)
      // document.getElementById(param.key).classList.add('dissapear')
      this.state.dissapear.push(param)
      console.log(this.state.dissapear)
    }
    handleClickPopping(event){
      // alert(this.state.popping)
      var index = this.state.currencymodified.findIndex(x => x.nation===this.state.popping)
      if( index >= 0){
        this.state.currencymodified[index].status = 'active'
        this.setState({popping: this.state.popping});
      } else {
        alert('data not found')
      }
    }
    render(){
      var currency = this.state.currencybase
      var currencymodified = this.state.currencymodified
      return (
        <div>
          <form onSubmit={this.handleSubmit}>
            <label>
            <div>Rate base in  {currency}</div>
              <input type="text" value={this.state.inputcoin} onChange={this.handleChange} />
            </label>
            <input type="submit" value="Submit" />
          </form>
          
            <label>
            <div>Pop more {currency}</div>
              <input type="text" value={this.state.popping} onChange={this.handleChangePopping} />
            </label>
            <input type="submit" value="Submit" onClick={() => this.handleClickPopping()}/>
          
          <div>
            {currencymodified ? 
            currencymodified.map(listcurrency => 
            <span key={listcurrency.nation}  onClick={() => this.choiceCurrency(listcurrency.nation)} >{listcurrency.nation} &nbsp; &nbsp; &nbsp;</span>  )
            : ''
            }
            {currencymodified ? 
              currencymodified.map(curr =>
                <div key={curr.nation} >{ curr.status === 'active' ? 
                    (
                      <div id={curr.nation} onClick={() => this.handleClick(curr)} key={curr.nation}>
                        <span key={curr.nation}>{curr.nation} -> {curr.currency*this.state.inputcoin}</span>
                      </div> 
                     ) : ('')}
                     </div>
                ) : ''}</div>
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
  
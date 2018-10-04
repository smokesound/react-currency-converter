import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import scrollToComponent from 'react-scroll-to-component';
import scrollToElement from 'scroll-to-element';
import Slider from "react-slick";

  class Hello extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        message: 'my friend frome state',
        items: [],
        firstitem: '',
        detailItem: {},
        openDetail: false,
        Blue: '',
        detailList: false,
        inputcoin: 10000,
        dissapear: [],
        popping: ''
      };
      this.handleClickPopping = this.handleClickPopping.bind(this)
      this.handleChangePopping = this.handleChangePopping.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.updateMessage = this.updateMessage.bind(this);
    }
    
    componentDidMount() {
      Promise.all([
        fetch("https://ot.tirto.id/tvr/instagram?page=1&limit=48"),
        fetch("https://api.exchangeratesapi.io/latest?base=USD")
      ])
      .then(([res1, res2]) => Promise.all([res1.json(), res2.json()]))
        .then(
          ([result, result1]) => {
            var obj = result1.rates
            var resultss = Object.keys(obj).map(function(key) {
              // var curr = parseFloat(obj[key]).toFixed(0)
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
            // console.log(this.state.dissapear)
            this.setState({
              isLoaded: true,
              items: result.data,
              currencybase: result1.base,
              currencyall: resultss,
              currencystart: this.state.dissapear,
              currencymodified: this.state.dissapear
            });
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
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
    updateMessage() {
      // console.log(this.state.items)
      this.setState({
        message: 'my friend from changed state'
      });
      console.log('baba')
    }
    closeDetail() {
      this.setState({
        openDetail: false
      })
      console.log(this.state.openDetail) 
    }
    openDetailImage(param) {
      this.setState({
        detailItem: param,
        openDetail:  true
      })
    }
    choiceCurrency(param){
      var index = this.state.currencymodified.findIndex(x => x.nation==param)
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
      var index = this.state.currencymodified.findIndex(x => x.nation==this.state.popping)
      if( index >= 0){
        this.state.currencymodified[index].status = 'active'
        this.setState({popping: this.state.popping});
      } else {
        alert('data not found')
      }
    }
    openParamToList(param, param2){
      console.log(param2.carousel)
      console.log(param) 
      this.setState({
        detailList: true
      })
      setTimeout(() => {
        scrollToElement('.' + param, {
            offset: 0,
            ease: 'linear',
            duration: 1500
        });
      }, 10)
    }
    render(){
      var data = this.state.items
      var currency = this.state.currencybase
      var currencyall = this.state.currencyall
      var currencymodified = this.state.currencymodified
      // console.log(currencyall)
      var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: false
      };
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
                <div key={curr.nation} >{ curr.status == 'active' ? 
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
    constructor(){
      super();
    }
      render() {
        return (
          <div key="1">
            <Hello/>
          </div>
        )
      }
  }

  
  // ========================================
  
  ReactDOM.render(<Fuser />, document.getElementById("root"));
  
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
            console.log(resultss)
            this.setState({
              isLoaded: true,
              items: result.data,
              currencybase: result1.base,
              currencyall: resultss
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
      console.log(this.state.items)
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
    handleClick(param){
      console.log(param)
      document.getElementById(param.key).classList.add('dissapear')
      this.state.dissapear.push(param)
      console.log(this.state.dissapear)
    }
    handleClickPopping(param){
      console.log(param)
      document.getElementById(param).classList.remove('dissapear')
      param.preventDefault();
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
      console.log(currencyall)
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
          <form onSubmit={this.handleClickPopping}>
            <label>
            <div>Pop more {currency}</div>
              <input type="text" value={this.state.popping} onChange={this.handleChangePopping} />
            </label>
            <input type="submit" value="Submit" />
          </form>
          <div>
            {currencyall ? 
              currencyall.map(curr =>
                    <div id={curr.key} onClick={() => this.handleClick(curr)} key={curr.key}>
                      <span>{curr.key} -> {curr.curr*this.state.inputcoin}</span>
                    </div> 
                ) : ''}</div>
          {this.state.openDetail ? 
            <div>
              <button onClick={() => this.closeDetail()} style={{height: '150px'}}> close </button>
              <img src={this.state.detailItem.img_standard} width="100%" />
              {this.state.detailItem.caption}
            </div> :
            ''
          }
          {this.state.detailList ? (
          <div style={{width: '400px', margin: '0 auto'}}>
            {data.length ?
              data.map(item => 
                <section className={'iniclass' + item.id}>
                {item.carousel ? '' : (<img style={{width: '100%', display: 'inline-block'}}  src={item.img_standard} width="100%" key={item.id} alt={item.caption}/>     )}                  
                 {item.carousel ? (
                    <Slider {...settings}>             
                    {item.carousel ? 
                    ( item.carousel.map(itemimage => 
                      <div class="ripit">
                          <img src={itemimage.img_standard} width="100%" key={itemimage.id} alt={itemimage.caption}/>
                      </div>
                      )) : 'ksoong'}   
                      </Slider>
                 ):''}
                <p>{item.caption}</p>
                </section>
              ) : <h2>loading</h2> }
          </div>
          ) : '' }
          {this.state.detailList ? '' : ( 
          <div style={{width: '400px', margin: '0 auto'}}>
            {data.length ?
            data.map(item => 
              <section className={'iniclass' + item.id}  style={{width: '30%', display: 'inline-block'}} >              
              <img src={item.img_standard} width="100%" key={item.id} onClick={() => this.openParamToList('iniclass' + item.id, item)} alt={item.caption}/>
              </section>
            ) : <h2>loading</h2> }
          </div>
          )}
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
          <div>
            <Hello message="Hello and Welcome"/>
          </div>
        )
      }
  }

  
  // ========================================
  
  ReactDOM.render(<Fuser />, document.getElementById("root"));
  
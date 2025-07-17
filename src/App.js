import React, { Component } from 'react';
import Layout from './layouts/Layout';
import PGIAdminLayout from './layouts/PGIAdminLayout';
import PGILabLayout from './layouts/PGILabLayout';
import 'react-toastify/dist/ReactToastify.min.css';
import 'react-datetime/css/react-datetime.css';
import 'react-image-lightbox/style.css';
import Flex from './components/common/Flex';
import CartContext, { CartContextClass } from './Shop/ShopContext'
import { BrowserRouter } from 'react-router-dom';
import AnonymousLayout from './layouts/AnonymousLayout';
import './custom.css'

  
export default class App extends Component {
    state = {
        Islogin: false, userid: "", mode: null,
        cart: []
    }
    userid = null;
    static mainapp;
    LoadCompleted() {
        this.setState({
            Islogin: true,
            userid: this.userid
        });
    }
    ChangeMode() {
        this.setState({
            ...this.state,
            mode: localStorage.getItem('user-mode')
        })
    }
    ChangeCart(add, product) {
        let newCart = [];
        if (add)
            newCart = CartContextClass.addToCart(product)
        else
            newCart = CartContextClass.removeFromCart(product)

        this.setState({
            ...this.state,
            cart: newCart
        })
    }
   componentDidMount(){

   }
    render() {
        App.mainapp = this;
        let result = null;
        let mode = localStorage.getItem('user-mode');
        //let mode = this.state.mode;
        let org = localStorage.getItem('org');
        if (mode !== null && org !== null) {
            let roles = JSON.parse(mode)
            if (roles !== null)
            mode = roles[0];
            switch (mode) {
                case 'R1':
                    result = (<Layout className="content " />);
                    break;
                case 'R2':
                    result = (<PGIAdminLayout className="content " />);
                    break;
                case 'R6':
                    result = (<PGILabLayout className="content " />);
                    break;
                //case '4':
                //    result = (<AuthCardLayout className="content " />);
                //    break;
                default:
                    result = <Flex justify="center" align="center"><h1 className="content mt-5" >Mode Problem</h1></Flex>
                    break;
            }
        }
        else {
            //result = (<AuthCardLayout className="content " />);
            result = (<AnonymousLayout className="content " />);
        }
        return (<CartContext.Provider value={{
            cart: this.state.cart,
            addToCart: this.ChangeCart.bind(this, true),
            removeFromCart: this.ChangeCart.bind(this, false)
        }}> <BrowserRouter basename={process.env.REACT_APP_BASE_URL}>
                <div className='pl-1 pr-1'>{result}</div>
            </BrowserRouter></CartContext.Provider>);
    }
}
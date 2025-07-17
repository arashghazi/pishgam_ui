import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { Label } from 'reactstrap';

export default class ErrorHandler extends Component {
    state = {
        error: null, ErrorInfo: null
    }
    componentDidCatch(error, errorInfo) {
        this.setState({
            error, errorInfo
        })
    }
    static async CominicationError(ex) {
        if (ex?.response?.status === 404)
            console.log('404');
        else if (ex?.response?.status === 401) {
        }
        else if (ex?.response?.status >= 500) {
            toast.error(ex.response.data.detail)
        }
        else if(ex.message==='Network Error'){
            toast.error('مشکل ارتباط باسرور لطفا ارتباط اینترنت خود را چک بفرمایید و مجددا تلاش کنید')
        }
        console.log(ex?.response);
    }

    render() {
        if (this.state.error !== null) {
            console.log(this.state.error.toString());
            return <Label>{this.state.error.toString()}</Label>
        }
        return this.props.children;
    }
}
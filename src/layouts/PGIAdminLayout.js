import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { CloseButton, Fade } from '../components/common/Toast';
import PGIDashboard from './PDIDashboard';
import ErrorLayout from './ErrorLayout';
import LoginForm from '../Pishgam/LoginForm';
import { AuthenticationController } from '../Engine/Authentication';
import { Spinner } from 'reactstrap';
import CertificationPage from '../Pishgam/anonymousPages/CertificationPage';

const PGIAdminLayout = () => {
    const [isInRole, SetIsInRole] = useState(false);
    useEffect(()=> {
        const fetch=async()=>{
            let role =await AuthenticationController.HasRole('R2');
            SetIsInRole(role);
        }
        fetch();
    },[])
    return (
        isInRole?
        <Router fallback={<span />}>
            <Switch>
                <Route path="/errors" exact component={ErrorLayout} />
                <Route path="/login" exact component={LoginForm} />
                <Route exact path="/cert/:id" component={CertificationPage} />
                <Route component={PGIDashboard} />
            </Switch>
            <ToastContainer transition={Fade} closeButton={<CloseButton />} position={toast.POSITION.BOTTOM_LEFT} />
        </Router>
        : <Spinner/>
    );
};

export default PGIAdminLayout;

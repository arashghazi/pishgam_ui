import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { Spinner } from 'reactstrap';
import { CloseButton, Fade } from '../components/common/Toast';
import { AuthenticationController } from '../Engine/Authentication';

import DashboardLayout from './DashboardLayout';
import ErrorLayout from './ErrorLayout';

const Layout = () => {
    const [isInRole, SetIsInRole] = useState(false);
    useEffect(()=> {
        const fetch=async()=>{
            await AuthenticationController.HasRole('R1');
            SetIsInRole(true);
        }
        fetch();
    },[])

    return (
        isInRole?
        <Router fallback={<span />}>
            <Switch>
                <Route path="/errors" component={ErrorLayout} />
                <Route component={DashboardLayout} />

            </Switch>
            <ToastContainer transition={Fade} closeButton={<CloseButton />} position={toast.POSITION.BOTTOM_LEFT} />
        </Router>:<Spinner/>
    );
};

export default Layout;

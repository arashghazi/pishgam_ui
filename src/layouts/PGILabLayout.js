import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { CloseButton, Fade } from '../components/common/Toast';

import PGILabDashboard from './PGILabDashboard';
import ErrorLayout from './ErrorLayout';
import { useState } from 'react';
import { useEffect } from 'react';
import { AuthenticationController } from '../Engine/Authentication';
import { Spinner } from 'reactstrap';

const PGIAdminLayout = () => {
    const [isInRole, SetIsInRole] = useState(false);
    useEffect(()=> {
        const fetch=async()=>{
            let role =await AuthenticationController.HasRole('R6');
            SetIsInRole(true);
        }
        fetch();
    },[])

    return (
        isInRole?
        <Router fallback={<span />}>
            <Switch>
                <Route path="/errors" component={ErrorLayout} />
                <Route component={PGILabDashboard} />
            </Switch>
            <ToastContainer transition={Fade} closeButton={<CloseButton />} position={toast.POSITION.BOTTOM_LEFT} />
        </Router>:<Spinner/>
    );
};

export default PGIAdminLayout;

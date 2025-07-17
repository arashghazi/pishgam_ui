import React from 'react';
import { BrowserRouter as Router, Route, Switch, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { CloseButton, Fade } from '../components/common/Toast';
import Landing from '../components/landing/Landing';
import AboutUs from '../Pishgam/anonymousPages/AboutUs';
import CertificationPage from '../Pishgam/anonymousPages/CertificationPage';
import NewLaboratory from '../Pishgam/anonymousPages/NewLaboratory';
import AuthCardLayout from './AuthCardLayout';
import ErrorLayout from './ErrorLayout';

const AnonymousLayout = ({ location, match }) => {
    console.log(match)
    return (<>
        <Router fallback={<span />}>
            <Switch>
                <Route path="/errors" exact component={ErrorLayout} />
                <Route path="/login" exact component={AuthCardLayout} />
                <Route path="/register" exact component={NewLaboratory} />
                <Route path="/aboutus" exact component={AboutUs} />
                <Route exact path="/cert/:id" component={CertificationPage} />
                <Route path="/authentication/forget-password" exact component={AuthCardLayout} />
                <Route component={Landing} />
            </Switch>
            <ToastContainer transition={Fade} closeButton={<CloseButton />} position={toast.POSITION.BOTTOM_LEFT} />
        </Router>
        </>
    );
};

export default AnonymousLayout;
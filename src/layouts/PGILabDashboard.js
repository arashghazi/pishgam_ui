import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import NavbarTop from '../components/navbar/NavbarTop';
import NavbarVertical from '../components/navbar/NavbarVertical';
import AppContext from '../context/Context';
import { getPageName } from '../helpers/utils';
import LabDashboard from './LabDashboard';
import InstanceDataList from '../Forms/InstanceDataList';
import Shop from '../Shop/Shop';
import ShoppingCart from '../Shop/ShoppingCart';
import Invoice from '../Shop/Invoice';
import ObjectClassController from '../Engine/ObjectClassController';
import { useState } from 'react';
import PaymentType from '../Shop/payment/PaymentType';
import AuthCardLayout from './AuthCardLayout';
import FormManager from '../EngineForms/FormManager';
import ConditionMakerComponent from '../Condition/ConditionMakerComponent';
import MorfologyCellCounter from '../Pishgam/AnswerSheet/MorfologyCellCounter';
import BacteryAnswerSheet from '../Pishgam/AnswerSheet/bactery/BacteryAnswerSheet';
import LabratoaryReports from '../Pishgam/Lab/LabratoaryReports';
import AnalyticsReport from '../Pishgam/AnalyticsReport';
import SectionDetail from '../Pishgam/Lab/SectionDetail';
import { AuthenticationController } from '../Engine/Authentication';
import TBAnswerSheet from '../Pishgam/AnswerSheet/TBAnswerSheet';
import HBVAnswerSheet from '../Pishgam/AnswerSheet/HBVAnswerSheet';
import LabCertificate from '../Pishgam/Lab/LabCertificate';
import CertificationPage from '../Pishgam/anonymousPages/CertificationPage';
import ErrorLayout from './ErrorLayout';
import { chackRouat } from '../routes';
import Survey from '../Pishgam/survey/Survey';
import LabPaymentType from '../Shop/payment/LabPaymentType';
import CytologyAnswer from '../Pishgam/AnswerSheet/CytologyAnswer';
const PGILabDashboard = ({ location }) => {
    const { isFluid, isVertical, navbarStyle } = useContext(AppContext);
    const [menu, setMenu] = useState([]);
    const isKanban = getPageName('kanban');
    useEffect(() => {
        async function fetchData() {
            if (menu.length === 0) {
                let tempmenu = await ObjectClassController.GetFormAsync('Menu-');
                if (Array.isArray(tempmenu)) {
                    setMenu(tempmenu);
                }
                else {
                    AuthenticationController.LogOut();
                }

            }
        }
        fetchData();
    })

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);
    let org = localStorage.getItem('org');
    return (
        <div className={`p-l ${isFluid || isKanban ? 'container-fluid' : 'container'}`}>
            {!org ? <AuthCardLayout /> : <>
                {isVertical && <NavbarVertical isKanban={isKanban} routes={menu} navbarStyle={navbarStyle} />}
                <div className="content">
                    <NavbarTop />
                    <Switch>
                        <Route path="/admin/*"  render={({ match }) => {
                            return <ErrorLayout match={match} />;
                        }}/>
                        <Route path="/survey" exact component={Survey} />
                        <Route path="/certhistory" exact component={LabCertificate} />
                        <Route exact path="/cert/:id" component={CertificationPage} />
                        <Route path="/section/:id" exact component={SectionDetail} />
                        <Route exact path="/e-commerce" component={Shop} />
                        <Route exact path="/e-commerce/shoppingcart" component={ShoppingCart} />
                        <Route exact path="/e-commerce/invoice/:id?" component={Invoice} />
                        <Route exact path="/e-commerce/payment/:id?" component={LabPaymentType} />
                        <Route exact path={"/forms/morphologyanswersheet"} component={MorfologyCellCounter} />
                        <Route exact path={"/forms/bacterybnswersheet"} component={BacteryAnswerSheet} />
                        <Route exact path="/forms/tbanswer" component={TBAnswerSheet} />
                        <Route exact path="/forms/hbvanswer" component={HBVAnswerSheet} />
                        <Route exact path="/forms/cytologyanswer" component={CytologyAnswer} />
                        <Route path="/support" exact component={InstanceDataList} />
                        <Route path="/Reports/:dom/:part?" exact component={LabratoaryReports} />
                        <Route path="/conditionalReport/:id" render={({ match }) => {
                            return <ConditionMakerComponent conditionid={match.params.id} />;
                        }} />
                        <Route exact path="/reportbuilder/show/:dom?" render={({ match }) => {

                            return <AnalyticsReport params={match.params} />;
                        }} />
                        <Route path="/:id/:params?" render={({ match, location }) => {
                            console.log(chackRouat(match.params.id))
                            if (chackRouat(match.params.id)) {
                                return (
                                    <FormManager location={location} formId={match.params.id} insId={match.params.insId} />
                                );
                            }
                            return <ErrorLayout match={match} />;


                        }} />
                        <Route path="/" component={LabDashboard} />
                        <Route path="/errors" exact component={ErrorLayout} />

                    </Switch>
                </div>
                {/*{!isKanban && <Footer />}*/}
                {/*<SidePanelModal path={location.pathname} />*/}
            </>}
        </div>
    );
};

PGILabDashboard.propTypes = { location: PropTypes.object.isRequired };

export default PGILabDashboard;

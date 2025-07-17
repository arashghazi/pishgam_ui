import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import FormBuilder from './../Developer/FormBuilder';
import NavbarTop from '../components/navbar/NavbarTop';
import NavbarVertical from '../components/navbar/NavbarVertical';
import AppContext from '../context/Context';
import { getPageName } from '../helpers/utils';
import routes from '../routes';
import PanelControl from '../Forms/Design/PanelControl';
import FormTester from '../Developer/FormTester';
import TemplateDataForm from '../Forms/TemplateDataForm';
import FormRouter from '../Forms/FormRouter';
import ReportBuilder from '../Forms/Design/ReportBuilder';
import AdminDashboard from '../Pishgam/AdminDashboard';
import ConditionalClassReport from '../Condition/ConditionalClassReport';
import ChatContent from '../Messenger/ChatContent';
import { Card, CardBody } from 'reactstrap';
import Flex from '../components/common/Flex';

const DashboardLayout = ({ location }) => {
    const { isFluid, isVertical, navbarStyle } = useContext(AppContext);

    const isKanban = getPageName('kanban');


    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <div className={`p-l ${isFluid || isKanban ? 'container-fluid' : 'container'}`}>
            {isVertical && <NavbarVertical isKanban={isKanban} routes={routes} navbarStyle={navbarStyle} />}
            <div className="content">
                <NavbarTop />
                <Switch>
                    <Route path="/" exact component={AdminDashboard} />
                    <Route path="/conditionalReport/:dom" render={({ match }) => {
                        return <ConditionalClassReport Params={match.params} />;
                    }} />
                    <Route path="/formbuiler" exact component={FormBuilder} />
                    <Route path="/design-panel" exact component={PanelControl} />
                    <Route path="/tester" exact component={FormTester} />
                    <Route path="/tempdata" exact component={TemplateDataForm} />
                    <Route path="/reportbuilder" exact component={ReportBuilder} />
                    <Route path="/message/:stog?" exact render={({ match }) =>
                    (<Card className="card-chat">
                        <CardBody tag={Flex} className="p-0 h-100 ">
                            <ChatContent {...match} />
                        </CardBody>
                    </Card>)} />
                    <Route path="/:id/:params" render={({ match }) => {
                        return (
                            <FormRouter source={match.params.id} Params={match.params} />
                        )
                    }} />
                </Switch>
                {/*{!isKanban && <Footer />}*/}
            </div>
            {/*<SidePanelModal path={location.pathname} />*/}
        </div>
    );
};

DashboardLayout.propTypes = { location: PropTypes.object.isRequired };

export default DashboardLayout;

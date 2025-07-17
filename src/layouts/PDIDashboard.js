import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import NavbarTop from '../components/navbar/NavbarTop';
import NavbarVertical from '../components/navbar/NavbarVertical';
import TemplateDataForm from '../Forms/TemplateDataForm';
import AdminDashboard from '../Pishgam/AdminDashboard';
import Mode2PreReport from '../Pishgam/Mode2PreReport';
import Mode2PreReportCA from '../Pishgam/Mode2PreReportCA';
import ObjectClassController from '../Engine/ObjectClassController';
import OverAllReport from '../Pishgam/OverAllReport';
import { Card, CardBody } from 'reactstrap';
import ChatContent from '../Messenger/ChatContent';
import Flex from '../components/common/Flex';
import ShoppingCart from '../Shop/ShoppingCart';
import Shop from '../Shop/Shop';
import Invoice from '../Shop/Invoice';
import PaymentType from '../Shop/payment/PaymentType';
import FormManager from '../EngineForms/FormManager';
import ConditionMakerComponent from '../Condition/ConditionMakerComponent';
import MorfologyCellCounter from '../Pishgam/AnswerSheet/MorfologyCellCounter';
import BacteryAnswerSheet from '../Pishgam/AnswerSheet/bactery/BacteryAnswerSheet';
import SendingProccess from '../Pishgam/SendingProccess';
import PeriodStats from '../Pishgam/SectionStatus/PeriodStats';
import AnalyticsReport from '../Pishgam/AnalyticsReport';
import MorfologyExpAnswer from '../Pishgam/AnswerSheet/MorfologyExpAnswer';
import MorfologyReport from '../Pishgam/AnswerSheet/MorfologyReport';
import ParasiteExpectedAnswer from '../Pishgam/ParasiteExpectedAnswer';
import StatisticalReport from '../Pishgam/StatisticalReport';
import BKExpectAnswer from '../Pishgam/AnswerSheet/BKExpectAnswer';
import TorchExpectedAnsawer from '../Pishgam/AnswerSheet/TorchExpectedAnsawer';
import ReportWithExpectedResult from '../Pishgam/AnswerSheet/ReportWithExpectedResult';
import WrightExpectedAnswer from '../Pishgam/AnswerSheet/WrightExpectedAnswer';
import SerologyExpectedAnswer from '../Pishgam/AnswerSheet/SerologyExpectedAnswer';
import BloodControlReport from '../Pishgam/AnswerSheet/BloodControlReport';
import ABOExpectedAnswer from '../Pishgam/AnswerSheet/BloodBank/ABOExpectedAnswer';
import ABOReport from '../Pishgam/AnswerSheet/BloodBank/ABOReport';
import CrossExpectedAnswer from '../Pishgam/AnswerSheet/BloodBank/CrossExpectedAnswer';
import CrossmatchReport from '../Pishgam/AnswerSheet/BloodBank/CrossmatchReport';
import AbExpectedAnswer from '../Pishgam/AnswerSheet/BloodBank/AbExpectedAnswer';
import AbReport from '../Pishgam/AnswerSheet/BloodBank/AbReport';
import BacteryExpectedAnswer from '../Pishgam/AnswerSheet/bactery/BacteryExpectedAnswer';
import BacteryReport from '../Pishgam/AnswerSheet/bactery/BacteryReport';
import InvoiceReport from '../Shop/InvoiceReport';
import TBAnswerSheet from '../Pishgam/AnswerSheet/TBAnswerSheet';
import HBVAnswerSheet from '../Pishgam/AnswerSheet/HBVAnswerSheet';
import HBVExpectedAnswerSheet from '../Pishgam/AnswerSheet/HBVExpectedAnswer';
import TBExpectedAnswerSheet from '../Pishgam/AnswerSheet/TBExpectedAnswer';
import AdminInvoice from '../Shop/AdminInvoice';
import TBReport from '../Pishgam/TBReport';
import HBVReport from '../Pishgam/HBVReport';
import MessageDefinition from '../Pishgam/MessageDefinition';
import AdminAnswersComponent from '../Pishgam/Admin/AdminAnswersComponent';
import FungusExpectedAnswer from '../Pishgam/AnswerSheet/FungusExpectedAnswer';
import OnlineUserList from '../Pishgam/OnlineUserList';
import AdminCertificate from '../Pishgam/Certificate/AdminCertificate';
import SectionDetail from '../Pishgam/Lab/SectionDetail';
import AdminSendingQuery from '../Pishgam/Admin/AdminSendingQuery';
import Survey from '../Pishgam/survey/Survey';
import CytologyAnswer from '../Pishgam/AnswerSheet/CytologyAnswer';


export default class PGIDashboard extends Component {
    state = {
        menus: []
    }


    async componentDidMount() {
        await this.initialiez();
    }
    async componentDidUpdate() {
        //ReactGA.pageview(window.location.pathname + window.location.search);
        await this.initialiez();
    }
    async initialiez() {
        if (this.state.menus.length === 0) {
            let menu = await ObjectClassController.GetFormAsync('Menu-');
            window.scrollTo(0, 0);
            this.setState({
                ...this.state,
                menus: menu
            })
        }
    }
    loadComponent(name) {
        const Component = React.lazy(() =>
            import(`${name}`)
        );
        return Component;
    }
    render() {
        return (

            <div className={`p-l container-fluid`}>
                {this.state.menus.length > 0 ? <NavbarVertical isKanban={true} routes={this.state.menus} navbarStyle='vibrant' /> : null}
                <div className="content ">
                    <NavbarTop />
                    <Switch>
                    {/* <Route path="/section/:id" exact component={SectionDetail} /> */}
                        <Route path="/survey" exact component={Survey} />
                        <Route exact path="/e-commerce" component={Shop} />
                        <Route exact path="/e-commerce/shopping-cart" component={ShoppingCart} />
                        <Route exact path="/e-commerce/invoice/:id?" component={Invoice} />
                        <Route exact path="/e-commerce/payment/:id?" component={PaymentType} />
                        <Route exact path="/e-commerce/sending/:id?" component={SendingProccess} />
                        <Route exact path="/e-commerce/sending-qry" component={AdminSendingQuery} />
                        <Route exact path="/e-commerce/report" component={PeriodStats} />
                        <Route exact path="/e-commerce/admininvoice" component={AdminInvoice} />

                        <Route exact path={"/forms/morphologyanswersheet/:id?"} component={MorfologyCellCounter} />
                        <Route exact path={"/forms/bacterybnswersheet/:id?"} component={BacteryAnswerSheet} />
                        <Route exact path="/forms/expectedanswermorpho" component={MorfologyExpAnswer} />
                        <Route exact path="/forms/reportmorpho" component={MorfologyReport} />
                        <Route exact path="/forms/ParasiteExpectedAnswer" component={ParasiteExpectedAnswer} />
                        <Route exact path="/forms/FungusExpectedAnswer" component={FungusExpectedAnswer} />
                        <Route exact path="/forms/bkexpectanswer" component={BKExpectAnswer} />
                        <Route exact path="/forms/torchexpectedansawer" component={TorchExpectedAnsawer} />
                        <Route exact path="/forms/wrightexpectedansawer" component={WrightExpectedAnswer} />
                        <Route exact path="/forms/serologyexpectedsnswer" component={SerologyExpectedAnswer} />
                        <Route exact path="/forms/tbanswer/:id?" component={TBAnswerSheet} />
                        <Route exact path="/forms/expectedtbanswer" component={TBAnswerSheet} />
                        <Route exact path="/forms/hbvanswer/:id?" component={HBVAnswerSheet} />
                        <Route exact path="/forms/hbvexpectedanswer" component={HBVExpectedAnswerSheet} />
                        <Route exact path="/forms/tbexpectedanswer" component={TBExpectedAnswerSheet} />
                        <Route exact path="/forms/cytologyanswer" component={CytologyAnswer} />

                        <Route exact path="/forms/bb/aboexpectedanswer" component={ABOExpectedAnswer} />
                        <Route exact path="/forms/bb/crossexpectedanswer" component={CrossExpectedAnswer} />
                        <Route exact path="/forms/bb/abexpectedanswer" component={AbExpectedAnswer} />

                        <Route exact path="/forms/answermessage" render={() => <MessageDefinition typeid={1} />} />
                        <Route exact path="/forms/reportmessage" render={() => <MessageDefinition typeid={2} />} />
                        <Route exact path="/forms/reportperiodmessage" render={() => <MessageDefinition typeid={3} />} />

                        <Route exact path="/forms/bacteryexpectedanswer" component={BacteryExpectedAnswer} />

                        <Route path="/tempdata" exact component={TemplateDataForm} />
                        <Route path="/tempdata/:id" exact render={({ match }) => {
                            return (
                                <FormManager id='tempdata' formId={match.params.id} mode='template' />
                            )
                        }} />
                        <Route path="/conditionalReport/:id" render={({ match }) => {
                            return <ConditionMakerComponent conditionid={match.params.id} />;
                        }} />
                        <Route path="/message/:stog?" exact render={({ match }) =>
                        (<Card className="card-chat">
                            <CardBody tag={Flex} className="p-0 h-100 ">
                                <ChatContent {...match} />
                            </CardBody>
                        </Card>)} />
                        <Route exact path="/reportbuilder/show/:dom?/:lab?/:smp?/:tst?" render={({ match, location }) => {
                            return <AnalyticsReport params={match.params} />;
                        }} />

                        <Route exact path="/admin/answersHandller" component={AdminAnswersComponent} />
                        <Route exact path="/admin/onlineusers" component={OnlineUserList} />
                        <Route exact path="/admin/certadmin" component={AdminCertificate} />

                        <Route exact path="/reportbuilder/invoice" component={InvoiceReport} />
                        <Route exact path="/reportbuilder/bacteryreport" component={BacteryReport} />
                        <Route exact path="/reportbuilder/bb/reportabo/:dom?" component={ABOReport} />
                        <Route exact path="/reportbuilder/bb/reportcross/:dom?" component={CrossmatchReport} />
                        <Route exact path="/reportbuilder/bb/reportab/:dom?" component={AbReport} />
                        <Route exact path="/reportbuilder/tbreport" component={TBReport} />
                        <Route exact path="/reportbuilder/hbvreport" component={HBVReport} />

                        <Route exact path="/reportbuilder/reportwithexpectedresult/:dom?" component={ReportWithExpectedResult} />
                        <Route exact path="/reportbuilder/reportblood/:dom?" component={BloodControlReport} />
                        <Route exact path="/reportbuilder/oar/:fid1?/:fid2?/:dom?" component={OverAllReport} />
                        <Route exact path="/reportbuilder/pre/ca/:dom?" component={Mode2PreReportCA} />
                        <Route exact path="/reportbuilder/statisticalreport/:dom" component={StatisticalReport} />
                        <Route exact path="/reportbuilder/pre/:fid1?/:fid2?/:dom?" render={({ match }) => {
                            return <Mode2PreReport Params={match.params} />;
                        }} />
                        <Route path="/:id/:insId?" exact render={({ match }) => {
                            return (
                                <FormManager formId={match.params.id} insId={match.params.insId} CardOff={false} />
                            )
                        }} />
                        <Route path="/" exact component={AdminDashboard} />

                    </Switch>
                </div>
                {/*<SidePanelModal path={location.pathname} /> 
                 * <FormRouter source={match.params.id} />
                 <FormRouter source={match.params.id} onRef={ref => (this.Forms = ref)} Mode='TempData' />
                 */}
            </div>

        );
    }
}

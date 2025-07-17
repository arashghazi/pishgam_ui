import { Redirect, Route, Switch } from 'react-router-dom';
import BacteryAnswerSheet from './AnswerSheet/bactery/BacteryAnswerSheet';
import MorfologyCellCounter from './AnswerSheet/MorfologyCellCounter';

const PishgamRoutes = () => {
    const mainroute = '/forms';
    return (
        <Switch>
            {/*Forms*/}
            <Route path={mainroute + "/morfologyanswersheet"} exact component={MorfologyCellCounter} />
            <Route path={mainroute + "/bacterybnswersheet"} exact component={BacteryAnswerSheet} />
            {/* ADMIN */}
            <Redirect to="/errors/404" />
        </Switch>
    )
}

export default PishgamRoutes;

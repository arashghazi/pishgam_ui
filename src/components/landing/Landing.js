import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import Banner from './Banner';
import Partners from './Partners';
import Processes from './Processes';
import Services from './Services';
import Testimonial from './Testimonial';
import Cta from './Cta';
import HeaderFooter from '../../Pishgam/anonymousPages/HeaderFooter';
import { LabRegister } from '../../layouts/LabDashboard';

const Landing = ({ location, match }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location?.path]);
  return (
    <Fragment>
      <HeaderFooter  location={location} match={match} >
      <Banner />
      <LabRegister/>
      <Partners />
      <Processes />
      <Services />
      <Testimonial />
      <Cta />
      </HeaderFooter>
    </Fragment>
  );
};

Landing.propTypes = { location: PropTypes.object.isRequired };

export default Landing;

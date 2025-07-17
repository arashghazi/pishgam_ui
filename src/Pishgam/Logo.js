import React from 'react';
import PropTypes from 'prop-types';
import Flex from '../components/common/Flex';

const Logo = ({ at, width, className, ...rest }) => {
    let pic = require(`../assets/img/logos/pg-logo.png`);
    return (
        <Flex align='center' justify='center' {...rest} >
            <img className='m-1' src={pic} alt="پیشگام ایرانیان" width={width??'150px'} title='سایت اصلی پیشگام ایرانیان' />
        </Flex>
    );
};

Logo.propTypes = {
    at: PropTypes.oneOf(['navbar-vertical', 'navbar-top', 'auth']),
    width: PropTypes.number,
    className: PropTypes.string
};

Logo.defaultProps = { at: 'auth', width: 58 };

export default Logo;

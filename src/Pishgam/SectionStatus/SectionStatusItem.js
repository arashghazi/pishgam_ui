import React from 'react';
import PropTypes from 'prop-types';
import Flex from '../../components/common/Flex';
import Dot from '../../components/common/Dot';

const SectionStatusItem = ({ color, name, value, totalShare }) => (
    <Flex justify="between" align="center" className="mb-1">
        <Flex align="center">
            <Dot style={{ backgroundColor: color }} />
            <span className="font-weight-semi-bold">{name}</span>
        </Flex>
        {/*<div className="d-xxl-none">{((value * 100) / totalShare).toFixed(0)}%</div>*/}
        <div className="d-xxl-none">{value}</div>
    </Flex>
);

SectionStatusItem.propsType = {
    color: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    totalShare: PropTypes.number.isRequired
};

export default SectionStatusItem;
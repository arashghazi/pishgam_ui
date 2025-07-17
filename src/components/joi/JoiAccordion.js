import React, { useState } from "react";
import PropTypes from 'prop-types';
import { Card, CardBody, CardHeader, Collapse } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const JoiAccordion = (props) => {
  const [isOpen, setIsOpen] = useState(props.open);
  return (
    <Card className="shadow-none border-bottom rounded-0">
      <CardHeader onClick={() => setIsOpen(!isOpen)} className="py-2 cursor-pointer">
        <FontAwesomeIcon icon="caret-right" transform={`rotate-${isOpen ? 90 : 180})`} />
        <span className="font-weight-medium text-dark text-sans-serif pl-2">{props.title}</span>
      </CardHeader>
      <Collapse isOpen={isOpen}>
        <CardBody className="pt-2">
            {props.children}
        </CardBody>
      </Collapse>
    </Card>
  );
};

JoiAccordion.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  open: PropTypes.bool
};

JoiAccordion.defaultProps = { open: false };

export default JoiAccordion;

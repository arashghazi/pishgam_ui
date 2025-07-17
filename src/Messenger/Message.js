import React from 'react';
import PropTypes from 'prop-types';
import { Media, Row, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ChatMessageOptions from './ChatMessageOptions';
import classNames from 'classnames';
import LightBoxGallery from '../components/common/LightBoxGallery';
import FalconLightBox from '../components/common/FalconLightBox';
import { isIterableArray } from '../helpers/utils';
import Flex from '../components/common/Flex';

const Message = ({ message, senderUserId, status, time, isGroup }) => {
    const name = "test";
    const isLeft = senderUserId===1;

    return (
        <Media className={classNames('p-3', { 'd-block': !isLeft })}>
            {/*{isLeft && <Avatar size="l" className="mr-2" src={user.avatarSrc} />}*/}
            <Media body className={classNames({ 'd-flex  justify-content-end': !isLeft })}>
                <div
                    className={classNames('w-xxl-75', {
                        'w-100': !isLeft
                    })}
                >
                    <Flex
                        align="center"
                        className={classNames('hover-actions-trigger', {
                            'justify-content-end': !isLeft
                        })}
                    >
                        {!isLeft && <ChatMessageOptions />}
                        {isIterableArray(message?.attachment) ? (
                            <div className="chat-message chat-gallery">
                                {message.text && (
                                    <p className="mb-0" dangerouslySetInnerHTML={{ __html: message.text ? message.text : message }} />
                                )}
                                <LightBoxGallery images={message.attachment}>
                                    {openImgIndex => (
                                        <Row noGutters className="mx-n1">
                                            {message.attachment.map((img, index) => {
                                                return (
                                                    <Col xs={6} md={4} className="px-1" style={{ minWidth: 50 }} key={index}>
                                                        <img
                                                            className="img-fluid rounded mb-2 cursor-pointer"
                                                            src={img}
                                                            alt=""
                                                            onClick={() => openImgIndex(index)}
                                                        />
                                                    </Col>
                                                );
                                            })}
                                        </Row>
                                    )}
                                </LightBoxGallery>
                            </div>
                        ) : (
                            <>
                                <div
                                    className={classNames('p-2 rounded-soft chat-message', {
                                        'bg-200': isLeft,
                                        'bg-primary text-white': !isLeft
                                    })}
                                >
                                    {(message || message.text) && (
                                        <p className="mb-0" dangerouslySetInnerHTML={{ __html: message.text ? message.text : message }} />
                                    )}
                                    {message.attachment && (
                                        <FalconLightBox imgSrc={message.attachment}>
                                            <img src={message.attachment} className="img-fluid rounded" width={150} alt="" />
                                        </FalconLightBox>
                                    )}
                                </div>
                            </>
                        )}
                        {isLeft && <ChatMessageOptions />}
                    </Flex>
                    <div
                        className={classNames('text-400 fs--2 mt-1', {
                            'text-right': !isLeft
                        })}
                    >
                        {isLeft && isGroup && <span className="font-weight-semi-bold mr-2">{name}</span>}
                        {time.hour}
                        {!isLeft && !!message && !!status && (
                            <FontAwesomeIcon
                                icon={classNames({
                                    check: status === 'seen' || status === 'sent',
                                    'check-double': status === 'delivered'
                                })}
                                transform="shrink-5 down-4"
                                className={classNames('ml-2', {
                                    'text-success': status === 'seen'
                                })}
                            />
                        )}
                    </div>
                </div>
            </Media>
        </Media>
    );
};
Message.propTypes = {
    message: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    senderUserId: PropTypes.number.isRequired,
    status: PropTypes.string,
    time: PropTypes.object.isRequired,
    isGroup: PropTypes.bool.isRequired
};

Message.defaultProps = { status: '' };

export default Message;

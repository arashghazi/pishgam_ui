import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Scrollbar from 'react-scrollbars-custom';
import Message from './Message';

const ChatContentBody = ({ content }) => {
    let lastDate = null;
    const [scrollHeight, setScrollHeight] = useState(0);
    useEffect(() => {
        setScrollHeight(document.getElementsByClassName('chat-content-scroll-area')[0].scrollHeight);
        //setTimeout(() => {
        //    setScrollHeight(document.getElementsByClassName('chat-content-scroll-area')[0].scrollHeight);
        //}, 500);
    },[]);
  return (
                  
      <div className="chat-content-body" style={{ width: '100%',display: 'inherit' }}>
      <Scrollbar
        style={{
                  height: '300px',
          minWidth: '175px',
          display: 'block'
        }}
        rtl={true}
        scrollTop={scrollHeight}
        noScrollX
        trackYProps={{
          renderer(props) {
            const { elementRef, ...restProps } = props;
            return <span {...restProps} ref={elementRef} className="TrackY" />;
          }
        }}>
        <div className="chat-content-scroll-area">
          {
            content.map(({ message, time, senderUserId, status }, index) => (
              <div key={index}>
                {lastDate !== time.date && (
                  <div className="text-center fs--2 text-500">{`${time.date}, ${time.hour}`}</div>
                )}
                {(() => {
                  lastDate = time.date;
                    })()}
                    <Message message={message} senderUserId={senderUserId} time={time} status={status} isGroup={false} />
              </div>
            ))
                  }
        </div>
      </Scrollbar>
    </div>
  );
};

ChatContentBody.propTypes = {
  isOpenThreadInfo: PropTypes.bool
};
ChatContentBody.defaultProps = {
  isOpenThreadInfo: false
};
export default ChatContentBody;

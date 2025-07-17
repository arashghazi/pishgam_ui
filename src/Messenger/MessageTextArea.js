import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { Picker } from 'emoji-mart';
import React, {Component } from 'react';
import { Button, Form, Input, Label } from 'reactstrap';
import { getGrays } from '../helpers/utils';
export default class MessageTextArea extends Component {
    state = {
        message: '',
        isRTL: true,
        isDark: false,
        previewEmoji: false
    }
    handleClickOutsideEmojiBox = e => {
        if (e.target.closest('.emoji-mart') || e.target.closest('.textarea')) return;
        this.setState({ ...this.state, previewEmoji: false })
    };
    componentDidMount() {
        if (this.state.previewEmoji) {
            document.addEventListener('click', this.handleClickOutsideEmojiBox.bind(this), false);
        } else {
            document.removeEventListener('click', this.handleClickOutsideEmojiBox.bind(this), false);
        }
    }
    addEmoji = e => {
        let emoji = e.native;
        this.setState({
            ...this.state,
            message: this.state.message + emoji
        });
    };
    addmessage() {
        if (this.props.AddMessage !== undefined) {
            this.props.AddMessage(this.state.message)
            this.setState({
                ...this.state,
                message:''
            })
        }

    }
    handleSubmit() {

    }
    render() {
        return (
            <Form className="chat-editor-area bg-white" onSubmit={this.handleSubmit.bind(this)}>
                <Input className="d-none" type="file" id="chat-file-upload" />
                <Label for="chat-file-upload" className="mb-0 p-1 chat-file-upload cursor-pointer">
                    <FontAwesomeIcon icon="paperclip" />
                </Label>

                <Input
                    className="border-0 outline-none shadow-none resize-none textarea bg-white"
                    type="textarea"
                    placeholder="توضیحات خود را تایپ کنید"
                    bsSize="sm"
                    value={this.state.message}
                    onChange={({ target }) => this.setState({ ...this.state, message: target.value })}
                    style={{
                        height: '2rem',
                        maxHeight: '10rem',
                        paddingRight: this.state.isRTL ? '0.75rem' : '7rem',
                        paddingLeft: this.state.isRTL ? '7rem' : '0.75rem'
                    }}
                />
                {/*<FontAwesomeIcon*/}
                {/*    icon={['far', 'laugh-beam']}*/}
                {/*    transform="grow-5"*/}
                {/*    className="emoji-icon"*/}
                {/*    onClick={() => this.setState({ ...this.state, previewEmoji: !this.state.previewEmoji })}*/}
                {/*/>*/}
                {this.state.previewEmoji && (
                    <Picker
                        set="google"
                        onSelect={this.addEmoji.bind(this)}
                        sheetSize={20}
                        style={{
                            position: 'absolute',
                            bottom: '100%',
                            left: this.state.isRTL ? '2%' : 'auto',
                            right: this.state.isRTL ? 'auto' : '2%',
                            padding: 0,
                            zIndex: 1,
                            backgroundColor: getGrays(this.state.isDark)[100]
                        }}
                        theme={this.state.isDark ? 'dark' : 'light'}
                        showPreview={false}
                        showSkinTones={false}
                    />
                )}
                <Button
                    color="transparent"
                    size="sm"
                    className={classNames(`btn-send outline-none ml-1`, {
                        'text-primary': this.state.message.length > 0
                    })}
                    onClick={this.addmessage.bind(this)}
                >
                    ارسال
                </Button>
            </Form>
        );
    }
}
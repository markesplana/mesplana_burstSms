import React, { Component } from 'react';

import axios from 'axios'
import './message.css';
import { Input, Col, Row, Form, Icon, Button, Select, Card, notification} from 'antd';
const InputGroup = Input.Group;
const { TextArea } = Input;
const FormItem = Form.Item;
const Option = Select.Option;

class Message extends Component { 
  constructor(){
      super()
      this.state = {
          message: "",
          submitting: false
      }
  }  

  openNotificationWithIcon = (type, desc, val) => {
    notification[type]({
      message: desc,
      description: val.phone,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/gm;
        const search = values.message.match(reg);
        const linkAPi = `/api/shortenurl?url=${search}`
        let message = values.message
        this.setState({
          message
        })
        if(search == null){
          axios.post(`/api/sendsms/`, {
            message,
            to: 63 + values.phone
          })
          .then(res => {
            console.log(res)
            const { data } = res
            if(data.error.code == "SUCCESS"){
              this.setState({
                submitting: false
              })
              this.props.form.resetFields();
              this.openNotificationWithIcon('success', 'Message Sent', values)
            }else{
              this.setState({
                submitting: false,
                message,
              })
              this.props.form.resetFields();
              this.openNotificationWithIcon('error', 'Failed Sent', values)
            }
          })
        }else{
          this.setState({
            submitting: true
          })
          axios.get(linkAPi)
          .then(response => {
            search.forEach((s, index) => {
              message = message.replace(s, response.data[index]);
              this.setState({
                message
              })
            })
            axios.post(`/api/sendsms/`, {
              message,
              to: 63 + values.phone
            })
            .then(res => {
              console.log(res)
              const { data } = res
              if(data.error.code == "SUCCESS"){
                this.setState({
                  submitting: false
                })
                this.props.form.resetFields();
                this.openNotificationWithIcon('success', 'Message Sent', values)
              }else{
                this.setState({
                  submitting: false,
                  message
                })
                this.props.form.resetFields();
                this.openNotificationWithIcon('error', 'Failed Sent', values)
              }
            })
          })
        }
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { message, submitting } = this.state
    console.log("STATE", message)
    return (
      <div className="container">
        <h2>Compose Message</h2>
            <Card>
              <Form onSubmit={this.handleSubmit}>
              <FormItem
                label={<small>Mobile Number</small>}
              >
                  {getFieldDecorator('phone', {
                    rules: [{ 
                      required: true, 
                      // type: "number",
                      // len: 10,
                      message: 'Please input your phone number!' }],
                  })(
                    <Input disabled={submitting} addonBefore={`+63`} style={{ width: '100%' }} />
                  )}
                </FormItem>
                {
                  submitting ?  <FormItem
                            label={<small>Message</small>}
                        > <TextArea disable="true" className="message-container" value={message} /></FormItem> :
                  <FormItem
                    label={<small>Message</small>}
                >
                  {getFieldDecorator('message', {
                    initialValue: message ? message : null,
                    rules: [{ required: false, message: '' }],
                  })(
                    <TextArea placeholder="Compose message" className="message-container" />,
                  )}
                </FormItem>
                }
              
                <FormItem>
                <Button type="primary" htmlType="submit" loading={submitting}>
                  Send <Icon type="arrow-right" />
                </Button>
              </FormItem>
              </Form>
              </Card>
      </div>
    );
  }
}

export default Form.create()(Message);

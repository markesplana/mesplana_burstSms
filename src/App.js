import React, { Component } from 'react';
import logo from './logo.svg';
import { Layout, Menu, Breadcrumb, Row, Col } from 'antd';


import Message from './components/message/message'

import './App.css';
import 'antd/dist/antd.css';  

import phoneImg from './assets/img/phone.png'


const { Header, Content, Footer } = Layout;
class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="cover" />
        <Layout  className="layout-container">
        <Content style={{ padding: '0 50px', marginTop: 64, height: '100vh' }}>
        <Row>
          <Col lg={12}>
          <div className="img-container">
            <img src={phoneImg} width="100px"/>
          </div></Col>
          <Col lg={12}>
            <Message /> 
          </Col>
        </Row>
          
        </Content>
      </Layout>
      </div>
    );
  }
}

export default App;

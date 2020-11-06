import React from 'react';
import './App.css';
import AcademicRecordPage from './pages/AcademicRecordPage';
import { Layout, Menu } from 'antd';
import {
  AuditOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import { Link, Route, Switch, BrowserRouter as Router, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';

const { Sider } = Layout;
const { SubMenu } = Menu;

function Nav() {
  let location = useLocation();

  return <Sider>
    <Menu theme="dark" mode="inline" defaultSelectedKeys={[location.pathname]}>
      <Menu.Item key="/" icon={<HomeOutlined />}>
        <Link to="/">Home</Link>
      </Menu.Item>
      <Menu.Item key="/academics" icon={<AuditOutlined />}>
        <Link to="/academics">Academic Records</Link>
      </Menu.Item>
    </Menu>
  </Sider>
}

function App() {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Nav />
        <Switch>
          <Route exact path={"/"}>
            <HomePage />
          </Route>
          <Route path={"/academics"}>
            <AcademicRecordPage />
          </Route>
        </Switch>
      </Layout>
    </Router>
  );
}

export default App;

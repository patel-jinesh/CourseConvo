import React from 'react';
import './App.css';
import AcademicRecordPage from './pages/AcademicRecordPage';
import { Layout, Menu } from 'antd';
import {
  AuditOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import { Link, Route, Switch, BrowserRouter as Router} from 'react-router-dom';
import HomePage from './pages/HomePage';

const { Sider } = Layout;
const { SubMenu } = Menu;

function App() {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={["0"]}>
            <Menu.Item key="0" icon={<HomeOutlined />}>
              <Link to="/">Home</Link>
            </Menu.Item>
            <Menu.Item icon={<AuditOutlined />}>
              <Link to="/academics">Academic Records</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        
        <Switch>
          <Route exact path={"/"}>
            <HomePage />
          </Route>
          <Route path={"/academics"}>
            <AcademicRecordPage/>
          </Route>
        </Switch>
        </Layout>
    </Router>
  );
}

export default App;

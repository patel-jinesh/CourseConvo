import React from 'react';
import './App.css';
import AcademicRecordPage from './pages/AcademicRecordPage';
import { Layout, Menu } from 'antd';
import {
  AuditOutlined,
  HomeOutlined,
  PieChartOutlined,
  CommentOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { Link, Route, Switch, BrowserRouter as Router, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';

const { Sider } = Layout;
const { SubMenu } = Menu;

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Nav() {
  let location = useLocation();
  let query = useQuery();

  return <Sider>
    <Menu theme="dark" mode="inline" defaultSelectedKeys={[location.pathname]}>
      <Menu.ItemGroup title="Main">
        <Menu.Item key="/" icon={<HomeOutlined />}>
          <Link to="/">Home</Link>
        </Menu.Item>
        <Menu.Item key="/academics" icon={<AuditOutlined />}>
          <Link to="/academics">Academic Records</Link>
        </Menu.Item>
      </Menu.ItemGroup>
      <Menu.ItemGroup title="Courses">
        <Menu.Item key="/information" icon={<InfoCircleOutlined />}>Information</Menu.Item>
        <Menu.Item key="/breakdown" icon={<PieChartOutlined/>}>Breakdown</Menu.Item>
        <Menu.Item key="/reviews" icon={<CommentOutlined />}>Reviews</Menu.Item>
      </Menu.ItemGroup>
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

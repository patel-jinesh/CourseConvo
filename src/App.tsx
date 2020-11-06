import React from 'react';
import './App.css';
import AcademicRecordPage from './pages/AcademicRecordPage';
import { Layout, Menu } from 'antd';
import {
  AuditOutlined,
  HomeOutlined,
  PieChartOutlined,
  CommentOutlined,
  SearchOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { Link, Route, Switch, BrowserRouter as Router, useLocation, useHistory } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SearchCoursePage from './pages/SearchCoursePage';

const { Sider } = Layout;
const { SubMenu } = Menu;

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Nav() {
  let history = useHistory();
  let query = useQuery();

  return (
    <Sider style={{ position: "sticky", height: '100vh', top: '0' }}>
      <Menu theme="dark" mode="inline" selectedKeys={[history.location.pathname]}>
        <Menu.ItemGroup title="Main">
          <Menu.Item key="/" icon={<HomeOutlined />}>
            <Link to="/">Home</Link>
          </Menu.Item>
          <Menu.Item key="/academics" icon={<AuditOutlined />}>
            <Link to="/academics">Academic Records</Link>
          </Menu.Item>
        </Menu.ItemGroup>
        <Menu.ItemGroup title="Courses">
          <Menu.Item key="/search" icon={<SearchOutlined />}>
            <Link to={{ pathname: '/search' }}>Search</Link>
          </Menu.Item>
          <Menu.Item key="/information" disabled={!query.has('id')} icon={<InfoCircleOutlined />}>
            <Link to={{ pathname: '/information', search: query.toString() }}>Information</Link>
          </Menu.Item>
          <Menu.Item key="/breakdown" disabled={!query.has('id')} icon={<PieChartOutlined />}>
            <Link to={{ pathname: '/breakdown', search: query.toString() }}>Breakdown</Link>
          </Menu.Item>
          <Menu.Item key="/reviews" disabled={!query.has('id')} icon={<CommentOutlined />}>
            <Link to={{ pathname: '/reviews', search: query.toString() }}>Reviews</Link>
          </Menu.Item>
        </Menu.ItemGroup>
      </Menu>
    </Sider>
  );
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
          <Route path={"/search"}
            render={
              props => <SearchCoursePage />
            }>
          </Route>
        </Switch>
      </Layout>
    </Router>
  );
}

export default App;
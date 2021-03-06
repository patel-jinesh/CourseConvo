import { AuditOutlined, BulbOutlined, CommentOutlined, HomeOutlined, InfoCircleOutlined, PieChartOutlined, SearchOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { BrowserRouter as Router, Link, Redirect, Route, Switch, useHistory, useLocation } from 'react-router-dom';
import '../node_modules/react-vis/dist/style.css';
import './App.css';
import { RootState } from './app/store';
import AcademicRecordPage from './pages/AcademicRecordPage';
import CourseBreakdownsPage from './pages/CourseBreakdownPage';
import CourseInformationPage from './pages/CourseInformationPage';
import CourseReviewsPage from './pages/CourseReviewsPage';
import ElectivePage from './pages/ElectivePage';
import HomePage from './pages/HomePage';
import SearchCoursePage from './pages/SearchCoursePage';

const { Sider } = Layout;

type ComponentProps = {}
type ComponentState = {}

const mapState = (state: RootState, props: ComponentProps) => ({
  courses: Object.keys(state.courses),
  instances: Object.keys(state.instances)
})

const mapDispatch = {}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

type Props = ReduxProps & ComponentProps;
type State = ComponentState

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
          <Menu.Item key="/electives" icon={<BulbOutlined />}>
            <Link to={{ pathname: "/electives", search: query.toString(), state: history.location.state }}>Electives</Link>
          </Menu.Item>
        </Menu.ItemGroup>
        <Menu.ItemGroup title="Courses">
          <Menu.Item key="/search" icon={<SearchOutlined />}>
            <Link to={{ pathname: '/search', state: history.location.state }}>Search</Link>
          </Menu.Item>
          <Menu.Item key="/information" disabled={!query.has('courseID')} icon={<InfoCircleOutlined />}>
            <Link to={{ pathname: '/information', search: query.toString(), state: history.location.state }}>Information</Link>
          </Menu.Item>
          <Menu.Item key="/breakdowns" disabled={!query.has('courseID')} icon={<PieChartOutlined />}>
            <Link to={{ pathname: '/breakdowns', search: query.toString(), state: history.location.state }}>Breakdowns</Link>
          </Menu.Item>
          <Menu.Item key="/reviews" disabled={!query.has('courseID')} icon={<CommentOutlined />}>
            <Link to={{ pathname: '/reviews', search: query.toString(), state: history.location.state }}>Reviews</Link>
          </Menu.Item>
        </Menu.ItemGroup>
      </Menu>
    </Sider>
  );
}

class App extends React.Component<Props, State> {
  render() {
    return (
      <Router>
        <Layout style={{ minHeight: '100vh' }}>
          <Nav />
          <Switch>
            <Route exact path={"/"}>
              <HomePage />
            </Route>
            <Route path={"/electives"}>
              <ElectivePage />
            </Route>
            <Route path={"/academics"}>
              <AcademicRecordPage />
            </Route>
            <Route path={"/search"}>
              <SearchCoursePage />
            </Route>
            <Route path={"/information"} render={props => {
              let query = new URLSearchParams(props.location.search);

              if (query.has('courseID') && this.props.courses.includes(query.get('courseID')!))
                return <CourseInformationPage />

              return <Redirect to="/search" />;
            }}>
            </Route>
            <Route path={"/breakdowns"} render={props => {
              let query = new URLSearchParams(props.location.search);

              if (query.has('courseID') && this.props.courses.includes(query.get('courseID')!))
                return <CourseBreakdownsPage />

              return <Redirect to="/search" />;
            }}>
            </Route>
            <Route path={"/reviews"} render={props => {
              let query = new URLSearchParams(props.location.search);

              if (query.has('courseID') && this.props.courses.includes(query.get('courseID')!))
                return <CourseReviewsPage />

              return <Redirect to="/search" />;
            }}>
            </Route>
          </Switch>
        </Layout>
      </Router>
    );
  }
}

export default connector(App);
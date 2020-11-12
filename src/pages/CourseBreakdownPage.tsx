import { Layout, PageHeader } from "antd";
import { History, Location } from "history";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { match, withRouter } from "react-router-dom";
import { RootState } from "../app/store";

const { Content } = Layout;

type ComponentProps = {
    match: match,
    location: Location,
    history: History,
}

type ComponentState = {}

const mapState = (state: RootState, props: ComponentProps) => {
    let queryID = (new URLSearchParams(props.location.search)).get('courseID')!;

    return {
        reviews: Object.values(state.reviews).filter(review => state.instances[review.instanceID].courseID === queryID),
        course: state.courses[queryID],
    }
};

const mapDispatch = {}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

type Props = ReduxProps & ComponentProps;
type State = ComponentState

class CourseBreakdownPage extends React.Component<Props, State> {
    state: State = {}

    render() {
        return (
            <PageHeader
                style={{ width: "100%" }}
                backIcon={false}
                title={`${this.props.course?.subject} ${this.props.course?.code} - ${this.props.course?.name}`}>
                <Content style={{ padding: 24 }}>

                </Content>
            </PageHeader>
        );
    }
}

export default withRouter(connector(CourseBreakdownPage));
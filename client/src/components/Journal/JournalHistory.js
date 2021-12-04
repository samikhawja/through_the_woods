import React from "react";
import { Tab, ListGroup, Col, Row } from "react-router-dom";

const myStyle = {
  color: "#403F48",
  backgroundColor: "#95A792",
  position: "fixed",
  left: "0",
  bottom: "0",
  height: "60px",
  width: "100%",
};
const History = () => {
  return (
    <Tab.Container
      style={myStyle}
      id="list-group-tabs-example"
      defaultActiveKey="#link1"
    >
      <Row>
        <Col sm={4}>
          <ListGroup>
            <ListGroup.Item action href="#link1">
              Link 1
            </ListGroup.Item>
            <ListGroup.Item action href="#link2">
              Link 2
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col sm={8}>
          <Tab.Content>
            <Tab.Pane eventKey="#link1"></Tab.Pane>
            <Tab.Pane eventKey="#link2"></Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
  );
};

export default History;
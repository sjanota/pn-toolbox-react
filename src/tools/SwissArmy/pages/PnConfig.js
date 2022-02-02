import { useState } from "react";
import ReactBSAlert from "react-bootstrap-sweetalert";

// reactstrap components
import {
  Container,
  Button,
  Card,
  CardHeader,
  CardBody,
  Form,
  FormGroup,
  Input,
  Row,
  Col,
} from "reactstrap";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

// core components
import { useKeySetData } from "../../KeySetProvider";
import { useSwissArmyData } from "../SwissArmyProvider";

const PnConfig = () => {
  const keySetContext = useKeySetData();
  const swissArmyContext = useSwissArmyData();

  console.log("PnConfig keySetContext: ", keySetContext);
  console.log("PnConfig swissArmyContext: ", swissArmyContext);

  const [property, setProperty] = useState();
  const [filter, setFilter] = useState();
  const [newVal, setNewVal] = useState();

  const [rawProps, setRawProps] = useState();
  const [pnConfigProps, setPnConfigProps] = useState();

  const [sweetAlert, setSweetAlert] = useState(null);

  const retrieveProperties = () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    timerAlert("Fetching pnconfig props", "Please wait while we retrieve the properties...", 5000);

    let uri = `/pnconfig?user=craig&subkey=${keySetContext.subKey}`;
    if (property != null && property !== "") {
      uri = uri + `&prop=${property}`;
    }
    else if (filter != null && filter !== "") {
      uri = uri + `&filter=${filter}`;
    }

    fetch(uri, { signal: controller.signal }).then(res => res.json()).then(
      (result) => {
        console.log(result);
        let payload = [];

        console.log("result", result);
        setRawProps(result.properties);

        Object.keys(result.properties).forEach(key => {
          let item = {};
          item.n = key;
          item.v = result.properties[key];
          payload.push(item);
        });

        setPnConfigProps(payload);
        clearTimeout(timeoutId);
        hideAlert();
      },
      (error) => {
        console.log("pnconfig error:", error);
        setPnConfigProps([]);
        timerAlert("pnconfig error", JSON.stringify(error, null, 2), 2000);
      }
    );
  }

  const updateProperty = () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    timerAlert("Updating pnconfig prop", "Please wait while we update the property...", 5000);

    let uri = `/setpnconfig?user=craig&subkey=${keySetContext.subKey}&prop=${property}&value=${newVal}`;

    // let body = {};
    // body.user = "craig";
    // body.subkey = keySetContext.subKey;
    // body.prop = property;
    // body.value = newVal;

    fetch(uri, { 
      signal: controller.signal,
      // method: "PUT",
      // headers: {"Content-Type":"application/json"},
      // body: JSON.stringify(body) 
    }).then(res => res.json()).then(
      (result) => {
        console.log(result);
        // let payload = [];

        console.log("result", result);
        // setRawProps(result.properties);

        // Object.keys(result.properties).forEach(key => {
        //   let item = {};
        //   item.n = key;
        //   item.v = result.properties[key];
        //   payload.push(item);
        // });

        // setPnConfigProps(payload);
        // create a new output for update success
        clearTimeout(timeoutId);
        hideAlert();
      },
      (error) => {
        console.log("update pnconfig error:", error);
        // setPnConfigProps([]);
        timerAlert("update pnconfig error", JSON.stringify(error, null, 2), 3000);
      }
    );
  }

  // const updateProperty = () => {
  //   const controller = new AbortController();
  //   const timeoutId = setTimeout(() => controller.abort(), 5000);
  //   timerAlert("Updating pnconfig prop", "Please wait while we update the property...", 5000);

  //   let uri = `/pnconfig`

  //   let body = {};
  //   body.user = "craig";
  //   body.subkey = keySetContext.subKey;
  //   body.prop = property;
  //   body.value = newVal;

  //   fetch(uri, { 
  //     signal: controller.signal,
  //     method: "PUT",
  //     headers: {"Content-Type":"application/json"},
  //     body: JSON.stringify(body) 
  //   }).then(res => res.json()).then(
  //     (result) => {
  //       console.log(result);
  //       // let payload = [];

  //       console.log("result", result);
  //       // setRawProps(result.properties);

  //       // Object.keys(result.properties).forEach(key => {
  //       //   let item = {};
  //       //   item.n = key;
  //       //   item.v = result.properties[key];
  //       //   payload.push(item);
  //       // });

  //       // setPnConfigProps(payload);
  //       // create a new output for update success
  //       clearTimeout(timeoutId);
  //       hideAlert();
  //     },
  //     (error) => {
  //       console.log("update pnconfig error:", error);
  //       // setPnConfigProps([]);
  //       timerAlert("update pnconfig error", JSON.stringify(error, null, 2), 3000);
  //     }
  //   );
  // }

  const hideAlert = () => {
    console.log("hideAlert");
    setSweetAlert(null);
  };

  const timerAlert = (title, message, delay) => {
    setSweetAlert(
      <ReactBSAlert
        style={{ display: "block", marginTop: "100px" }}
        title={title}
        onConfirm={() => hideAlert()}
        showConfirm={false}
      >
        {message}
      </ReactBSAlert>
    );
    setTimeout(function () { hideAlert() }, delay);
  };

  return (
    <>
      {sweetAlert}
      <Container className="mt--7" fluid>

        <Row className="mt-0">
          <Col className="order-xl-2">
            <Card className="bg-secondary shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">pnconfig properties</h3>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                <Form>
                  <Row>
                    <Col sm="2">
                      <FormGroup>
                        <Row>
                          <Col>
                            <label
                              className="form-control-label"
                              htmlFor="input-property"
                            >
                              Property
                            </label>
                          </Col>
                        </Row>
                        <Input
                          className="form-control-alternative"
                          id="input-property"
                          placeholder="Enter a property"
                          type="text"
                          value={property}
                          onChange={(e) => setProperty(e.target.value)}
                        />
                      </FormGroup>
                      <FormGroup>
                        <Row>
                          <Col>
                            <label
                              className="form-control-label"
                              htmlFor="input-filter"
                            >
                              Filter
                            </label>
                          </Col>
                        </Row>
                        <Input
                          className="form-control-alternative"
                          id="input-filter"
                          placeholder="Enter a property filter"
                          type="text"
                          value={filter}
                          onChange={(e) => setFilter(e.target.value)}
                        />
                      </FormGroup>
                      <Row>
                        <Col className="col text-right">
                          <Button
                            color="danger"
                            onClick={retrieveProperties}
                            size="sm"
                            disabled={keySetContext.subKey == null || keySetContext.subKey === ""}
                          >
                            Retrieve Properties
                          </Button>
                        </Col>
                      </Row>
                    </Col>
                    <Col sm="4">
                      <FormGroup>
                        <Row>
                          <Col>
                            <label
                              className="form-control-label"
                              htmlFor="input-new-value"
                            >
                              New Value
                            </label>
                          </Col>
                        </Row>
                        <Input
                          className="form-control-alternative"
                          id="input-new-value"
                          placeholder="Enter a new value"
                          type="text"
                          value={newVal}
                          onChange={(e) => setNewVal(e.target.value)}
                        />
                      </FormGroup>
                      <Row>
                        <Col className="col text-right">
                          <Button
                            color="danger"
                            onClick={updateProperty}
                            size="sm"
                            disabled={keySetContext.subKey == null || keySetContext.subKey === ""
                              || property == null || property === "" || newVal == null || newVal === "" }
                          >
                            Update Property
                          </Button>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
              <CardBody>
                <Row className="mt-0">
                  <Col className="order-xl-2">
                    <CardHeader>
                      <Row>
                        <Col>
                          <label
                            className="form-control-label"
                            htmlFor="output-received-messages"
                          >
                            Output
                          </label>
                        </Col>
                        <Col className="col text-right">
                          <Button
                            color="danger"
                            size="sm"
                            onClick={() => setPnConfigProps()}
                          >
                            Clear
                          </Button>
                        </Col>
                      </Row>
                    </CardHeader>
                    <Card className="bg-secondary shadow">
                      <div className="pl-lg-12">
                        <Col>
                          <Row>
                            {pnConfigProps != null &&
                              <PropertiesTable rows={pnConfigProps} />
                            }
                          </Row>
                          <p/>
                          <Row>
                            <Col>
                              <Row>Raw Data</Row>
                              <Row><pre>{JSON.stringify(rawProps, null, 2)}</pre></Row>
                            </Col>
                          </Row>
                        </Col>
                      </div>
                    </Card>
                  </Col>
                </Row>
              </CardBody>
            </Card>
            <p/>
          </Col>
        </Row>

      </Container>
    </>
  );
}

export default PnConfig;

const PropertiesTable = ({ rows }) => {
  console.log("properties", rows);

  if (rows == null || rows.length === 0) return <>No Results</>;

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align="right">#</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Value</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((prop, index) => (
              <PropRow index={index} prop={prop} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

const PropRow = ({ index, prop }) => {
  return (
    <>
      <TableRow key={index} sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell align="right">{index}</TableCell>
        <TableCell component="th" scope="row" width="10%">{prop.n}</TableCell>
        <TableCell component="th" scope="row" width="90%">{JSON.stringify(prop.v, null, 2)}</TableCell>
      </TableRow>
    </>
  );
}
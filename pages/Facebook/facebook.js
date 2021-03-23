import "@ag-grid-community/all-modules/dist/styles/ag-grid.css";
import "@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css";

import React, { Component, Fragment } from "react";
import { Row, Button, Card, CardBody, Input } from "reactstrap";
import { AgGridReact } from "@ag-grid-community/react";
import { AllCommunityModules } from "@ag-grid-community/all-modules";
import { Colxx } from "../../components/Colxx";

class idolList extends Component {
  constructor(props) {
    super();

    this.state = {
      selectedByIdolName: "",
      modules: [...AllCommunityModules],
      columnDefs: [
        {
          colId: "id",
          headerName: "#",
          field: "id",
          width: 50,
          cellClass: "text-muted truncate",
          valueFormatter: (params) => params.node.rowIndex + 1,
        },
        {
          colId: "fid",
          headerName: "FID",
          field: "uid",
          with: 200,
          cellClass: "truncate",
          // hide: true
        },
        {
          colId: "createdTime",
          headerName: "Tao luc",
          field: "label",
          width: 180,
          cellClass: "text-muted truncate",
        },
      ],
      defaultColDef: {
        resizable: true,
        sortable: true,
        filter: true,
      },

      data: null,
      // frameworkComponents: {
      //     actionCellRenderer: ActionCellRenderer
      // },
    };
  }

  onGridReady = (params) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.handleFetchData();
  };

  onKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      this.handleFetchData();
    }
  };

  handleFetchData = async () => {
    let query = [];
    if (keyword) {
      query.push(`keyword=${encodeURIComponent(keyword)}`);
    }

    const data = await fetch("/api/facebook?" + query.join("&"))
      .then(async (resp) => await resp.json())
      .then((data) => data);

    console.log(data);
    this.setState({ data });
  };

  handleColumnVisibilityChange = (e) => {
    let { columnDefs } = this.state;
    let nextColumnDefs = columnDefs.map((el) => {
      if (el.colId === e.colId) {
        return {
          ...el,
          hide: !el.hide,
        };
      }
      return el;
    });
    this.setState({
      columnDefs: nextColumnDefs,
    });
  };

  render() {
    return (
      <Fragment>
        <Row>
          <Colxx xxs="12">
            <Row>
              <Card className="mb-4 w-100">
                <CardBody>
                  <div className="w-100 mb-2 d-flex align-items-center">
                    <div className="d-flex align-items-center mr-3">
                      Ten
                      <Input
                        type="text"
                        defaultValue={this.state.selectedByIdolName}
                        onChange={(event) => {
                          this.setState({ selectedByIdolName: event.target.value });
                        }}
                        onKeyDown={this.onKeyDown}
                      />
                    </div>
                    <div className="mr-1">
                      <Button
                        // className={classes.__btn_search}
                        outline
                        color="primary"
                        size="sm"
                        onClick={this.handleFetchData}
                      >
                        <i className="glyph-icon simple-icon-magnifier" />
                      </Button>
                    </div>
                    <div className="flex-1"></div>
                    <div className="mr-1">
                      <Button outline color="primary" size="sm" onClick={this.handleFetchData}>
                        <i className="simple-icon-reload" />
                      </Button>
                    </div>
                  </div>
                  <div className="mb-4 w-100" style={{ height: 600 }}>
                    <div className="ag-theme-alpine no-outbox-border w-100 h-100">
                      <AgGridReact
                        modules={this.state.modules}
                        columnDefs={this.state.columnDefs}
                        defaultColDef={this.state.defaultColDef}
                        rowData={this.state.data}
                        onGridReady={this.onGridReady}
                        frameworkComponents={this.state.frameworkComponents}
                      />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Row>
          </Colxx>
        </Row>
      </Fragment>
    );
  }
}

const styles = {
  __checkbox_row: {
    padding: "0px 4px",
    "&:hover": {
      borderRadius: 4,
      backgroundColor: "#e4e4e4",
    },
  },
  __btn_no_padding: {
    padding: "2px 12px",
  },
};

export default idolList;

// export default withRouter(
//     injectIntl(
//         connect(
//             ({ authUser, settings }) => ({
//                 userPermission: authUser.userPermission,
//                 themeSetting: settings.theme.split(".")[0]
//             }),
//             dispatchToProps({
//                 getIdol,
//                 deleteIdol
//             })
//         )(withStyles(styles)(idolList))
//     )
// );

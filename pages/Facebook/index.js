import React, { useState } from "react";
import { Input } from "reactstrap";
import moment from "moment";
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";

const App = () => {
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);

  const [keywords, setKeywords] = useState("");

  const [rowData, setRowData] = useState(null);

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  const handleFetchData = async () => {
    let query = [];
    if (keywords) {
      query.push(`keywords=${encodeURIComponent(keywords)}`);
    }

    gridApi.showLoadingOverlay();
    const data = await fetch("/api/facebook?" + query.join("&"))
      .then(async (resp) => await resp.json())
      .then((data) => data);

    setRowData(data);
    gridApi.hideOverlay();
  };

  const onKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleFetchData();
    }
  };

  React.useEffect(() => {
    if (gridApi && gridColumnApi) {
      handleFetchData();
    }
  }, [gridApi, gridColumnApi]);

  return (
    <>
      <Input
        type="text"
        defaultValue={keywords}
        onChange={(event) => {
          setKeywords(event.target.value);
        }}
        onKeyDown={onKeyDown}
      />
      <div className="ag-theme-alpine" style={{ height: "90vh", width: "100%" }}>
        <AgGridReact onGridReady={onGridReady} rowData={rowData}>
          <AgGridColumn field="uid" filter={true}></AgGridColumn>
          <AgGridColumn field="type" filter={true}></AgGridColumn>
          <AgGridColumn field="label" filter={true}></AgGridColumn>
          <AgGridColumn
            field="createdTime"
            filter={true}
            valueFormatter={({ value }) => (value ? moment(value).format("DD-MM-YYYY HH:mm:ss") : "")}
          ></AgGridColumn>
          <AgGridColumn field="permalink" filter={true}></AgGridColumn>
        </AgGridReact>
      </div>
    </>
  );
};
export default App;

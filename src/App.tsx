import './App.css';
import { Grid, MuiThemeProvider, Button } from "@material-ui/core";
import { createTheme } from "@material-ui/core/styles";
import MaterialTable from './material-table'
import {data, columns} from './data/data'
import React from 'react';
function App() {

  let direction = "ltr"; // direction = 'rtl';
  const theme = createTheme({
    //direction: Direction.ltr,
    palette: {
      type: "light",
    },
  });

  const darkTheme = createTheme({
    //direction: Direction.ltr,
    palette: {
      type: "light",
    },
  });
  
  return (
    <div style={{ maxWidth: "100%" }}>
    

    <MuiThemeProvider theme={theme}>
       {Editable()}  
    </MuiThemeProvider>
    
    <br /><br /><br />

    <MuiThemeProvider theme={darkTheme}>
      {ConditionalActions()} 
    </MuiThemeProvider>  

    <br /><br /><br />

    <MuiThemeProvider theme={theme}>
      {DetailPanelWithRowClick()}
    </MuiThemeProvider>

    </div>
  );
}

function DetailPanelWithRowClick() {
  return (
    <MaterialTable
      columns={columns}
      data={data}
      title="Detail Panel With RowClick Preview"
      detailPanel={() => {
        return (
          <iframe
            width="100%"
            height="315"
            src="https://www.youtube.com/embed/C0DPdy98e4c"
            // frameborder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            // allowfullscreen
          />
        )
      }}
      onRowClick={(event:any, rowDat:any, togglePanel:any) => togglePanel()}
    />
  )
}

function Editable() {
  const { useState } = React;

  const [cols, setColumns] = useState(columns);

  const [theData, setData] = useState(data);

  return (
    <MaterialTable
      title="Editable Preview"
      columns={cols}
      data={theData}
      editable={{
        onRowAdd: newData =>
          new Promise<void>((resolve, reject) => {
            setTimeout(() => {
              setData([...theData, newData]);
              
              resolve();
            }, 1000)
          }),
        onRowUpdate: (newData, oldData) =>
          new Promise<void>((resolve, reject) => {
            setTimeout(() => {
              const dataUpdate = [...theData];
              const index = oldData.tableData.id;
              dataUpdate[index] = newData;
              setData([...dataUpdate]);

              resolve();
            }, 1000)
          }),
        onRowDelete: oldData =>
          new Promise<void>((resolve, reject) => {
            setTimeout(() => {
              const dataDelete = [...theData];
              const index = oldData.tableData.id;
              dataDelete.splice(index, 1);
              setData([...dataDelete]);
              
              resolve()
            }, 1000)
          }),
      }}
    />
  )
}

function ConditionalActions() {
  return (
    <MaterialTable
      title="Conditional Actions Preview"
      columns={[
        { title: 'Name', field: 'name' },
        { title: 'Surname', field: 'surname' },
        { title: 'Birth Year', field: 'birthYear', type: 'numeric' },
        {
          title: 'Birth Place',
          field: 'birthCity',
          lookup: { 34: 'İstanbul', 63: 'Şanlıurfa' },
        },
      ]}
      data={[
        { name: 'Mehmet', surname: 'Baran', birthYear: 1987, birthCity: 63 },
        { name: 'Zerya Betül', surname: 'Baran', birthYear: 2017, birthCity: 34 },
      ]}
      actions={[
        {
          icon: 'save',
          tooltip: 'Save User',
          onClick: (event: any, rowData: any) => alert("You saved " + rowData.name)
        },
        (rowData:any) => ({
          icon: 'delete',
          tooltip: 'Delete User',
          onClick: (event: any, rowData: any) => alert("You want to delete " + rowData.name),
          disabled: rowData.birthYear < 2000
        })
      ]}
    />
  )
}

export default App;

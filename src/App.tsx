
import logo from './logo.svg';
import './App.css';
import { Grid, MuiThemeProvider, Button } from "@material-ui/core";
import { createTheme } from "@material-ui/core/styles";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import MaterialTable from './material-table'
//import gridData from "./data/data";
//import gridColumns from "./data/columns";

function App() {

  let direction = "ltr"; // direction = 'rtl';
  const theme = createTheme({
    //direction: Direction.ltr,
    palette: {
      type: "light",
    },
  });
  
  return (
    <div className="App">
      vvv
                <MaterialTable
                  title="Basic Tree Data Preview"
                  data={[
                    {
                      id: 1,
                      name: 'a',
                      surname: 'Baran',
                      birthYear: 1987,
                      birthCity: 63,
                      sex: 'Male',
                      type: 'adult',
                    },
                    {
                      id: 2,
                      name: 'b',
                      surname: 'Baran',
                      birthYear: 1987,
                      birthCity: 34,
                      sex: 'Female',
                      type: 'adult',
                      parentId: 1,
                    },
                    {
                      id: 3,
                      name: 'c',
                      surname: 'Baran',
                      birthYear: 1987,
                      birthCity: 34,
                      sex: 'Female',
                      type: 'child',
                      parentId: 1,
                    },
                    {
                      id: 4,
                      name: 'd',
                      surname: 'Baran',
                      birthYear: 1987,
                      birthCity: 34,
                      sex: 'Female',
                      type: 'child',
                      parentId: 3,
                    },
                    {
                      id: 5,
                      name: 'e',
                      surname: 'Baran',
                      birthYear: 1987,
                      birthCity: 34,
                      sex: 'Female',
                      type: 'child',
                    },
                    {
                      id: 6,
                      name: 'f',
                      surname: 'Baran',
                      birthYear: 1987,
                      birthCity: 34,
                      sex: 'Female',
                      type: 'child',
                      parentId: 5,
                    },
                  ]}
                  columns={[
                    { title: 'Adı', field: 'name' },
                    { title: 'Soyadı', field: 'surname' },
                    { title: 'Cinsiyet', field: 'sex' },
                    { title: 'Tipi', field: 'type', removable: false },
                    { title: 'Doğum Yılı', field: 'birthYear', type: 'numeric' },
                    {
                      title: 'Doğum Yeri',
                      field: 'birthCity',
                      lookup: { 34: 'İstanbul', 63: 'Şanlıurfa' },
                    },
                  ]}
                  parentChildData={(row:any, rows:any) => rows.find((a: { id: any; })  => a.id === row.parentId)}
                  options={{
                    selection: true,
                  }}
                />
            
    </div>
  );
}

export default App;

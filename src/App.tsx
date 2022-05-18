import './App.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MaterialTable from './material-table'
import {data, columns} from './data/data'
import React, { useState } from 'react';
import { MTableToolbar } from './components';
import { Button, Chip } from '@mui/material';


function App() {

  let direction = "ltr"; // direction = 'rtl';
  //const theme = createTheme();

  const theme = createTheme({
    palette: {
      primary: {
        main: '#4caf50',
      },
      secondary: {
        main: '#ff9100',
      },
    },

  });

  const materialTableRef = React.createRef();
  const [state, setState] = useState({initialFormData: {}});
  
  return (
    <div style={{ maxWidth: "100%" }}>




    <ThemeProvider theme={theme}>

    Styling with MUI

    <ThemeProvider theme={theme}>
      <MaterialTable
        title="Styling with MuiThemeProvider Preview"
        columns={[
          {
            title: 'Name', field: 'name',
          },
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
        options={{
          selection: true
        }}
      />
    </ThemeProvider>

    Selected Row Styling

    {SelectedRowStyling()}

    Row Styling 

    <MaterialTable
      title="Row Styling Preview"
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
      options={{
        rowStyle: {
          backgroundColor: '#EEE',
        }
      }}
    />

      Header Styling Cells

      <MaterialTable
      title="Cell Header Styling Preview"
      columns={[
        {
          title: 'Name', field: 'name',
          cellStyle: {
            backgroundColor: '#039be5',
            color: '#FFF'
          },
          headerStyle: {
            backgroundColor: '#039be5',
          }
        },
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
      options={{
        headerStyle: {
          backgroundColor: '#01579b',
          color: '#FFF'
        }
      }}
    />

      Optional Selection Props

      <MaterialTable
      title="Conditional Selection Boxes Preview"
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
      options={{
        selection: true,
        selectionProps: rowData => ({
          disabled: rowData.name === 'Mehmet',
          color: 'primary'
        })
      }}
    />

      Handling Selection Change Events 

      <MaterialTable
        title="Handling Selection Changes Preview"
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
        options={{
          selection: true
        }}
        onSelectionChange={(rows) => alert('You selected ' + rows.length + ' rows')}
      />

      Selection

      <MaterialTable
      title="Basic Selection Preview"
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
      options={{
        selection: true
      }}
    />

      Remote Data

      <MaterialTable
      title="Remote Data Preview"
      columns={[
        {
          title: 'Avatar',
          field: 'avatar',
          render: rowData => (
            <img
              style={{ height: 36, borderRadius: '50%' }}
              src={rowData.avatar}
            />
          ),
        },
        { title: 'Id', field: 'id' },
        { title: 'First Name', field: 'first_name' },
        { title: 'Last Name', field: 'last_name' },
      ]}
      data={query =>
        new Promise((resolve, reject) => {
          let url = 'https://reqres.in/api/users?'
          url += 'per_page=' + query.pageSize
          url += '&page=' + (query.page + 1)
          fetch(url)
            .then(response => response.json())
            .then(result => {
              resolve({
                data: result.data,
                page: result.page - 1,
                totalCount: result.total,
              })
            })
        })
      }
    />

      Grouping

      <MaterialTable
      title="Basic Grouping Preview"
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
      options={{
        grouping: true
      }}
    />

      Frozen

      <MaterialTable
        title="Basic Fixed Columns Preview"
        columns={[
          { title: 'Name', field: 'name', width: 150 },
          { title: 'Surname', field: 'surname', width: 150 },
          { title: 'Birth Year', field: 'birthYear', type: 'numeric', width: 150 },
          {
            title: 'Birth Place',
            field: 'birthCity',
            lookup: { 34: 'İstanbul', 63: 'Şanlıurfa' },
            width: 150
          },
          { title: 'Name', field: 'name', width: 150 },
          { title: 'Surname', field: 'surname', width: 150 },
          { title: 'Birth Year', field: 'birthYear', type: 'numeric', width: 150 },
          {
            title: 'Birth Place',
            field: 'birthCity',
            lookup: { 34: 'İstanbul', 63: 'Şanlıurfa' },
            width: 150
          },
        ]}
        data={[
          { name: 'Mehmet', surname: 'Baran', birthYear: 1987, birthCity: 63 },
          { name: 'Zerya Betül', surname: 'Baran', birthYear: 2017, birthCity: 34 },
        ]}        
        options={{
          fixedColumns: {
            left: 2,
            right: 1
          }
        }}
      />
    )

      Toggle Panel On Rowc Click

      <MaterialTable
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
        { name: 'Zerya Betül', surname: 'Baran', birthYear: 1987, birthCity: 63 },
      ]}
      title="Detail Panel With RowClick Preview"
      detailPanel={rowData => {
        return (
          <iframe
            width="100%"
            height="315"
            src="https://www.youtube.com/embed/C0DPdy98e4c"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          />
        )
      }}
      onRowClick={(event, rowData, togglePanel) => togglePanel()}
    />

    Frozen Cliumns

    <MaterialTable
        title="Basic Fixed Columns Preview"
        columns={[
          { title: 'Name', field: 'name', width: 150 },
          { title: 'Surname', field: 'surname', width: 150 },
          { title: 'Birth Year', field: 'birthYear', type: 'numeric', width: 150 },
          {
            title: 'Birth Place',
            field: 'birthCity',
            lookup: { 34: 'İstanbul', 63: 'Şanlıurfa' },
            width: 150
          },
          { title: 'Name', field: 'name', width: 150 },
          { title: 'Surname', field: 'surname', width: 150 },
          { title: 'Birth Year', field: 'birthYear', type: 'numeric', width: 150 },
          {
            title: 'Birth Place',
            field: 'birthCity',
            lookup: { 34: 'İstanbul', 63: 'Şanlıurfa' },
            width: 150
          },
        ]}
        data={[
          { name: 'Mehmet', surname: 'Baran', birthYear: 1987, birthCity: 63 },
          { name: 'Zerya Betül', surname: 'Baran', birthYear: 2017, birthCity: 34 },
        ]}        
        options={{
          fixedColumns: {
            left: 2,
            right: 1
          }
        }}
      />
    )

      Multiple Detail Panels

      <MaterialTable
      title="Multiple Detail Panels Preview"
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
      detailPanel={[
        {
          tooltip: 'Show Name',
          render: rowData => {
            return (
              <div
                style={{
                  fontSize: 100,
                  textAlign: 'center',
                  color: 'white',
                  backgroundColor: '#43A047',
                }}
              >
                {rowData.name}
              </div>
            )
          },
        },
        {
          icon: 'account_circle',
          tooltip: 'Show Surname',
          render: rowData => {
            return (
              <div
                style={{
                  fontSize: 100,
                  textAlign: 'center',
                  color: 'white',
                  backgroundColor: '#E53935',
                }}
              >
                {rowData.surname}
              </div>
            )
          },
        },
        {
          icon: 'favorite_border',
          openIcon: 'favorite',
          tooltip: 'Show Both',
          render: rowData => {
            return (
              <div
                style={{
                  fontSize: 100,
                  textAlign: 'center',
                  color: 'white',
                  backgroundColor: '#FDD835',
                }}
              >
                {rowData.name} {rowData.surname}
              </div>
            )
          },
        },
      ]}
    />

      Detail Panel

      <MaterialTable
      title="One Detail Panel Preview"
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
      detailPanel={rowData => {
        return (
          <iframe
            width="100%"
            height="315"
            src="https://www.youtube.com/embed/C0DPdy98e4c"
           
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            
          />
        )
      }}
    />
  )

      Action Overriding

      <MaterialTable
      title="Action Overriding Preview"
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
          onClick: (event, rowData) => alert("You saved " + rowData.name)
        }
      ]}
      components={{
        Action: props => (
          <Button
            onClick={(event) => props.action.onClick(event, props.data)}
            color="primary"
            variant="contained"
            style={{textTransform: 'none'}}
            size="small"
          >
            My Button
          </Button>
        ),
      }}
    />

      Component Overriding

      <MaterialTable
      title="Toolbar Overriding Preview"
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
      components={{
        Toolbar: props => (
          <div>
            <MTableToolbar {...props} />
            <div style={{padding: '0px 10px'}}>
              <Chip label="Chip 1" color="secondary" style={{marginRight: 5}}/>
              <Chip label="Chip 2" color="secondary" style={{marginRight: 5}}/>
              <Chip label="Chip 3" color="secondary" style={{marginRight: 5}}/>
              <Chip label="Chip 4" color="secondary" style={{marginRight: 5}}/>
              <Chip label="Chip 5" color="secondary" style={{marginRight: 5}}/>
            </div>
          </div>
        ),
      }}
    />

      Editable

      {Editable()}

      <br/><br/><br/>

      Custom Column Renderig:

      <MaterialTable
      title="Render Image Preview"
      columns={[
        { title: 'Avatar', 
          field: 'imageUrl', 
          render: rowData => <img src={rowData.imageUrl} style={{width: 40, borderRadius: '50%'}}/> 
        },
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
        { name: 'Mehmet', surname: 'Baran', birthYear: 1987, birthCity: 63, imageUrl: 'https://avatars0.githubusercontent.com/u/7895451?s=460&v=4' },
        { name: 'Zerya Betül', surname: 'Baran', birthYear: 2017, birthCity: 34, imageUrl: 'https://avatars0.githubusercontent.com/u/7895451?s=460&v=4' },
      ]}        
    />

    <MaterialTable
      title="Free Action Preview"
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
          icon: 'add',
          tooltip: 'Add User',
          isFreeAction: true,
          onClick: (event) => alert("You want to add a new row")
        }
      ]}
    />

    <br/><br/><br/>

    <MaterialTable
      title="Positioning Actions Column Preview"
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
          onClick: (event, rowData) => alert("You saved " + rowData.name)
        },
        rowData => ({
          icon: 'delete',
          tooltip: 'Delete User',
          onClick: (event, rowData) => alert("You want to delete " + rowData.name),
          disabled: rowData.birthYear < 2000
        })
      ]}
      options={{
        actionsColumnIndex: -1
      }}
    />  

      <br/><br/><br/>


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
          onClick: (event, rowData) => alert("You saved " + rowData.name)
        },
        rowData => ({
          icon: 'delete',
          tooltip: 'Delete User',
          onClick: (event, rowData) => alert("You want to delete " + rowData.name),
          disabled: rowData.birthYear < 2000
        })
      ]}
    />

      <br/><br/><br/>

    <MaterialTable
      title="Multiple Actions Preview"
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
          onClick: (event, rowData) => alert("You saved " + rowData.name)
        },
        {
          icon: 'delete',
          tooltip: 'Delete User',
          onClick: (event, rowData) => alert("You want to delete " + rowData.name)
        }
      ]}
    />

    <br/><br/><br/>

    {/* <MaterialTable
        title="Duplicate Action Preview"
        columns={[
          { title: 'Name', field: 'name' },
          { title: 'Surname', field: 'surname' },
          { title: 'Birth Year', field: 'birthYear', type: 'numeric' },
          {
            title: 'Birth Place',
            field: 'birthCity',
            lookup: { 62: 'Cucq' },
          },
        ]}
        data={[
          { name: 'Poyo', surname: 'Man', birthYear: 1992, birthCity: 62 },
        ]}
        tableRef={materialTableRef}
        initialFormData={state.initialFormData}
        actions={[
          {
            icon: 'library_add',
            tooltip: 'Duplicate User',
            onClick: (event, rowData) => {
              const materialTable:any = materialTableRef.current;

              setState({
                initialFormData: {
                  ...rowData,
                  name: null,
                },
              });

              console.log(materialTableRef);

              materialTable.DataManager.changeRowEditing();
              materialTable.setState({
                ...materialTable.DataManager.getRenderState(),
                showAddRow: true,
              });
            }
          }
        ]}
      />   */}

      <br/><br/><br/>


    <MaterialTable
      title="Simple Action Preview"
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
          onClick: (event:any, rowData) => { 
            console.log(rowData)
            alert("You saved " + rowData.name)
          }
        },
        {
          icon: 'edit',
          tooltip: 'Edit User',
          onClick: (event:any, rowData) => { 
            console.log(rowData)
            alert("You Edited " + rowData.name)
          }
        }
      ]}
    />
      {/* {Editable()}<br></br><br/><br/>  
      {ConditionalActions()}<br/><br/>
      {DetailPanelWithRowClick()} */}
    </ThemeProvider>

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

function SelectedRowStyling() {
  const { useState } = React;
  const [selectedRow, setSelectedRow] = useState(null);
  
  return (
    <MaterialTable
      title="Selected Row Styling Preview"
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
      onRowClick={((evt, selectedRow) => setSelectedRow(selectedRow.tableData.id))}
      options={{
        rowStyle: rowData => ({
          backgroundColor: (selectedRow === rowData.tableData.id) ? '#EEE' : '#FFF'
        })
      }}
    />
  )
}

function Editable() {
  //const { useState } = React;

  const [columns, setColumns] = useState([
    { title: 'Name', field: 'name' },
    { title: 'Surname', field: 'surname', initialEditValue: 'initial edit value' },
    { title: 'Birth Year', field: 'birthYear', type: 'numeric' },
    {
      title: 'Birth Place',
      field: 'birthCity',
      lookup: { 34: 'İstanbul', 63: 'Şanlıurfa' },
    },
  ]);

  const [data, setData] = useState([
    { name: 'Mehmet', surname: 'Baran', birthYear: 1987, birthCity: 63 },
    { name: 'Zerya Betül', surname: 'Baran', birthYear: 2017, birthCity: 34 },
  ]);

  return (
    <MaterialTable
      title="Editable Preview"
      columns={columns}
      data={data}
      editable={{
        onRowAdd: newData =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              setData([...data, newData]);
              
              resolve(newData);
            }, 1000)
          }),
        onRowUpdate: (newData, oldData) =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              const dataUpdate = [...data];
              const index = oldData.tableData.id;
              dataUpdate[index] = newData;
              setData([...dataUpdate]);

              resolve(newData);
            }, 1000)
          }),
        onRowDelete: oldData =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              const dataDelete = [...data];
              const index = oldData.tableData.id;
              dataDelete.splice(index, 1);
              setData([...dataDelete]);
              
              resolve(dataDelete)
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

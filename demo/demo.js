import { Grid, MuiThemeProvider, Button } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import MaterialTable from "../src";
import gridData from "./data/data";
import gridColumns from "./data/columns";

let direction = "ltr"; // direction = 'rtl';
const theme = createMuiTheme({
  direction: direction,
  palette: {
    type: "light",
  },
});

const App = () => {
  const tableRef = React.createRef();
  const colRenderCount = 0;

  const [text, setText] = useState("text");
  const [selected, setSelected] = useState(0);
  const [data, setData] = useState(gridData);
  const [columns, setColumns] = useState(gridColumns);

  return (
    <>
      <MuiThemeProvider theme={theme}>
        <div style={{ maxWidth: "100%", direction }}>
          <Grid container>
            <Grid item xs={12}>
              {/* <MaterialTable
                tableRef={tableRef}
                columns={columns}
                data={data}
                title="Demo Title"
                onFilterChange={(appliedFilter) => {
                  console.log("selected Filters : ", appliedFilter);
                }}
                options={{
                  tableLayout: "fixed",
                  columnResizable: true,
                  headerSelectionProps: {
                    color: "primary",
                  },
                  selection: false,
                  selectionProps: (rowData) => {
                    rowData.tableData.disabled = rowData.name === "A1";

                    return {
                      disabled: rowData.name === "A1",
                      color: "primary",
                    };
                  },
                }}
                localization={{
                  body: {
                    emptyDataSourceMessage: "No records to display",
                    filterRow: {
                      filterTooltip: "Filter",
                      filterPlaceHolder: "Filtaaer",
                    },
                  },
                }}
                onSearchChange={(e) => console.log("search changed: " + e)}
                onColumnDragged={(oldPos, newPos) =>
                  console.log(
                    "Dropped column from " + oldPos + " to position " + newPos
                  )
                }
              /> */}
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
      parentChildData={(row, rows) => rows.find(a => a.id === row.parentId)}
      options={{
        selection: true,
      }}
    />
            </Grid>
          </Grid>
          {text}
          <button
            onClick={() => tableRef.current.onAllSelected(true)}
            style={{ margin: 10 }}
          >
            Select
          </button>
        </div>
      </MuiThemeProvider>
    </>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));

module.hot.accept();

//class App1 extends Component {
//   tableRef = React.createRef();

//   colRenderCount = 0;

//   state = {
//     text: "text",
//     selecteds: 0,
//     data: gridData,
//     columns: gridColumns,
//     // remoteColumns: [
//     //   {
//     //     title: "Avatar",
//     //     field: "avatar",
//     //     render: (rowData) => (
//     //       <img
//     //         style={{ height: 36, borderRadius: "50%" }}
//     //         src={rowData.avatar}
//     //       />
//     //     ),
//     //     tooltip: "delakjdslkjdaskljklsdaj",
//     //   },
//     //   { title: "Id", field: "id" },
//     //   { title: "First Name", field: "first_name", defaultFilter: "De" },
//     //   { title: "Last Name", field: "last_name" },
//     // ],
//   };

//   render() {
//     return (
//       <>
//         <MuiThemeProvider theme={theme}>
//           <div style={{ maxWidth: "100%", direction }}>
//             <Grid container>
//               <Grid item xs={12}>
//                 {this.state.selectedRows && this.state.selectedRows.length}
//                 <MaterialTable
//                   tableRef={this.tableRef}
//                   columns={this.state.columns}
//                   data={this.state.data}
//                   title="Demo Title"
//                   onFilterChange={(appliedFilter) => {
//                     console.log("selected Filters : ", appliedFilter);
//                   }}
//                   // cellEditable={{
//                   //   cellStyle: {},
//                   //   onCellEditApproved: (
//                   //     newValue,
//                   //     oldValue,
//                   //     rowData,
//                   //     columnDef
//                   //   ) => {
//                   //     return new Promise((resolve, reject) => {
//                   //       console.log("newValue: " + newValue);
//                   //       setTimeout(resolve, 4000);
//                   //     });
//                   //   },
//                   // }}
//                   options={{
//                     tableLayout: "fixed",
//                     columnResizable: true,
//                     headerSelectionProps: {
//                       color: "primary",
//                     },
//                     selection: false,
//                     selectionProps: (rowData) => {
//                       rowData.tableData.disabled = rowData.name === "A1";

//                       return {
//                         disabled: rowData.name === "A1",
//                         color: "primary",
//                       };
//                     },
//                   }}
//                   // editable={{
//                   //   onBulkUpdate: (changedRows) =>
//                   //     new Promise((resolve, reject) => {
//                   //       console.log(changedRows);
//                   //       setTimeout(() => {
//                   //         {
//                   //           /* const data = this.state.data;
//                   //           data.push(newData);
//                   //           this.setState({ data }, () => resolve()); */
//                   //         }
//                   //         resolve();
//                   //       }, 1000);
//                   //     }),
//                   //   onRowAdd: (newData) =>
//                   //     new Promise((resolve, reject) => {
//                   //       setTimeout(() => {
//                   //         {
//                   //           /* const data = this.state.data;
//                   //           data.push(newData);
//                   //           this.setState({ data }, () => resolve()); */
//                   //         }
//                   //         resolve();
//                   //       }, 1000);
//                   //     }),
//                   //   onRowUpdate: (newData, oldData) =>
//                   //     new Promise((resolve, reject) => {
//                   //       setTimeout(() => {
//                   //         {
//                   //           /* const data = this.state.data;
//                   //           const index = data.indexOf(oldData);
//                   //           data[index] = newData;
//                   //           this.setState({ data }, () => resolve()); */
//                   //         }
//                   //         resolve();
//                   //       }, 1000);
//                   //     }),
//                   //   onRowDelete: (oldData) =>
//                   //     new Promise((resolve, reject) => {
//                   //       setTimeout(() => {
//                   //         {
//                   //           /* let data = this.state.data;
//                   //           const index = data.indexOf(oldData);
//                   //           data.splice(index, 1);
//                   //           this.setState({ data }, () => resolve()); */
//                   //         }
//                   //         resolve();
//                   //       }, 1000);
//                   //     }),
//                   // }}
//                   localization={{
//                     body: {
//                       emptyDataSourceMessage: "No records to display",
//                       filterRow: {
//                         filterTooltip: "Filter",
//                         filterPlaceHolder: "Filtaaer",
//                       },
//                     },
//                   }}
//                   onSearchChange={(e) => console.log("search changed: " + e)}
//                   onColumnDragged={(oldPos, newPos) =>
//                     console.log(
//                       "Dropped column from " + oldPos + " to position " + newPos
//                     )
//                   }
//                 // parentChildData={(row, rows) => rows.find(a => a.id === row.parentId)}
//                 />
//               </Grid>
//             </Grid>
//             {this.state.text}
//             <button
//               onClick={() => this.tableRef.current.onAllSelected(true)}
//               style={{ margin: 10 }}
//             >
//               Select
//             </button>
//             {/* <MaterialTable
//               title={
//                 <Typography variant="h6" color="primary">
//                   Remote Data Preview
//                 </Typography>
//               }
//               columns={[
//                 {
//                   title: "Avatar",
//                   field: "avatar",
//                   render: (rowData) => (
//                     <img
//                       style={{ height: 36, borderRadius: "50%" }}
//                       src={rowData.avatar}
//                     />
//                   ),
//                 },
//                 {
//                   title: "Id",
//                   field: "id",
//                   filterOnItemSelect: true,
//                   filterPlaceholder: "placeholder",
//                   lookup: {
//                     1: "1",
//                     2: "2",
//                     3: "3",
//                     4: "4",
//                     5: "5",
//                     6: "6",
//                     7: "7",
//                     8: "8",
//                     9: "9",
//                     10: "10",
//                     11: "11",
//                     12: "12",
//                   },
//                 },
//                 { title: "First Name", field: "first_name" },
//                 { title: "Last Name", field: "last_name" },
//               ]}
//               options={{
//                 filtering: true,
//                 grouping: true,
//                 groupTitle: (group) => group.data.length,
//                 searchFieldVariant: "outlined",
//               }}
//               localization={{
//                 toolbar: {
//                   searchPlaceholder: "Outlined Search Field",
//                 },
//               }}
//               data={(query) =>
//                 new Promise((resolve, reject) => {
//                   let url = "https://reqres.in/api/users?";
//                   url += "per_page=" + query.pageSize;
//                   url += "&page=" + (query.page + 1);
//                   console.log(query);
//                   fetch(url)
//                     .then((response) => response.json())
//                     .then((result) => {
//                       resolve({
//                         data: result.data,
//                         page: result.page - 1,
//                         totalCount: result.total,
//                       });
//                     });
//                 })
//               }
//             /> */}
//           </div>
//         </MuiThemeProvider>
//       </>
//     );
//   }
// }

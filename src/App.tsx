import './App.css';
import { Grid, MuiThemeProvider, Button } from "@material-ui/core";
import { createTheme } from "@material-ui/core/styles";
import MaterialTable from './material-table'
import {data, columns} from './data/data'
//import gridData from "./data/data";

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
        <MaterialTable
          title="Basic Tree Data Preview"
          data={data}
          columns={columns}
          parentChildData={(row:any, rows:any) => rows.find((a: { id: any; })  => a.id === row.parentId)}
          options={{
            selection: true,
          }}
        />
            
    </div>
  );
}

export default App;

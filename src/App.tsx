import "./App.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { data, columns } from "./data/data";
import React, { useState } from "react";

import { MTableToolbar } from "./components";
import { Button, Chip } from "@mui/material";

//import MaterialTable from "@reactuicomponents/reactmaterialgrid"

import MaterialTable from './material-table'

function App() {
  let direction = "ltr"; // direction = 'rtl';
  const REACT_VERSION = React.version;
  //const theme = createTheme();

  const theme = createTheme({
    palette: {
      primary: {
        main: "#4caf50",
      },
      secondary: {
        main: "#ff9100",
      },
    },
  });

  const materialTableRef = React.createRef();
  
  const [state, setState] = useState({ initialFormData: {} });

  return (
    <div style={{ maxWidth: "100%" }}>
      {REACT_VERSION}<br></br>
      <ThemeProvider theme={theme}>

        French localization
        {Editable()}
       
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
        );
      }}
      onRowClick={(event: any, rowDat: any, togglePanel: any) => togglePanel()}
    />
  );
}

function SelectedRowStyling() {
  const { useState } = React;
  const [selectedRow, setSelectedRow] = useState(null);

  return (
    <MaterialTable
      title="Selected Row Styling Preview"
      columns={[
        { title: "Name", field: "name" },
        { title: "Surname", field: "surname" },
        { title: "Birth Year", field: "birthYear", type: "numeric" },
        {
          title: "Birth Place",
          field: "birthCity",
          lookup: { 34: "İstanbul", 63: "Şanlıurfa" },
        },
      ]}
      data={[
        { name: "Mehmet", surname: "Baran", birthYear: 1987, birthCity: 63 },
        {
          name: "Zerya Betül",
          surname: "Baran",
          birthYear: 2017,
          birthCity: 34,
        },
      ]}
      onRowClick={(evt, selectedRow) =>
        setSelectedRow(selectedRow.tableData.id)
      }
      options={{
        rowStyle: (rowData) => ({
          backgroundColor:
            selectedRow === rowData.tableData.id ? "#EEE" : "#FFF",
        }),
      }}
    />
  );
}

function Editable() {
  //const { useState } = React;

  const [columns, setColumns] = useState([
    { title: "Name", field: "name" },
    {
      title: "Surname",
      field: "surname",
      initialEditValue: "initial edit value",
    },
    { title: "Birth Year", field: "birthYear", type: "numeric" },
    {
      title: "Birth Place",
      field: "birthCity",
      lookup: { 34: "İstanbul", 63: "Şanlıurfa" },
    },
  ]);

  const [data, setData] = useState([
    { name: "Mehmet", surname: "Baran", birthYear: 1987, birthCity: 63 },
    { name: "Zerya Betül", surname: "Baran", birthYear: 2017, birthCity: 34 },
  ]);

  return (
    <MaterialTable
      title="Editable Preview"
      columns={columns}
      data={data}
      editable={{
        onRowAdd: (newData) =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              setData([...data, newData]);

              resolve(newData);
            }, 1000);
          }),
        onRowUpdate: (newData, oldData) =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              const dataUpdate = [...data];
              const index = oldData.tableData.id;
              dataUpdate[index] = newData;
              setData([...dataUpdate]);

              resolve(newData);
            }, 1000);
          }),
        onRowDelete: (oldData) =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              const dataDelete = [...data];
              const index = oldData.tableData.id;
              dataDelete.splice(index, 1);
              setData([...dataDelete]);

              resolve(dataDelete);
            }, 1000);
          }),
      }}
    />
  );
}

function ConditionalActions() {
  return (
    <MaterialTable
      title="Conditional Actions Preview"
      columns={[
        { title: "Name", field: "name" },
        { title: "Surname", field: "surname" },
        { title: "Birth Year", field: "birthYear", type: "numeric" },
        {
          title: "Birth Place",
          field: "birthCity",
          lookup: { 34: "İstanbul", 63: "Şanlıurfa" },
        },
      ]}
      data={[
        { name: "Mehmet", surname: "Baran", birthYear: 1987, birthCity: 63 },
        {
          name: "Zerya Betül",
          surname: "Baran",
          birthYear: 2017,
          birthCity: 34,
        },
      ]}
      actions={[
        {
          icon: "save",
          tooltip: "Save User",
          onClick: (event: any, rowData: any) =>
            alert("You saved " + rowData.name),
        },
        (rowData: any) => ({
          icon: "delete",
          tooltip: "Delete User",
          onClick: (event: any, rowData: any) =>
            alert("You want to delete " + rowData.name),
          disabled: rowData.birthYear < 2000,
        }),
      ]}
    />
  );
}

function FrenchTable() {
  return (
    <MaterialTable
      title="Visualisation du tableau en Français"
      columns={[
        { title: "Prénom", field: "name" },
        { title: "Nom", field: "surname" },
        {
          title: "Date de naissance",
          field: "birthYear",
          type: "numeric",
        },
        {
          title: "Ville de naissance",
          field: "birthCity",
          lookup: { 34: "Istanbul", 63: "Sanliurfa" },
        },
      ]}
      data={[
        {
          name: "Mehmet",
          surname: "Baran",
          birthYear: 1987,
          birthCity: 63,
        },
        {
          name: "Zerya Betül",
          surname: "Baran",
          birthYear: 2017,
          birthCity: 34,
        },
      ]}
      localization={{
        body: {
          emptyDataSourceMessage: "Pas d'enregistreent à afficher",
          addTooltip: "Ajouter",
          deleteTooltip: "Supprimer",
          editTooltip: "Editer",
          filterRow: {
            filterTooltip: "Filtrer",
          },
          editRow: {
            deleteText: "Voulez-vous supprimer cette ligne?",
            cancelTooltip: "Annuler",
            saveTooltip: "Enregistrer",
          },
        },
        grouping: {
          placeholder: "Tirer l'entête ...",
          groupedBy: "Grouper par:",
        },
        header: {
          actions: "Actions",
        },
        pagination: {
          labelDisplayedRows: "{from}-{to} de {count}",
          labelRowsSelect: "lignes",
          labelRowsPerPage: "lignes par page:",
          firstAriaLabel: "Première page",
          firstTooltip: "Première page",
          previousAriaLabel: "Page précédente",
          previousTooltip: "Page précédente",
          nextAriaLabel: "Page suivante",
          nextTooltip: "Page suivante",
          lastAriaLabel: "Dernière page",
          lastTooltip: "Dernière page",
        },
        toolbar: {
          addRemoveColumns: "Ajouter ou supprimer des colonnes",
          nRowsSelected: "{0} ligne(s) sélectionée(s)",
          showColumnsTitle: "Voir les colonnes",
          showColumnsAriaLabel: "Voir les colonnes",
          exportTitle: "Exporter",
          exportAriaLabel: "Exporter",
          exportName: "Exporter en CSV",
          searchTooltip: "Chercher",
          searchPlaceholder: "Chercher",
        },
      }}
    />
  );
}

function BasicTreeData() {
  return (
    <MaterialTable
      title="Basic Tree Data Preview"
      data={[
        {
          id: 1,
          name: "a",
          surname: "Baran",
          birthYear: 1987,
          birthCity: 63,
          sex: "Male",
          type: "adult",
        },
        {
          id: 2,
          name: "b",
          surname: "Baran",
          birthYear: 1987,
          birthCity: 34,
          sex: "Female",
          type: "adult",
          parentId: 1,
        },
        {
          id: 3,
          name: "c",
          surname: "Baran",
          birthYear: 1987,
          birthCity: 34,
          sex: "Female",
          type: "child",
          parentId: 1,
        },
        {
          id: 4,
          name: "d",
          surname: "Baran",
          birthYear: 1987,
          birthCity: 34,
          sex: "Female",
          type: "child",
          parentId: 3,
        },
        {
          id: 5,
          name: "e",
          surname: "Baran",
          birthYear: 1987,
          birthCity: 34,
          sex: "Female",
          type: "child",
        },
        {
          id: 6,
          name: "f",
          surname: "Baran",
          birthYear: 1987,
          birthCity: 34,
          sex: "Female",
          type: "child",
          parentId: 5,
        },
      ]}
      columns={[
        { title: "Adı", field: "name" },
        { title: "Soyadı", field: "surname" },
        { title: "Cinsiyet", field: "sex" },
        { title: "Tipi", field: "type", removable: false },
        { title: "Doğum Yılı", field: "birthYear", type: "numeric" },
        {
          title: "Doğum Yeri",
          field: "birthCity",
          lookup: { 34: "İstanbul", 63: "Şanlıurfa" },
        },
      ]}
      parentChildData={(row, rows) => rows.find((a) => a.id === row.parentId)}
      options={{
        selection: true,
      }}
    />
  );
}

function BasicFiltering() {
  return (
    <MaterialTable
      title="Basic Filtering Preview"
      columns={[
        { title: "Name", field: "name" },
        { title: "Surname", field: "surname" },
        { title: "Birth Year", field: "birthYear", type: "numeric" },
        {
          title: "Birth Place",
          field: "birthCity",
          lookup: { 34: "İstanbul", 63: "Şanlıurfa" },
        },
      ]}
      data={[
        { name: "Mehmet", surname: "Baran", birthYear: 1987, birthCity: 63 },
        {
          name: "Zerya Betül",
          surname: "Baran",
          birthYear: 2017,
          birthCity: 34,
        },
      ]}
      options={{
        filtering: true,
      }}
    />
  );
}

function NonFilteringField() {
  return (
    <MaterialTable
      title="Non Filtering Field Preview"
      columns={[
        { title: "Name", field: "name", filtering: false },
        { title: "Surname", field: "surname" },
        { title: "Birth Year", field: "birthYear", type: "numeric" },
        {
          title: "Birth Place",
          field: "birthCity",
          lookup: { 34: "İstanbul", 63: "Şanlıurfa" },
        },
      ]}
      data={[
        { name: "Mehmet", surname: "Baran", birthYear: 1987, birthCity: 63 },
        {
          name: "Zerya Betül",
          surname: "Baran",
          birthYear: 2017,
          birthCity: 34,
        },
      ]}
      options={{
        filtering: true,
      }}
    />
  );
}

export default App;

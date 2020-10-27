export default [
  {
    title: "Adı",
    field: "name",
    filterPlaceholder: "Adı filter",
    tooltip: "This is tooltip text",
    editPlaceholder: "This is placeholder",
    maxWidth: 50,
  },
  {
    title: "Soyadı",
    field: "surname",
    initialEditValue: "test",
    tooltip: "This is tooltip text",
    editable: "never",
    resizable: false,
  },
  { title: "Evli", field: "isMarried" },
  {
    title: "Cinsiyet",
    field: "sex",
    disableClick: true,
    editable: "onAdd",
  },
  { title: "Tipi", field: "type", removable: false, editable: "never" },
  { title: "Doğum Yılı", field: "birthDate", type: "date" },
  {
    title: "Doğum Yeri",
    field: "birthCity",
    lookup: { 34: "İstanbul", 0: "Şanlıurfa" },
  },
  { title: "Kayıt Tarihi", field: "insertDateTime", type: "datetime" },
  { title: "Zaman", field: "time", type: "time" },
];

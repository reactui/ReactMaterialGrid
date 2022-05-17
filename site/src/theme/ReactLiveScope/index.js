import React from 'react';
import MaterialTable from '../../../../src/material-table'
import {data, columns} from '../../../../src/data/data'


//import ReactLiveScope from '@theme-original/ReactLiveScope';

// export default function ReactLiveScopeWrapper(props) {
//   return (
//     <>
//       <ReactLiveScope {...props} />
//     </>
//   );
// }



// Add react-live imports you need here
const ReactLiveScope = {
  React,
  ...React,
  MaterialTable,
  //...MaterialTable,
  data,
  columns
};

export default ReactLiveScope;

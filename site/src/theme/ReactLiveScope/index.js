import React from 'react';
import { useState } from 'react';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
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
  data,
  columns
};

export default ReactLiveScope;

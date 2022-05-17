---
sidebar_position: 1
---

# Tutorial Intro

Let's discover **Docusaurus in less than 5 minutes**.

## Getting Started

```jsx live
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
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          />
        )
      }}
      onRowClick={(event, rowData, togglePanel) => togglePanel()}
    />
```
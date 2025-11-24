import { Box } from "@mui/material";
import { GridRowId } from "@mui/x-data-grid";
import { DataGrid as MuiDataGrid } from '@mui/x-data-grid';

interface Props {
  rows: any;
  columns: any;
  getRowId?: (row: any) => GridRowId;
}

export default function CustomDataGrid({ rows, columns, getRowId }: Props) {
  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <MuiDataGrid
        rows={rows}
        columns={columns}
        getRowId={getRowId}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
      />
    </Box>
  );
}

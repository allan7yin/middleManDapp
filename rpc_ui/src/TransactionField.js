import { Typography } from "@mui/material"

function TransactionField({field_name, field_value}) {
    return(
        <>
        <div style={{display: "flex"}}>
            <Typography variant="subtitle1" gutterBottom>
                {field_name}
            </Typography>
            <Typography variant="subtitle1" gutterBottom style={{ marginLeft: 'auto' }}>
                {field_value}
            </Typography>
        </div>
        <div style={{ borderBottom: '1px solid black', width: '100%' }}></div>
        </>
    )
}

export default TransactionField
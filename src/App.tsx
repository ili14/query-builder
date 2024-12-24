import "./App.css";
import React from "react";
import {Box, Grid2 as Grid} from "@mui/material";


function App(): JSX.Element {

    return (
        <Box gap={2} className="[&_.cell]:bg-red-500 h-[100vh] flex flex-col " >
            <Grid container spacing={2} height={'50%'}>
                <Grid className="cell" size={3}>
                    <div>top-left</div>
                </Grid>
                <Grid className="cell" size={6}>
                    <div>top-center</div>
                </Grid>
                <Grid className="cell" size={3}>
                    <div>top-right</div>
                </Grid>

            </Grid>
            <Grid container spacing={2} height={'50%'}>
                <Grid className="cell" size={3} >
                    <div>bottom-left</div>
                </Grid>
                <Grid className="cell" size={9}>
                    <div>bottom-left</div>
                </Grid>
            </Grid>
        </Box>
    );
}

export default App;

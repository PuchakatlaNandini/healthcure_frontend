import React from "react";
import Box from '@mui/material/Box';
import '../styles/Navbar.css';
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { Link } from "react-router-dom";


export default function Navbar(){
    return(
        <Box className="navbar-wrapper">
    <Box className="navbar">
       <img src="../images/image.png" alt="Healthcure"  width={300}/>
       <Stack direction="row" spacing={2}>
         
        <Button variant="outlined">Patient Login</Button>
        <Link to="/doctor-login">
         <Button variant="outlined">Doctor Login</Button></Link>
         </Stack>
    </Box>
    </Box> 
    
    )
}

import {
    Typography,
    Grid,
    TextField,
    InputAdornment
} from "@mui/material";
import { AccessTimeFilled } from "@mui/icons-material";
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { styled } from '@mui/material/styles';
import AvailabilitySlotManager from "./availabilitySlots";

export default function Availability() {

    const IOSSwitch = styled((props) => (
        <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
    ))(({ theme }) => ({
        width: 42,
        height: 26,
        padding: 0,
        '& .MuiSwitch-switchBase': {
            padding: 0,
            margin: 2,
            transitionDuration: '300ms',
            '&.Mui-checked': {
                transform: 'translateX(16px)',
                color: '#fff',
                '& + .MuiSwitch-track': {
                    backgroundColor: '#65C466',
                    opacity: 1,
                    border: 0,
                    ...theme.applyStyles('dark', {
                        backgroundColor: '#2ECA45',
                    }),
                },
                '&.Mui-disabled + .MuiSwitch-track': {
                    opacity: 0.5,
                },
            },
            '&.Mui-focusVisible .MuiSwitch-thumb': {
                color: '#33cf4d',
                border: '6px solid #fff',
            },
            '&.Mui-disabled .MuiSwitch-thumb': {
                color: theme.palette.grey[100],
                ...theme.applyStyles('dark', {
                    color: theme.palette.grey[600],
                }),
            },
            '&.Mui-disabled + .MuiSwitch-track': {
                opacity: 0.7,
                ...theme.applyStyles('dark', {
                    opacity: 0.3,
                }),
            },
        },
        '& .MuiSwitch-thumb': {
            boxSizing: 'border-box',
            width: 22,
            height: 22,
        },
        '& .MuiSwitch-track': {
            borderRadius: 26 / 2,
            backgroundColor: '#E9E9EA',
            opacity: 1,
            transition: theme.transitions.create(['background-color'], {
                duration: 500,
            }),
            ...theme.applyStyles('dark', {
                backgroundColor: '#39393D',
            }),
        },
    }));


    return (

        <Grid>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Availability Settings</Typography>
            <Typography variant="subtitle1">Set your working hours and manage appointment slots</Typography>
            <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Working Hours
                </Typography>


                <Grid item xs={12} mt={2} >
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} size={6}>
                            <TextField
                                fullWidth
                                label="Available From"
                                defaultValue="09:00 AM"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AccessTimeFilled />
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} size={6}>
                            <TextField
                                fullWidth
                                label="Available To"
                                defaultValue="10:00 PM"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AccessTimeFilled />
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            {/*working days */}
            <Grid>
                <Typography variant="h6" sx={{ mt: 3 }}>Working Days</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={3} size={3} >
                        <FormControlLabel
                            control={<IOSSwitch sx={{ m: 1 }} defaultChecked />}
                            label="Monday"
                        />
                    </Grid>
                    <Grid item xs={12} md={3} size={3} >
                        <FormControlLabel
                            control={<IOSSwitch sx={{ m: 1 }} defaultChecked />}
                            label="Tuesday"
                        />
                    </Grid>
                    <Grid item xs={12} md={3} size={3} >
                        <FormControlLabel
                            control={<IOSSwitch sx={{ m: 1 }} defaultChecked />}
                            label="Wednesday"
                        />
                    </Grid>
                    <Grid item xs={12} md={3} size={3} >
                        <FormControlLabel
                            control={<IOSSwitch sx={{ m: 1 }} defaultChecked />}
                            label="Thursday"
                        />
                    </Grid>
                    <Grid item xs={12} md={3} size={3}>
                        <FormControlLabel
                            control={<IOSSwitch sx={{ m: 1 }} defaultChecked />}
                            label="Friday"
                        />
                    </Grid>
                    <Grid item xs={12} md={3} size={3} >
                        <FormControlLabel
                            control={<IOSSwitch sx={{ m: 1 }} defaultChecked />}
                            label="Saturday"
                        /></Grid>
                    <Grid item xs={12} md={3} size={3} >
                        <FormControlLabel
                            control={<IOSSwitch sx={{ m: 1 }} defaultChecked />}
                            label="Sunday"
                        />
                    </Grid>
                </Grid>
            </Grid>

            <Grid>
                <Typography variant="h6" sx={{ mt: 3 }}>Available Timeslots</Typography>

                <Grid container spacing={2} sx={{ mt: 3 }}>
                    <AvailabilitySlotManager />
                </Grid>

            </Grid>
        </Grid>
    )
} 
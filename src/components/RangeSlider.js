import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

function valuetext(value) {
    return `${value}°C`;
}

export default function RangeSlider(props) {
    const marks = [
        {
            value: 0,
            label: '0°C',
        },
        {
            value: 10,
            label: '10°C',
        },
        {
            value: 20,
            label: '20°C',
        },
        {
            value: 30,
            label: '30°C',
        },
        {
            value: 40,
            label: '40°C',
        },
        {
            value: 50,
            label: '50°C',
        },

    ];
    let [value, setValue] = React.useState([props.minTemp, props.maxTemp]);

    const handleChange = (event, newValue) => {
        setValue(newValue);

        // send to parent class Settings the desired and updated min and max temp as array
        props.handleChangeTemp(newValue)
    };

    return (
        <Box sx={{ width: 300 }}>
            <Slider
                marks={marks}
                getAriaLabel={() => 'Temperature range'}
                value={value}
                onChange={handleChange}
                valueLabelDisplay="auto"
                getAriaValueText={valuetext}
                min={0}
                max={50}
            />
        </Box>
    );
}
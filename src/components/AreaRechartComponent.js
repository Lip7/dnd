import React from "react";
import {AreaChart, Area, YAxis, XAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';

//chart to show the measurements
class AreaRechartComponent extends React.Component {

    data = this.props.data
    type = this.props.type

    render() {
        return (
            <ResponsiveContainer width="95%" height={220}>
                <AreaChart data={this.data}
                           margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="rgba(220, 134, 108, 1)" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="rgba(220, 134, 108, 1)" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="rgba(220, 134, 108, 1)" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="rgba(220, 134, 108, 1)" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Legend />
                    {this.type=="Temperature"?<Area type="monotone" dataKey="Temperature" stroke="rgba(158, 82, 75, 1)" fillOpacity={1} fill="url(#colorUv)" />
                        :<Area type="monotone" dataKey="CO2" stroke="rgba(158, 82, 75, 1)" fillOpacity={1} fill="url(#colorUv)" />}

                </AreaChart>
            </ResponsiveContainer>

        )
    };
}

export default AreaRechartComponent;
import React, { useState } from 'react';
import ReactDatePicker from 'react-datepicker';

interface CompProp {
    component: React.ReactNode;
    onchange: (date: Date) => any;
}

export const CustomDatePicker: React.FC<CompProp> = ({ component, onchange }) => {
    const [selectDate, setSelectDate] = useState(new Date());
    return (
        <ReactDatePicker
            dateFormat='dd/MM/yyyy'
            selected={selectDate}
            onChange={(date) => {
                setSelectDate(date as Date);
                onchange(date as Date);
            }}
            customInput={component}
        />
    );
};

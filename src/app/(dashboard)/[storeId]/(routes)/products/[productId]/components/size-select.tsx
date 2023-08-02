
import { Size } from '@prisma/client';
import React, { ChangeEvent } from 'react'
import CreatableSelect, { ActionMeta, MultiValue } from 'react-select';

interface SizeSelectProps {
    data: Size[]
    onChange: (newValue: MultiValue<{ value: string; label: string, name: string; }>, actionMeta: ActionMeta<{ value: string; label: string, name: string; }>) => void
}


const SizeSelect = ({ data, onChange }: SizeSelectProps) => {



    const formattedData = data.map(item => ({
        value: item.id,
        name: item.name,
        label: item.value
    }))





    return (
        <CreatableSelect
            onChange={onChange}
            closeMenuOnSelect={false}
            isMulti
            name="Sizes"
            options={formattedData}
            className="basic-multi-select"
            classNamePrefix="select"
        />
    )
}

export default SizeSelect
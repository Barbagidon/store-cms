
import { Size } from '@prisma/client';
import React, { ChangeEvent } from 'react'
import CreatableSelect, { ActionMeta, MultiValue } from 'react-select';

interface SizeSelectProps {
    sizes: Size[]

    onChange: (newValue: MultiValue<{ value: string; label: string, name: string; }>, actionMeta: ActionMeta<{ value: string; label: string, name: string; }>) => void
}


const SizeSelect = ({ sizes, onChange }: SizeSelectProps) => {



    const formattedSizes = sizes.map(size => ({
        value: size.id,
        name: size.name,
        label: size.value
    }))







    return (
        <CreatableSelect
            // defaultValue={formattedProductSizes}
            onChange={onChange}
            closeMenuOnSelect={false}
            isMulti
            name="Sizes"
            options={formattedSizes}
            className="basic-multi-select"
            classNamePrefix="select"
        />
    )
}

export default SizeSelect
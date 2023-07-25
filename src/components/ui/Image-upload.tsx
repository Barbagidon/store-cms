"use client"

import React, { useEffect, useState } from 'react'
import { Button } from './button'
import { ImagePlus, Trash } from 'lucide-react'
import Image from 'next/image'
import { CldUploadWidget } from 'next-cloudinary'

interface ImageUploadProps {
    disabled?: boolean
    onChange: (value: string) => void
    onRemove: (value: string) => void
    value: string[]
}

const ImageUpload = ({ disabled, onChange, onRemove, value }: ImageUploadProps) => {

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);


    const onUpload = (result: any) => {

        onChange(result.info.secure_url)

    }


    if (!isMounted) {
        return null;
    }

    return (
        <div>
            <div className='mb-4 flex items-center gap-4'>
                {value.map(url => (<div className='relative w-[200px] h-[200px] rounded-md overflow-hidden' key={url}>
                    <div className='z-10 absolute top-2 right-2'>
                        <Button onClick={() => onRemove(url)} type='button' variant={'destructive'} size={'icon'}>
                            <Trash className='h-4 w-4' />
                        </Button>
                    </div>
                    <Image alt='image' fill className='object-cover' src={url} />
                </div>))}
            </div>
            <CldUploadWidget onUpload={onUpload} uploadPreset='jsd6zk7e'>

                {({ open }) => {

                    const onClick = () => {
                        open();
                    }

                    return (
                        <Button onClick={onClick} variant={'secondary'} disabled={disabled} type={'button'}>
                            <ImagePlus className='h-4 w-4 mr-2' />
                            Upload an image
                        </Button>
                    )
                }}
            </CldUploadWidget>
        </div>
    )
}

export default ImageUpload
import React from 'react'
import { uploadImage } from '../common/ApiService'

export default function ImageUpload({ setImageUrl }: { setImageUrl: (prop: string) => void }) {
    const handleChange = async (fileList: FileList | null) => {
        if (fileList) {
            const resp = await uploadImage(fileList[0])
            setImageUrl(resp.url)
        }
    }
    return (
        <div><input type="file" onChange={(e) => { handleChange(e.target.files) }} /></div>
    )
}

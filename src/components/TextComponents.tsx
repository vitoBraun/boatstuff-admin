import { ChangeEvent } from "react"

export const TextField = ({ onChange, value, name, label, ...restProps }: { onChange?: (e: ChangeEvent<HTMLInputElement>) => void, value?: string | number | null, name?: string, label?: string }) => {
    return <><label htmlFor="title" className="text-sm text-navy-700 font-bold">{label}</label>
        <input
            type="text"
            name={name}
            onChange={onChange}
            value={value ?? ''}
            className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-500"
            {...restProps}
        /></>
}

export const TextArea = ({ onChange, value, name, label, ...restProps }: { onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void, value: string | number, name: string, label: string }) => {
    return <><label htmlFor="title" className="text-sm text-navy-700 font-bold">{label}</label>
        <textarea
            rows={3}
            name={name}
            onChange={onChange}
            value={value}
            className="mt-2 flex  w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-500"
            {...restProps}
        /></>
}

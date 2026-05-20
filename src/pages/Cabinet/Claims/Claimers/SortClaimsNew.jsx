import { Select } from "antd";

export default function SortClaimsNew({ options, setSelectSort }) {
    const onChange = (value) => {
        setSelectSort(value)
    }
    return (
        <div style={{ flex: 1 }}>
            <Select options={options} onChange={onChange} style={{ minWidth: 300 }} />
        </div>
    )
}

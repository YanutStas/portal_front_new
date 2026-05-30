import { Select } from "antd";

export default function SortClaimsNew({ sorts, setSelectSort }) {
    const onChange = (value) => {
        setSelectSort(value)
    }
    // console.log("sorts", sorts);
    // console.log("sorts?.defaultValue", sorts?.defaultValue);
    // console.log("sorts?.options", sorts?.options);

    return (
        <div style={{ flex: 1 }}>
            {sorts &&
                <Select
                    placeholder={"Сортировка"}
                    defaultValue={sorts?.defaultValue}
                    options={sorts?.options}
                    onChange={onChange}
                    style={{ minWidth: 300 }}
                />
            }
        </div>
    )
}

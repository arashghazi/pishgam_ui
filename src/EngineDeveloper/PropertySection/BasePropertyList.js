import React from 'react';
import BasePropertyItem from './BasePropertyItem'
const BasePropertyList = ({ data, changeData,onDelete }) => {
    return (<>
        {data?.properties?.map((item, index) => (
            <BasePropertyItem draggableId={item.ID} changeData={changeData??null} data={data}
                key={item.ID} index={index} property={item} onDelete={onDelete}  />
        ))}
    </>
    );
};

export default BasePropertyList;
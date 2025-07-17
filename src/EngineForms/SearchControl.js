import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, {  useState } from 'react';
import ReactDOM from 'react-dom';
import { useEffect } from 'react';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Input, InputGroup } from 'reactstrap';
import { SearchObject, Utility } from '../Engine/Common';

const SearchControl = ({ operator, onChange, type, prop, notprop,placeholder,id}) => {
    const [FirstItem, setFirstItem] = useState();

    useEffect(() => {
        if (!notprop) {
            if (!prop) {
                setFlag('');
                setValue('');
            }
            else if (prop?.IPV) {
                setFlag(prop?.IPV);
                setValue((prop?.DIS??prop?.display)??prop?.OBJ?.display??'');
            }
        }
        //setInputFocus();

    }, [prop, FirstItem,notprop])
    const [openmenu, setopen] = useState(false);
    const [flag, setFlag] = useState(prop?.IPV);
    const [value, setValue] = useState('');
    const [list, setList] = useState([]);
    // const setInputFocus = () => {
    //     if (FirstItem)
    //         ReactDOM.findDOMNode(FirstItem).focus();
    // }
    const SearchCommand = async () => {
        let result = [];
        let oprator = operator;
        if (operator === undefined)
            oprator = "like N'%{#}%'";
        if (Utility.IsInstanceID(value))
            oprator = "=";
        result = await SearchObject(value, type, oprator);
        if (result?.length > 1) {
            setList(result);
            setopen(true);


        }
        else if (result?.length === 1) {
            setValue(result[0]?.display)
            setFlag(prop?.IPV);
            onChange(result[0])
        }
        else {
            setopen(false);
            setList([]);
        }
    }
    const ItemSelected = ({ target }) => {
        setopen(false);
        let obj = list.find(x => x.id === target.value);
        setValue(obj?.display)
        setFlag(prop?.IPV);
        setFirstItem(null)
        onChange(obj)
    }
    const handleFocus = (e) => {
        e.target.select();
    };

    const KeyUp = async (event) => {
        event.preventDefault()

        if (event.key === 'Enter') {
            await SearchCommand();
        }
    }
    const KeyDown = async (event) => {
        if (event.key === 'Enter') {
            event.preventDefault()
        }

    }
    return <Dropdown isOpen={openmenu} toggle={() => setopen(!openmenu)} >
        <DropdownToggle
            tag="div" id={id}
            data-toggle="dropdown"
            aria-expanded={openmenu}>
            <InputGroup size="sm" className="d-flex">
                <Input placeholder={placeholder??'search '} aria-label="Search"
                    className="search-input" value={value??''} onChange={(event) => { setList([]); setValue(event.target.value) }}
                    onFocus={handleFocus} key={prop?.IPV ?? 'notloaded'}
                    onKeyUp={KeyUp} onKeyDown={KeyDown} />
                <Button color='light' size="sm" onClick={SearchCommand} >
                    <FontAwesomeIcon icon="search" />
                </Button>
            </InputGroup>

        </DropdownToggle>
        {list?.length > 0 ?
            <DropdownMenu style={{ maxHeight: "200px", overflowY: 'scroll' }}>
                {
                    list.map((item, index) => {
                        return <DropdownItem ref={(input) => {
                            if (index === 0)
                                setFirstItem(input)
                        }} onClick={ItemSelected}
                            className="p-2" value={item.id} key={item.id}>{item.display}</DropdownItem>
                    })
                }
            </DropdownMenu> : null}
    </Dropdown>
};
export default SearchControl;
import { useState } from "react";
import { Button, Flex, Combobox, useCombobox, rem,
  Pill, PillsInput  } from "@mantine/core";
  import dayjs from "dayjs";
import { find } from 'lodash'



const ProductFilter = ({initialValue, handleSearch}) => {
  const combobox2 = useCombobox({
    onDropdownClose: () => combobox2.resetSelectedOption(),
    // onDropdownOpen: () => combobox2.updateSelectedOptionIndex('active'),
  });

  const [search, setSearch] = useState('');
  const [value2, setValue2] = useState(initialValue);
  const [error, setError] = useState({})

  const handleValueSelect = (val) => {
    setValue2((current) => current.includes(val) ? current.filter((v) => v !== val) : [...current, val]);
    setSearch('')
  }

const handleValueRemove = (val) => setValue2((current) => current.filter((v) => v !== val));


const values = value2.map((item) => (
  <Pill key={item} withRemoveButton onRemove={() => handleValueRemove(item)}>
    <span><b>{`${item.split('=')[0]}=`}</b>{item.split('=')[1]}</span>
  </Pill>
));

    const options2 = ['from', 'to', 'description']
    .filter((item) => !value2.some((i) => i.startsWith(item)))
    .map((item) => (
      <Combobox.Option value={`${item}=${search}`} key={item}>
        {`${item}=${search}`}
      </Combobox.Option>
    ));



    //const [searchQuery, setSearchQuery] = useState(initialValue);
  
    const handleSearchClick = () => {
      console.log(`1. Conds are ${value2}`);

      const from = find(value2, i => i.startsWith('from')) || null
      const to = find(value2, i => i.startsWith('to')) || null

      let err = ''

      if (from && !dayjs(from.split('=')[1]).isValid()) {
        err += `${from} is invalid. `
      }
      to
      if (to && !dayjs(to.split('=')[1]).isValid()) {
        err += `${to} is invalid. `
      }

      if (err !== '') {
        setError({
          error: err
        })
      } else {
        setError({})
        if (find(value2, i => i.startsWith('from')) === undefined) {
          const now = dayjs().format('YYYY-MM-DD')
          setValue2((current) => [...current, `from=${now}T00:00:00`])
          handleSearch([...value2, `from=${now}T00:00:00`]);
        } else {
          handleSearch(value2);
        }
      }
    };


    return (
     <Flex
            direction={{ base: "column", sm: "row" }}
            gap="sm"
            align="flex-start"
          >
            <Combobox store={combobox2} onOptionSubmit={handleValueSelect} withinPortal={false} style={{width: rem(700)}} {...error}>
      <Combobox.DropdownTarget>
        <PillsInput onClick={() => combobox2.openDropdown()}>
          <Pill.Group>
            {values}

            <Combobox.EventsTarget>
              <PillsInput.Field
                onFocus={() => combobox2.openDropdown()}
                onBlur={() => combobox2.closeDropdown()}
                value={search}
                placeholder="Enter values"
                onChange={(event) => {
                  combobox2.updateSelectedOptionIndex();
                  setSearch(event.currentTarget.value);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Backspace' && search.length === 0) {
                    event.preventDefault();
                    handleValueRemove(value2[value2.length - 1]);
                  }
                }}
              />
            </Combobox.EventsTarget>
          </Pill.Group>
        </PillsInput>
      </Combobox.DropdownTarget>

      <Combobox.Dropdown>
        <Combobox.Options>
          {options2.length > 0 ? options2 : <Combobox.Empty>Nothing found...</Combobox.Empty>}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
            <Button onClick={handleSearchClick}  size="sm" radius="sm">
              Search
            </Button>
      </Flex>);
}
 
export default ProductFilter;
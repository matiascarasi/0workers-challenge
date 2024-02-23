import { useCallback, useState } from 'react';
import './App.css';

interface SelectorPropsTypes {
  options: SelectorOptionTypes[],
  allSelected?: boolean
}

interface SelectorOptionTypes {
  label: string,
  name: string,
  defaultValue?: boolean
}

interface SelectorOptionComponentTypes extends SelectorOptionTypes {
  onChange() : void
  value: boolean
}

type ReactStatePair<T> = [T, React.Dispatch<React.SetStateAction<T>>]

function SelectorOption({ label, name, value, onChange } : SelectorOptionComponentTypes) {
  return (
    <div className="selector_option">
      <input 
        type="checkbox" 
        onChange={onChange}
        checked={value} 
        name={name} 
      />
      <label htmlFor={name}>{label}</label>
    </div>
  )
}

function Selector({ options, allSelected = false } : SelectorPropsTypes ) {
  
  const [selectedOptions, setSelectedOptions]: ReactStatePair<Map<string, boolean>> = useState(new Map(options.map(({ name, defaultValue = false }) => [name, allSelected || defaultValue])))
  const [isAllSelected, setIsAllSelected] = useState(allSelected)
  
  const selectAllOptions = useCallback(() => {
    setIsAllSelected(prevValue => {
      setSelectedOptions(new Map(options.map(({ name }) => [name, !prevValue])))
      return !prevValue
    })
  }, [setIsAllSelected, setSelectedOptions, options])

  const selectOption = useCallback( (name: string) => {
    setSelectedOptions((prevValue) => {
      let newValue = new Map(prevValue)
      newValue.set(name, !newValue.get(name))
      return newValue
    })
  }, [setSelectedOptions])

  return (
    <div className="selector">
      <SelectorOption 
        label="Select All" 
        name="select_all" 
        onChange={selectAllOptions}
        value={isAllSelected}
      />
      {
        options.map(({ label, name }) => (
          <SelectorOption
            label={label}
            name={name}
            key={name}
            value={selectedOptions.get(name) || false}
            onChange={() => selectOption(name)}
          />
        ))
      }
    </div>
  )
}

const mockData: SelectorOptionTypes[] = [
  {
    label: "India",
    name: "india"
  },
  {
    label: "USA",
    name: "usa",
  },
  {
    label: "France",
    name: "france"
  },
]

function App() {
  return (
    <div className="App">
      <Selector
        options={mockData}
        allSelected={true}
      />
    </div>
  );
}

export default App;

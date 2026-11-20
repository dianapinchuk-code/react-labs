import { createContext, use, useState } from 'react'

const TabsContext = createContext(null)

function useTabsContext() {
  const context = use(TabsContext)
  if (!context) {
    throw new Error(
      'Компоненти Tabs повинні використовуватися всередині <Tabs>',
    )
  }
  return context
}

export default function Tabs({ defaultValue, children }) {
  const [selectedTab, setSelectedTab] = useState(defaultValue)

  return (
    <TabsContext value={{ selectedTab, setSelectedTab }}>
      <div className="tabs">{children}</div>
    </TabsContext>
  )
}

Tabs.List = function TabsList({ children, ...props }) {
  return (
    <div className="tab-list" {...props}>
      {children}
    </div>
  )
}

Tabs.Tab = function TabsTab({ value, children, ...props }) {
  const { selectedTab, setSelectedTab } = useTabsContext()
  const isSelected = selectedTab === value

  return (
    <button
      type="button"
      className={isSelected ? 'active' : ''}
      onClick={() => setSelectedTab(value)}
      {...props}
    >
      {children}
    </button>
  )
}

Tabs.Panel = function TabsPanel({ value, children, ...props }) {
  const { selectedTab } = useTabsContext()
  const isSelected = selectedTab === value

  return (
    <div hidden={!isSelected} {...props}>
      {children}
    </div>
  )
}

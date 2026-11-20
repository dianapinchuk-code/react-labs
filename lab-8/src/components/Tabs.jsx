import { createContext, use, useId, useState } from 'react'

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
  const baseId = useId()

  return (
    <TabsContext value={{ selectedTab, setSelectedTab, baseId }}>
      <div className="tabs">{children}</div>
    </TabsContext>
  )
}

Tabs.List = function TabsList({ children, ...props }) {
  function handleKeyDown(e) {
    const keys = ['ArrowRight', 'ArrowLeft', 'Home', 'End']
    if (!keys.includes(e.key)) return

    e.preventDefault()
    const tabs = Array.from(e.currentTarget.querySelectorAll('[role="tab"]'))
    if (tabs.length === 0) return

    const currentIndex = tabs.indexOf(e.target)
    if (currentIndex === -1) return

    let nextIndex = currentIndex
    if (e.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % tabs.length
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length
    } else if (e.key === 'Home') {
      nextIndex = 0
    } else if (e.key === 'End') {
      nextIndex = tabs.length - 1
    }

    const nextTab = tabs[nextIndex]
    if (nextTab) {
      nextTab.focus()
      nextTab.click()
    }
  }

  return (
    <div
      role="tablist"
      className="tab-list"
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
    </div>
  )
}

Tabs.Tab = function TabsTab({ value, children, ...props }) {
  const { selectedTab, setSelectedTab, baseId } = useTabsContext()
  const isSelected = selectedTab === value

  const tabId = `${baseId}-tab-${value}`
  const panelId = `${baseId}-panel-${value}`

  return (
    <button
      id={tabId}
      role="tab"
      type="button"
      aria-selected={isSelected}
      aria-controls={panelId}
      tabIndex={isSelected ? 0 : -1}
      onClick={() => setSelectedTab(value)}
      {...props}
    >
      {children}
    </button>
  )
}

Tabs.Panel = function TabsPanel({ value, children, ...props }) {
  const { selectedTab, baseId } = useTabsContext()
  const isSelected = selectedTab === value

  const tabId = `${baseId}-tab-${value}`
  const panelId = `${baseId}-panel-${value}`

  return (
    <div
      id={panelId}
      role="tabpanel"
      aria-labelledby={tabId}
      tabIndex={0}
      hidden={!isSelected}
      {...props}
    >
      {children}
    </div>
  )
}

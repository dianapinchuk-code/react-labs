import './App.css'
import ProfileCard from './components/ProfileCard.jsx'

function App() {
  return (
    <main className="app">
      <ProfileCard
        name="Олександр Шевченко"
        group="ІПЗ-31"
        technologies={['React Hooks', 'Next.js', 'TypeScript']}
      />
    </main>
  )
}

export default App

import './App.css'
import ProfileCard from './components/ProfileCard.jsx'

function App() {
  return (
    <main className="app">
      <ProfileCard
        name="Пінчук Діана"
        group="Кн-312"
        technologies={['React Hooks', 'Next.js', 'TypeScript']}
      />
    </main>
  )
}

export default App

import { Link, useLocation } from "react-router-dom"
import { faHome, faInbox, faCalendar } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export function MobilePatientNav() {
  const location = useLocation()

  // Helper function to check if current route matches nav item
  const isActive = (path: string) => {
    return location.pathname === path || 
           (path === '/games' && location.pathname.startsWith('/games'))
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#4C45FC] flex justify-around items-center p-2 z-50 shadow-lg">
      {/* Inbox button with active state styling */}
      <Link 
        to="/inbox" 
        className={`flex items-center justify-center p-3 rounded-lg ${
          isActive('/inbox') ? 'bg-white' : ''
        }`}
      >
        <FontAwesomeIcon 
          icon={faInbox} 
          className={`text-2xl ${
            isActive('/inbox') ? 'text-[#4C45FC]' : 'text-white'
          }`} 
        />
      </Link>

      {/* Home button with active state styling */}
      <Link 
        to="/" 
        className={`flex items-center justify-center p-3 rounded-lg ${
          isActive('/') ? 'bg-white' : ''
        }`}
      >
        <FontAwesomeIcon 
          icon={faHome} 
          className={`text-2xl ${
            isActive('/') ? 'text-[#4C45FC]' : 'text-white'
          }`} 
        />
      </Link>

      {/* Calendar button with active state styling */}
      <Link 
        to="/calendar" 
        className={`flex items-center justify-center p-3 rounded-lg ${
          isActive('/calendar') ? 'bg-white' : ''
        }`}
      >
        <FontAwesomeIcon 
          icon={faCalendar} 
          className={`text-2xl ${
            isActive('/calendar') ? 'text-[#4C45FC]' : 'text-white'
          }`} 
        />
      </Link>
    </nav>
  )
}
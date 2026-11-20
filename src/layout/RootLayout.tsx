import { NavLink, Outlet } from 'react-router'

const RootLayout = () => {
  return (
    <div className="app">
      <header className="header">
        <NavLink to="/" className="brand" end>
          我的 Side Project
        </NavLink>
        <nav className="nav" aria-label="主要">
          <NavLink to="/" end>
            首頁
          </NavLink>
          <NavLink to="/counter">計數</NavLink>
        </nav>
      </header>
      <main className="main">
        <Outlet />
      </main>
    </div>
  )
}

export default RootLayout

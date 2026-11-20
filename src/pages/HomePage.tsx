import { Link } from 'react-router'

const HomePage = () => {
  return (
    <section className="stack">
      <header className="page-heading">
        <p className="eyebrow">單頁應用骨架</p>
        <h1>我的 Side Project</h1>
        <p className="lede">
          這是一個 Vite、React 與 TypeScript
          的起點。路由、共用版面和一個 Redux
          計數已經接好，接下來可以直接換成你自己的頁面。
        </p>
      </header>
      <div className="card">
        <h2>已經接上的東西</h2>
        <ul className="feature-list">
          <li>React Router：首頁、計數頁，以及找不到頁</li>
          <li>Redux Toolkit：計數 slice，還沒有接 API</li>
          <li>一個全域樣式檔，淺色藍點</li>
        </ul>
        <Link className="button button-primary" to="/counter">
          打開計數頁
        </Link>
      </div>
    </section>
  )
}

export default HomePage

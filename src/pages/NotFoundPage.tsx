import { Link } from 'react-router'

const NotFoundPage = () => {
  return (
    <section className="stack">
      <div className="card">
        <p className="eyebrow">404</p>
        <h1>找不到這個頁面</h1>
        <p className="lede">這個網址沒有對應的頁面。</p>
        <Link className="button button-primary" to="/">
          回到首頁
        </Link>
      </div>
    </section>
  )
}

export default NotFoundPage

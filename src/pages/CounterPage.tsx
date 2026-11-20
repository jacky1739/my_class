import { decrement, increment, reset } from '../store/counterSlice.ts'
import { useAppDispatch, useAppSelector } from '../store/hooks.ts'

const CounterPage = () => {
  const count = useAppSelector((state) => state.counter.value)
  const dispatch = useAppDispatch()
  const atZero = count === 0

  return (
    <section className="stack">
      <header className="page-heading">
        <p className="eyebrow">Redux Toolkit</p>
        <h1>計數</h1>
        <p className="lede">這個數字存在 store 裡。換頁再回來，數值還會在。</p>
      </header>
      <div className="card counter-card">
        <p className="count" aria-live="polite">
          {count}
        </p>
        <div className="button-row">
          <button
            type="button"
            className="button button-primary"
            onClick={() => dispatch(increment())}
          >
            增加
          </button>
          <button
            type="button"
            className="button button-secondary"
            onClick={() => dispatch(decrement())}
            disabled={atZero}
          >
            減少
          </button>
          <button
            type="button"
            className="button button-ghost"
            onClick={() => dispatch(reset())}
            disabled={atZero}
          >
            歸零
          </button>
        </div>
      </div>
    </section>
  )
}

export default CounterPage

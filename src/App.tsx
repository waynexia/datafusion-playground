import { useState } from 'react'
import './App.css'
import * as datafusion_wasm from 'datafusion-wasm'
import { About } from './About.tsx'

function App() {
  const [exec_result, setExecResult] = useState('starting!')

  console.log(datafusion_wasm)
  console.log(datafusion_wasm.DataFusionContext.greet())
  const df_ctx = datafusion_wasm.DataFusionContext.new()
  console.log(df_ctx)

  const handleSubmit = (e) => {
    e.preventDefault();

    const sql = e.target[0].value;
    console.log("executing " + sql)
    const result = df_ctx.execute_sql(sql)
    result.then((r) => {
      setExecResult(r)
    })
  };

  return (
    <>
      <main className="h-100vh w-100vw">
        <div className="sidebar">
          <About />
        </div>
        <div className="history">
          <div className="py-6">
            Execute Result:
            <pre>
              {exec_result}
            </pre>
          </div>
        </div>

        <div className="input-area">
          <form onSubmit={handleSubmit}>
            <button type="submit">Run</button>
            <textarea className='w90% h100%' />
          </form>
        </div>
      </main>
    </>
  )
}

export default App

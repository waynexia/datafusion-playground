import { useState } from 'react'
import './App.css'
import React from 'react'
import * as datafusion_wasm from 'datafusion-wasm'



function App() {
  const [exec_result, setExecResult] = useState('starting!')
  const [inputValue, setInputValue] = useState('');

  console.log(datafusion_wasm)
  console.log(datafusion_wasm.DataFusionContext.greet())
  const df_ctx = datafusion_wasm.DataFusionContext.new()
  console.log(df_ctx)

  const handleSubmit = (e) => {
    e.preventDefault();

    const sql = inputValue;
    console.log("executing " + sql)
    const result = df_ctx.execute_sql(sql)
    result.then((r) => {
      setExecResult(r)
      setInputValue('');
    })

  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <>
      <div className="min-h-full">
        <header className="b-white shadow text-5xl">
          <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-5xl font-bold tracking-tight text-gray-900">DataFusion Playground</h1>
          </div>
        </header>
        <div className="explain">
          <p>Playground of <a href="https://github.com/apache/arrow-datafusion">Apache Arrow DataFusion</a>. In the early experimental stage as <a href="https://github.com/waynexia/datafusion-playground">my side project.</a></p>
          <p>It might take a while to load the wasm file. I don't find a appropriate CDN for it. You'll see "starting!" when it's ready.</p>
          <p>Known bug: backspace doesn't work, and error message won't display.</p>
        </div>
        <main>
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            Execute Result:
            <pre>
              {exec_result}
            </pre>
          </div>

          <form onSubmit={handleSubmit}>
            <input type="text" value={inputValue} onChange={handleChange} />
            <button type="submit">Execute</button>
          </form>
        </main>
      </div>
    </>
  )
}

export default App

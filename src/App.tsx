import { useState } from 'react'
import './App.css'
import React from 'react'

function App() {
  const [count, setCount] = useState(0)

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
            <div className="wasm-terminal" id="terminal"></div>
          </div>
        </main>
      </div>
    </>
  )
}

export default App

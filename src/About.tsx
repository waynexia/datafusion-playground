
import './App.css'

export function About() {
  return (
    <>
      <div className="">
        <header className="b-white shadow text-5xl">
          <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-5xl font-bold tracking-tight text-gray-900">DataFusion <br /> Playground</h1>
          </div>
        </header>
        <div className="explain">
          <p>Playground of <a href="https://github.com/apache/arrow-datafusion">Apache Arrow DataFusion</a>. In the early experimental stage as <a href="https://github.com/waynexia/datafusion-playground">my side project.</a></p>
          <p>It might take a while to load the wasm file.</p>
        </div>
      </div >
    </>
  )
}
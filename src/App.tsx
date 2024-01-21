import './App.css'
import * as datafusion_wasm from 'datafusion-wasm'
import { About } from './components/About.tsx'
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { History } from './components/History.tsx';
import { InputArea } from './components/InputArea.tsx';

console.log(datafusion_wasm.DataFusionContext.greet())
export const dfCtx = datafusion_wasm.DataFusionContext.new()

function App() {
  return (
    <MantineProvider>
      <main className="h-100vh w-100vw">
        <div className="sidebar">
          <About />
        </div>
        <div className="history">
          <History />
        </div>

        <div className="input-area">
          <InputArea />
        </div>
      </main>
    </MantineProvider>
  )
}

export default App

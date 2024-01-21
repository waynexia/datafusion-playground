import './App.css'
import * as datafusion_wasm from 'datafusion-wasm'
import { About } from './About.tsx'
import { ActionIcon, Textarea, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { atom, useAtom } from 'jotai'

const sqlAtom = atom('')
const execResultAtom = atom('DataFusion Playground is initialized!')

function App() {
  const [execResult, setExecResult] = useAtom(execResultAtom)
  const [sql, setSql] = useAtom(sqlAtom)

  console.log(datafusion_wasm.DataFusionContext.greet())
  const df_ctx = datafusion_wasm.DataFusionContext.new()

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("executing " + sql)
    const result = df_ctx.execute_sql(sql)
    result.then((r) => {
      setExecResult(r)
    })
  };

  const handleChange = (e) => {
    setSql(e.currentTarget.value)
  }

  return (
    <MantineProvider>
      <main className="h-100vh w-100vw">
        <div className="sidebar">
          <About />
        </div>
        <div className="history">
          <div className="py-6">
            Execute Result:
            <pre>
              {execResult}
            </pre>
          </div>
        </div>

        <div className="input-area">
          <Textarea
            size="md"
            radius="m"
            minRows={5}
            autosize={true}
            description=""
            placeholder="SQL here"
            onChange={handleChange}
            rightSection={
              <ActionIcon size={32} radius="xl" variant="filled" onClick={handleSubmit} >
                <div className='i-tabler-run' />
              </ActionIcon>
            }
          />
        </div>
      </main>
    </MantineProvider>
  )
}

export default App

import { Textarea } from "@mantine/core"
import { atom, useAtom, useSetAtom } from "jotai"
import { historyListAtom, } from "./History"
import { dfCtx } from "../App"

export const sqlAtom = atom('')

export function InputArea() {
  const [sql, setSql] = useAtom(sqlAtom)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSql(e.currentTarget.value)
  }

  const handleCmdEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.metaKey) {
      doQuery();

      e.currentTarget.value = ''
    }
  }

  const doQuery = () => {
    const result = dfCtx.execute_sql(sql)
    result.then((r) => {
      const setHistoryList = useSetAtom(historyListAtom)
      setHistoryList((history) => [...history, { query: sql, result: r, isErr: false }])
    })
    console.log('doQuery' + sql)
  }

  return (
    < Textarea
      className="m-4"
      size="md"
      radius="m"
      minRows={4}
      maxRows={7}
      autosize={true}
      description="Cmd + Enter to execute"
      placeholder="SQL here"
      onChange={handleChange}
      onKeyDown={handleCmdEnter}
    />)
}
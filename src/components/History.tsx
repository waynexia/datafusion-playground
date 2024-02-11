import { ActionIcon, Tooltip } from "@mantine/core";
import { atom, useAtomValue } from "jotai";

const initialGreeting = { query: '', result: 'DataFusion Playground is initialized!', isErr: false }

class ExecuteHistory {
  query!: string;
  result!: string;
  isErr!: boolean;
}

export const historyListAtom = atom([initialGreeting])

function HistoryItem(executeHistory: ExecuteHistory) {
  return (
    <div className="py-1 m1 position-relative group border-solid border-1 border-rd border-transparent hover:border-gray">
      <div className="hidden group-hover-display-unset">
        <Tooltip label="Copy Result">
          <ActionIcon
            className="position-absolute top-4 right-4"
            variant="outline" color="gray"
            onClick={() => { navigator.clipboard.writeText(executeHistory.result) }}>
            <div className="i-tabler-copy" />
          </ActionIcon>
        </Tooltip>
      </div>

      <pre>{executeHistory.result}</pre>
    </div>
  )
}

export function History() {
  const results = useAtomValue(historyListAtom)

  return (
    <div className="overflow-auto flex max-h-80svh h-full flex-col-reverse">
      {
        results.map((result, index) => (<HistoryItem query={result.query} result={result.result} isErr={result.isErr} key={index} />))
      }
    </div>
  )
}
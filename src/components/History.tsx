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
    <div className="py-1 m4 position-relative group hover:border-solid hover:border-1 hover:border-rd hover:border-gray">
      <div className="hidden group-hover-display-unset">
        <Tooltip label="Copy Result">
          <ActionIcon className="position-absolute top-4 right-4" variant="outline" color="gray">
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
    <div className="overflow-scroll max-h-80svh">
      {
        results.map((result) => (<HistoryItem query={result.query} result={result.result} isErr={result.isErr} />))
      }
    </div>
  )
}
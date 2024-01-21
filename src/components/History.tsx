import { atom, useAtomValue } from "jotai";

export const execResultAtom = atom('DataFusion Playground is initialized!')

export function History() {
  const execResult = useAtomValue(execResultAtom)

  return (
    <div className="py-6 m4">
      Execute Result:
      <pre>
        {execResult}
      </pre>
    </div>
  )
}
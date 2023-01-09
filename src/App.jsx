import WasmTerminal from "@wasmer/wasm-terminal";
import { WASI, WASIContext, WASIWorkerHost } from "../runno/packages/wasi-motor";
// import WasmTerminal from "@runno/terminal"
// import { WASI } from '@wasmer/wasi';
// import browserBindings from '@wasmer/wasi/lib/bindings/browser';
import { Terminal } from "xterm";
import React, { useEffect } from "react";
import './App.css'
// import SharedArrayBuffer from "typescript";

function App() {
  const fetchCommandHandler = async ({ args }) => {
    console.log("loading wasm file");
    const response = await fetch("./datafusion-cli.wasm");
    const bin = await response.arrayBuffer();
    console.log(bin.byteLength);
    return new Uint8Array(bin)
  };

  var is_randered = false;
  var stdinBuffer = new SharedArrayBuffer(8 * 1024);

  const wasmTerminal = new WasmTerminal({
    fetchCommand: fetchCommandHandler,
  });

  useEffect(() => {
    if (is_randered) {
      return;
    } else {
      is_randered = true;
    }

    const terminal = new Terminal({
      convertEol: true,
      altClickMovesCursor: false,
    });

    terminal.resize(80, 40);

    terminal.onData(async (data) => {
      if (data === "\r") {
        data = "\n";
      }
      terminal.write(data);

      const view = new DataView(stdinBuffer);

      // Wait until the stdinbuffer is consumed at the other end

      // TODO: This isn't great, should probably use a lock instead
      while (view.getInt32(0) !== 0) {
        await new Promise((resolve) => setTimeout(resolve, 0));
      }

      const encodedText = new TextEncoder().encode(data);
      const buffer = new Uint8Array(stdinBuffer, 4);
      buffer.set(encodedText);

      view.setInt32(0, encodedText.byteLength);

      console.log("going to notify");

      Atomics.notify(new Int32Array(stdinBuffer), 0);
    });

    const onTerminalEOF = async () => {
      const view = new DataView(stdinBuffer);
      // TODO: This isn't great, should probably use a lock instead
      while (view.getInt32(0) !== 0) {
        await new Promise((resolve) => setTimeout(resolve, 0));
      }

      view.setInt32(0, -1);
      Atomics.notify(new Int32Array(stdinBuffer), 0);
    };

    terminal.onKey((keyEvent) => {

    });

    // terminal.onKey = ({ domEvent }) => {
    //   console.log("what the fuck");
    // }

    terminal.open(document.getElementById("terminal"));

    // const context = new WASIContext({
    //   args: ["datafusion-cli"],
    //   env: {},
    //   stdout: (out) => terminal.write(out),
    //   stderr: (err) => terminal.write(err),
    //   stdin: () => prompt("stdin:"),
    //   fs: {},
    // });

    const workerHost = new WASIWorkerHost("http://localho.st:8080/datafusion-cli.wasm", stdinBuffer, {
      args: ["datafusion-cli"],
      env: {},
      stdout: (out) => terminal.write(out),
      // stdout: (out) => console.log(out),
      stderr: (err) => terminal.write(err), // TODO: Different colour?
      fs: {},
    });
    const result = workerHost.start().then(() => { console.log("Exit"); terminal.write("Exit"); });

    // const result = WASI.start(fetch("./datafusion-cli.wasm"), context);

  });

  return (
    <>
      {/* <!-- This includes the external stylesheet. NOTE: The path should point to wherever you are hosting the wasm-terminal output. --> */}
      <link
        rel="stylesheet"
        type="text/css"
        // href="./node_modules/@wasmer/wasm-terminal/lib/xterm/xterm.css"
        href="./node_modules/xterm/css/xterm.css"
      />

      <div className="min-h-full">
        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">DataFusion Playground</h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            {/* Replace with your content */}
            {/* <div className="px-4 py-6 sm:px-0">
              <div className="h-96 rounded-lg border-4 border-dashed border-gray-200"> */}
            <div className="wasm-terminal" id="terminal"></div>
            {/* </div>
            </div> */}
            {/* /End replace */}
          </div>
        </main>
      </div>
    </>
  )
}

export default App

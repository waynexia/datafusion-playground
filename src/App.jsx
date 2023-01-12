import WasmTerminal from "@wasmer/wasm-terminal";
import { WASIWorkerHost } from "../runno/packages/wasi-motor";
import { Terminal } from "xterm";
import React, { useEffect } from "react";
import './App.css'

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

    terminal.open(document.getElementById("terminal"));
    const workerHost = new WASIWorkerHost("https://static-dispatch.s3.ap-northeast-1.amazonaws.com/datafusion-cli.wasm", stdinBuffer, {
      args: ["datafusion-cli"],
      env: {},
      stdout: (out) => terminal.write(out),
      stderr: (err) => terminal.write(err), // TODO: Different colour?
      fs: {},
    });
    const result = workerHost.start().then(() => { console.log("Exit"); terminal.write("Exit"); });
  });

  return (
    <>
      {/* <!-- This includes the external stylesheet. NOTE: The path should point to wherever you are hosting the wasm-terminal output. --> */}
      <link
        rel="stylesheet"
        type="text/css"
        href="./node_modules/xterm/css/xterm.css"
      />
      <script data-goatcounter="https://waynest.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>

      <div className="min-h-full">
        <header className="bg-white shadow text-5xl">
          <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-5xl font-bold tracking-tight text-gray-900">DataFusion Playground</h1>
          </div>
        </header>
        <div className="explain">
          <p>Playground of <a href="www.google.com">Apache Arrow DataFusion</a>. In a early experimental stage as my side project.</p>
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

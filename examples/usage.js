// keep in sync with readme
import { catalog as corenodes, dflowhost } from "../dflow.js";

function rungraph() {
  // use builtin nodes
  const dflow = new dflowhost(corenodes);

  // create nodes
  const numnode = dflow.newnode({
    kind: "number",
  });
  const sinnode = dflow.newnode({
    kind: corenodes.mathsin.kind,
  });
  const consolelognode = dflow.newnode({
    kind: corenodes.consolelog.kind,
  });

  // set numnode output to π / 2
  numnode.output(0).data = math.pi / 2;

  // connect numnode to sinnode and sinnode to consolelog
  dflow.connect(numnode).to(sinnode);
  dflow.connect(sinnode).to(consolelognode);

  // run graph
  dflow.run();
}

rungraph();

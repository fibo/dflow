import { Dflow, DflowNode } from "../../dflow.ts";

const { input, output } = Dflow;

class MathAbs extends DflowNode {
  static kind = "mathAbs";
  static inputs = [input("number")];
  static outputs = [output("number")];
  run() {
    this.output(0).data = Math.abs(this.input(0).data as number);
  }
}

class MathCos extends DflowNode {
  static kind = "mathCos";
  static inputs = [input("number")];
  static outputs = [output("number")];
  run() {
    this.output(0).data = Math.cos(this.input(0).data as number);
  }
}

class MathCosh extends DflowNode {
  static kind = "mathCosh";
  static inputs = [input("number")];
  static outputs = [output("number")];
  run() {
    this.output(0).data = Math.cosh(this.input(0).data as number);
  }
}

class MathFloor extends DflowNode {
  static kind = "mathFloor";
  static inputs = [input("number")];
  static outputs = [output("number")];
  run() {
    this.output(0).data = Math.floor(this.input(0).data as number);
  }
}

class MathMax extends DflowNode {
  static kind = "mathMax";
  static inputs = [input("array")];
  static outputs = [output("number")];
  run() {
    // Suppose input is a list of numbers, just to make TS happy.
    // Then check that result is not `NaN`, in case some input is not ok.
    const list = this.input(0).data as number[];
    const data = Math.max(...list);
    if (isNaN(data)) {
      this.output(0).clear();
    } else {
      this.output(0).data = data;
    }
  }
}

class MathMin extends DflowNode {
  static kind = "mathMin";
  static inputs = [input("array")];
  static outputs = [output("number")];
  run() {
    // Suppose input is a list of numbers, just to make TS happy.
    // Then check that result is not `NaN`, in case some input is not ok.
    const list = this.input(0).data as number[];
    const data = Math.min(...list);
    if (isNaN(data)) {
      this.output(0).clear();
    } else {
      this.output(0).data = data;
    }
  }
}

class MathPI extends DflowNode {
  static kind = "mathPI";
  static outputs = [output("number", { name: "π", data: Math.PI })];
}

class MathRound extends DflowNode {
  static kind = "mathRound";
  static inputs = [input("number")];
  static outputs = [output("number")];
  run() {
    this.output(0).data = Math.round(this.input(0).data as number);
  }
}

class MathSin extends DflowNode {
  static kind = "mathSin";
  static inputs = [input("number")];
  static outputs = [output("number")];
  run() {
    this.output(0).data = Math.sin(this.input(0).data as number);
  }
}

class MathSinh extends DflowNode {
  static kind = "mathSinh";
  static inputs = [input("number")];
  static outputs = [output("number")];
  run() {
    this.output(0).data = Math.sinh(this.input(0).data as number);
  }
}

export default [
  MathAbs,
  MathCos,
  MathCosh,
  MathFloor,
  MathMax,
  MathMin,
  MathPI,
  MathRound,
  MathSin,
  MathSinh
];

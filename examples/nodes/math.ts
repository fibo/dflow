import { DflowNode } from "dflow";

const { input, output } = DflowNode;

class DflowMathAbs extends DflowNode {
  static kind = "mathAbs";
  static inputs = [input("number")];
  static outputs = [output("number")];
  run() {
    this.output(0).data = Math.abs(this.input(0).data as number);
  }
}

class DflowMathCos extends DflowNode {
  static kind = "mathCos";
  static inputs = [input("number")];
  static outputs = [output("number")];
  run() {
    this.output(0).data = Math.cos(this.input(0).data as number);
  }
}

class DflowMathCosh extends DflowNode {
  static kind = "mathCosh";
  static inputs = [input("number")];
  static outputs = [output("number")];
  run() {
    this.output(0).data = Math.cosh(this.input(0).data as number);
  }
}

class DflowMathFloor extends DflowNode {
  static kind = "mathFloor";
  static inputs = [input("number")];
  static outputs = [output("number")];
  run() {
    this.output(0).data = Math.floor(this.input(0).data as number);
  }
}

class DflowMathMax extends DflowNode {
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

class DflowMathMin extends DflowNode {
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

class DflowMathPI extends DflowNode {
  static kind = "mathPI";
  static outputs = [output("number", { name: "π", data: Math.PI })];
}

class DflowMathRound extends DflowNode {
  static kind = "mathRound";
  static inputs = [input("number")];
  static outputs = [output("number")];
  run() {
    this.output(0).data = Math.round(this.input(0).data as number);
  }
}

class DflowMathSin extends DflowNode {
  static kind = "mathSin";
  static inputs = [input("number")];
  static outputs = [output("number")];
  run() {
    this.output(0).data = Math.sin(this.input(0).data as number);
  }
}

class DflowMathSinh extends DflowNode {
  static kind = "mathSinh";
  static inputs = [input("number")];
  static outputs = [output("number")];
  run() {
    this.output(0).data = Math.sinh(this.input(0).data as number);
  }
}

export const catalog = {
  [DflowMathAbs.kind]: DflowMathAbs,
  [DflowMathCos.kind]: DflowMathCos,
  [DflowMathCosh.kind]: DflowMathCosh,
  [DflowMathFloor.kind]: DflowMathFloor,
  [DflowMathMax.kind]: DflowMathMax,
  [DflowMathMin.kind]: DflowMathMin,
  [DflowMathPI.kind]: DflowMathPI,
  [DflowMathRound.kind]: DflowMathRound,
  [DflowMathSin.kind]: DflowMathSin,
  [DflowMathSinh.kind]: DflowMathSinh,
};
